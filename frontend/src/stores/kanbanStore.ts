import { create } from "zustand";
import { Notebook, Resource } from "../types";
import { api } from "../lib/api";
import { v4 as uuidv4 } from "uuid";

interface KanbanState {
  notebooks: Notebook[];
  resources: Resource[];
  isLoadingNotebooks: boolean;
  isLoadingResources: boolean;
  error: string | null;
  
  // Backend integrations
  fetchNotebooks: () => Promise<void>;
  fetchResources: (notebookId: string) => Promise<void>;
  addNotebook: (
    topic: string,
    level: Notebook["level"],
    length: Notebook["length"]
  ) => Promise<Notebook>;
  deleteNotebook: (id: string) => Promise<void>;
  addResource: (
    notebookId: string,
    title: string,
    url: string,
    sourceType: Resource["sourceType"],
    difficulty: Resource["difficulty"]
  ) => void;
  deleteResource: (id: string) => Promise<void>;
  updateResourceStatus: (
    resourceId: string,
    status: Resource["status"]
  ) => Promise<void>;
  reorderResources: (notebookId: string, reorderedList: Resource[]) => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  notebooks: [],
  resources: [],
  isLoadingNotebooks: false,
  isLoadingResources: false,
  error: null,

  fetchNotebooks: async () => {
    set({ isLoadingNotebooks: true, error: null });
    try {
      const res = await api.get<Notebook[]>("/notebook/getAll");
      set({ notebooks: res.data });
      console.log("[Zustand Store] Notebooks fetched from backend:", res.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to fetch notebooks from server.";
      console.error("[Zustand Store] Error fetching notebooks:", errMsg);
      set({ error: errMsg });
    } finally {
      set({ isLoadingNotebooks: false });
    }
  },

  fetchResources: async (notebookId) => {
    set({ isLoadingResources: true, error: null });
    try {
      const res = await api.get<{ success: boolean; data: Resource[] }>(`/resources/${notebookId}`);
      const fetchedResources = res.data.data || [];

      set((state) => {
        // Exclude other notebooks' resources from being overwritten
        const otherResources = state.resources.filter((r) => r.notebookId !== notebookId);
        return { resources: [...otherResources, ...fetchedResources] };
      });
      console.log(`[Zustand Store] Resources for notebook ${notebookId} fetched from backend:`, fetchedResources);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to fetch resources from server.";
      console.error("[Zustand Store] Error fetching resources:", errMsg);
      set({ error: errMsg });
    } finally {
      set({ isLoadingResources: false });
    }
  },

  addNotebook: async (topic, level, length) => {
    try {
      const res = await api.post<{
        success: boolean;
        data: { notebook: Notebook; resources: Resource[] };
      }>("/notebook/create", { topic, level, length });

      const newNotebook = res.data.data.notebook;
      const newResources = res.data.data.resources || [];

      set((state) => ({
        notebooks: [newNotebook, ...state.notebooks],
        resources: [...newResources, ...state.resources],
      }));

      console.log("[Zustand Store] Notebook and AI resources generated successfully:", res.data.data);
      return newNotebook;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create notebook via AI orchestrator.";
      console.error("[Zustand Store] Error creating notebook:", errMsg);
      throw new Error(errMsg);
    }
  },

  deleteNotebook: async (id) => {
    try {
      await api.delete(`/notebook/${id}`);

      set((state) => {
        const updatedNotebooks = state.notebooks.filter((n) => n.id !== id);
        const updatedResources = state.resources.filter((r) => r.notebookId !== id);
        return { notebooks: updatedNotebooks, resources: updatedResources };
      });

      console.log(`[Zustand Store] Notebook ${id} successfully deleted from backend.`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete notebook.";
      console.error("[Zustand Store] Error deleting notebook:", errMsg);
      throw new Error(errMsg);
    }
  },

  addResource: (notebookId, title, url, sourceType, difficulty) => {
    // Generate a local resource since the backend only auto-populates resources via the AI search flow.
    const newRes: Resource = {
      id: uuidv4(),
      notebookId,
      title,
      url,
      sourceType,
      difficulty,
      status: "todo",
      summary: `Manually added resource for learning ${title}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      resources: [...state.resources, newRes],
    }));

    console.log("[Zustand Store] Added local manual resource:", newRes);
  },

  deleteResource: async (id) => {
    const state = get();
    const deletedResource = state.resources.find((r) => r.id === id);
    if (!deletedResource) return;

    // 1. Optimistic delete
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    }));

    try {
      await api.delete(`/resources/${id}`);
      console.log(`[Zustand Store] Resource "${deletedResource.title}" deleted from server.`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete resource.";
      console.error("[Zustand Store] Error deleting resource on server, rolling back:", errMsg);
      // 2. Rollback
      set((state) => ({
        resources: [...state.resources, deletedResource],
      }));
    }
  },

  updateResourceStatus: async (resourceId, status) => {
    const state = get();
    const targetResource = state.resources.find((r) => r.id === resourceId);
    if (!targetResource) return;

    const originalStatus = targetResource.status;

    // 1. Optimistic Update (instant UI move + instant progress bar recalculation!)
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === resourceId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));

    console.log(`[Optimistic Update] Moving "${targetResource.title}" to status "${status}"`);

    // 2. Background sync to PATCH endpoint
    try {
      const res = await api.patch<{ success: boolean; data: Resource }>(`/resources/update/${resourceId}`, { status });
      console.log(`[Server Sync Success] Status for "${targetResource.title}" confirmed as "${status}" on backend:`, res.data.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update resource status.";
      console.error(`[Server Sync Failed] Reverting "${targetResource.title}" status back to "${originalStatus}". Error:`, errMsg);
      // 3. Rollback on failure
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, status: originalStatus } : r
        ),
      }));
    }
  },

  reorderResources: (notebookId, reorderedList) => {
    set((state) => {
      const otherResources = state.resources.filter((r) => r.notebookId !== notebookId);
      return { resources: [...otherResources, ...reorderedList] };
    });
    console.log(`[Zustand Store] Card order updated locally in notebook ${notebookId}`);
  },
}));

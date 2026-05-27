import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Notebook, Resource } from "../types";
import { useKanbanStore } from "../stores/kanbanStore";
import KanbanColumn from "./KanbanColumn";
import ResourceCard from "./ResourceCard";

interface KanbanBoardProps {
  notebook: Notebook;
  isLoading: boolean;
}

export default function KanbanBoard({ notebook, isLoading }: KanbanBoardProps) {
  const { resources, updateResourceStatus, reorderResources, deleteResource } =
    useKanbanStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter resources that belong to this active notebook
  const notebookResources = resources.filter((r) => r.notebookId === notebook.id);

  // Split resources into their respective status columns
  const todoResources = notebookResources.filter((r) => r.status === "todo");
  const inProgressResources = notebookResources.filter(
    (r) => r.status === "in_progress"
  );
  const completedResources = notebookResources.filter(
    (r) => r.status === "completed"
  );
  const skippedResources = notebookResources.filter(
    (r) => r.status === "skipped"
  );

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Crucial: Allows clicks on buttons and links without accidentally triggering a drag event!
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Find the resource currently being dragged
    const draggedResource = resources.find((r) => r.id === activeIdStr);
    if (!draggedResource) return;

    // Check if we dropped over a column status directly
    const validColumnStatuses = ["todo", "in_progress", "completed", "skipped"];
    const isDroppedOverColumn = validColumnStatuses.includes(overIdStr);

    if (isDroppedOverColumn) {
      const targetStatus = overIdStr as Resource["status"];
      if (draggedResource.status !== targetStatus) {
        updateResourceStatus(activeIdStr, targetStatus);
      }
    } else {
      // Dropped over another resource card
      const targetResource = resources.find((r) => r.id === overIdStr);
      if (!targetResource) return;

      const targetStatus = targetResource.status;

      // Update status if it changed
      if (draggedResource.status !== targetStatus) {
        updateResourceStatus(activeIdStr, targetStatus);
      }

      // Reorder within the same notebook resource set
      const updatedNotebookResources = resources.filter(
        (r) => r.notebookId === notebook.id
      );

      // Recompute the indices with updated statuses to ensure arrayMove works correctly
      const tempResources = updatedNotebookResources.map((r) => {
        if (r.id === activeIdStr) {
          return { ...r, status: targetStatus };
        }
        return r;
      });

      const oldIndex = tempResources.findIndex((r) => r.id === activeIdStr);
      const newIndex = tempResources.findIndex((r) => r.id === overIdStr);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(tempResources, oldIndex, newIndex);
        reorderResources(notebook.id, reordered);
      }
    }
  };

  // Find active resource for the DragOverlay card
  const activeResource = resources.find((r) => r.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        <KanbanColumn
          id="todo"
          title="To Do"
          resources={todoResources}
          onDeleteResource={deleteResource}
          isLoading={isLoading}
        />
        <KanbanColumn
          id="in_progress"
          title="In Progress"
          resources={inProgressResources}
          onDeleteResource={deleteResource}
          isLoading={isLoading}
        />
        <KanbanColumn
          id="completed"
          title="Completed"
          resources={completedResources}
          onDeleteResource={deleteResource}
          isLoading={isLoading}
        />
        <KanbanColumn
          id="skipped"
          title="Skipped"
          resources={skippedResources}
          onDeleteResource={deleteResource}
          isLoading={isLoading}
        />
      </div>

      {/* Persistent drag overlay ghost card */}
      <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeResource ? (
          <ResourceCard
            resource={activeResource}
            onDelete={() => {}}
            isOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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
import ResourceCard, { clearAnimatedCards } from "./ResourceCard";
import { motion } from "framer-motion";

interface KanbanBoardProps {
  notebook: Notebook;
  isLoading: boolean;
}

export default function KanbanBoard({ notebook, isLoading }: KanbanBoardProps) {
  const { resources, updateResourceStatus, reorderResources, deleteResource } =
    useKanbanStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Clear entry animation state when switching notebooks
  useEffect(() => {
    clearAnimatedCards();
  }, [notebook.id]);

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
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Crucial: Allows clicks on buttons and links without accidentally triggering a drag event!
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Tap & hold for 250ms triggers drag (allows horizontal swiping without accidental drags!)
        tolerance: 5, // Hold finger within 5px tolerance during delay
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-x-0 select-none w-full relative pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.0 }}
          className="w-full md:px-3.5 md:border-r border-[var(--color-warm-border)]/70 last:border-r-0"
        >
          <KanbanColumn
            id="todo"
            title="To Do"
            resources={todoResources}
            onDeleteResource={deleteResource}
            isLoading={isLoading}
            startIndex={0}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="w-full md:px-3.5 md:border-r border-[var(--color-warm-border)]/70 last:border-r-0"
        >
          <KanbanColumn
            id="in_progress"
            title="In Progress"
            resources={inProgressResources}
            onDeleteResource={deleteResource}
            isLoading={isLoading}
            startIndex={todoResources.length}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          className="w-full md:px-3.5 md:border-r border-[var(--color-warm-border)]/70 last:border-r-0"
        >
          <KanbanColumn
            id="completed"
            title="Completed"
            resources={completedResources}
            onDeleteResource={deleteResource}
            isLoading={isLoading}
            startIndex={todoResources.length + inProgressResources.length}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
          className="w-full md:px-3.5 md:border-r border-[var(--color-warm-border)]/70 last:border-r-0"
        >
          <KanbanColumn
            id="skipped"
            title="Skipped"
            resources={skippedResources}
            onDeleteResource={deleteResource}
            isLoading={isLoading}
            startIndex={todoResources.length + inProgressResources.length + completedResources.length}
          />
        </motion.div>
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

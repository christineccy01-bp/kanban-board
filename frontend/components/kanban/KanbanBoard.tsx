"use client";

import { useId, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DarkModeSwitch from "./DarkModeSwitch";
import Column from "./Column";
import Popup from "./AddTaskModal";
import { CardProps } from "./TaskCard";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import { useTasks } from "@/context/TasksContext";
import { STATUS_MAP } from "@/utils/constants";
import { TaskStatus } from "@/utils/types";

// Matches against the full title and description, not the truncated card text
export const matchesSearch = (
  task: Pick<CardProps, "title" | "description">,
  query: string,
) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q)
  );
};

const KanbanBoard = () => {
  const { tasks, createTask, moveTask } = useTasks();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Only the columns are filtered; actions keep working on the full task list
  const visibleTasks = tasks.filter((task) => matchesSearch(task, searchQuery));
  const hasNoMatches = searchQuery.trim() !== "" && visibleTasks.length === 0;

  const dndContextId = useId();
  // Require a small movement before dragging so a plain click opens the task details
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    moveTask(String(active.id), over.id as TaskStatus);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-8 font-sans">
      <menu className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">My Kanban Board</h1>
        <DarkModeSwitch />
      </menu>
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          className="max-w-sm"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <Button onClick={() => setIsPopupOpen(true)}>Add Task</Button>
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          popUpTitle="Create Task"
          onCreate={createTask}
        />
      </div>
      {hasNoMatches && (
        <p
          role="status"
          className="text-sm text-neutral-600 dark:text-neutral-400"
        >
          No tasks match &ldquo;{searchQuery.trim()}&rdquo;
        </p>
      )}
      <div className="flex flex-1 gap-8 w-full">
        <DndContext
          id={dndContextId}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          {(Object.keys(STATUS_MAP) as TaskStatus[]).map((status) => (
            <Column
              key={`column-${status}`}
              id={status}
              tasks={visibleTasks.filter((task) => task.status === status)}
            />
          ))}
        </DndContext>
      </div>
    </main>
  );
};

export default KanbanBoard;

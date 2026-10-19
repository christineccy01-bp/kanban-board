"use client";

import { useState } from "react";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";
import Column from "@/components/kanban/Column";
import { ColumnType } from "@/components/types";
import { CardProps } from "@/components/kanban/TaskCard";
import { DndContext, DragEndEvent } from '@dnd-kit/core';

const COLUMNS: ColumnType[] = [
  { id: 'new', title: 'New' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'archive', title: 'Archive' },
];

const INITIAL_TASKS: CardProps[] = [
  {
    id: '1',
    title: 'Research Project',
    description: 'Gather requirements and create initial documentation',
    status: 'new',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Create component library and design tokens',
    status: 'new',
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Implement REST API endpoints',
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Testing',
    description: 'Write unit tests for core functionality',
    status: 'done',
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<CardProps[]>(INITIAL_TASKS);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as CardProps['status'];

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-4 p-8 font-sans">
      <menu className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">My Kanban Board</h1>
        <DarkModeSwitch />
      </menu>
      <div className="flex flex-1 gap-8 w-full">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            );
          })}
        </DndContext>
      </div>
    </main>
  );
}

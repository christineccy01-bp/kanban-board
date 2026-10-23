"use client";

import { useId, useState, useEffect, MouseEvent } from "react";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";
import Column from "@/components/kanban/Column";
import { ColumnType, TaskStatus } from "@/components/types";
import { CardProps } from "@/components/kanban/TaskCard";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Button from "@/components/kanban/Button";

const COLUMNS: ColumnType[] = [
  { id: 'new', title: 'New' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'archive', title: 'Archive' },
];

const STATUS_MAP: Record<string, TaskStatus> = {
  N: 'new',
  P: 'in-progress',
  D: 'done',
  A: 'archive'
}

export default function Home() {
  const [tasks, setTasks] = useState<CardProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:4242/todo_item')
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item:any) => ({
          ...item,
          status: STATUS_MAP[item.status],
        }));
        setTasks(mapped);
        console.log(mapped);
      })
      .catch((err) => {
        console.error('Error fetching todo items:', err);
      });
  }, []);

  const dndContextId = useId();
  // Require a small movement before dragging so a plain click opens the task details
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

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

  const handleAddTask = (event: MouseEvent) => {
    // add new task code goes here
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-8 font-sans">
      <menu className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">My Kanban Board</h1>
        <DarkModeSwitch />
      </menu>
      <div className="flex justify-end">
        <Button onClick={handleAddTask}>
          Add New Task
        </Button>
      </div>
      <div className="flex flex-1 gap-8 w-full">
        <DndContext id={dndContextId} sensors={sensors} onDragEnd={handleDragEnd}>
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

"use client";

import { useId, useState, useEffect, MouseEvent } from "react";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";
import Column from "@/components/kanban/Column";
import { ColumnType, TaskStatus } from "@/components/types";
import { CardProps, TaskUpdateProps } from "@/components/kanban/TaskCard";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Button from "@/components/kanban/Button";
import Popup, {NewTaskInput} from "@/components/kanban/Popup";

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

const STATUS_CODE: Record<TaskStatus, string> = {
  'new': 'N',
  'in-progress': 'P',
  'done': 'D',
  'archive': 'A',
};

//extracted out from the useEffect to be reused
const fetchTasks = async (): Promise<CardProps[]> => {
  const res = await fetch('http://localhost:4242/todo_item');
  const data = await res.json();
  return data.map((item: any) => ({
    ...item,
    id: item.todo_item_id,
    status: STATUS_MAP[item.status],
  }));
};

export default function Home() {
  const [tasks, setTasks] = useState<CardProps[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  useEffect(() => {
    fetchTasks()
    .then (setTasks)
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as CardProps['status'];
    const previousTasks = tasks;

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

    //update to DB
    try {
      const res = await fetch(`http://localhost:4242/todo_item/${taskId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: STATUS_CODE[newStatus] }),
      });
      console.log(res.body)
      if (!res.ok) throw new Error(`Failed to update task (status ${res.status})`);
    } catch (err) {
      console.error('Error updating task status:', err);
      setTasks(previousTasks);
    }
  }

  const handleAddTask = () => {
    setIsPopupOpen(true);
  }

  const handleCreateTask = async (input: NewTaskInput) => {
    const res = await fetch('http://localhost:4242/todo_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`Failed to create task (status ${res.status})`);
    }
    const saved = await res.json();
    setTasks(await fetchTasks());
  };

  const handleUpdateTask = async (taskId: string, changes: TaskUpdateProps) => {
    const previousTasks = tasks;

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...changes } : task,
      ),
    );

    try {
      const res = await fetch(`http://localhost:4242/todo_item/${taskId}/title/description/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...changes, status: STATUS_CODE[changes.status] }),
      });
      if (!res.ok) throw new Error(`Failed to update task (status ${res.status})`);
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-8 font-sans">
      <menu className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">My Kanban Board</h1>
        <DarkModeSwitch />
      </menu>
      <div className="flex justify-end">
        <Button onClick={handleAddTask}>
          Add Task
        </Button>
          <Popup 
            isOpen={isPopupOpen} 
            onClose = {() => setIsPopupOpen(false)} 
            popUpTitle="Create Task"
            onCreate={handleCreateTask}
          />
      </div>
      <div className="flex flex-1 gap-8 w-full">
        <DndContext id={dndContextId} sensors={sensors} onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            return (
              <Column
                key={`column-${column.id}`}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
                onUpdateTask={handleUpdateTask}
              />
            );
          })}
        </DndContext>
      </div>
    </main>
  );
}
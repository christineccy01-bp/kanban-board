"use client";

import { useId, useState, useEffect } from "react";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";
import Column from "@/components/kanban/Column";
import { STATUS_MAP } from "@/utils/constants";
import { TaskStatus } from "@/utils/types";
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
import Popup, {NewTaskInput} from "@/components/kanban/AddTaskModal";

//extracted out from the useEffect to be reused
const fetchTasks = async (): Promise<CardProps[]> => {
  const res = await fetch('http://localhost:4242/todo_item');
  const data = await res.json();
  return data.map((item: any) => ({
    ...item,
    id: item.todo_item_id,
    status: item.status,
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
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;

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
      const res = await fetch(`http://localhost:4242/todo_item/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus
        }),
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
      const res = await fetch(`http://localhost:4242/todo_item/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...changes, status: changes.status }),
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
          {(Object.keys(STATUS_MAP) as TaskStatus[]).map((status) => {
            return (
              <Column
                key={`column-${status}`}
                id={status}
                tasks={tasks.filter((task) => task.status === status)}
                onUpdateTask={handleUpdateTask}
              />
            );
          })}
        </DndContext>
      </div>
    </main>
  );
}
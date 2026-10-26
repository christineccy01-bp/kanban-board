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
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import Popup, {NewTaskInput} from "@/components/kanban/AddTaskModal";


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
  const [searchQuery, setSearchQuery] = useState("");

  // Only the columns are filtered; handlers keep working on the full task list
  const visibleTasks = tasks.filter((task) => matchesSearch(task, searchQuery));
  const hasNoMatches = searchQuery.trim() !== "" && visibleTasks.length === 0;

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

  // The card unmounts once removed from state, which also closes its modals
  const handleDeleteTask = async (taskId: string) => {
    const res = await fetch(`http://localhost:4242/todo_item/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete task (status ${res.status})`);
    setTasks((current) => current.filter((task) => task.id !== taskId));
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
      {hasNoMatches && (
        <p role="status" className="text-sm text-neutral-600 dark:text-neutral-400">
          No tasks match &ldquo;{searchQuery.trim()}&rdquo;
        </p>
      )}
      <div className="flex flex-1 gap-8 w-full">
        <DndContext id={dndContextId} sensors={sensors} onDragEnd={handleDragEnd}>
          {(Object.keys(STATUS_MAP) as TaskStatus[]).map((status) => {
            return (
              <Column
                key={`column-${status}`}
                id={status}
                tasks={visibleTasks.filter((task) => task.status === status)}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </DndContext>
      </div>
    </main>
  );
}
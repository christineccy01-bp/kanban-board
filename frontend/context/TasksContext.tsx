"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as todoApi from "@/api/todoApi";
import { CardProps, TaskUpdateProps } from "@/components/kanban/TaskCard";
import { TaskStatus } from "@/utils/types";

type TasksContextValue = {
  tasks: CardProps[];
  createTask: (input: TaskUpdateProps) => Promise<void>;
  // Rethrows on failure so the caller (e.g. the edit modal) can stay open
  updateTask: (id: string, changes: TaskUpdateProps) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Logs instead of throwing, since a drag has no UI to report the error in
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<CardProps[]>([]);

  useEffect(() => {
    todoApi
      .getTasks()
      .then(setTasks)
      .catch((err) => {
        console.error("Error fetching todo items:", err);
      });
  }, []);

  // Rolling back only the one task means a failed save can't undo other changes made meanwhile
  const replaceTask = (id: string, task: CardProps) =>
    setTasks((current) => current.map((t) => (t.id === id ? task : t)));

  const createTask = async (input: TaskUpdateProps) => {
    const created = await todoApi.createTask(input);
    setTasks((current) => [...current, created]);
  };

  const updateTask = async (id: string, changes: TaskUpdateProps) => {
    const previous = tasks.find((task) => task.id === id);
    if (!previous) return;

    replaceTask(id, { ...previous, ...changes });
    try {
      await todoApi.updateTask(id, changes);
    } catch (err) {
      replaceTask(id, previous);
      throw err;
    }
  };

  // The card unmounts once removed from state, which also closes its modals
  const deleteTask = async (id: string) => {
    await todoApi.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const moveTask = async (id: string, status: TaskStatus) => {
    const previous = tasks.find((task) => task.id === id);
    if (!previous || previous.status === status) return;

    replaceTask(id, { ...previous, status });
    try {
      await todoApi.updateTask(id, {
        title: previous.title,
        description: previous.description,
        status,
      });
    } catch (err) {
      console.error("Error updating task status:", err);
      replaceTask(id, previous);
    }
  };

  return (
    <TasksContext.Provider
      value={{ tasks, createTask, updateTask, deleteTask, moveTask }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

import { CardProps, TaskUpdateProps } from "@/components/kanban/TaskCard";
import { TaskStatus } from "@/utils/types";

// Only NEXT_PUBLIC_ variables are exposed to the browser
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4242";

// Mirrors TodoItem in backend/src/models/todoModel.ts
export type TodoItemResponse = {
  todo_item_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const toTask = (row: TodoItemResponse): CardProps => ({
  id: String(row.todo_item_id),
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: Date.parse(row.created_at),
});

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init.body
      ? { "Content-Type": "application/json", ...init.headers }
      : init.headers,
  });

  if (!res.ok) {
    // The backend sends { error: string }, but a proxy or crash may not
    const body = await res.json().catch(() => null);
    throw new ApiError(
      body?.error ?? `Request failed with status ${res.status}`,
      res.status,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
};

export const getTasks = async (): Promise<CardProps[]> => {
  const rows = await request<TodoItemResponse[]>("/todo_item");
  return rows.map(toTask);
};

export const createTask = async (
  input: TaskUpdateProps,
): Promise<CardProps> => {
  const row = await request<TodoItemResponse>("/todo_item", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return toTask(row);
};

export const updateTask = async (
  id: string,
  changes: TaskUpdateProps,
): Promise<CardProps> => {
  const row = await request<TodoItemResponse>(`/todo_item/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
  return toTask(row);
};

export const deleteTask = async (id: string): Promise<void> => {
  await request<void>(`/todo_item/${id}`, { method: "DELETE" });
};

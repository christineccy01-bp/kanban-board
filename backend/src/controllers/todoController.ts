import type { Request, Response } from 'express';
import * as todoService from '../services/todoServices.ts';

function handleError(res: Response, error: unknown, message: string) {
  if (error instanceof todoService.ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  console.error(message, error);
  return res.status(500).json({ error: message });
}

export async function getTasks(req: Request, res: Response) {
  try {
    res.json(await todoService.getAllTasks());
  } catch (error) {
    handleError(res, error, 'Failed to fetch todo items.');
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    res.status(201).json(await todoService.makeTask(req.body));
  } catch (error) {
    handleError(res, error, 'Failed to create todo item.');
  }
}

export async function editTask(req: Request<{ id: number }>, res: Response) {
  try {
    const updated = await todoService.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Todo item not found.' });
    res.json(updated);
  } catch (error) {
    handleError(res, error, 'Failed to update todo item.');
  }
}

export async function deleteTask(req: Request<{ id: number }>, res: Response) {
  try {
    const deleted = await todoService.removeTask(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Todo item not found.' });
    res.status(204).end();
  } catch (error) {
    handleError(res, error, 'Failed to delete todo item.');
  }
}
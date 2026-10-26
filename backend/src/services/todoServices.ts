import { STATUSES } from '../models/todoModel.ts';
import * as todoRepository from '../repos/todoRepository.ts';

export class ValidationError extends Error {}

export const validateTodoInput = (data: any) => {
    if (typeof data.title !== 'string') {
        throw new Error('Title is required.');
    }
    if (typeof data.description !== 'string') {
        throw new Error('Description is required.');
    }
    if (!STATUSES.includes(data.status)) {
        throw new Error('Invalid status.');
    }

    return {
        title: data.title,
        description: data.description,
        status: data.status
    }
}

export const getAllTasks = async () => {
    return todoRepository.getTasks();
}

export const createTask = async (data: any) => {
    return todoRepository.createTask(validateTodoInput(data));
}

export const updateTask = async (id: string, data: any) => {
    return todoRepository.updateTask(id, validateTodoInput(data));
}

export const removeTask = async (id: string) => {
    return todoRepository.removeTask(id);
}
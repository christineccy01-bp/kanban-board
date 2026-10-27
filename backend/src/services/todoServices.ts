import { STATUSES, type TodoInput } from '../models/todoModel.ts';
import * as todoRepository from '../repos/todoRepository.ts';

export class ValidationError extends Error {}

export const validateTodoInput = (data: TodoInput) => {
    if (typeof data.title === 'undefined') {
        throw new ValidationError('Title is required.');
    }
    if (typeof data.title !== 'string') {
        throw new ValidationError('Title must be a string.');
    }
    if (typeof data.description === 'undefined') {
        throw new ValidationError('Description is required.');
    }
    if (typeof data.description !== 'string') {
        throw new ValidationError('Description must be a string.');
    }
    if (typeof data.status === 'undefined') {
        throw new ValidationError('Status is required.');
    }
    if (!STATUSES.includes(data.status)) {
        throw new ValidationError('Invalid status.');
    }

    return {
        title: data.title,
        description: data.description,
        status: data.status
    }
}

export const getAllTasks = async () => {
    return todoRepository.list();
}

export const makeTask = async (data: TodoInput) => {
    return todoRepository.create(validateTodoInput(data));
}

export const updateTask = async (id: number, data: TodoInput) => {
    return todoRepository.update(id, validateTodoInput(data));
}

export const removeTask = async (id: number) => {
    return todoRepository.remove(id);
}
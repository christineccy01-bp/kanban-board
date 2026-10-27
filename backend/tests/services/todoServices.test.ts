import {getAllTasks, makeTask, removeTask, updateTask, validateTodoInput, ValidationError} from "../../src/services/todoServices.ts";
import * as todoRepository from "../../src/repos/todoRepository.ts";
import type { TodoInput } from "../../src/models/todoModel.ts";

jest.mock("../../src/repos/todoRepository.ts", () => ({
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

const validInput: TodoInput = {
    title: "Create unit tests",
    description: "Write tests for todo services",
    status: "N"
};

describe('validateTodoInput', () => {
    //use any for the override to bypass TodoInput type checking for testing
    const call = (overrides: any = {}) => validateTodoInput({ ...validInput, ...overrides });
    
    it('should return only title, description and status', () => {
        expect(call()).toEqual(validInput);
    });

    it('should throw an error if title is missing', () => {
        expect(() => call({ title: undefined })).toThrow(ValidationError);
        expect(() => call({ title: undefined })).toThrow('Title is required.');
    });

    it('should throw an error if title is not a string', () => {
        expect(() => call({ title: 123 })).toThrow(ValidationError);
        expect(() => call({ title: 123 })).toThrow('Title must be a string.');
    });

    it('should throw an error if description is missing', () => {
        expect(() => call({ description: undefined })).toThrow(ValidationError);
        expect(() => call({ description: undefined })).toThrow('Description is required.');
    });

    it('should throw an error if description is not a string', () => {
        expect(() => call({ description: 123 })).toThrow(ValidationError);
        expect(() => call({ description: 123 })).toThrow('Description must be a string.');
    });

    it('should throw an error if status is missing', () => {
        expect(() => call({ status: undefined })).toThrow(ValidationError);
        expect(() => call({ status: undefined })).toThrow('Status is required.');
    });

    it('should throw an error if status is not N, P, D or A', () => {
        expect(() => call({ status: 'X' })).toThrow(ValidationError);
        expect(() => call({ status: 'X' })).toThrow('Invalid status.');
    });
});

describe('getAllTasks', () => {
    // clear all mocks for jest.fn() before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return all tasks from the repository layer', async () => {
        const tasks = [{ todo_item_id: 1, ...validInput, created_at: '2026-10-27' }];
        jest.mocked(todoRepository.list).mockResolvedValue(tasks);

        const result = await getAllTasks();

        expect(result).toEqual(tasks);
    });
});

describe('makeTask', () => {
    //overwriting status for testing invalid status (bypassing TodoInput type validation)
    const overrideMakeTask = (overrides: any = {}) => makeTask({ ...validInput, ...overrides });
    // clear all mocks for jest.fn() before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save and pass the validated input to the repository layer', async () => {
        await makeTask(validInput);
        expect(todoRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('should return the created task', async () => {
        const savedTask = { todo_item_id: 1, ...validInput, created_at: '2026-10-27' };
        jest.mocked(todoRepository.create).mockResolvedValue(savedTask);

        const result = await makeTask(validInput);

        expect(result).toEqual(savedTask);
    });

    it('should not save invalid input', async () => {
        await expect(overrideMakeTask({ ...validInput, status: 'X' })).rejects.toThrow(ValidationError);

        expect(todoRepository.create).not.toHaveBeenCalled();
    });
});

describe('updateTask', () => {
    //overwriting status for testing invalid status (bypassing TodoInput type validation)
    const overrideUpdateTask = (overrides: any = {}) => updateTask(1, { ...validInput, ...overrides });
    // clear all mocks for jest.fn() before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should save and pass the validated input to the repository layer', async () => {
        await updateTask(1, validInput);
        expect(todoRepository.update).toHaveBeenCalledWith(1, validInput);
    });

    it('should return the updated task', async () => {
        const savedTask = { todo_item_id: 1, ...validInput, created_at: '2026-10-27' };
        jest.mocked(todoRepository.update).mockResolvedValue(savedTask);

        const result = await updateTask(1, validInput);

        expect(result).toEqual(savedTask);
    });

    it('should not save invalid input', async () => {
        await expect(overrideUpdateTask({ ...validInput, status: 'X' })).rejects.toThrow(ValidationError);

        expect(todoRepository.update).not.toHaveBeenCalled();
    });
});

describe('removeTask', () => {
    // clear all mocks for jest.fn() before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call the repository layer to delete the task', async () => {
        await removeTask(1);
        expect(todoRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should return the deleted task', async () => {
        const deletedTask = { todo_item_id: 1, ...validInput, created_at: '2026-10-27' };
        jest.mocked(todoRepository.remove).mockResolvedValue(deletedTask);

        const result = await removeTask(1);

        expect(result).toEqual(deletedTask);
    });

    it('should return undefined when the task does not exist', async () => {
        jest.mocked(todoRepository.remove).mockResolvedValue(undefined as any);

        const result = await removeTask(999);

        expect(result).toBeUndefined();
    });
});
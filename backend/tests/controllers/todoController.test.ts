import { createTask, deleteTask, editTask, getTasks } from "../../src/controllers/todoController.ts";
import type { TodoInput, TodoItem } from "../../src/models/todoModel.ts";
import * as todoServices from "../../src/services/todoServices.ts";

jest.mock('../../src/services/todoServices.ts', () => ({
    //actual is for the validation error class
    ...jest.requireActual('../../src/services/todoServices.ts'),
    //the rest is mocked functions
    getAllTasks: jest.fn(),
    makeTask: jest.fn(),
    updateTask: jest.fn(),
    removeTask: jest.fn(),
}));

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
}

const validInput: TodoInput = {
    title: 'Writing Unit Test',
    description: 'Testing todoController',
    status: 'N'
};

const savedTask:TodoItem = { todo_item_id: 1, ...validInput, created_at: new Date().toDateString() };

beforeEach(() => { jest.clearAllMocks(); });

describe('getTasks', () => {
    it('should return all tasks', async () => {
        jest.mocked(todoServices.getAllTasks).mockResolvedValue([savedTask]);
        const res = mockRes();

        await getTasks({} as any, res);

        expect(res.json).toHaveBeenCalledWith([savedTask]);
    });

    it('should return 500 when the service fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.mocked(todoServices.getAllTasks).mockRejectedValue(new Error('DB down'));
        const res = mockRes();

        await getTasks({} as any, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch todo items.' });
    });
});

describe('createTask', () => {
    it('should return 201 with the created task', async() => {
    
        jest.mocked(todoServices.makeTask).mockResolvedValue(savedTask);
        const res = mockRes();

        await createTask({ body: validInput } as any, res);

        expect(todoServices.makeTask).toHaveBeenCalledWith(validInput);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(savedTask);
    });

    it('should return 400 when validation fails', async () => {
        jest.mocked(todoServices.makeTask).mockRejectedValue(new todoServices.ValidationError('Title is required.'));
        const res = mockRes();

        await createTask({ body: {} as TodoInput } as any, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Title is required.' });
    });

    it('should return 500 on unexpected errors', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.mocked(todoServices.makeTask).mockRejectedValue(new Error('DB down'));
        const res = mockRes();

        await createTask({ body: validInput } as any, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create todo item.' });
    });
});


describe('editTask', () => {
    it('should respond with the updated task', async () => {
        jest.mocked(todoServices.updateTask).mockResolvedValue(savedTask);
        const res = mockRes();

        await editTask({ params: { id: 1 }, body: validInput } as any, res);

        expect(todoServices.updateTask).toHaveBeenCalledWith(1, validInput);
        expect(res.json).toHaveBeenCalledWith(savedTask);
    });

    it('should return 404 when the task does not exist', async () => {
        jest.mocked(todoServices.updateTask).mockResolvedValue(undefined as any);
        const res = mockRes();

        await editTask({ params: { id: 999 }, body: validInput } as any, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todo item not found.' });
    });

    it('should return 400 when validation fails', async () => {
        jest.mocked(todoServices.updateTask).mockRejectedValue(new todoServices.ValidationError('Invalid status.'));
        const res = mockRes();

        await editTask({ params: { id: 1 }, body: { ...validInput, status: 'X' } } as any, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status.' });
    });
});

describe('deleteTask', () => {
    it('should return 204 with no body', async () => {
        jest.mocked(todoServices.removeTask).mockResolvedValue(savedTask);
        const res = mockRes();

        await deleteTask({ params: { id: 1 } } as any, res);

        expect(todoServices.removeTask).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('should return 404 when the task does not exist', async () => {
        jest.mocked(todoServices.removeTask).mockResolvedValue(undefined as any);
        const res = mockRes();

        await deleteTask({ params: { id: 999 } } as any, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Todo item not found.' });
    });
});
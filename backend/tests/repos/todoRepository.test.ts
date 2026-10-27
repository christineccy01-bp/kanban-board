import { sql } from "../../db/client.ts";
import type { TodoInput } from "../../src/models/todoModel.ts";
import * as todoRepository from "../../src/repos/todoRepository.ts";


jest.mock('../../db/client.ts', () => ({ sql: jest.fn() }));

const mockedSql = jest.mocked(sql);
beforeEach(() => jest.clearAllMocks());

const input: TodoInput = {
    title: 'Writing Unit Test',
    description: 'Testing todoRepository',
    status: 'N'
};

describe('list', () => {
    it('should query the todo_items table', async () => {
        mockedSql.mockResolvedValue([]);

        await todoRepository.list();

        const [strings] = mockedSql.mock.calls[0];
        expect(strings.join('?')).toContain('SELECT * FROM todo_items');
    });

    it('should return an empty array when no todos exist', async () => {
        mockedSql.mockResolvedValue([]);

        const result = await todoRepository.list();

        expect(result).toEqual([]);
    });

    it('should return all rows when there is data', async() => {
        const mockData = [
            { todo_item_id: 1, title: 'Writing Unit Test', description: 'Testing todoRepository', status: 'N' },
            { todo_item_id: 2, title: 'Another Test', description: 'Another description', status: 'D' }
        ];
        mockedSql.mockResolvedValue(mockData);

        const result = await todoRepository.list();

        expect(result).toEqual(mockData);
    })
});

describe('create', () => {
    it('should pass the title, description and status to the SQL query', async () => {
        mockedSql.mockResolvedValue([]);

        await todoRepository.create(input);

        const [strings, ...values] = mockedSql.mock.calls[0];
        expect(strings.join('?')).toContain('INSERT INTO todo_items');
        expect(values).toEqual([input.title, input.description, input.status]);
    });

    it('should pass back the created row', async() => {
        const row = {todo_item_id: 1, ...input};
        mockedSql.mockResolvedValue([row]);

        const result = await todoRepository.create(input);
        expect(result).toEqual(row);
    });
});

describe('update', () => {
    it('should pass the updated title, description and status to the SQL query', async () => {
        mockedSql.mockResolvedValue([]);

        const updatedInput: TodoInput = {
            title: 'Updated Title',
            description: 'Updated Description',
            status: 'A'
        }

        await todoRepository.update(1, updatedInput);

        const [strings, ...values] = mockedSql.mock.calls[0];
        expect(strings.join('?')).toContain('UPDATE todo_items');
        expect(values).toEqual([updatedInput.title, updatedInput.description, updatedInput.status, 1]);
    });

    it('should pass back the updated row', async() => {
        const row = {todo_item_id: 1, ...input};
        mockedSql.mockResolvedValue([row]);

        const result = await todoRepository.update(1,input);
        expect(result).toEqual(row);
    });

    it('should return undefined when the row does not exist', async () => {
        mockedSql.mockResolvedValue([]);

        const result = await todoRepository.update(999, input);

        expect(result).toBeUndefined();
    });
});

describe('remove', () => {
    it('should pass the id to the SQL query', async () => {
        mockedSql.mockResolvedValue([]);

        await todoRepository.remove(1);

        const [strings, ...values] = mockedSql.mock.calls[0];
        expect(strings.join('?')).toContain('DELETE FROM todo_items');
        expect(values).toEqual([1]);
    });

    it('should pass back the removed row', async() => {
        const row = {todo_item_id: 1, ...input};
        mockedSql.mockResolvedValue([row]);

        const result = await todoRepository.remove(1);
        expect(result).toEqual(row);
    });

    it('should return undefined when the row does not exist', async () => {
        mockedSql.mockResolvedValue([]);

        const result = await todoRepository.remove(1);

        expect(result).toBeUndefined();
    });
});
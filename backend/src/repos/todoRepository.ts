import { sql } from '../../db/client.ts';
import type { TodoInput, TodoItem } from '../models/todoModel.ts';

export const getTasks = async () => {
    return (await sql`SELECT * FROM todo_items`) as TodoItem[];
}

export const createTask = async (data: TodoInput) => {
    const [created] = await sql`
    INSERT INTO todo_items (title, description, status)
        VALUES (${data.title}, ${data.description}, ${data.status})
        RETURNING *`;
    return created as TodoItem;
}

export const updateTask = async (id: string, data: TodoInput) => {
    const [updated] = await sql`
        UPDATE todo_items SET 
            title = ${data.title}, 
            description = ${data.description}, 
            status = ${data.status}
        WHERE todo_item_id = ${id}
        RETURNING *`;
    return updated as TodoItem;
}

export const removeTask = async (id: string) => {
    const [deleted] = await sql`
        DELETE FROM todo_items
        WHERE todo_item_id = ${id}
        RETURNING *`;
    return deleted as TodoItem;
}
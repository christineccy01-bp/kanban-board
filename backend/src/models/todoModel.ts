export const STATUSES = ['N', 'P', 'D', 'A'] as const;
export type Status = typeof STATUSES[number];

export type TodoItem = {
    todo_item_id: number;
    title: string;
    description: string;
    status: Status;
    created_at: string;
};

export type TodoInput = Pick<TodoItem, 'title' | 'description' | 'status'>;
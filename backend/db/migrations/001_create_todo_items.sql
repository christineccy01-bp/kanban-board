CREATE TABLE todo_items (
    todo_item_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT ('new') CHECK (status IN('new', 'in-progress', 'done', 'archive')),
    createdAt TIMESTAMP NOT NULL DEFAULT now()
);
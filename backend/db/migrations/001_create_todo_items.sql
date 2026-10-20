CREATE TABLE todo_items (
    todo_item_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status CHAR(1) NOT NULL DEFAULT ('N') CHECK (status IN('N', 'P', 'D', 'A')),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);
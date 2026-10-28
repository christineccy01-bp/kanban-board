# Kanban Board

A full-stack Kanban board for managing tasks across four stages: **New**, **In Progress**, **Done** and **Archive**.

## Features

- **Board view**: tasks are grouped into a column per status.
- **Drag and drop**: move a card to another column to change its status.
- **Create tasks**: add a task with a title, description and status.
- **Task details**: click a card to see its full title, description and status.
- **Edit tasks**: change the title, description or status of a task.
- **Delete tasks**: delete an existing task.
- **Search tasks**: search cards across all columns by title or description as you type.
- **Dark mode**: switch between light and dark themes.

## Technologies

| Area | Stack |
|---|---|
| Frontend | [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, [Radix UI](https://www.radix-ui.com) (Dialog, Select, Switch), [Lucide](https://lucide.dev) icons, next-themes |
| Drag and drop | [dnd-kit](https://dndkit.com) |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL on [Neon](https://neon.tech) |
| Testing | Jest, React Testing Library |
| Tooling | pnpm, ESLint, Prettier |

## Project structure

```
kanban-board/
├── frontend/          Next.js app (http://localhost:3000)
│   ├── app/           Page, layout and global styles
│   ├── api/           API client for the backend
│   ├── components/
│   │   ├── kanban/    Board-specific components (cards, columns, task modals)
│   │   └── ui/        Reusable components (Button, Modal, InputField, Dropdown, SearchInput)
│   ├── context/       TasksContext: task state shared across the board
│   └── utils/         Shared types, constants and helpers
├── backend/           Express API (http://localhost:4242)
│   ├── server.ts      App entry point
│   ├── src/           routes, controllers, services, repos, models
│   ├── tests/         Jest tests for controllers, services and repos
│   └── db/            Database client and SQL migrations
└── start.sh           Installs dependencies and starts both apps
```

Frontend tests live next to the code they cover, in `__tests__` folders.

## Getting started

### Prerequisites

- Node.js 24 or later
- pnpm
- A Neon (or any PostgreSQL) database

### 1. Configure the database

Create `backend/.env` with your connection string:

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

Then create the table by running `backend/db/migrations/001_create_todo_items.sql` against your database. You can paste it into the Neon SQL editor.

### 2. Run the app

From the project root:

```bash
./start.sh
```

This installs the dependencies for both apps and starts the backend on port 4242 and the frontend on port 3000. Open http://localhost:3000.

To run them separately:

```bash
cd backend && pnpm install && pnpm start
cd frontend && pnpm install && pnpm dev
```

The frontend calls the backend at `http://localhost:4242` by default. To use a different backend, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend.example.com
```

### 3. Run the tests

```bash
cd frontend && pnpm test   # components, context and API client
cd backend && pnpm test    # controllers, services and repositories
```

Frontend component tests use React Testing Library and look elements up by their accessible role and label, for example `getByRole("dialog", { name: "Create Task" })`.

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todo_item` | List all tasks |
| `POST` | `/todo_item` | Create a task (`title`, `description`, `status`) |
| `PUT` | `/todo_item/:id` | Update a task |
| `DELETE` | `/todo_item/:id` | Delete a task |
| `GET` | `/` | Health check (returns the database version) |

Status codes: `N` = New, `P` = In Progress, `D` = Done, `A` = Archive.

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
| API docs | OpenAPI, Swagger UI |
| Tooling | pnpm, ESLint, Prettier |
| Deployment | Docker, Docker Hub, GitHub Actions, AWS EC2 |

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
├── .github/workflows/ CI/CD pipeline (test → build → deploy)
├── docker-compose.yml       Builds and runs both apps locally
├── docker-compose.prod.yml  Runs the prebuilt Docker Hub images on EC2
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

#### With Docker

```bash
docker compose up --build
```

This builds both images and starts the backend on port 4242 and the frontend on port 3000. It reads `DATABASE_URL` from `backend/.env`.

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

Interactive API docs (Swagger UI) are served at http://localhost:4242/api, and the raw OpenAPI spec at `/docs.json`.

## Deployment

The app runs on an AWS EC2 instance using Docker. Merging a pull request into `main` deploys it automatically through `.github/workflows/deploy.yml`:

1. **test**: runs the backend and frontend test suites. If any test fails, nothing is deployed.
2. **build**: builds both Docker images and pushes them to the private Docker Hub repository `mykanban-cicd`. Each image gets two tags:
   - `<app>` (`backend` / `frontend`): always the newest build
   - `<app>-<commit sha>`: pinned to that commit, for rollbacks
3. **deploy**: copies `docker-compose.prod.yml` to EC2 over SSH, then pulls and starts the images for that commit. EC2 never builds anything.

You can also run the workflow by hand from the **Actions** tab (**Run workflow**). Only one deploy runs at a time.

### One-time setup

**1. GitHub:** go to **Settings → Secrets and variables → Actions** and add these repository secrets:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Read & Write) |
| `EC2_HOST` | Elastic IP of the EC2 instance |
| `EC2_USER` | SSH user, e.g. `ec2-user` or `ubuntu` |
| `EC2_SSH_KEY` | Private key used to SSH into the instance |
| `EC2_APP_DIR` | Directory on EC2 that holds the compose file and `.env` files |

On the **Variables** tab, add `NEXT_PUBLIC_API_URL=http://<elastic-ip>:4242`. It is baked into the frontend at build time, so changing it requires a redeploy.

**2. EC2:** log in as the `EC2_USER` user and set up `EC2_APP_DIR`:

```bash
# Docker Hub repo is private: log in once with a Read-only access token.
# The login is saved in ~/.docker/config.json, so deploys reuse it.
docker login -u <dockerhub-username>

mkdir -p <EC2_APP_DIR>/backend && cd <EC2_APP_DIR>
echo "DATABASE_URL=postgresql://..." > backend/.env
cat > .env <<EOF
CORS_ORIGIN=http://<elastic-ip>:3000
DOCKERHUB_USERNAME=<dockerhub-username>
EOF
```

Security group: allow inbound port 22 (for GitHub Actions SSH), plus 3000 and 4242.

### Running or rolling back by hand

On the EC2 instance, in `EC2_APP_DIR`:

```bash
# Latest images
docker compose -f docker-compose.prod.yml up -d --pull always

# A specific earlier commit (find SHAs in the GitHub commit history or Docker Hub tags)
IMAGE_SUFFIX=-<commit sha> docker compose -f docker-compose.prod.yml up -d
```

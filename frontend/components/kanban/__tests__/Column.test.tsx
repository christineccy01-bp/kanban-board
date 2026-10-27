import { render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import Column from "@/components/kanban/Column";
import { CardProps } from "@/components/kanban/TaskCard";
import { useTasks } from "@/context/TasksContext";

jest.mock("@/context/TasksContext");

const tasks: CardProps[] = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements",
    status: "D",
    createdAt: 0,
  },
  {
    id: "2",
    title: "Design System",
    description: "Component library",
    status: "D",
    createdAt: 0,
  },
];

beforeEach(() => {
  jest.mocked(useTasks).mockReturnValue({
    tasks,
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    moveTask: jest.fn(),
  });
});

const renderColumn = (columnTasks: CardProps[]) =>
  render(
    <DndContext>
      <Column id="D" tasks={columnTasks} />
    </DndContext>,
  );

describe("Column", () => {
  it("shows the status name as its heading", () => {
    renderColumn([]);

    expect(
      screen.getByRole("heading", { level: 2, name: "Done" }),
    ).toBeInTheDocument();
  });

  it("renders a card for each task", () => {
    renderColumn(tasks);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Research Project", "Design System"]);
  });

  it("renders no cards when there are no tasks", () => {
    renderColumn([]);

    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });
});

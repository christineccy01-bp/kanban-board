import { act, fireEvent, render, screen, within } from "@testing-library/react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { CardProps } from "@/components/kanban/TaskCard";
import { useTasks } from "@/context/TasksContext";

jest.mock("@/context/TasksContext");
jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: jest.fn() }),
}));

const tasks: CardProps[] = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements",
    status: "N",
    createdAt: 0,
  },
  {
    id: "2",
    title: "Design System",
    description: "Component library",
    status: "P",
    createdAt: 0,
  },
];

const createTask = jest.fn();

beforeEach(() => {
  createTask.mockReset().mockResolvedValue(undefined);
  jest.mocked(useTasks).mockReturnValue({
    tasks,
    createTask,
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    moveTask: jest.fn(),
  });
});

const column = (name: string) =>
  screen.getByRole("heading", { level: 2, name }).parentElement!;

const search = (value: string) =>
  fireEvent.change(screen.getByRole("searchbox"), { target: { value } });

describe("KanbanBoard", () => {
  it("renders the header, search, add button and dark mode switch", () => {
    render(<KanbanBoard />);

    expect(
      screen.getByRole("heading", { level: 1, name: "My Kanban Board" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Task" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Dark mode" }),
    ).toBeInTheDocument();
  });

  it("renders a column for every status", () => {
    render(<KanbanBoard />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["New", "In Progress", "Done", "Archive"]);
  });

  it("places each task in the column for its status", () => {
    render(<KanbanBoard />);

    expect(
      within(column("New")).getByText("Research Project"),
    ).toBeInTheDocument();
    expect(
      within(column("In Progress")).getByText("Design System"),
    ).toBeInTheDocument();
    expect(
      within(column("Done")).queryByRole("heading", { level: 3 }),
    ).toBeNull();
  });

  it("filters the cards by the search query", () => {
    render(<KanbanBoard />);

    search("library");

    expect(screen.getByText("Design System")).toBeInTheDocument();
    expect(screen.queryByText("Research Project")).not.toBeInTheDocument();
  });

  it("shows a message when no tasks match the search", () => {
    render(<KanbanBoard />);

    search("  deploy  ");

    // dnd-kit adds its own role="status" live region, so query by text
    expect(screen.getByText("No tasks match “deploy”")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("does not show the no-match message when the search is empty", () => {
    jest.mocked(useTasks).mockReturnValue({
      ...jest.mocked(useTasks)(),
      tasks: [],
    });
    render(<KanbanBoard />);

    expect(screen.queryByText(/No tasks match/)).not.toBeInTheDocument();
  });

  it("opens the create task modal and creates a task", async () => {
    render(<KanbanBoard />);

    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));
    const dialog = screen.getByRole("dialog", { name: "Create Task" });
    fireEvent.change(within(dialog).getByLabelText("Title"), {
      target: { value: "Write tests" },
    });
    fireEvent.change(within(dialog).getByLabelText("Description"), {
      target: { value: "For every component" },
    });
    await act(async () =>
      fireEvent.click(within(dialog).getByRole("button", { name: "Save" })),
    );

    expect(createTask).toHaveBeenCalledWith({
      title: "Write tests",
      description: "For every component",
      status: "N",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

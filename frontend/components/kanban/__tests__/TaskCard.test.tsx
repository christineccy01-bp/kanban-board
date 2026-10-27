import { fireEvent, render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import TaskCard, {
  CardProps,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  truncate,
} from "@/components/kanban/TaskCard";
import { useTasks } from "@/context/TasksContext";

jest.mock("@/context/TasksContext");

describe("truncate", () => {
  it("returns text unchanged when shorter than the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns text unchanged when exactly at the limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("cuts text to the limit and appends an ellipsis when over the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("trims trailing whitespace before the ellipsis", () => {
    expect(truncate("hello world", 6)).toBe("hello…");
  });

  it("handles an empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});
describe("TaskCard", () => {
  const task: CardProps = {
    id: "1",
    title: "Research Project",
    description: "Gather requirements",
    status: "N",
    createdAt: 0,
  };

  beforeEach(() => {
    jest.mocked(useTasks).mockReturnValue({
      tasks: [task],
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      moveTask: jest.fn(),
    });
  });

  const renderCard = (overrides: Partial<CardProps> = {}) =>
    render(
      <DndContext>
        <TaskCard {...task} {...overrides} />
      </DndContext>,
    );

  it("shows the title, description and status", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { name: "Research Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gather requirements")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("truncates long text but keeps the full text in the tooltip", () => {
    const title = "a".repeat(TITLE_MAX_LENGTH + 10);
    const description = "b".repeat(DESCRIPTION_MAX_LENGTH + 10);
    renderCard({ title, description });

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent(truncate(title, TITLE_MAX_LENGTH));
    expect(heading).toHaveAttribute("title", title);
    expect(
      screen.getByText(truncate(description, DESCRIPTION_MAX_LENGTH)),
    ).toHaveAttribute("title", description);
  });

  it("is draggable", () => {
    renderCard();

    expect(
      screen.getByRole("button", { name: /Research Project/ }),
    ).toHaveAttribute("aria-roledescription", "draggable");
  });

  it("opens the task details when clicked", () => {
    renderCard();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("heading", { name: "Research Project" }));

    expect(
      screen.getByRole("dialog", { name: "Research Project" }),
    ).toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import TaskCardDetails from "@/components/kanban/TaskCardDetails";
import { CardProps } from "@/components/kanban/TaskCard";
import { useTasks } from "@/context/TasksContext";

jest.mock("@/context/TasksContext");
const mockUseTasks = jest.mocked(useTasks);

const task: CardProps = {
  id: "1",
  title: "Research Project",
  description: "Gather requirements",
  status: "P",
  createdAt: 0,
};

const updateTask = jest.fn();
const deleteTask = jest.fn();

const renderDetails = (overrides: Partial<CardProps> = {}) => {
  const onClose = jest.fn();
  render(
    <TaskCardDetails task={{ ...task, ...overrides }} open onClose={onClose} />,
  );
  return { onClose };
};

beforeEach(() => {
  updateTask.mockReset().mockResolvedValue(undefined);
  deleteTask.mockReset().mockResolvedValue(undefined);
  mockUseTasks.mockReturnValue({
    tasks: [task],
    createTask: jest.fn(),
    updateTask,
    deleteTask,
    moveTask: jest.fn(),
  });
});

describe("TaskCardDetails", () => {
  it("shows the task title, status and description", () => {
    renderDetails();

    expect(
      screen.getByRole("dialog", { name: "Research Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Gather requirements")).toBeInTheDocument();
  });

  it("shows a placeholder when there is no description", () => {
    renderDetails({ description: "" });

    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  it("switches to the edit view when Edit is clicked", () => {
    renderDetails();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("dialog", { name: "Edit Task" }),
    ).toBeInTheDocument();
  });

  it("returns to the details view when Back is clicked in the edit view", () => {
    renderDetails();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(
      screen.getByRole("dialog", { name: "Research Project" }),
    ).toBeInTheDocument();
  });

  it("updates the task and returns to the details view on save", async () => {
    renderDetails();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated" },
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Save" })),
    );

    expect(updateTask).toHaveBeenCalledWith("1", {
      title: "Updated",
      description: "Gather requirements",
      status: "P",
    });
    expect(
      screen.queryByRole("dialog", { name: "Edit Task" }),
    ).not.toBeInTheDocument();
  });

  it("asks for confirmation before deleting", async () => {
    renderDetails();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByRole("dialog", { name: "Delete Task" }),
    ).toHaveTextContent("Are you sure you want to delete Research Project?");
    expect(deleteTask).not.toHaveBeenCalled();

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Delete" })),
    );

    expect(deleteTask).toHaveBeenCalledWith("1");
  });

  it("can start a delete from the edit view", () => {
    renderDetails();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByRole("dialog", { name: "Delete Task" }),
    ).toBeInTheDocument();
  });

  it("returns to the previous view when the delete is cancelled", () => {
    renderDetails();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.getByRole("dialog", { name: "Edit Task" }),
    ).toBeInTheDocument();
    expect(deleteTask).not.toHaveBeenCalled();
  });

  it("calls onClose(false) when closed", () => {
    const { onClose } = renderDetails();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledWith(false);
  });
});

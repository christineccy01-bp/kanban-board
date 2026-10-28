import { act, fireEvent, render, screen } from "@testing-library/react";
import EditTaskModal, {
  EditTaskModalProps,
} from "@/components/kanban/EditTaskModal";
import { CardProps } from "@/components/kanban/TaskCard";

const task: CardProps = {
  id: "1",
  title: "Research Project",
  description: "Gather requirements",
  status: "N",
  createdAt: 0,
};

const renderEdit = (props: Partial<EditTaskModalProps> = {}) =>
  render(
    <EditTaskModal
      task={task}
      open
      onSave={jest.fn().mockResolvedValue(undefined)}
      onBack={jest.fn()}
      onDelete={jest.fn()}
      onClose={jest.fn()}
      {...props}
    />,
  );

const save = () =>
  act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Save" })),
  );

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("EditTaskModal", () => {
  it("pre-fills the form with the task", () => {
    renderEdit();

    expect(
      screen.getByRole("dialog", { name: "Edit Task" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Research Project");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Gather requirements",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent(
      "New",
    );
  });

  it("saves the edited values", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    renderEdit({ onSave });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New description" },
    });
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Status" }), {
      key: "Enter",
    });
    fireEvent.click(screen.getByRole("option", { name: "Done" }));
    await save();

    expect(onSave).toHaveBeenCalledWith({
      title: "Updated",
      description: "New description",
      status: "D",
    });
  });

  it("logs when saving fails", async () => {
    const error = new Error("boom");
    renderEdit({ onSave: jest.fn().mockRejectedValue(error) });

    await save();

    expect(console.error).toHaveBeenCalledWith("Failed to save task:", error);
  });

  it("calls onDelete when Delete is clicked", () => {
    const onDelete = jest.fn();
    renderEdit({ onDelete });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when Back is clicked", () => {
    const onBack = jest.fn();
    renderEdit({ onBack });

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onClose(false) when Close is clicked", () => {
    const onClose = jest.fn();
    renderEdit({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledWith(false);
  });

  describe("validation", () => {
    const type = (label: string, value: string) =>
      fireEvent.change(screen.getByLabelText(label), { target: { value } });

    it.each([
      ["title is cleared", "Title", ""],
      ["description is cleared", "Description", ""],
      ["title is only spaces", "Title", "   "],
      ["description is only spaces", "Description", "   "],
    ])("does not save when the %s", async (_, label, value) => {
      const onSave = jest.fn().mockResolvedValue(undefined);
      renderEdit({ onSave });

      type(label, value);
      await save();

      expect(onSave).not.toHaveBeenCalled();
      expect(screen.getByLabelText(label)).toBeInvalid();
    });

    it("does not save a task that already has an empty description", async () => {
      const onSave = jest.fn().mockResolvedValue(undefined);
      renderEdit({ task: { ...task, description: "" }, onSave });

      await save();

      expect(onSave).not.toHaveBeenCalled();
      expect(screen.getByLabelText("Description")).toBeInvalid();
    });

    it("trims surrounding spaces before saving", async () => {
      const onSave = jest.fn().mockResolvedValue(undefined);
      renderEdit({ onSave });

      type("Title", "  Updated ");
      type("Description", " New description  ");
      await save();

      expect(onSave).toHaveBeenCalledWith({
        title: "Updated",
        description: "New description",
        status: "N",
      });
    });

    it("saves once a spaces-only field is filled in", async () => {
      const onSave = jest.fn().mockResolvedValue(undefined);
      renderEdit({ onSave });

      type("Description", "   ");
      await save();
      expect(onSave).not.toHaveBeenCalled();

      type("Description", "New description");
      await save();

      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });
});

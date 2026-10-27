import { act, fireEvent, render, screen } from "@testing-library/react";
import AddTaskModal, {
  AddTaskModalProps,
} from "@/components/kanban/AddTaskModal";

const renderPopup = (props: Partial<AddTaskModalProps> = {}) =>
  render(
    <AddTaskModal
      isOpen
      onClose={jest.fn()}
      popUpTitle="Create Task"
      onCreate={jest.fn().mockResolvedValue(undefined)}
      {...props}
    />,
  );

const fillForm = () => {
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Write tests" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "For every component" },
  });
};

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const chooseStatus = (label: string) => {
  fireEvent.keyDown(screen.getByRole("combobox", { name: "Status" }), {
    key: "Enter",
  });
  fireEvent.click(screen.getByRole("option", { name: label }));
};

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

describe("AddTaskModal", () => {
  it("renders nothing when closed", () => {
    renderPopup({ isOpen: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an empty form with the given title and New status", () => {
    renderPopup();

    expect(
      screen.getByRole("dialog", { name: "Create Task" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent(
      "New",
    );
  });

  it("creates the task with the entered values and closes", async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    renderPopup({ onCreate, onClose });

    fillForm();
    chooseStatus("In Progress");
    await save();

    expect(onCreate).toHaveBeenCalledWith({
      title: "Write tests",
      description: "For every component",
      status: "P",
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("resets the form after a successful create", async () => {
    renderPopup();

    fillForm();
    chooseStatus("Done");
    await save();

    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent(
      "New",
    );
  });

  it("stays open and keeps the input when create fails", async () => {
    const error = new Error("boom");
    const onClose = jest.fn();
    renderPopup({ onCreate: jest.fn().mockRejectedValue(error), onClose });

    fillForm();
    await save();

    expect(console.error).toHaveBeenCalledWith("Failed to create task:", error);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Title")).toHaveValue("Write tests");
  });

  it("calls onClose when the footer Close button is clicked", () => {
    const onClose = jest.fn();
    renderPopup({ onClose });

    // The header X is also named "Close", so target the footer button by its text
    fireEvent.click(screen.getByText("Close"));

    expect(onClose).toHaveBeenCalled();
  });

  describe("validation", () => {
    const expectNotSaved = (onCreate: jest.Mock, onClose: jest.Mock) => {
      expect(onCreate).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    };

    it.each([
      ["title is empty", "", "For every component", "Title"],
      ["description is empty", "Write tests", "", "Description"],
      ["title is only spaces", "   ", "For every component", "Title"],
      ["description is only spaces", "Write tests", "   ", "Description"],
    ])("does not save when the %s", async (_, title, description, invalid) => {
      const onCreate = jest.fn().mockResolvedValue(undefined);
      const onClose = jest.fn();
      renderPopup({ onCreate, onClose });

      type("Title", title);
      type("Description", description);
      await save();

      expectNotSaved(onCreate, onClose);
      expect(screen.getByLabelText(invalid)).toBeInvalid();
    });

    it("does not save an untouched form", async () => {
      const onCreate = jest.fn().mockResolvedValue(undefined);
      const onClose = jest.fn();
      renderPopup({ onCreate, onClose });

      await save();

      expectNotSaved(onCreate, onClose);
    });

    it("trims surrounding spaces before saving", async () => {
      const onCreate = jest.fn().mockResolvedValue(undefined);
      renderPopup({ onCreate });

      type("Title", "  Write tests ");
      type("Description", " For every component  ");
      await save();

      expect(onCreate).toHaveBeenCalledWith({
        title: "Write tests",
        description: "For every component",
        status: "N",
      });
    });

    it("saves once a spaces-only field is filled in", async () => {
      const onCreate = jest.fn().mockResolvedValue(undefined);
      renderPopup({ onCreate });

      type("Title", "   ");
      type("Description", "For every component");
      await save();
      expect(onCreate).not.toHaveBeenCalled();

      type("Title", "Write tests");
      await save();

      expect(onCreate).toHaveBeenCalledTimes(1);
    });
  });
});

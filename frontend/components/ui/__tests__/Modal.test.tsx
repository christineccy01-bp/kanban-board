import { fireEvent, render, screen } from "@testing-library/react";
import Modal, { ModalProps } from "@/components/ui/Modal";

const renderModal = (props: Partial<ModalProps> = {}) =>
  render(
    <Modal open onOpenChange={jest.fn()} title="Task" {...props}>
      <p>Body content</p>
    </Modal>,
  );

describe("Modal", () => {
  it("renders nothing when closed", () => {
    renderModal({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a dialog labelled by its title with its children", () => {
    renderModal();

    expect(screen.getByRole("dialog", { name: "Task" })).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    renderModal({ description: "Some details" });

    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "Some details",
    );
  });

  it("renders the footer when provided", () => {
    renderModal({ footer: <button>Save</button> });

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when the close button is clicked", () => {
    const onOpenChange = jest.fn();
    renderModal({ onOpenChange });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const onOpenChange = jest.fn();
    renderModal({ onOpenChange });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("only shows the back button when onBack is provided", () => {
    const { unmount } = renderModal();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
    unmount();

    const onBack = jest.fn();
    renderModal({ onBack });
    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

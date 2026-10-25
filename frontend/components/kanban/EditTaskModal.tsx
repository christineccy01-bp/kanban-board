"use client";

import { SubmitEvent, useState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import Modal from "./Modal";
import { CardProps, TaskUpdateProps } from "./TaskCard";
import { STATUS_OPTIONS } from "../../utils/constants";
import { TaskStatus } from "@/utils/types";

export type EditTaskModalProps = {
  task: CardProps;
  open: boolean;
  onSave: (changes: TaskUpdateProps) => Promise<void>;
  onBack: () => void;
  onDelete: () => void;
  onClose: (open: boolean) => void;
};

const EditTaskModal = ({
  task,
  open,
  onSave,
  onBack,
  onDelete,
  onClose,
}: EditTaskModalProps) => {
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newStatus, setNewStatus] = useState<TaskStatus>(task.status);

  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSave({
        title: newTitle,
        description: newDescription,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const formId = `edit-task-form-${task.id}`;

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      onBack={onBack}
      title="Edit Task"
      footer={
        <>
          <Button type="submit" form={formId}>
            Save
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={handleSave}
        className="flex flex-col gap-4 text-sm"
      >
        <InputField
          id={`${formId}-title`}
          label="Title"
          required
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <InputField
          id={`${formId}-status`}
          label="Status"
          type="select"
          options={STATUS_OPTIONS}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
        />
        <InputField
          id={`${formId}-description`}
          label="Description"
          type="textarea"
          rows={4}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </form>
    </Modal>
  );
};

export default EditTaskModal;

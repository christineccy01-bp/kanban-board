"use client";

import { useState } from "react";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";
import EditTaskModal from "./EditTaskModal";
import Modal from "./Modal";
import StatusTag from "./StatusBadge";
import { CardProps, TaskUpdateProps } from "./TaskCard";

export type TaskCardDetailsProps = {
  task: CardProps;
  open: boolean;
  onEdit: (changes: TaskUpdateProps) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: (open: boolean) => void;
};

const TaskCardDetails = ({
  task,
  open,
  onEdit,
  onDelete,
  onClose,
}: TaskCardDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

const startEditing = () => {
  setIsEditing(true);
}

const handleClose = (isOpen: boolean) => {
  if (!isOpen) {
    setIsEditing(false);
    setIsConfirmingDelete(false);
  }
  onClose(isOpen);
}

const handleSave = async (changes: TaskUpdateProps) => {
  await onEdit(changes);
  setIsEditing(false);
};

  // Cancelling returns to whichever view the delete was started from
  if (isConfirmingDelete) {
    return (
      <ConfirmModal
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setIsConfirmingDelete(false);
        }}
        title="Delete Task"
        confirmLabel="Delete"
        onConfirm={onDelete}
      >
        Are you sure you want to delete <strong>{task.title}</strong>? This
        cannot be undone.
      </ConfirmModal>
    );
  }

  if (isEditing) {
    return (
      <EditTaskModal
        task={task}
        open={open}
        onSave={handleSave}
        onBack={() => setIsEditing(false)}
        onDelete={() => setIsConfirmingDelete(true)}
        onClose={handleClose}
      />
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={task.title}
      footer={
        <>
        <Button key="edit" onClick={startEditing}>
          Edit
        </Button>
        <Button key="delete" variant="danger" onClick={() => setIsConfirmingDelete(true)}>
          Delete
        </Button>
      </>
      }
    >
    <dl className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <dt className="font-medium text-slate-500 dark:text-neutral-400">
          Status
        </dt>
        <dd>
          <StatusTag status={task.status} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="font-medium text-slate-500 dark:text-neutral-400">
          Description
        </dt>
        <dd className="whitespace-pre-wrap break-words">
          {task.description || "No description"}
        </dd>
      </div>
    </dl>
    </Modal>
  );
};

export default TaskCardDetails;

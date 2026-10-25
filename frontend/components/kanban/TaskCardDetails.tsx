"use client";

import { FormEvent, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import StatusTag from "./StatusBadge";
import { CardProps, TaskUpdateProps } from "./TaskCard";
import { TaskStatus } from "../types";


export type TaskCardDetailsProps = {
  task: CardProps;
  open: boolean;
  onEdit: (changes: TaskUpdateProps) => Promise<void>;
  onClose: (open: boolean) => void;
};

const TaskCardDetails = ({
  task,
  open,
  onEdit,
  onClose,
}: TaskCardDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newStatus, setNewStatus] = useState<TaskStatus>(task.status);

const startEditing = () => {
  setIsEditing(true);
}

const handleClose = (isOpen: boolean) => {
  if(!isOpen) setIsEditing(false);
  onClose(isOpen);
}

const handleSave = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await onEdit({
      title: newTitle,
      description: newDescription,
      status: newStatus,
    });
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to save task:", error);
  }
};

const formId = `edit-task-form-${task.id}`;

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={isEditing ? "Edit Task" : task.title}
      footer={
        isEditing ? (        
        <>
          <Button key="save" type="submit" form = {formId}>
            Save
          </Button>
          <Button key="cancel" variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>)
        :
        (<>
        <Button key="edit" variant="secondary" onClick={startEditing}>
          Edit
        </Button>
        <Button key="close" variant="secondary" onClick={() => handleClose(false)}>
          Close
        </Button>
      </>
        )
      }
    >
    {isEditing ? (
        <form
        id={formId}
        onSubmit={handleSave}
        className="flex flex-col gap-4 text-sm"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-title`}>
            Title
          </label>
          <input
            id={`${formId}-title`}
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-status`}>
            Status
          </label>
          <select
            id={`${formId}-status`}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
          >
            <option value="new">New</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${formId}-description`}>
            Description
          </label>
          <textarea
            id={`${formId}-description`}
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
      </form>
    ) : (      
    <dl className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">

        <dt className="font-medium text-slate-500 dark:text-slate-400">
          Status
        </dt>
        <dd>
          <StatusTag status={task.status} />
        </dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="font-medium text-slate-500 dark:text-slate-400">
          Description
        </dt>
        <dd className="whitespace-pre-wrap break-words">
          {task.description || "No description"}
        </dd>
      </div>
    </dl>
    )}
    </Modal>
  );
};

export default TaskCardDetails;

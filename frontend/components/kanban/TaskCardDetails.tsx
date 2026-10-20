"use client";

import Button from "./Button";
import Modal from "./Modal";
import StatusTag from "./StatusBadge";
import { CardProps } from "./TaskCard";

export type TaskCardDetailsProps = {
  task: CardProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TaskCardDetails = ({
  task,
  open,
  onOpenChange,
}: TaskCardDetailsProps) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={task.title}
      footer={
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
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
    </Modal>
  );
};

export default TaskCardDetails;

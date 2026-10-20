"use client";

import { useDraggable } from "@dnd-kit/core";
import { TaskStatus } from "../types";
import StatusTag from "./StatusBadge";

export type CardProps = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

const TaskCard = ({ id, title, description, status }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <article
      id={id}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      draggable
      className=" cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
      style={style}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{title}</h3>
        <StatusTag status={status} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </article>
  );
};

export default TaskCard;

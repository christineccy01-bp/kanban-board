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

export const TITLE_MAX_LENGTH = 30;
export const DESCRIPTION_MAX_LENGTH = 130;

export const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;

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
      className=" cursor-grab rounded-lg bg-white p-4 shadow-sm active:cursor-grabbing dark:bg-neutral-900 dark:shadow-neutral-800"
      style={style}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug" title={title}>
          {truncate(title, TITLE_MAX_LENGTH)}
        </h3>
        <StatusTag status={status} />
      </div>
      <p
        className="text-sm text-slate-600 dark:text-slate-400"
        title={description}
      >
        {truncate(description, DESCRIPTION_MAX_LENGTH)}
      </p>
    </article>
  );
};

export default TaskCard;

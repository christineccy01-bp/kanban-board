import { StatusTag, TaskStatus } from "./StatusBadge";

type CardProps = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

const Card = ({ id, title, description, status }: CardProps) => {
  return (
    <article
      id={id}
      draggable
      className="w-72 cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
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

export default Card;

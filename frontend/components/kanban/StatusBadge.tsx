import { TaskStatus } from "@/utils/types";

export type StatusTagProps = {
  status: TaskStatus;
};

const STATUS_STYLES: Record<TaskStatus, { label: string; className: string }> =
  {
    N: {
      label: "New",
      className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    },
    P: {
      label: "In Progress",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    },
    D: {
      label: "Done",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    },
    A: {
      label: "Archive",
      className:
        "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    },
  };

const StatusTag = ({ status }: StatusTagProps) => {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusTag;
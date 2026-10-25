import { TaskStatus } from "./types";

export const STATUS_MAP: Record<TaskStatus, string> = {
  N: 'New',
  P: 'In Progress',
  D: 'Done',
  A: 'Archive'
}

export const STATUS_OPTIONS = (Object.keys(STATUS_MAP) as TaskStatus[]).map((value) => ({
  value,
  label: STATUS_MAP[value],
}));
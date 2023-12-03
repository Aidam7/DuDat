import { type Group, type Task } from "@prisma/client";

export interface ITableColumns {
  key: string;
  label: string;
}
export interface ITaskWithGroup extends Task {
  group: Group
}
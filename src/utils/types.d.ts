import { type Group, type Task } from "@prisma/client";

export interface ITaskWithGroup extends Task {
  group: Group;
}
export interface IBreadcrumb {
  name: string;
  link: string;
}

import React from "react";
import BreadcrumbDisplay from "../breadcrumbs";
import { IBreadcrumb } from "~/utils/types";

type Props = {
  name: string;
  breadcrumbs: IBreadcrumb[];
  description?: string;
};

const PageHeader: React.FC<Props> = (props: Props) => {
  return (
    <div className="grid-col-1">
      <BreadcrumbDisplay breadcrumbs={props.breadcrumbs} />
      <h1 className="mb-1 text-6xl font-semibold">{props.name}</h1>
      {props.description && (
        <span className="text-3xl font-semibold italic lg:ml-5">
          {props.description}
        </span>
      )}
    </div>
  );
};

export default PageHeader;

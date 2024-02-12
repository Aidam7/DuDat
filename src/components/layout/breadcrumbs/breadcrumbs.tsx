import { BreadcrumbItem, Breadcrumbs, breadcrumbs } from "@nextui-org/react";
import React, { type FC } from "react";
import { type IBreadcrumb } from "~/utils/types";

interface Props {
  breadcrumbs: IBreadcrumb[];
}

const BreadcrumbDisplay: FC<Props> = (props: Props) => {
  if (props.breadcrumbs.length < 2) return;
  return (
    <Breadcrumbs variant="bordered">
      {props.breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem key={breadcrumb.link} href={breadcrumb.link}>
          {breadcrumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbDisplay;

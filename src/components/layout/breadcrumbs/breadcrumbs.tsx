import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import Link from "next/link";
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
        <BreadcrumbItem key={breadcrumb.link}>
          <Link href={breadcrumb.link}>{breadcrumb.name}</Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbDisplay;

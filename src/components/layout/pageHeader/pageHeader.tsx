import React from "react";

type Props = {
  name: string;
  description?: string;
};

const PageHeader: React.FC<Props> = (props: Props) => {
  return (
    <div className="grid-col-1">
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

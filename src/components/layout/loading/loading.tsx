import { Spinner } from "@nextui-org/react";
import React from "react";
import CenteredLayout from "../centeredLayout";
interface Props {
  text?: string;
}
const Loading: React.FC<Props> = (props: Props) => {
  return (
    <CenteredLayout>
      <Spinner size="lg">
        <span className="text-lg font-semibold">
          {props.text ? props.text : "Loading..."}
        </span>
      </Spinner>
    </CenteredLayout>
  );
};

export default Loading;

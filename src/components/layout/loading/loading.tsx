import { Spinner } from "@nextui-org/react";
import React from "react";
import CenteredLayout from "../centeredLayout";

const Loading: React.FC = () => {
  return (
    <CenteredLayout>
      <Spinner size="lg">
        <span className="text-lg font-semibold">Loading...</span>
      </Spinner>
    </CenteredLayout>
  );
};

export default Loading;

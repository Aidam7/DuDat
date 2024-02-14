import { Spinner } from "@nextui-org/react";
import React from "react";
import CenteredLayout from "../centeredLayout";

const Loading: React.FC = () => {
  return (
    <CenteredLayout>
      <Spinner>Loading...</Spinner>
    </CenteredLayout>
  );
};

export default Loading;

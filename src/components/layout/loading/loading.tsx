import { Spinner } from "@nextui-org/react";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner>Loading...</Spinner>
    </div>
  );
};

export default Loading;

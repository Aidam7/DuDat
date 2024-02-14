import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CenteredLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-5 text-center">
      {children}
    </div>
  );
};

export default CenteredLayout;

import React from "react";
import Image from "next/image";
import img500 from "public/images/errors/500.jpg";
import CenteredLayout from "../../centeredLayout";

const Code500: React.FC = () => {
  return (
    <CenteredLayout>
      <h1 className="mb-10 hidden text-9xl">500</h1>
      <p className="mb-10 hidden text-3xl">
        An internal server error occurred.
      </p>
      <Image src={img500} alt="500" width={500} height={500} />
    </CenteredLayout>
  );
};
export default Code500;

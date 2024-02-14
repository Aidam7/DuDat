import React from "react";
import Image from "next/image";
import img401 from "public/images/errors/401.jpg";
import CenteredLayout from "../../centeredLayout";

const Code401: React.FC = () => {
  return (
    <CenteredLayout>
      <h1 className="mb-10 hidden text-9xl">401</h1>
      <p className="mb-10 hidden text-3xl">
        You are not authorized to enter this page.
      </p>
      <Image src={img401} alt="403" width={500} height={500} />
    </CenteredLayout>
  );
};
export default Code401;

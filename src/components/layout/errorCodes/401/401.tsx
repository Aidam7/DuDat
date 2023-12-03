import React from "react";
import Image from "next/image";
import img401 from "public/images/errors/401.jpg";

const Code401: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-10 hidden text-9xl">401</h1>
      <p className="mb-10 hidden text-3xl">
        You are not authorized to enter this page.
      </p>
      <Image src={img401} alt="403" width={500} height={500} />
    </div>
  );
};
export default Code401;

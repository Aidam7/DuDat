import React from "react";
import Image from "next/image";
import img400 from "public/images/400.jpg";

const Code400: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-10 hidden text-9xl">400</h1>
      <p className="mb-10 hidden text-3xl">Bad request.</p>
      <Image src={img400} alt="400" width={500} height={500} />
    </div>
  );
};
export default Code400;

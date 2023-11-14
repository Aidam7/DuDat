import React from "react";
import Image from "next/image";
import img404 from "public/images/errors/404.jpg";

const Code404: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-10 hidden text-9xl">404</h1>
      <p className="mb-10 hidden text-3xl">
        Sorry, the page you are looking for does not exist.
      </p>
      <Image src={img404} alt="404" width={500} height={500} />
    </div>
  );
};
export default Code404;

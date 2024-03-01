import React from "react";
import Image from "next/image";
import img404 from "public/images/errors/404.jpg";
import CenteredLayout from "../../centeredLayout";

const Code404: React.FC = () => {
  return (
    <CenteredLayout>
      <h1 className="mb-10 hidden text-9xl">404</h1>
      <p className="mb-10 hidden text-3xl">
        Sorry, the page you are looking for does not exist.
      </p>
      <Image src={img404} alt="404" width={500} height={500} />
    </CenteredLayout>
  );
};
export default Code404;

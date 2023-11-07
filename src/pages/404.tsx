import React from "react";

import Image from 'next/image';
import img404 from 'public/images/404.jpg';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-9xl mb-10 hidden">404</h1>
      <p className="text-3xl mb-10 hidden">Sorry, the page you are looking for does not exist.</p>
      <Image src={img404} alt="404" width={500} height={500} />
    </div>
  );
};

export default NotFoundPage;

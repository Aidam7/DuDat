import Link from "next/link";
import React, { type FC } from "react";

const Footer: FC = () => {
  return (
    <>
      <footer className="fixed bottom-0 z-30 w-full bg-blue py-1 text-white">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="w-full px-4 text-center sm:w-auto sm:text-left">
              <span className="text-lg font-semibold">DuDat</span> —— MIT
              License 2023 - {new Date().getFullYear()}
            </div>
            <div className="w-full px-4 text-center sm:w-auto sm:text-left">
              Contact me on{" "}
              <Link
                href={"https://github.com/Aidam7/DuDat"}
                className="font-semibold"
              >
                Github
              </Link>
              !
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

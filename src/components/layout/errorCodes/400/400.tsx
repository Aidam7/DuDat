import React from "react";
import Image from "next/image";
import img400 from "public/images/400.jpg";
interface Props {
  specifier: string;
}

const Code400: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-10 hidden text-9xl">400</h1>
      <p className="mb-10 hidden text-3xl">Bad request.</p>
      <p className="text-3xl">{props.specifier}</p>
      <Image src={img400} alt="400" width={500} height={500} />
    </div>
  );
};
export default Code400;

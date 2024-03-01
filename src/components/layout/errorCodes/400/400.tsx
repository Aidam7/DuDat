import React from "react";
import Image from "next/image";
import img400 from "public/images/errors/400.jpg";
import CenteredLayout from "../../centeredLayout";
interface Props {
  specifier: string;
}

const Code400: React.FC<Props> = (props: Props) => {
  return (
    <CenteredLayout>
      <h1 className="mb-10 hidden text-9xl">400</h1>
      <p className="mb-10 hidden text-3xl">Bad request.</p>
      <p className="text-3xl">{props.specifier}</p>
      <Image src={img400} alt="400" width={500} height={500} />
    </CenteredLayout>
  );
};
export default Code400;

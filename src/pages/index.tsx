import CenteredLayout from "~/components/layout/centeredLayout";

export default function Home() {
  return (
    <CenteredLayout>
      <div className="container flex flex-col items-center justify-center px-4 py-16 ">
        <h1 className="text-9xl font-extrabold tracking-tight sm:text-[5rem]">
          DuDat
        </h1>
        <div className="flex flex-col items-center tracking-tight">
          <p className="mb-5 text-6xl max-md:text-3xl">
            A dead simple, easy to use TODO app
          </p>
          <p className="text-3xl max-md:text-xl">
            For both individuals or groups
          </p>
        </div>
      </div>
    </CenteredLayout>
  );
}

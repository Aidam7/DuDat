export default function Home() {
  return (
    <>
      <main className=" flex flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center px-4 py-16 ">
          <h1 className="text-9xl font-extrabold tracking-tight sm:text-[5rem]">
            DuDat
          </h1>
          <div className="flex flex-col items-center tracking-tight">
            <p className="mb-5 text-6xl">A dead simple, easy to use TODO app</p>
            <p className="text-3xl">For both individuals or groups</p>
          </div>
        </div>
      </main>
    </>
  );
}

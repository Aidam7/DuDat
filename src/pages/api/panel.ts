/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../server/api/root";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === "development") {
    res.status(200).send(
      renderTrpcPanel(appRouter, {
        url: "http://localhost:3000/api/trpc",
        transformer: "superjson",
      }),
    );
  } else {
    res.status(404).end();
  }
}

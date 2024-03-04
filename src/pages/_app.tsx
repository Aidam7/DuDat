import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import { NextUIProvider } from "@nextui-org/react";
import { type NextPage } from "next";
import Head from "next/head";
import DuDatNavbar from "~/components/layout/navbar/";
import "../components/tasks/taskCalendar/calendar.scss";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "~/components/layout/footer";
import CheckAuth from "~/components/auth/checkAuth";
import "~/styles/globals.css";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  // getLayout?: (page: ReactElement) => ReactNode,
  Layout?: typeof DefaultLayout;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const DefaultLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const Wrapper = Component.Layout ?? DefaultLayout;
  return (
    <div lang="en">
      <NextUIProvider className="break-words font-sans light">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment*/}
        <SessionProvider session={session}>
          <Wrapper>
            <Head>
              <title>DuDat</title>
              <meta name="description" content="A dead simple TODO app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <DuDatNavbar />
            <div className="flex flex-col px-8 py-20 md:px-16 lg:px-32 xl:px-64">
              <CheckAuth>
                <Component {...pageProps} />
              </CheckAuth>
            </div>
            <Footer />
          </Wrapper>
        </SessionProvider>
      </NextUIProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);

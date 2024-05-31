import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { Header } from "~/components/header/header";
import { Sidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider } from "~/contexts/SidebarContext";
import "~/styles/globals.css";
import { ThemeProvider } from "~/providers/theme-provider";
import { Footer } from "~/components/footer/footer";

import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <Analytics />
          <Header />
          <div className="flex-grow-1 grid grid-cols-[auto,1fr] overflow-auto">
            <Sidebar />
            <Component {...pageProps} />
          </div>
          <Footer />
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

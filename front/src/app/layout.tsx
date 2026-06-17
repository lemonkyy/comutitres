import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import "./globals.css";
import Navbar from "@/components/layout/navbar/navbar";
import { ApiClientProvider } from "@/contexts/api-client";
import { routing } from "@/i18n/routing";

type ProvidersProps = {
  children: ReactNode;
};

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <NextIntlClientProvider>
      <ApiClientProvider>
        <Navbar />
        {children}
      </ApiClientProvider>
    </NextIntlClientProvider>
  );
};

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang={routing.defaultLocale}>
      <body className="flex min-h-dvh flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-[4.5rem] md:pb-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

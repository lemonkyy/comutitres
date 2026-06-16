import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import "./globals.css";
import Navbar from "@/components/partials/navbar";
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
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

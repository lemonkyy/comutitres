import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome/app-chrome";
import { ApiClientProvider } from "@/contexts/api-client";
import { AuthProvider } from "@/contexts/auth-context";
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
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </ApiClientProvider>
    </NextIntlClientProvider>
  );
};

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang={routing.defaultLocale}>
      <body className="min-h-dvh bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

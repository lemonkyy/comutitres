import type { ReactNode } from "react";

import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome/app-chrome";
import { ApiClientProvider } from "@/contexts/api-client";
import { AuthProvider } from "@/contexts/auth-context";
import { routing } from "@/i18n/routing";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";

type ProvidersProps = {
  children: ReactNode;
};

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <NextIntlClientProvider>
      <ApiClientProvider locale="fr">
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
      <head>
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-background">{children}</body>
    </html>
  );
};

export default RootLayout;

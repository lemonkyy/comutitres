import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import Script from "next/script";
import { getLocale } from "next-intl/server";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  applicationName: "Comutitres",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Comutitres",
  },
  icons: {
    icon: [
      {
        url: "/assets/logos/comutitres-v-couleur.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1972d2",
};

const RootLayout = async ({ children }: Props) => {
  const locale = await getLocale();

  return (
    <html lang={locale}>
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

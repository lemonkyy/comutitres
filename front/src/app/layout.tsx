import type { ReactNode } from "react";

import "./globals.css";
import { routing } from "@/i18n/routing";

type Props = {
  children: ReactNode;
};

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang={routing.defaultLocale}>
      <head>
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

"use client";

import type { ReactNode } from "react";

import Navbar from "@/components/layout/navbar/navbar";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const hideNavbar = isAssistantPath(pathname) || isAuthPath(pathname);

  return (
    <>
      {hideNavbar ? null : <Navbar />}
      <div
        className={cn(
          "flex flex-col",
          hideNavbar ? "h-dvh min-h-0 overflow-hidden" : "min-h-dvh",
          !hideNavbar &&
            "pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-[4.5rem] md:pb-0",
        )}
      >
        {children}
      </div>
    </>
  );
}

function isAssistantPath(pathname: string) {
  return pathname === "/assistant" || pathname.endsWith("/assistant");
}

function isAuthPath(pathname: string) {
  return pathname === "/login" || pathname.endsWith("/login");
}

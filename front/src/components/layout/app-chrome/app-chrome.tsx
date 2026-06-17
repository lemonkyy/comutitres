"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type AssistantPanelCopy,
  getAssistantPanelCopy,
} from "@/components/assistant/assistant-copy";
import { DesktopAssistant } from "@/components/assistant/desktop-assistant";
import Navbar from "@/components/layout/navbar/navbar";
import {
  type AssistantPanelContextValue,
  AssistantPanelProvider,
} from "@/contexts/assistant-panel-context";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const t = useTranslations("assistant");
  const assistantCopy = useMemo<AssistantPanelCopy>(
    () => getAssistantPanelCopy((key) => t(key)),
    [t],
  );
  const isAssistantRoute = isAssistantPath(pathname);
  const isAuthRoute = isAuthPath(pathname);
  const shouldUseFullscreenShell = isAssistantRoute || isAuthRoute;
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const openAssistant = useCallback((restoreElement?: HTMLElement | null) => {
    const activeElement = document.activeElement;

    restoreFocusRef.current =
      restoreElement ??
      (activeElement instanceof HTMLElement ? activeElement : null);
    setAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);

    requestAnimationFrame(() => {
      restoreFocusRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const toggleAssistant = useCallback(() => {
    if (isAssistantOpen) {
      closeAssistant();
      return;
    }

    openAssistant();
  }, [closeAssistant, isAssistantOpen, openAssistant]);

  const assistantPanelContext = useMemo<AssistantPanelContextValue>(
    () => ({
      closeAssistant,
      isAssistantOpen,
      openAssistant,
      toggleAssistant,
    }),
    [closeAssistant, isAssistantOpen, openAssistant, toggleAssistant],
  );

  useEffect(() => {
    if (!isAssistantOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAssistant();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAssistant, isAssistantOpen]);

  useEffect(() => {
    if (isAuthRoute) {
      setAssistantOpen(false);
    }
  }, [isAuthRoute]);

  return (
    <AssistantPanelProvider value={assistantPanelContext}>
      {isAuthRoute ? null : (
        <Navbar className={isAssistantRoute ? "hidden md:block" : undefined} />
      )}
      <div
        className={cn(
          "flex flex-col",
          shouldUseFullscreenShell
            ? "h-dvh min-h-0 overflow-hidden"
            : "min-h-dvh",
          !shouldUseFullscreenShell &&
            "pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-[4.5rem] md:pb-0",
          isAssistantRoute &&
            "md:h-auto md:min-h-dvh md:overflow-visible md:pt-[4.5rem] md:pb-0",
        )}
      >
        {children}
      </div>
      {isAuthRoute ? null : (
        <DesktopAssistant
          closeLabel={assistantCopy.closeLabel}
          copy={assistantCopy.screen}
          isOpen={isAssistantOpen}
          onClose={closeAssistant}
          onOpen={openAssistant}
          openLabel={assistantCopy.openLabel}
        />
      )}
    </AssistantPanelProvider>
  );
}

function isAssistantPath(pathname: string) {
  return pathname === "/assistant" || pathname.endsWith("/assistant");
}

function isAuthPath(pathname: string) {
  return pathname === "/login" || pathname.endsWith("/login");
}

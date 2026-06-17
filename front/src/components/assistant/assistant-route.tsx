"use client";

import { useEffect } from "react";

import {
  AssistantScreen,
  type AssistantScreenCopy,
} from "@/components/assistant/assistant-screen";
import { useAssistantPanel } from "@/contexts/assistant-panel-context";
import { useRouter } from "@/i18n/navigation";

type AssistantRouteProps = {
  copy: AssistantScreenCopy;
};

export function AssistantRoute({ copy }: AssistantRouteProps) {
  const { openAssistant } = useAssistantPanel();
  const router = useRouter();

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    if (!desktopQuery.matches) {
      return;
    }

    openAssistant();
    router.replace("/");
  }, [openAssistant, router]);

  return (
    <>
      <div className="md:hidden">
        <AssistantScreen copy={copy} />
      </div>
      <main className="hidden min-h-[calc(100dvh-4.5rem)] items-center justify-center bg-background px-6 md:flex">
        <p className="text-sm font-semibold text-muted-foreground">
          {copy.loadingLabel}
        </p>
      </main>
    </>
  );
}

"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/actions/button/button";
import {
  AssistantScreen,
  type AssistantScreenCopy,
} from "@/components/assistant/assistant-screen";
import { cn } from "@/lib/utils";

type DesktopAssistantProps = {
  closeLabel: string;
  copy: AssistantScreenCopy;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (restoreElement?: HTMLElement | null) => void;
  openLabel: string;
};

const drawerTransitionMs = 240;
type PanelMotionState = "closed" | "open";

export function DesktopAssistant({
  closeLabel,
  copy,
  isOpen,
  onClose,
  onOpen,
  openLabel,
}: DesktopAssistantProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [isPanelMounted, setPanelMounted] = useState(isOpen);
  const [panelMotionState, setPanelMotionState] =
    useState<PanelMotionState>("closed");

  useEffect(() => {
    if (isOpen) {
      setPanelMounted(true);

      const frame = requestAnimationFrame(() => {
        setPanelMotionState("open");
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    setPanelMotionState("closed");

    const timeout = window.setTimeout(() => {
      setPanelMounted(false);
    }, drawerTransitionMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  useEffect(() => {
    if (panelMotionState !== "open") {
      return;
    }

    panelRef.current?.focus({ preventScroll: true });
  }, [panelMotionState]);

  return (
    <>
      {isPanelMounted ? (
        <aside
          aria-label={copy.title}
          data-state={panelMotionState}
          className={cn(
            "assistant-desktop-panel fixed top-[7.75rem] right-4 bottom-4 z-40 hidden w-[min(28rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-[6px] border border-border bg-background shadow-[var(--idfm-card-shadow)] outline-none md:block",
            panelMotionState === "closed" && "pointer-events-none",
          )}
          ref={panelRef}
          tabIndex={-1}
        >
          <div
            className="assistant-desktop-panel-content h-full min-h-0"
            data-state={panelMotionState}
          >
            <AssistantScreen
              closeLabel={closeLabel}
              copy={copy}
              onClose={onClose}
              variant="panel"
            />
          </div>
        </aside>
      ) : null}
      <Button
        aria-hidden={isPanelMounted}
        aria-label={openLabel}
        data-state={isPanelMounted ? "open" : "closed"}
        className={cn(
          "assistant-desktop-trigger assistant-pressable-motion fixed right-6 bottom-6 z-40 hidden size-14 origin-bottom-right rounded-[6px] border border-primary bg-primary text-primary-foreground shadow-[var(--idfm-card-shadow)] [--button-icon-size:1.35rem] hover:bg-[var(--bleu-focus)] focus-visible:ring-primary/30 md:inline-flex",
          isPanelMounted && "pointer-events-none",
        )}
        onClick={(event) => {
          onOpen(event.currentTarget);
        }}
        size={null}
        tabIndex={isPanelMounted ? -1 : undefined}
        type="button"
      >
        <MessageSquare aria-hidden="true" />
      </Button>
    </>
  );
}

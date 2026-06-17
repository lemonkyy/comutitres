"use client";

import { createContext, useContext } from "react";

export type AssistantPanelContextValue = {
  closeAssistant: () => void;
  isAssistantOpen: boolean;
  openAssistant: (restoreElement?: HTMLElement | null) => void;
  toggleAssistant: () => void;
};

const noopContext: AssistantPanelContextValue = {
  closeAssistant: () => {},
  isAssistantOpen: false,
  openAssistant: () => {},
  toggleAssistant: () => {},
};

const AssistantPanelContext = createContext<AssistantPanelContextValue | null>(
  null,
);

export const AssistantPanelProvider = AssistantPanelContext.Provider;

export function useAssistantPanel() {
  return useContext(AssistantPanelContext) ?? noopContext;
}

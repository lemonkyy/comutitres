import type { AssistantScreenCopy } from "@/components/assistant/assistant-screen";

type AssistantTranslator = (key: string) => string;

export type AssistantPanelCopy = {
  closeLabel: string;
  openLabel: string;
  screen: AssistantScreenCopy;
};

export function getAssistantScreenCopy(
  t: AssistantTranslator,
): AssistantScreenCopy {
  return {
    assistantAvatarLabel: t("assistantAvatarLabel"),
    backLabel: t("backLabel"),
    choiceGroupLabel: t("choiceGroupLabel"),
    completedMessage: t("completedMessage"),
    errorDescription: t("errorDescription"),
    errorTitle: t("errorTitle"),
    loadingLabel: t("loadingLabel"),
    loadingMessage: t("loadingMessage"),
    questionLabel: t("questionLabel"),
    recommendationCtaLabel: t("recommendationCtaLabel"),
    recommendationDescription: t("recommendationDescription"),
    recommendationPricePrefix: t("recommendationPricePrefix"),
    recommendationTitle: t("recommendationTitle"),
    resetLabel: t("resetLabel"),
    retryLabel: t("retryLabel"),
    stepErrorMessage: t("stepErrorMessage"),
    title: t("title"),
    unavailableDescription: t("unavailableDescription"),
    unavailableTitle: t("unavailableTitle"),
  };
}

export function getAssistantPanelCopy(
  t: AssistantTranslator,
): AssistantPanelCopy {
  return {
    closeLabel: t("closeLabel"),
    openLabel: t("openLabel"),
    screen: getAssistantScreenCopy(t),
  };
}

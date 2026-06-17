import { getTranslations } from "next-intl/server";

import { getAssistantScreenCopy } from "@/components/assistant/assistant-copy";
import { AssistantRoute } from "@/components/assistant/assistant-route";

export default async function AssistantPage() {
  const t = await getTranslations("assistant");

  return <AssistantRoute copy={getAssistantScreenCopy((key) => t(key))} />;
}

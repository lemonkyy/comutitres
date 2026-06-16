"use client";

import { ChevronRight, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/actions/button/button";
import { useApiClient } from "@/contexts/api-client";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("");

  const { apiClient } = useApiClient();

  useEffect(() => {
    apiClient.pass.getCollection().then((response) => {
      console.log(response);
    });
  }, [apiClient]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t("welcome")}
          </h1>
        </div>
        <Button
          asChild
          size={null}
          className="min-h-20 w-full max-w-[43.25rem] gap-4 rounded-[1.75rem] px-6 text-xl font-bold leading-none [--button-icon-size:1.5rem] has-[>svg]:px-6 sm:min-h-[6.5rem] sm:gap-5 sm:px-10 sm:text-3xl sm:[--button-icon-size:1.875rem]"
        >
          <Link href="/assistant">
            <MessageSquare data-icon="inline-start" />
            {t("startAssistant")}
            <ChevronRight data-icon="inline-end" />
          </Link>
        </Button>
      </main>
    </div>
  );
}

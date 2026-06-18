import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppChrome } from "@/components/layout/app-chrome/app-chrome";
import { ApiClientProvider } from "@/contexts/api-client";
import { AuthProvider } from "@/contexts/auth-context";
import { DocumentProvider } from "@/contexts/document-context";
import { InvoiceProvider } from "@/contexts/invoice-context";
import { UserProvider } from "@/contexts/user-context";
import { routing } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("navigation");

  return (
    <NextIntlClientProvider locale={locale} messages={await getMessages()}>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[6px] focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-[3px] focus:ring-ring/35"
        href="#main-content"
      >
        {t("skipToContent")}
      </a>
      <ApiClientProvider locale={locale}>
        <AuthProvider>
          <UserProvider>
            <InvoiceProvider>
              <DocumentProvider>
                <AppChrome>{children}</AppChrome>
              </DocumentProvider>
            </InvoiceProvider>
          </UserProvider>
        </AuthProvider>
      </ApiClientProvider>
    </NextIntlClientProvider>
  );
}

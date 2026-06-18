import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { AppChrome } from "@/components/layout/app-chrome/app-chrome";
import { ApiClientProvider } from "@/contexts/api-client";
import { AuthProvider } from "@/contexts/auth-context";
import { routing } from "@/i18n/routing";
import { UserProvider } from "@/contexts/user-context";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={await getMessages()}>
      <ApiClientProvider locale={locale}>
        <AuthProvider>
          <UserProvider>
            <AppChrome>{children}</AppChrome>
          </UserProvider>
        </AuthProvider>
      </ApiClientProvider>
    </NextIntlClientProvider>
  );
}

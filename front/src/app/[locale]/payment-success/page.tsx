import { CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getPassAsset } from "@/components/passes/pass-assets";
import {
  type PaymentEligibilityNotice,
  type PaymentResultPurchase,
  PaymentResultScreen,
  type PaymentResultScreenCopy,
} from "@/components/payment/payment-result-screen";
import type { CollectionResponse } from "@/lib/api/ApiClient";
import { apiPaths } from "@/lib/api/paths";
import { AUTH_TOKEN_COOKIE, fetchBackendJson } from "@/lib/api/server";
import { passRequiresDocuments } from "@/utils/document-requirements";
import type { Purchase } from "@/utils/types";

type PaymentSuccessPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const eligibilityDeadline = new Date("2026-07-15T12:00:00+02:00");

export default async function PaymentSuccessPage({
  params,
}: PaymentSuccessPageProps) {
  const [{ locale }, cookieStore, t] = await Promise.all([
    params,
    cookies(),
    getTranslations("payment.success"),
  ]);
  const latestPurchase = await getLatestPurchase(
    locale,
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
  );
  const eligibilityNotice = latestPurchase
    ? createEligibilityNotice(latestPurchase, locale, t)
    : undefined;
  const copy: PaymentResultScreenCopy = {
    backLabel: t("backLabel"),
    breadcrumbAriaLabel: t("breadcrumbAriaLabel"),
    ctaLabel: t("ctaLabel"),
    description: t("description"),
    homeLabel: t("homeLabel"),
    invoiceCtaLabel: t("invoiceCtaLabel"),
    passesLabel: t("passesLabel"),
    purchaseAmountLabel: t("purchaseAmountLabel"),
    purchaseDateLabel: t("purchaseDateLabel"),
    purchasePassLabel: t("purchasePassLabel"),
    title: t("title"),
  };

  return (
    <PaymentResultScreen
      ctaHref="/account/passes"
      copy={copy}
      eligibilityNotice={eligibilityNotice}
      icon={CheckCircle2}
      purchase={latestPurchase}
      tone="success"
    />
  );
}

function createEligibilityNotice(
  purchase: PaymentResultPurchase,
  locale: string,
  t: (key: string, values?: Record<string, string>) => string,
): PaymentEligibilityNotice | undefined {
  if (!requiresEligibilityDocuments(purchase)) {
    return undefined;
  }

  return {
    ctaLabel: t("eligibilityNotice.ctaLabel"),
    description: t("eligibilityNotice.description", {
      date: formatEligibilityDeadline(locale),
    }),
    title: t("eligibilityNotice.title"),
  };
}

function requiresEligibilityDocuments(purchase: PaymentResultPurchase) {
  return passRequiresDocuments({
    description: purchase.passDescription,
    id: purchase.passId,
    name: purchase.passName,
  });
}

function formatEligibilityDeadline(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(eligibilityDeadline);
}

async function getLatestPurchase(
  locale: string,
  token?: string,
): Promise<PaymentResultPurchase | undefined> {
  if (!token) {
    return undefined;
  }

  const response = await fetchBackendJson<CollectionResponse<Purchase>>(
    apiPaths.invoice.collection,
    {
      headers: {
        Accept: "application/ld+json",
        "Accept-Language": locale,
        "Content-Language": locale,
      },
    },
    token,
  );

  if (!response.ok) {
    return undefined;
  }

  const [purchase] = [...getCollectionMembers(response.data)].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );

  if (!purchase) {
    return undefined;
  }

  return {
    amount: formatPurchaseAmount(purchase.total, locale),
    asset: getPassAsset(purchase.pass),
    date: formatPurchaseDate(purchase.createdAt, locale),
    invoiceHref: purchase.invoiceId
      ? `/api/backend${apiPaths.invoice.item.replace(
          ":id",
          encodeURIComponent(purchase.invoiceId),
        )}`
      : undefined,
    passDescription: purchase.pass.description,
    passId: purchase.pass.id,
    passName: purchase.pass.name,
  };
}

function getCollectionMembers<T>(collection: CollectionResponse<T>) {
  return collection.member ?? collection["hydra:member"] ?? [];
}

function formatPurchaseAmount(total: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    currency: "EUR",
    style: "currency",
  }).format(total);
}

function formatPurchaseDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

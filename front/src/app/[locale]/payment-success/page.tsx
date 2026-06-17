import { CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  type PaymentResultPurchase,
  PaymentResultScreen,
  type PaymentResultScreenCopy,
} from "@/components/payment/payment-result-screen";
import type { CollectionResponse } from "@/lib/api/ApiClient";
import { apiPaths } from "@/lib/api/paths";
import { AUTH_TOKEN_COOKIE, fetchBackendJson } from "@/lib/api/server";
import type { Pass, Purchase } from "@/utils/types";

const passAssetById: Record<string, string> = {
  prod_Ui102EIh2XMWhW: "/assets/fares/products/navigo-mois-oblique.svg",
  prod_UijSQtOMSTEyVg: "/assets/fares/products/navigo-annuel-oblique.svg",
  prod_UijUsBO0JFy1Lz:
    "/assets/fares/products/navigo-imagine-r-scolaire-oblique.svg",
  prod_UijUZDKnnNQEOU:
    "/assets/fares/products/navigo-imagine-r-etudiant-oblique.svg",
  prod_UijVbWCnE9RT8a:
    "/assets/fares/products/navigo-imagine-r-junior-oblique.svg",
};

type PaymentSuccessPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

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
      copy={copy}
      icon={CheckCircle2}
      purchase={latestPurchase}
      tone="success"
    />
  );
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
    asset: getPurchaseAsset(purchase.pass),
    date: formatPurchaseDate(purchase.createdAt, locale),
    invoiceHref: purchase.invoiceId
      ? `/api/backend${apiPaths.invoice.item.replace(
          ":id",
          encodeURIComponent(purchase.invoiceId),
        )}`
      : undefined,
    passDescription: purchase.pass.description,
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

function getPurchaseAsset(pass: Pass) {
  return passAssetById[pass.id] ?? "/assets/passes/passe-navigo-full.svg";
}

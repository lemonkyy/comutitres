import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  type AccountPassPayment,
  type AccountPassSummary,
  AccountPasses,
  type AccountPassesCopy,
} from "@/components/account/account-passes";
import {
  AccountShell,
  type AccountShellCopy,
} from "@/components/account/account-shell";
import { AuthPrompt, type AuthPromptCopy } from "@/components/auth/auth-prompt";
import { getPassAsset } from "@/components/passes/pass-assets";
import type { CollectionResponse } from "@/lib/api/ApiClient";
import { apiPaths } from "@/lib/api/paths";
import { AUTH_TOKEN_COOKIE, fetchBackendJson } from "@/lib/api/server";
import type { Pass, Purchase } from "@/utils/types";

type AccountPassesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type PurchasesResult =
  | {
      ok: true;
      purchases: Purchase[];
    }
  | {
      message: string;
      ok: false;
    };

type PassPurchaseGroup = {
  pass: Pass;
  purchases: Purchase[];
};

type AccountTranslator = (key: string) => string;

export default async function AccountPassesPage({
  params,
  searchParams,
}: AccountPassesPageProps) {
  const [{ locale }, resolvedSearchParams, cookieStore, shellT, titlesT] =
    await Promise.all([
      params,
      searchParams,
      cookies(),
      getTranslations("account.shell"),
      getTranslations("account.titles"),
    ]);
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const shellCopy = createAccountShellCopy(shellT);
  const authPromptCopy: AuthPromptCopy = {
    ctaLabel: titlesT("authPrompt.ctaLabel"),
    description: titlesT("authPrompt.description"),
    title: titlesT("authPrompt.title"),
  };
  const copy: AccountPassesCopy = {
    downloadInvoiceLabel: titlesT("downloadInvoiceLabel"),
    emptyCtaLabel: titlesT("emptyCtaLabel"),
    emptyDescription: titlesT("emptyDescription"),
    emptyTitle: titlesT("emptyTitle"),
    errorDescription: titlesT("errorDescription"),
    errorTitle: titlesT("errorTitle"),
    invoiceLabel: titlesT("invoiceLabel"),
    latestPaymentLabel: titlesT("latestPaymentLabel"),
    noInvoiceLabel: titlesT("noInvoiceLabel"),
    paidStatusLabel: titlesT("paidStatusLabel"),
    passListDescription: titlesT("passListDescription"),
    passListTitle: titlesT("passListTitle"),
    paymentAmountLabel: titlesT("paymentAmountLabel"),
    paymentDateLabel: titlesT("paymentDateLabel"),
    paymentStatusLabel: titlesT("paymentStatusLabel"),
    paymentsTitle: titlesT("paymentsTitle"),
    selectedMissingDescription: titlesT("selectedMissingDescription"),
    selectedMissingTitle: titlesT("selectedMissingTitle"),
    summaryTitle: titlesT("summaryTitle"),
    title: titlesT("title"),
    totalPaidLabel: titlesT("totalPaidLabel"),
  };

  if (!token) {
    return (
      <AccountShell activeTab="passes" copy={shellCopy}>
        <AuthPrompt copy={authPromptCopy} returnTo="/account/passes" />
      </AccountShell>
    );
  }

  const purchasesResult = await getAccountPurchases(locale, token);

  if (!purchasesResult.ok) {
    return (
      <AccountShell activeTab="passes" copy={shellCopy}>
        <AccountPasses
          copy={copy}
          errorMessage={purchasesResult.message || copy.errorDescription}
          passes={[]}
          payments={[]}
        />
      </AccountShell>
    );
  }

  const groups = getPassPurchaseGroups(purchasesResult.purchases);
  const summaries = groups.map((group) =>
    createPassSummary(group, locale, titlesT),
  );
  const requestedPassId = getSelectedPassId(resolvedSearchParams.pass);
  const requestedPassExists = requestedPassId
    ? summaries.some((pass) => pass.id === requestedPassId)
    : false;
  const selectedPassMissing = Boolean(requestedPassId && !requestedPassExists);
  const selectedPassId = selectedPassMissing
    ? undefined
    : requestedPassId || summaries[0]?.id;
  let detailErrorMessage: string | undefined;
  let selectedPayments: AccountPassPayment[] = [];

  if (selectedPassId) {
    const filteredResult = await getAccountPurchases(
      locale,
      token,
      selectedPassId,
    );

    if (filteredResult.ok) {
      selectedPayments = filteredResult.purchases
        .sort(comparePurchasesByNewest)
        .map((purchase) => createPassPayment(purchase, locale));
    } else {
      detailErrorMessage = filteredResult.message || copy.errorDescription;
    }
  }

  return (
    <AccountShell activeTab="passes" copy={shellCopy}>
      <AccountPasses
        copy={copy}
        detailErrorMessage={detailErrorMessage}
        passes={summaries}
        payments={selectedPayments}
        selectedPassId={selectedPassId}
        selectedPassMissing={selectedPassMissing}
      />
    </AccountShell>
  );
}

function createAccountShellCopy(t: AccountTranslator): AccountShellCopy {
  return {
    backLabel: t("backLabel"),
    breadcrumbAriaLabel: t("breadcrumbAriaLabel"),
    homeLabel: t("homeLabel"),
    subtitle: t("subtitle"),
    tabs: {
      account: t("tabs.account"),
      passes: t("tabs.passes"),
      settings: t("tabs.settings"),
    },
    title: t("title"),
  };
}

async function getAccountPurchases(
  locale: string,
  token: string,
  passId?: string,
): Promise<PurchasesResult> {
  const path = passId
    ? `${apiPaths.invoice.collection}?pass=${encodeURIComponent(passId)}`
    : apiPaths.invoice.collection;
  const response = await fetchBackendJson<
    CollectionResponse<Purchase> | Purchase[]
  >(
    path,
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
    return {
      message: response.message,
      ok: false,
    };
  }

  return {
    ok: true,
    purchases: getCollectionMembers(response.data).filter(hasPass),
  };
}

function getPassPurchaseGroups(purchases: Purchase[]) {
  const groups = new Map<string, PassPurchaseGroup>();

  for (const purchase of purchases) {
    const existingGroup = groups.get(purchase.pass.id);

    if (existingGroup) {
      existingGroup.purchases.push(purchase);
    } else {
      groups.set(purchase.pass.id, {
        pass: purchase.pass,
        purchases: [purchase],
      });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      purchases: group.purchases.sort(comparePurchasesByNewest),
    }))
    .sort((first, second) =>
      comparePurchasesByNewest(first.purchases[0], second.purchases[0]),
    );
}

function createPassSummary(
  group: PassPurchaseGroup,
  locale: string,
  t: AccountTranslator,
): AccountPassSummary {
  const latestPurchase = group.purchases[0];
  const totalPaid = group.purchases.reduce(
    (total, purchase) => total + purchase.total,
    0,
  );

  return {
    asset: getPassAsset(group.pass),
    description: group.pass.description,
    id: group.pass.id,
    latestPaymentDate: latestPurchase
      ? formatPurchaseDate(latestPurchase.createdAt, locale, t)
      : t("unknownDateLabel"),
    name: group.pass.name,
    paymentCount: formatCount(
      group.purchases.length,
      t("paymentCountSingular"),
      t("paymentCountPlural"),
    ),
    totalPaid: formatPurchaseAmount(totalPaid, locale),
  };
}

function createPassPayment(
  purchase: Purchase,
  locale: string,
): AccountPassPayment {
  return {
    amount: formatPurchaseAmount(purchase.total, locale),
    date: formatPurchaseDateWithoutFallback(purchase.createdAt, locale),
    id: purchase.id,
    invoiceHref: purchase.invoiceId
      ? `/api/backend${apiPaths.invoice.item.replace(
          ":id",
          encodeURIComponent(purchase.invoiceId),
        )}`
      : undefined,
  };
}

function getCollectionMembers<T>(collection: CollectionResponse<T> | T[]) {
  if (Array.isArray(collection)) {
    return collection;
  }

  return collection.member ?? collection["hydra:member"] ?? [];
}

function hasPass(purchase: Purchase): purchase is Purchase & { pass: Pass } {
  return Boolean(purchase.pass?.id);
}

function comparePurchasesByNewest(first?: Purchase, second?: Purchase) {
  return (
    getPurchaseTimestamp(second?.createdAt) -
    getPurchaseTimestamp(first?.createdAt)
  );
}

function getPurchaseTimestamp(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatPurchaseAmount(total: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    currency: "EUR",
    style: "currency",
  }).format(total);
}

function formatPurchaseDate(
  value: string,
  locale: string,
  t: AccountTranslator,
) {
  return (
    formatPurchaseDateWithoutFallback(value, locale) || t("unknownDateLabel")
  );
}

function formatPurchaseDateWithoutFallback(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getSelectedPassId(value: string | string[] | undefined) {
  const passId = Array.isArray(value) ? value[0] : value;

  return passId?.trim() || null;
}

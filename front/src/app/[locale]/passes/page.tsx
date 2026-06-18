import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  type PassFrequencyId,
  type PassProfileId,
  PassesScreen,
  type PassesScreenCopy,
  passFrequencyIds,
  passProfileIds,
} from "@/components/passes/passes-screen";
import type { CollectionResponse } from "@/lib/api/ApiClient";
import { apiPaths } from "@/lib/api/paths";
import { AUTH_TOKEN_COOKIE, fetchBackendJson } from "@/lib/api/server";
import type { Pass } from "@/utils/types";

type PassesTranslator = (key: string) => string;

type PassesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PassesPage({
  params,
  searchParams,
}: PassesPageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const cookieStore = await cookies();
  const [t, products] = await Promise.all([
    getTranslations("passes"),
    getPassProducts(locale, cookieStore.get(AUTH_TOKEN_COOKIE)?.value),
  ]);

  const copy: PassesScreenCopy = {
    allHeading: t("allHeading"),
    assistantCtaLabel: t("assistantCtaLabel"),
    backLabel: t("backLabel"),
    breadcrumbAriaLabel: t("breadcrumbAriaLabel"),
    frequencies: createRecord(passFrequencyIds, (id) =>
      getAudienceCopy(t, "frequencies", id),
    ),
    frequencyHeading: t("frequencyHeading"),
    heroCardDescription: t("heroCardDescription"),
    heroCardTitle: t("heroCardTitle"),
    heroZoneLabel: t("heroZoneLabel"),
    homeLabel: t("homeLabel"),
    missingPriceLabel: t("missingPriceLabel"),
    products,
    productsEmptyDescription: t("productsEmptyDescription"),
    productsEmptyTitle: t("productsEmptyTitle"),
    popularHeading: t("popularHeading"),
    purchaseErrorMessage: t("purchaseErrorMessage"),
    purchaseLabel: t("purchaseLabel"),
    purchaseLoadingLabel: t("purchaseLoadingLabel"),
    profileHeading: t("profileHeading"),
    profiles: createRecord(passProfileIds, (id) =>
      getAudienceCopy(t, "profiles", id),
    ),
    subtitle: t("subtitle"),
    title: t("title"),
  };

  return (
    <PassesScreen
      copy={copy}
      highlightedPassId={getHighlightedPassId(resolvedSearchParams.pass)}
    />
  );
}

async function getPassProducts(
  locale: string,
  token?: string,
): Promise<PassesScreenCopy["products"]> {
  const response = await fetchBackendJson<CollectionResponse<Pass> | Pass[]>(
    apiPaths.pass.collection,
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
    return [];
  }

  return getCollectionMembers(response.data).map((pass) => ({
    description: pass.description ?? "",
    id: pass.id,
    priceId: pass.prices?.[0]?.id,
    price: formatPassPrice(pass.prices?.[0]?.amount, locale),
    title: pass.name,
  }));
}

function getCollectionMembers<T>(collection: CollectionResponse<T> | T[]) {
  if (Array.isArray(collection)) {
    return collection;
  }

  return collection.member ?? collection["hydra:member"] ?? [];
}

function formatPassPrice(amount: number | undefined, locale: string) {
  if (typeof amount !== "number" || amount <= 0) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    currency: "EUR",
    style: "currency",
  }).format(amount / 100);
}

function getHighlightedPassId(value: string | string[] | undefined) {
  const passId = Array.isArray(value) ? value[0] : value;

  return passId?.trim() || null;
}

function getAudienceCopy<TId extends PassFrequencyId | PassProfileId>(
  t: PassesTranslator,
  namespace: "frequencies" | "profiles",
  id: TId,
): {
  description: string;
  title: string;
} {
  return {
    description: t(`${namespace}.${id}.description`),
    title: t(`${namespace}.${id}.title`),
  };
}

function createRecord<TId extends string, TValue>(
  ids: readonly TId[],
  createValue: (id: TId) => TValue,
) {
  return Object.fromEntries(ids.map((id) => [id, createValue(id)])) as Record<
    TId,
    TValue
  >;
}

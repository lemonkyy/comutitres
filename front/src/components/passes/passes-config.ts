export const passFrequencyIds = ["frequent", "occasional"] as const;

export const passProfileIds = [
  "active",
  "young",
  "senior",
  "visitor",
  "solidarity",
  "reducedMobility",
] as const;

export type PassFrequencyId = (typeof passFrequencyIds)[number];
export type PassProfileId = (typeof passProfileIds)[number];

export type PassProductCopy = {
  description: string;
  id: string;
  priceId?: string;
  price: string;
  title: string;
};

export type PassAudienceCopy = {
  description: string;
  title: string;
};

export type PassesScreenCopy = {
  allHeading: string;
  assistantCtaLabel: string;
  backLabel: string;
  breadcrumbAriaLabel: string;
  frequencyHeading: string;
  heroCardDescription: string;
  heroCardTitle: string;
  heroZoneLabel: string;
  homeLabel: string;
  missingPriceLabel: string;
  productsEmptyDescription: string;
  productsEmptyTitle: string;
  popularHeading: string;
  products: PassProductCopy[];
  purchaseErrorMessage: string;
  purchaseLabel: string;
  purchaseLoadingLabel: string;
  profiles: Record<PassProfileId, PassAudienceCopy>;
  profileHeading: string;
  frequencies: Record<PassFrequencyId, PassAudienceCopy>;
  subtitle: string;
  title: string;
};

export type ProductTone = "blue" | "violet" | "green" | "yellow" | "neutral";

export type ProductPresentation = {
  asset: string;
  tone: ProductTone;
};

export type AudienceConfig<TId extends string> = {
  asset: string;
  id: TId;
  tone: ProductTone;
};

export const productPresentationConfigs: ProductPresentation[] = [
  {
    asset: "/assets/fares/products/navigo-annuel-oblique.svg",
    tone: "blue",
  },
  {
    asset: "/assets/fares/products/ticket-metro-train-rer-oblique.svg",
    tone: "neutral",
  },
  {
    asset: "/assets/fares/products/ticket-bus-tram-oblique.svg",
    tone: "green",
  },
  {
    asset: "/assets/fares/products/navigo-liberte-plus-oblique.svg",
    tone: "blue",
  },
  {
    asset: "/assets/fares/products/navigo-mois-oblique.svg",
    tone: "blue",
  },
  {
    asset: "/assets/fares/products/navigo-semaine-oblique.svg",
    tone: "green",
  },
  {
    asset: "/assets/fares/products/navigo-jour-oblique.svg",
    tone: "yellow",
  },
  {
    asset: "/assets/fares/products/navigo-imagine-r-etudiant-oblique.svg",
    tone: "violet",
  },
  {
    asset: "/assets/fares/products/navigo-imagine-r-scolaire-oblique.svg",
    tone: "violet",
  },
  {
    asset: "/assets/fares/products/navigo-imagine-r-junior-oblique.svg",
    tone: "yellow",
  },
  {
    asset: "/assets/fares/products/ticket-sms-mini.svg",
    tone: "neutral",
  },
  {
    asset: "/assets/fares/products/ticket-paris-region-aeroports-oblique.svg",
    tone: "blue",
  },
];

export const frequencyConfigs: AudienceConfig<PassFrequencyId>[] = [
  {
    asset: "/assets/fares/audiences/frequents.svg",
    id: "frequent",
    tone: "blue",
  },
  {
    asset: "/assets/fares/audiences/occasionnels.svg",
    id: "occasional",
    tone: "green",
  },
];

export const profileConfigs: AudienceConfig<PassProfileId>[] = [
  {
    asset: "/assets/fares/audiences/actif.svg",
    id: "active",
    tone: "blue",
  },
  {
    asset: "/assets/fares/audiences/jeune.svg",
    id: "young",
    tone: "violet",
  },
  {
    asset: "/assets/fares/audiences/senior.svg",
    id: "senior",
    tone: "green",
  },
  {
    asset: "/assets/fares/audiences/visiteur.svg",
    id: "visitor",
    tone: "yellow",
  },
  {
    asset: "/assets/fares/audiences/solidarite.svg",
    id: "solidarity",
    tone: "neutral",
  },
  {
    asset: "/assets/fares/audiences/mobilite-reduite.svg",
    id: "reducedMobility",
    tone: "blue",
  },
];

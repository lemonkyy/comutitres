import type { CollectionResponse } from "@/lib/api/ApiClient";
import type { DocumentKind, Pass, Purchase } from "@/utils/types";

type PassDocumentSource = Pick<Pass, "id" | "name"> &
  Partial<Pick<Pass, "description">>;

const documentKindOrder = [
  "identity_photo",
  "proof_of_residence",
  "school_certificate",
  "grant_certificate",
] as const satisfies DocumentKind[];

const baseRequiredDocumentKinds = [
  "identity_photo",
  "proof_of_residence",
] as const satisfies DocumentKind[];

const schoolCertificatePassIds = new Set([
  "prod_UijUsBO0JFy1Lz",
  "prod_UijUZDKnnNQEOU",
  "prod_UijVbWCnE9RT8a",
]);

const schoolCertificateKeywords = [
  "apprenti",
  "collegien",
  "etudiant",
  "jeune",
  "junior",
  "lyceen",
  "scolaire",
];

const grantCertificateKeywords = [
  "aide sociale",
  "bours",
  "crous",
  "solidarite",
  "solidaire",
  "tarif social",
];

export function getRequiredDocumentKindsForPasses(
  passes: ReadonlyArray<PassDocumentSource>,
): DocumentKind[] {
  const requiredKinds = new Set<DocumentKind>(baseRequiredDocumentKinds);

  for (const pass of passes) {
    if (requiresSchoolCertificate(pass)) {
      requiredKinds.add("school_certificate");
    }

    if (requiresGrantCertificate(pass)) {
      requiredKinds.add("grant_certificate");
    }
  }

  return documentKindOrder.filter((kind) => requiredKinds.has(kind));
}

export function getPurchasedPasses(purchases: ReadonlyArray<Purchase>): Pass[] {
  const passes = new Map<string, Pass>();

  for (const purchase of purchases) {
    if (purchase.pass?.id) {
      passes.set(purchase.pass.id, purchase.pass);
    }
  }

  return [...passes.values()];
}

export function getCollectionMembers<T>(
  collection: CollectionResponse<T> | T[] | null | undefined,
) {
  if (!collection) {
    return [];
  }

  if (Array.isArray(collection)) {
    return collection;
  }

  return collection.member ?? collection["hydra:member"] ?? [];
}

export function passRequiresDocuments(pass: PassDocumentSource) {
  return getRequiredDocumentKindsForPasses([pass]).length > 0;
}

function requiresSchoolCertificate(pass: PassDocumentSource) {
  return (
    schoolCertificatePassIds.has(pass.id) ||
    hasAnyKeyword(pass, schoolCertificateKeywords)
  );
}

function requiresGrantCertificate(pass: PassDocumentSource) {
  return hasAnyKeyword(pass, grantCertificateKeywords);
}

function hasAnyKeyword(
  pass: PassDocumentSource,
  keywords: ReadonlyArray<string>,
) {
  const searchText = normalizeSearchText(
    `${pass.name} ${pass.description ?? ""}`,
  );

  return keywords.some((keyword) =>
    searchText.includes(normalizeSearchText(keyword)),
  );
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR");
}

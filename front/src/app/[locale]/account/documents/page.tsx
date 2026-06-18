import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import {
  type AccountDocumentRequirement,
  AccountDocuments,
  type AccountDocumentsCopy,
} from "@/components/account/account-documents";
import {
  AccountShell,
  type AccountShellCopy,
} from "@/components/account/account-shell";
import { AuthPrompt, type AuthPromptCopy } from "@/components/auth/auth-prompt";
import type { CollectionResponse } from "@/lib/api/ApiClient";
import { apiPaths } from "@/lib/api/paths";
import { AUTH_TOKEN_COOKIE, fetchBackendJson } from "@/lib/api/server";
import {
  getCollectionMembers,
  getPurchasedPasses,
  getRequiredDocumentKindsForPasses,
} from "@/utils/document-requirements";
import { normalizeMyDocuments } from "@/utils/documents";
import type { DocumentKind, MyDocuments, Purchase } from "@/utils/types";

type AccountDocumentsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type DocumentsResult =
  | {
      documents: MyDocuments;
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

type PurchasesResult =
  | {
      ok: true;
      purchases: Purchase[];
    }
  | {
      ok: false;
    };

type AccountTranslator = (key: string) => string;

const requirementKinds = {
  grantCertificate: "grant_certificate",
  identityPhoto: "identity_photo",
  proofOfResidence: "proof_of_residence",
  schoolCertificate: "school_certificate",
} as const satisfies Record<string, DocumentKind>;

const requirementIdsByKind = {
  grant_certificate: "grantCertificate",
  identity_photo: "identityPhoto",
  proof_of_residence: "proofOfResidence",
  school_certificate: "schoolCertificate",
} as const satisfies Record<
  (typeof requirementKinds)[keyof typeof requirementKinds],
  keyof typeof requirementKinds
>;

export default async function AccountDocumentsPage({
  params,
}: AccountDocumentsPageProps) {
  const [{ locale }, cookieStore, shellT, documentsT] = await Promise.all([
    params,
    cookies(),
    getTranslations("account.shell"),
    getTranslations("account.documents"),
  ]);
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const shellCopy = createAccountShellCopy(shellT);
  const authPromptCopy: AuthPromptCopy = {
    ctaLabel: documentsT("authPrompt.ctaLabel"),
    description: documentsT("authPrompt.description"),
    title: documentsT("authPrompt.title"),
  };

  if (!token) {
    return (
      <AccountShell activeTab="documents" copy={shellCopy}>
        <AuthPrompt copy={authPromptCopy} returnTo="/account/documents" />
      </AccountShell>
    );
  }

  const [documentsResult, purchasesResult] = await Promise.all([
    getAccountDocuments(locale, token),
    getAccountPurchases(locale, token),
  ]);
  const copy = createAccountDocumentsCopy(documentsT);
  const requiredDocumentKinds = getRequiredDocumentKindsForPasses(
    purchasesResult.ok ? getPurchasedPasses(purchasesResult.purchases) : [],
  );
  const requirements = createRequirements(documentsT, requiredDocumentKinds);

  return (
    <AccountShell activeTab="documents" copy={shellCopy}>
      <AccountDocuments
        copy={copy}
        initialDocuments={documentsResult.ok ? documentsResult.documents : {}}
        initialErrorMessage={
          documentsResult.ok ? undefined : documentsResult.message
        }
        locale={locale}
        requirements={requirements}
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
      documents: t("tabs.documents"),
      passes: t("tabs.passes"),
      settings: t("tabs.settings"),
    },
    title: t("title"),
  };
}

function createAccountDocumentsCopy(
  t: AccountTranslator,
): AccountDocumentsCopy {
  return {
    card: {
      acceptedFormatsLabel: t("card.acceptedFormatsLabel"),
      browseLabel: t("card.browseLabel"),
      downloadLabel: t("card.downloadLabel"),
      replaceLabel: t("card.replaceLabel"),
      statusLabels: {
        approved: t("card.statusLabels.approved"),
        missing: t("card.statusLabels.missing"),
        pending: t("card.statusLabels.pending"),
        rejected: t("card.statusLabels.rejected"),
      },
      submitLabel: t("card.submitLabel"),
      submittingLabel: t("card.submittingLabel"),
      unavailableFileLabel: t("card.unavailableFileLabel"),
      uploadLabel: t("card.uploadLabel"),
      viewDialogDescription: t("card.viewDialogDescription"),
      viewLabel: t("card.viewLabel"),
    },
    fileTooLargeError: t("fileTooLargeError"),
    infoNoticeDescription: t("infoNoticeDescription"),
    infoNoticeTitle: t("infoNoticeTitle"),
    invalidFileTypeError: t("invalidFileTypeError"),
    introDescription: t("introDescription"),
    introTitle: t("introTitle"),
    loadErrorDescription: t("loadErrorDescription"),
    loadErrorTitle: t("loadErrorTitle"),
    requiredDocumentsLabel: t("requiredDocumentsLabel"),
    statusSummaryLabels: {
      approved: t("statusSummaryLabels.approved"),
      pending: t("statusSummaryLabels.pending"),
      rejected: t("statusSummaryLabels.rejected"),
    },
    submittedFileMeta: t("submittedFileMeta"),
    submittedFileName: t("submittedFileName"),
    successDescription: t("successDescription"),
    successTitle: t("successTitle"),
    title: t("title"),
    uploadErrorMessage: t("uploadErrorMessage"),
  };
}

function createRequirements(
  t: AccountTranslator,
  requiredDocumentKinds: ReadonlyArray<DocumentKind>,
): AccountDocumentRequirement[] {
  return requiredDocumentKinds.map((kind) => {
    const id = requirementIdsByKind[kind];

    return {
      description: t(`requirements.${id}.description`),
      kind,
      title: t(`requirements.${id}.title`),
    };
  });
}

async function getAccountPurchases(
  locale: string,
  token: string,
): Promise<PurchasesResult> {
  const response = await fetchBackendJson<
    CollectionResponse<Purchase> | Purchase[]
  >(
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
    return {
      ok: false,
    };
  }

  return {
    ok: true,
    purchases: getCollectionMembers(response.data).filter(hasPass),
  };
}

function hasPass(purchase: Purchase) {
  return Boolean(purchase.pass?.id);
}

async function getAccountDocuments(
  locale: string,
  token: string,
): Promise<DocumentsResult> {
  const response = await fetchBackendJson<unknown>(
    apiPaths.document.mine,
    {
      headers: {
        Accept: "application/json",
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
    documents: normalizeMyDocuments(response.data),
    ok: true,
  };
}

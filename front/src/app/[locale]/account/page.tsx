import { getTranslations } from "next-intl/server";

import {
  AccountOverview,
  type AccountOverviewCopy,
} from "@/components/account/account-overview";
import {
  AccountShell,
  type AccountShellCopy,
} from "@/components/account/account-shell";

export default async function AccountPage() {
  const [accountT, shellT] = await Promise.all([
    getTranslations("account.overview"),
    getTranslations("account.shell"),
  ]);
  const shellCopy: AccountShellCopy = {
    backLabel: shellT("backLabel"),
    breadcrumbAriaLabel: shellT("breadcrumbAriaLabel"),
    homeLabel: shellT("homeLabel"),
    subtitle: shellT("subtitle"),
    tabs: {
      account: shellT("tabs.account"),
      documents: shellT("tabs.documents"),
      passes: shellT("tabs.passes"),
      settings: shellT("tabs.settings"),
    },
    title: shellT("title"),
  };
  const overviewCopy: AccountOverviewCopy = {
    authPrompt: {
      ctaLabel: accountT("authPrompt.ctaLabel"),
      description: accountT("authPrompt.description"),
      title: accountT("authPrompt.title"),
    },
    detailsTitle: accountT("detailsTitle"),
    fields: {
      address: accountT("fields.address"),
      email: accountT("fields.email"),
      name: accountT("fields.name"),
    },
    loading: accountT("loading"),
    logoutLabel: accountT("logoutLabel"),
    missingAddress: accountT("missingAddress"),
    missingName: accountT("missingName"),
    sessionLabel: accountT("sessionLabel"),
    summary: accountT("summary"),
    title: accountT("title"),
  };

  return (
    <AccountShell activeTab="account" copy={shellCopy}>
      <AccountOverview copy={overviewCopy} />
    </AccountShell>
  );
}

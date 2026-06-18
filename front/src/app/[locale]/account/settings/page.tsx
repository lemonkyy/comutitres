import { getLocale, getTranslations } from "next-intl/server";

import {
  AccountShell,
  type AccountShellCopy,
} from "@/components/account/account-shell";
import { getSupportedLanguage } from "@/components/settings/settings-model";
import {
  SettingsPanel,
  type SettingsScreenCopy,
} from "@/components/settings/settings-screen";

export default async function AccountSettingsPage() {
  const [locale, settingsT, shellT] = await Promise.all([
    getLocale(),
    getTranslations("settings"),
    getTranslations("account.shell"),
  ]);
  const shellCopy: AccountShellCopy = {
    backLabel: shellT("backLabel"),
    breadcrumbAriaLabel: shellT("breadcrumbAriaLabel"),
    homeLabel: shellT("homeLabel"),
    subtitle: shellT("subtitle"),
    tabs: {
      account: shellT("tabs.account"),
      passes: shellT("tabs.passes"),
      settings: shellT("tabs.settings"),
    },
    title: shellT("title"),
  };
  const settingsCopy: SettingsScreenCopy = {
    accommodations: {
      legend: settingsT("accommodations.legend"),
      options: {
        dyslexia: {
          description: settingsT("accommodations.options.dyslexia.description"),
          title: settingsT("accommodations.options.dyslexia.title"),
        },
        hardOfHearing: {
          description: settingsT(
            "accommodations.options.hardOfHearing.description",
          ),
          title: settingsT("accommodations.options.hardOfHearing.title"),
        },
        lowVision: {
          description: settingsT(
            "accommodations.options.lowVision.description",
          ),
          title: settingsT("accommodations.options.lowVision.title"),
        },
        reducedMobility: {
          description: settingsT(
            "accommodations.options.reducedMobility.description",
          ),
          title: settingsT("accommodations.options.reducedMobility.title"),
        },
      },
    },
    backLabel: settingsT("backLabel"),
    language: {
      legend: settingsT("language.legend"),
      options: {
        ar: {
          description: settingsT("language.options.ar.description"),
          title: settingsT("language.options.ar.title"),
        },
        en: {
          title: settingsT("language.options.en.title"),
        },
        es: {
          description: settingsT("language.options.es.description"),
          title: settingsT("language.options.es.title"),
        },
        fr: {
          title: settingsT("language.options.fr.title"),
        },
        pt: {
          description: settingsT("language.options.pt.description"),
          title: settingsT("language.options.pt.title"),
        },
      },
      unavailable: settingsT("language.unavailable"),
    },
    subtitle: settingsT("subtitle"),
    title: settingsT("title"),
  };

  return (
    <AccountShell activeTab="settings" copy={shellCopy}>
      <SettingsPanel
        copy={settingsCopy}
        currentLocale={getSupportedLanguage(locale)}
      />
    </AccountShell>
  );
}

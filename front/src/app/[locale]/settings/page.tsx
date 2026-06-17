import { getLocale, getTranslations } from "next-intl/server";
import { getSupportedLanguage } from "@/components/settings/settings-model";
import {
  SettingsScreen,
  type SettingsScreenCopy,
} from "@/components/settings/settings-screen";

export default async function SettingsPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("settings"),
  ]);
  const copy: SettingsScreenCopy = {
    accommodations: {
      legend: t("accommodations.legend"),
      options: {
        dyslexia: {
          description: t("accommodations.options.dyslexia.description"),
          title: t("accommodations.options.dyslexia.title"),
        },
        hardOfHearing: {
          description: t("accommodations.options.hardOfHearing.description"),
          title: t("accommodations.options.hardOfHearing.title"),
        },
        lowVision: {
          description: t("accommodations.options.lowVision.description"),
          title: t("accommodations.options.lowVision.title"),
        },
        reducedMobility: {
          description: t("accommodations.options.reducedMobility.description"),
          title: t("accommodations.options.reducedMobility.title"),
        },
      },
    },
    backLabel: t("backLabel"),
    language: {
      legend: t("language.legend"),
      options: {
        ar: {
          description: t("language.options.ar.description"),
          title: t("language.options.ar.title"),
        },
        en: {
          title: t("language.options.en.title"),
        },
        es: {
          description: t("language.options.es.description"),
          title: t("language.options.es.title"),
        },
        fr: {
          title: t("language.options.fr.title"),
        },
        pt: {
          description: t("language.options.pt.description"),
          title: t("language.options.pt.title"),
        },
      },
      unavailable: t("language.unavailable"),
    },
    subtitle: t("subtitle"),
    title: t("title"),
  };

  return (
    <SettingsScreen copy={copy} currentLocale={getSupportedLanguage(locale)} />
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  Eye,
  Keyboard,
  type LucideIcon,
  Type,
  Volume2,
} from "lucide-react";
import { useController, useForm } from "react-hook-form";

import { CheckboxCardGroup } from "@/components/forms/checkbox-card-group/checkbox-card-group";
import {
  type CardOption,
  RadioCardGroup,
} from "@/components/forms/radio-card-group/radio-card-group";
import {
  PageHeader,
  PageHeaderIconButton,
} from "@/components/layout/page-header/page-header";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  type Accommodation,
  type SettingsFormValues,
  type SupportedLanguage,
  defaultAccommodations,
  settingsSchema,
  supportedLanguageSchema,
} from "./settings-model";

type LanguageOptionId = SupportedLanguage | "ar" | "es" | "pt";

export type SettingsScreenCopy = {
  accommodations: {
    legend: string;
    options: Record<Accommodation, { description: string; title: string }>;
  };
  backLabel: string;
  language: {
    legend: string;
    unavailable: string;
    options: Record<LanguageOptionId, { description?: string; title: string }>;
  };
  subtitle: string;
  title: string;
};

type SettingsScreenProps = {
  copy: SettingsScreenCopy;
  currentLocale: SupportedLanguage;
};

type LanguageOptionConfig = Pick<CardOption, "dir" | "disabled" | "leading"> & {
  value: LanguageOptionId;
};

type AccommodationOptionConfig = Pick<CardOption, "leading" | "tone"> & {
  value: Accommodation;
};

const languageOptionConfig: LanguageOptionConfig[] = [
  {
    leading: <span className="block w-9 text-center text-2xl">🇫🇷</span>,
    value: "fr",
  },
  {
    leading: <span className="block w-9 text-center text-2xl">🇬🇧</span>,
    value: "en",
  },
  {
    dir: "rtl",
    disabled: true,
    leading: <span className="block w-9 text-center text-2xl">🇲🇦</span>,
    value: "ar",
  },
  {
    disabled: true,
    leading: <span className="block w-9 text-center text-2xl">🇪🇸</span>,
    value: "es",
  },
  {
    disabled: true,
    leading: <span className="block w-9 text-center text-2xl">🇧🇷</span>,
    value: "pt",
  },
] satisfies LanguageOptionConfig[];

const accommodationOptionConfig: AccommodationOptionConfig[] = [
  {
    leading: getAccommodationLeading(Eye, "primary"),
    tone: "primary",
    value: "lowVision",
  },
  {
    leading: getAccommodationLeading(Volume2, "profile"),
    tone: "profile",
    value: "hardOfHearing",
  },
  {
    leading: getAccommodationLeading(Type, "success"),
    tone: "success",
    value: "dyslexia",
  },
  {
    leading: getAccommodationLeading(Keyboard, "warning"),
    tone: "warning",
    value: "reducedMobility",
  },
] satisfies AccommodationOptionConfig[];

export function SettingsScreen({ copy, currentLocale }: SettingsScreenProps) {
  return (
    <main className="min-h-dvh bg-white">
      <PageHeader
        backButton={
          <PageHeaderIconButton
            className="size-9 [--button-icon-size:1.125rem]"
            href="/"
            icon={ChevronLeft}
            label={copy.backLabel}
          />
        }
        className="border-[var(--gris-moyen)]"
        contentClassName="max-w-md gap-0"
        subtitle={copy.subtitle}
        subtitleClassName="mt-1 text-xs font-normal"
        title={copy.title}
      />

      <div className="px-4 py-5 pb-8">
        <SettingsPanel copy={copy} currentLocale={currentLocale} />
      </div>
    </main>
  );
}

export function SettingsPanel({ copy, currentLocale }: SettingsScreenProps) {
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      accommodations: defaultAccommodations,
      language: currentLocale,
    },
    mode: "onChange",
    resolver: zodResolver(settingsSchema),
  });
  const languageField = useController({
    control: form.control,
    name: "language",
  });
  const accommodationsField = useController({
    control: form.control,
    name: "accommodations",
  });
  const languageOptions = getLanguageOptions(copy);
  const accommodationOptions = getAccommodationOptions(copy);

  return (
    <form
      className="grid w-full gap-6 xl:grid-cols-2 xl:items-start xl:gap-8"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FieldSet className="min-w-0 gap-0">
        <FieldLegend
          className="mb-3 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.16em] text-muted-foreground"
          variant="label"
        >
          {copy.language.legend}
        </FieldLegend>
        <FieldGroup className="gap-3">
          <RadioCardGroup
            invalid={languageField.fieldState.invalid}
            name={languageField.field.name}
            onBlur={languageField.field.onBlur}
            onValueChange={(nextLanguage) => {
              const parsedLanguage =
                supportedLanguageSchema.safeParse(nextLanguage);

              if (!parsedLanguage.success) {
                return;
              }

              languageField.field.onChange(parsedLanguage.data);

              if (parsedLanguage.data !== currentLocale) {
                router.replace(pathname, { locale: parsedLanguage.data });
              }
            }}
            options={languageOptions}
            value={languageField.field.value}
          />
          <FieldError errors={[languageField.fieldState.error]} />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="min-w-0 gap-0">
        <FieldLegend
          className="mb-3 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.16em] text-muted-foreground"
          variant="label"
        >
          {copy.accommodations.legend}
        </FieldLegend>
        <FieldGroup className="gap-3">
          <CheckboxCardGroup
            invalid={accommodationsField.fieldState.invalid}
            name={accommodationsField.field.name}
            onBlur={accommodationsField.field.onBlur}
            onValueChange={accommodationsField.field.onChange}
            options={accommodationOptions}
            value={accommodationsField.field.value}
          />
          <FieldError errors={[accommodationsField.fieldState.error]} />
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

function getLanguageOptions(copy: SettingsScreenCopy): CardOption[] {
  return languageOptionConfig.map((option) => ({
    ...option,
    description:
      copy.language.options[option.value].description ??
      (option.disabled ? copy.language.unavailable : undefined),
    title: copy.language.options[option.value].title,
    tone: "primary",
  }));
}

function getAccommodationOptions(copy: SettingsScreenCopy): CardOption[] {
  return accommodationOptionConfig.map((option) => ({
    ...option,
    description: copy.accommodations.options[option.value].description,
    title: copy.accommodations.options[option.value].title,
  }));
}

function getAccommodationLeading(Icon: LucideIcon, tone: CardOption["tone"]) {
  return ({ selected }: { selected: boolean }) => (
    <span
      className={cn(
        "grid size-10 place-items-center rounded-[6px]",
        selected
          ? getIconSelectedClasses(tone)
          : "bg-muted text-muted-foreground",
      )}
    >
      <Icon className="size-5 stroke-[1.75]" />
    </span>
  );
}

function getIconSelectedClasses(tone: CardOption["tone"]) {
  if (tone === "profile") {
    return "bg-[color-mix(in_srgb,var(--profil-etudiant)_16%,white)] text-[var(--profil-etudiant)]";
  }

  if (tone === "success") {
    return "bg-[color-mix(in_srgb,var(--profil-senior)_14%,white)] text-[var(--profil-senior)]";
  }

  if (tone === "warning") {
    return "bg-[var(--accompagnement-moteur-bg)] text-[var(--accompagnement-moteur)]";
  }

  return "bg-white text-primary";
}

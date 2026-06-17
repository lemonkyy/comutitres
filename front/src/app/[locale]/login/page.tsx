import { getTranslations } from "next-intl/server";

import {
  LoginScreen,
  type LoginScreenCopy,
} from "@/components/auth/login-screen";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const allowedReturnTargets = {
  "/": "/",
  "/account": "/account",
  "/account/settings": "/account/settings",
  "/passes": "/passes",
  "/mon-compte": "/account",
  "/mon-compte/parametres": "/account/settings",
  "/titres-et-tarifs": "/passes",
} as const;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [params, t] = await Promise.all([
    searchParams,
    getTranslations("auth.login"),
  ]);
  const copy: LoginScreenCopy = {
    backLabel: t("backLabel"),
    form: {
      email: {
        invalid: t("form.email.invalid"),
        label: t("form.email.label"),
        placeholder: t("form.email.placeholder"),
        required: t("form.email.required"),
      },
      password: {
        label: t("form.password.label"),
        placeholder: t("form.password.placeholder"),
        required: t("form.password.required"),
      },
      franceConnect: {
        description: t("form.franceConnect.description"),
        label: t("form.franceConnect.label"),
        unavailableLabel: t("form.franceConnect.unavailableLabel"),
      },
      separatorLabel: t("form.separatorLabel"),
      submitLabel: t("form.submitLabel"),
      submittingLabel: t("form.submittingLabel"),
    },
    subtitle: t("subtitle"),
    title: t("title"),
    visual: {
      assistantLabel: t("visual.assistantLabel"),
      folderLabel: t("visual.folderLabel"),
      passLabel: t("visual.passLabel"),
      subtitle: t("visual.subtitle"),
      title: t("visual.title"),
    },
  };

  return <LoginScreen copy={copy} returnTo={getSafeReturnTo(params.retour)} />;
}

function getSafeReturnTo(value: string | string[] | undefined) {
  const returnTo = Array.isArray(value) ? value[0] : value;

  if (!returnTo) {
    return "/account";
  }

  if (returnTo in allowedReturnTargets) {
    return allowedReturnTargets[returnTo as keyof typeof allowedReturnTargets];
  }

  return "/account";
}

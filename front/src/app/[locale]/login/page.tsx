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
  "/mon-compte": "/account",
  "/mon-compte/parametres": "/account/settings",
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
      submitLabel: t("form.submitLabel"),
      submittingLabel: t("form.submittingLabel"),
    },
    subtitle: t("subtitle"),
    title: t("title"),
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

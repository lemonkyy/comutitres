import { ChevronLeft } from "lucide-react";

import {
  PageHeader,
  PageHeaderIconButton,
} from "@/components/layout/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { LoginForm, type LoginFormCopy } from "./login-form";

export type LoginScreenCopy = {
  backLabel: string;
  form: LoginFormCopy;
  subtitle: string;
  title: string;
};

type LoginScreenProps = {
  copy: LoginScreenCopy;
  returnTo: "/" | "/account" | "/account/settings";
};

export function LoginScreen({ copy, returnTo }: LoginScreenProps) {
  return (
    <main className="min-h-dvh bg-white">
      <PageHeader
        backButton={
          <PageHeaderIconButton
            href="/"
            icon={ChevronLeft}
            label={copy.backLabel}
          />
        }
        contentClassName="max-w-md"
        subtitle={copy.subtitle}
        title={copy.title}
      />

      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-6">
        <Card padding="lg" variant="outlined">
          <LoginForm copy={copy.form} returnTo={returnTo} />
        </Card>
      </div>
    </main>
  );
}

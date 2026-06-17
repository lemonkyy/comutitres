import { ChevronLeft } from "lucide-react";

import { Logo } from "@/components/assets/logo/logo";
import { PageHeaderIconButton } from "@/components/layout/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { LoginForm, type LoginFormCopy } from "./login-form";
import {
  LoginVisualPanel,
  type LoginVisualPanelCopy,
} from "./login-visual-panel";

export type LoginScreenCopy = {
  backLabel: string;
  form: LoginFormCopy;
  visual: LoginVisualPanelCopy;
  subtitle: string;
  title: string;
};

type LoginScreenProps = {
  copy: LoginScreenCopy;
  returnTo: "/" | "/account" | "/account/settings";
};

export function LoginScreen({ copy, returnTo }: LoginScreenProps) {
  return (
    <main className="h-full overflow-y-auto bg-[var(--bleu-clair)]">
      <div className="mx-auto grid min-h-full w-full max-w-[1240px] gap-5 px-5 py-5 md:gap-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,25rem)] lg:items-stretch lg:gap-10 xl:gap-12">
        <section
          aria-labelledby="login-title"
          className="order-1 flex min-w-0 flex-col justify-start lg:order-2"
        >
          <div className="flex min-w-0 flex-col gap-5 lg:pt-8">
            <div className="flex items-center justify-between gap-4">
              <PageHeaderIconButton
                className="bg-white shadow-[var(--idfm-card-shadow)]"
                href="/"
                icon={ChevronLeft}
                label={copy.backLabel}
              />
              <Logo className="w-28 lg:hidden" priority variant="couleur" />
            </div>

            <div className="min-w-0">
              <h1
                className="text-balance text-[2.5rem] font-bold leading-[1.1] text-foreground md:text-5xl md:leading-[57.6px]"
                id="login-title"
              >
                {copy.title}
              </h1>
              <p className="mt-2 max-w-[27rem] text-pretty text-base font-semibold leading-6 text-muted-foreground md:text-lg md:leading-[27px]">
                {copy.subtitle}
              </p>
            </div>

            <Card
              className="border-transparent p-5 shadow-[var(--idfm-card-shadow-large)] sm:p-[30px]"
              padding="none"
              variant="elevated"
            >
              <LoginForm copy={copy.form} returnTo={returnTo} />
            </Card>
          </div>
        </section>

        <LoginVisualPanel
          className="hidden lg:order-1 lg:block"
          copy={copy.visual}
        />
      </div>
    </main>
  );
}

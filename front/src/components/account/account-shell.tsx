import {
  ChevronLeft,
  type LucideIcon,
  Settings,
  UserRound,
} from "lucide-react";
import type * as React from "react";

import {
  PageHeader,
  PageHeaderIconButton,
} from "@/components/layout/page-header/page-header";
import {
  type PageTabItem,
  PageTabs,
} from "@/components/navigation/page-tabs/page-tabs";
import { Link } from "@/i18n/navigation";
import type { pathnames } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = keyof typeof pathnames;

export type AccountShellCopy = {
  backLabel: string;
  subtitle: string;
  tabs: {
    account: string;
    settings: string;
  };
  title: string;
};

type AccountShellProps = {
  activeTab: "account" | "settings";
  children: React.ReactNode;
  copy: AccountShellCopy;
};

type AccountNavigationItem = PageTabItem & {
  href: AppHref;
  icon: LucideIcon;
};

export function AccountShell({ activeTab, children, copy }: AccountShellProps) {
  const tabs: AccountNavigationItem[] = [
    {
      current: activeTab === "account",
      href: "/account",
      icon: UserRound,
      id: "account",
      label: copy.tabs.account,
    },
    {
      current: activeTab === "settings",
      href: "/account/settings",
      icon: Settings,
      id: "settings",
      label: copy.tabs.settings,
    },
  ];

  return (
    <main className="min-h-dvh bg-background pb-20 md:pb-0">
      <div className="md:hidden">
        <PageHeader
          backButton={
            <PageHeaderIconButton
              href="/"
              icon={ChevronLeft}
              label={copy.backLabel}
            />
          }
          subtitle={copy.subtitle}
          title={copy.title}
        >
          <PageTabs items={tabs} />
        </PageHeader>
      </div>

      <header className="hidden border-b bg-card/80 md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 py-8">
          <div className="min-w-0">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground outline-none transition-[color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-primary active:scale-[0.98] focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/25"
              href="/"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              {copy.backLabel}
            </Link>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-normal text-foreground">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground">
              {copy.subtitle}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="hidden size-16 shrink-0 place-items-center rounded-[1.25rem] border border-primary/10 bg-accent text-primary shadow-[0_0.75rem_2rem_color-mix(in_srgb,var(--anthracite)_8%,transparent)] lg:grid"
          >
            <UserRound className="size-7 stroke-[1.75]" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-5 md:grid-cols-[15rem_minmax(0,1fr)] md:px-6 md:py-8">
        <AccountSideNavigation items={tabs} label={copy.title} />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}

function AccountSideNavigation({
  items,
  label,
}: {
  items: ReadonlyArray<AccountNavigationItem>;
  label: string;
}) {
  return (
    <aside className="hidden md:block">
      <nav
        aria-label={label}
        className="sticky top-6 rounded-[1.25rem] border border-border bg-card p-2 shadow-[0_0.5rem_1.5rem_color-mix(in_srgb,var(--anthracite)_6%,transparent)]"
      >
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <AccountSideNavigationEntry item={item} key={item.id} />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function AccountSideNavigationEntry({ item }: { item: AccountNavigationItem }) {
  const Icon = item.icon;

  return (
    <Link
      aria-current={item.current ? "page" : undefined}
      className={cn(
        "group flex min-h-12 items-center gap-3 rounded-[1rem] px-3 text-sm font-extrabold text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent hover:text-primary active:scale-[0.98] focus-visible:bg-accent focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/25",
        item.current
          ? "bg-accent text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
          : null,
      )}
      href={item.href}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[0.875rem] bg-background text-muted-foreground transition-colors duration-150 group-hover:text-primary",
          item.current ? "text-primary" : null,
        )}
      >
        <Icon className="size-4 stroke-[1.9]" />
      </span>
      <span className="min-w-0">{item.label}</span>
    </Link>
  );
}

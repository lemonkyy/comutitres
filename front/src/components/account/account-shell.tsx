import {
  ChevronLeft,
  type LucideIcon,
  Settings,
  UserRound,
} from "lucide-react";
import type * as React from "react";

import {
  DesktopPageHeader,
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
  breadcrumbAriaLabel: string;
  homeLabel: string;
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
    <main className="min-h-dvh bg-white pb-20 md:pb-0">
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

      <DesktopPageHeader
        breadcrumbAriaLabel={copy.breadcrumbAriaLabel}
        breadcrumbs={getAccountBreadcrumbs(activeTab, copy)}
        subtitle={copy.subtitle}
        title={copy.title}
      />

      <div className="mx-auto grid w-full max-w-[1080px] gap-6 px-5 py-5 md:w-[calc(100%-2.5rem)] md:grid-cols-[15rem_minmax(0,1fr)] md:px-0 md:py-10">
        <AccountSideNavigation items={tabs} label={copy.title} />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}

function getAccountBreadcrumbs(
  activeTab: AccountShellProps["activeTab"],
  copy: AccountShellCopy,
) {
  if (activeTab === "settings") {
    return [
      { href: "/" as const, id: "home", label: copy.homeLabel },
      { href: "/account" as const, id: "account", label: copy.title },
      { id: "settings", label: copy.tabs.settings },
    ];
  }

  return [
    { href: "/" as const, id: "home", label: copy.homeLabel },
    { id: "account", label: copy.title },
  ];
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
        className="sticky top-6 rounded-[6px] border border-border bg-card p-2 shadow-[var(--idfm-card-shadow)]"
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
        "group flex min-h-12 items-center gap-3 rounded-[6px] px-3 text-sm font-semibold text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent hover:text-primary active:scale-[0.98] focus-visible:bg-accent focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/25",
        item.current ? "bg-accent text-primary" : null,
      )}
      href={item.href}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[6px] bg-white text-muted-foreground transition-colors duration-150 group-hover:text-primary",
          item.current ? "text-primary" : null,
        )}
      >
        <Icon className="size-4 stroke-[1.9]" />
      </span>
      <span className="min-w-0">{item.label}</span>
    </Link>
  );
}

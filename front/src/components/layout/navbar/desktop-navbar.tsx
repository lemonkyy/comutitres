"use client";

import { UserRound } from "lucide-react";

import { Logo } from "@/components/assets/logo/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { NavbarItem as NavbarItemConfig } from "./navbar-items";

type DesktopNavbarProps = {
  ariaLabel: string;
  className?: string;
  items: NavbarItemConfig[];
};

export function DesktopNavbar({
  ariaLabel,
  className,
  items,
}: DesktopNavbarProps) {
  const pathname = usePathname();
  const mainItems = items.filter(
    (item) => item.visibility !== "mobile" && item.id !== "account",
  );
  const accountItem = items.find((item) => item.id === "account");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 hidden py-4 bg-[var(--anthracite)] text-white md:block",
        className,
      )}
      data-slot="desktop-navbar"
    >
      <div className="mx-auto flex h-full w-full max-w-[1080px] items-center justify-between gap-8 px-5 md:w-[calc(100%-2.5rem)] md:px-0">
        <Link
          href="/"
          className="inline-flex h-11 shrink-0 items-center rounded-[6px] pr-2 outline-none transition-[background-color,box-shadow,transform] duration-150 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-white/70"
        >
          <Logo className="h-9 w-auto max-w-none" priority variant="blanc" />
        </Link>

        <nav
          aria-label={ariaLabel}
          className="flex min-w-0 items-center justify-end gap-1"
        >
          {mainItems.map((item) => (
            <DesktopNavLink item={item} key={item.id} pathname={pathname} />
          ))}
          {accountItem ? (
            <AccountLink item={accountItem} pathname={pathname} />
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function DesktopNavLink({
  item,
  pathname,
}: {
  item: NavbarItemConfig;
  pathname: string;
}) {
  const isActive = isCurrentPath(pathname, item.href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-11 items-center rounded-[6px] px-2 text-base font-semibold leading-6 text-white outline-none transition-[background-color,color,transform] duration-150 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-white/70",
        isActive && "bg-white/15",
      )}
      href={item.href}
    >
      {item.label}
    </Link>
  );
}

function AccountLink({
  item,
  pathname,
}: {
  item: NavbarItemConfig;
  pathname: string;
}) {
  const isActive = isCurrentPath(pathname, item.href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "ml-1 inline-flex h-11 items-center gap-2 rounded-[6px] bg-white px-3.5 text-base font-semibold leading-6 text-primary outline-none transition-[background-color,color,transform] duration-150 hover:bg-[var(--bleu-moyen)] hover:text-[var(--bleu-focus)] active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-white/70",
        isActive && "bg-[var(--bleu-moyen)] text-[var(--bleu-focus)]",
      )}
      href={item.href}
    >
      <UserRound aria-hidden="true" className="size-5 stroke-[1.75]" />
      <span>{item.label}</span>
    </Link>
  );
}

function isCurrentPath(pathname: string, href: NavbarItemConfig["href"]) {
  const current = normalizePathname(pathname);
  const target = normalizePathname(String(href));

  if (current === target) {
    return true;
  }

  const sectionPrefix = sectionPrefixesByTarget[target];

  return sectionPrefix ? current.startsWith(sectionPrefix) : false;
}

const sectionPrefixesByTarget: Record<string, string> = {
  "/account": "/account/",
  "/administration/documents": "/administration/documents/",
  "/administration/utilisateurs": "/administration/utilisateurs/",
};

function normalizePathname(pathname: string) {
  const withoutQuery = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  const startsWithSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const segments = startsWithSlash.split("/");
  const maybeLocale = segments[1];
  const localeStripped = routing.locales.includes(maybeLocale as "fr" | "en")
    ? `/${segments.slice(2).join("/")}`
    : startsWithSlash;
  const withoutTrailing =
    localeStripped !== "/" ? localeStripped.replace(/\/+$/, "") : localeStripped;

  return withoutTrailing || "/";
}

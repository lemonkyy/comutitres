import type * as React from "react";

import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = StaticPathname;

export type PageTabItem = {
  ariaLabel?: string;
  current?: boolean;
  disabled?: boolean;
  href?: AppHref;
  id: string;
  label: React.ReactNode;
};

export type PageTabsProps = Omit<React.ComponentProps<"nav">, "children"> & {
  items: ReadonlyArray<PageTabItem>;
  label?: string;
};

export function PageTabs({
  className,
  items,
  label = "Navigation de page",
  ...props
}: PageTabsProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "relative -mx-5 -mb-5 overflow-x-auto border-[var(--gris-moyen)] border-b px-5 [scrollbar-width:none] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:hidden after:w-10 after:bg-gradient-to-l after:from-white after:to-transparent sm:after:block md:-mx-5 md:px-5 [&::-webkit-scrollbar]:hidden",
        className,
      )}
      data-slot="page-tabs"
      {...props}
    >
      <div className="flex min-w-max items-end">
        {items.map((item) => (
          <PageTabsEntry item={item} key={item.id} />
        ))}
      </div>
    </nav>
  );
}

function PageTabsEntry({ item }: { item: PageTabItem }) {
  const entryClassName = cn(
    "relative flex min-h-12 min-w-max flex-none items-center justify-center whitespace-nowrap px-6 text-center text-base font-semibold leading-6 text-muted-foreground outline-none transition-[color,background-color] duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-transparent hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] hover:text-primary focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50",
    item.current ? "text-primary after:bg-primary" : null,
    item.disabled ? "pointer-events-none opacity-50" : null,
  );

  return item.href ? (
    <Link
      aria-current={item.current ? "page" : undefined}
      aria-disabled={item.disabled ? true : undefined}
      aria-label={item.ariaLabel}
      className={entryClassName}
      href={item.href}
      tabIndex={item.disabled ? -1 : undefined}
    >
      {item.label}
    </Link>
  ) : (
    <button
      aria-current={item.current ? "page" : undefined}
      aria-label={item.ariaLabel}
      className={entryClassName}
      disabled={item.disabled}
      type="button"
    >
      {item.label}
    </button>
  );
}

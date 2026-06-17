import type * as React from "react";

import { Link } from "@/i18n/navigation";
import type { pathnames } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = keyof typeof pathnames;

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
        "-mx-4 -mb-5 overflow-x-auto border-b px-4 md:-mx-6 md:px-6",
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
    "relative flex min-h-12 min-w-[5.75rem] flex-1 items-center justify-center px-4 text-center text-base font-extrabold leading-none text-muted-foreground outline-none transition-[color,background-color] duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent hover:text-primary focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50",
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

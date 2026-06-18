import { ChevronRight } from "lucide-react";
import type * as React from "react";

import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = StaticPathname;

export type BreadcrumbItem = {
  href?: AppHref;
  id: string;
  label: React.ReactNode;
};

export type BreadcrumbsProps = Omit<React.ComponentProps<"nav">, "children"> & {
  items: ReadonlyArray<BreadcrumbItem>;
  label?: string;
};

export function Breadcrumbs({
  className,
  items,
  label = "Fil d'Ariane",
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label={label}
      className={cn("text-sm font-semibold leading-5", className)}
      data-slot="breadcrumbs"
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="contents" key={item.id}>
              {item.href && !isLast ? (
                <Link
                  className="text-primary underline-offset-4 hover:text-[var(--bleu-focus)] hover:underline"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 stroke-[2.2]"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

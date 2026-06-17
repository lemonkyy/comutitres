"use client";

import Icon from "@/components/assets/icon";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavbarItem as NavbarItemConfig } from "./navbar-items";

export type NavbarItemLayout = "desktop" | "mobile" | "responsive";

type NavbarItemProps = {
  item: NavbarItemConfig;
  className?: string;
  layout?: NavbarItemLayout;
};

const easeOut = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const rootBase =
  "group flex min-w-0 items-center justify-center rounded-full font-medium text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 active:scale-[0.94] focus-visible:bg-accent focus-visible:text-primary";
const mobileRoot = "basis-0 flex-col gap-1.5 py-0.5 text-center";
const desktopRoot =
  "basis-auto flex-row gap-2 px-3 py-2 text-left hover:bg-accent hover:text-primary";
const responsiveRoot =
  "basis-0 flex-col gap-1.5 py-0.5 text-center md:basis-auto md:flex-row md:gap-2 md:px-3 md:py-2 md:text-left md:hover:bg-accent md:hover:text-primary";
const mobileIcon =
  "flex h-7 w-10 items-center justify-center rounded-full transition-[background-color,transform] duration-150";
const desktopIcon =
  "flex size-8 items-center justify-center rounded-full transition-[background-color,transform] duration-150";
const responsiveIcon =
  "flex h-7 w-10 items-center justify-center rounded-full transition-[background-color,transform] duration-150 md:size-8";

function isCurrentPath(pathname: string, href: NavbarItemConfig["href"]) {
  const target = String(href);

  return (
    pathname === target || (target !== "/" && pathname.startsWith(`${target}/`))
  );
}

function getRootLayoutClass(layout: NavbarItemLayout) {
  if (layout === "mobile") {
    return mobileRoot;
  }

  if (layout === "desktop") {
    return desktopRoot;
  }

  return responsiveRoot;
}

function getIconLayoutClass(layout: NavbarItemLayout) {
  if (layout === "mobile") {
    return mobileIcon;
  }

  if (layout === "desktop") {
    return desktopIcon;
  }

  return responsiveIcon;
}

export function NavbarItem({
  item,
  className,
  layout = "responsive",
}: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = isCurrentPath(pathname, item.href);
  const isMobileLayout = layout === "mobile";
  const isDesktopLayout = layout === "desktop";

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={item.href}
      className={cn(
        rootBase,
        getRootLayoutClass(layout),
        easeOut,
        isActive &&
          cn(
            "font-bold text-primary",
            isDesktopLayout && "bg-accent",
            !isMobileLayout && !isDesktopLayout && "md:bg-accent",
          ),
        className,
      )}
    >
      <span
        className={cn(
          getIconLayoutClass(layout),
          easeOut,
          isActive &&
            !isDesktopLayout &&
            cn("bg-accent", !isMobileLayout && "md:bg-transparent"),
          !isDesktopLayout &&
            cn(
              "group-focus-visible:bg-accent",
              !isMobileLayout && "md:group-focus-visible:bg-transparent",
            ),
        )}
        aria-hidden="true"
      >
        <Icon
          name={item.icon}
          className="text-current [&_svg]:size-5 [&_svg]:stroke-[1.75]"
        />
      </span>
      <span
        className={cn(
          "truncate text-xs leading-4 tracking-normal",
          isDesktopLayout && "text-sm leading-none",
          !isMobileLayout && !isDesktopLayout && "md:text-sm md:leading-none",
          isMobileLayout && "md:text-xs md:leading-4",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

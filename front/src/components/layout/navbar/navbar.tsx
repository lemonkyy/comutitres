"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useUser } from "@/contexts/user-context";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import {
  administrationMenuItems,
  administrationNavbarItems,
  navbarItems,
} from "./navbar-items";

type NavbarProps = {
  className?: string;
};

export default function Navbar({ className = "" }: NavbarProps) {
  const { myUser } = useUser();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const isAdmin = myUser?.roles?.includes("ROLE_ADMIN") ?? false;
  const isAdministrationPage = pathname.startsWith("/administration");

  const items = useMemo(() => {
    const sourceItems =
      isAdministrationPage && isAdmin
        ? administrationNavbarItems
        : [...navbarItems, ...(isAdmin ? administrationMenuItems : [])];

    return sourceItems.map((item) => ({
      ...item,
      label: t.has(`items.${item.id}`) ? t(`items.${item.id}`) : item.label,
    }));
  }, [isAdmin, isAdministrationPage, t]);

  return (
    <div className={cn(className)} data-slot="navbar">
      <DesktopNavbar ariaLabel={t("ariaLabel")} items={items} />
      <MobileNavbar ariaLabel={t("ariaLabel")} items={items} />
    </div>
  );
}

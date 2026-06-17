import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";
import { navbarItems } from "./navbar-items";

type NavbarProps = {
  className?: string;
};

export default function Navbar({ className = "" }: NavbarProps) {
  const t = useTranslations("navigation");
  const items = useMemo(
    () =>
      navbarItems.map((item) => ({
        ...item,
        label: t(`items.${item.id}`),
      })),
    [t],
  );

  return (
    <div className={cn(className)} data-slot="navbar">
      <DesktopNavbar ariaLabel={t("ariaLabel")} items={items} />
      <MobileNavbar ariaLabel={t("ariaLabel")} items={items} />
    </div>
  );
}

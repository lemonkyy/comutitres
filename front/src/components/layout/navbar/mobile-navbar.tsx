import { NavbarItem } from "./navbar-item";
import type {
  NavbarItem as NavbarItemConfig,
  NavbarVisibility,
} from "./navbar-items";

type MobileNavbarProps = {
  ariaLabel: string;
  className?: string;
  items: NavbarItemConfig[];
};

function getVisibilityClass(visibility: NavbarVisibility = "all") {
  if (visibility === "desktop") {
    return "hidden";
  }

  return "flex";
}

export function MobileNavbar({
  ariaLabel,
  className = "",
  items,
}: MobileNavbarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`fixed inset-x-0 bottom-0 z-50 border-[var(--gris-moyen)] border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden ${className}`}
      data-slot="mobile-navbar"
    >
      <div className="mx-auto grid h-20 w-full grid-cols-5 items-stretch px-1 pt-2 pb-4">
        {items.map((item) => (
          <NavbarItem
            key={item.id}
            item={item}
            className={getVisibilityClass(item.visibility)}
            layout="mobile"
          />
        ))}
      </div>
    </nav>
  );
}

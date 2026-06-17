import { Logo } from "@/components/assets/logo/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NavbarItem } from "./navbar-item";
import { type NavbarVisibility, navbarItems } from "./navbar-items";

type NavbarProps = {
  className?: string;
};

function getVisibilityClass(visibility: NavbarVisibility = "all") {
  if (visibility === "mobile") {
    return "flex md:hidden";
  }

  if (visibility === "desktop") {
    return "hidden md:flex";
  }

  return "flex";
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-[color-mix(in_srgb,var(--anthracite)_10%,transparent)] bg-card/[0.97] pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:top-0 md:bottom-auto md:border-t-0 md:border-b md:pb-0",
        className,
      )}
    >
      <div className="mx-auto flex h-20 w-full items-stretch px-1 pt-2 pb-4 md:h-[4.5rem] md:max-w-6xl md:items-center md:justify-between md:px-6 md:py-0 lg:px-8">
        <Link
          href="/"
          className="hidden items-center rounded-[0.875rem] px-2 py-1.5 outline-none transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/25 md:flex"
        >
          <Logo
            className="h-10 w-auto max-w-none md:h-11"
            priority
            variant="couleur"
          />
        </Link>

        <div className="grid w-full grid-cols-5 items-stretch md:w-auto md:flex md:items-center md:justify-end md:gap-1.5">
          {navbarItems.map((item) => (
            <NavbarItem
              key={item.id}
              item={item}
              className={getVisibilityClass(item.visibility)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

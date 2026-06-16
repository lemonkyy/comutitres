import { Link } from "@/i18n/navigation";
import { type NavbarVisibility, navbarItems } from "./navbar-items";

type NavbarProps = {
  className?: string;
};

function getVisibilityClass(visibility: NavbarVisibility = "all") {
  if (visibility === "mobile") {
    return "md:hidden";
  }

  if (visibility === "desktop") {
    return "hidden md:inline-flex";
  }

  return "inline-flex";
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/90 backdrop-blur md:top-0 md:bottom-auto md:border-t-0 md:border-b dark:border-white/10 dark:bg-black/90 ${className}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-around gap-2 px-4 sm:px-6 lg:justify-start lg:gap-6 lg:px-8">
        {navbarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${getVisibilityClass(item.visibility)} items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

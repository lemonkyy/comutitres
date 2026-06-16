import { pathnames } from "@/i18n/pathnames";

export type NavbarVisibility = "all" | "mobile" | "desktop";

export type NavbarItem = {
	id: string;
	label: string;
	href: keyof typeof pathnames;
  visibility?: NavbarVisibility;
  icon?: React.ReactNode | null;
};

export const navbarItems: NavbarItem[] = [
	{
		id: "home",
		label: "Accueil",
		href: "/",
		visibility: "all",
    icon: null
	},
	{
		id: "lobby",
		label: "Assistant",
		href: "/assistant",
		visibility: "all",
    icon: null
	},
	{
		id: "roles",
		label: "Mon dossier",
		href: "/my-folder",
		visibility: "all",
    icon: null
  },
  {
    id: "params",
    label: "Paramètres",
    href: "/settings",
    visibility: "all",
    icon: null
  },
  {
    id: "ui",
    label: "UI",
    href: "/ui",
    visibility: "all",
    icon: null
  }
];

import type { IconName } from "@/components/assets/icon/config";
import type { pathnames } from "@/i18n/pathnames";

export type NavbarVisibility = "all" | "mobile" | "desktop";

export type NavbarItem = {
  id: string;
  label: string;
  href: keyof typeof pathnames;
  visibility?: NavbarVisibility;
  icon: IconName;
};

export const navbarItems: NavbarItem[] = [
  {
    id: "home",
    label: "Accueil",
    href: "/",
    visibility: "all",
    icon: "house",
  },
  {
    id: "assistant",
    label: "Assistant",
    href: "/assistant",
    visibility: "mobile",
    icon: "messagesquare",
  },
  {
    id: "passes",
    label: "Titres et tarifs",
    href: "/passes",
    visibility: "all",
    icon: "ticket",
  },
  {
    id: "account",
    label: "Mon compte",
    href: "/account",
    visibility: "all",
    icon: "userround",
  },
];

export const administrationMenuItems: NavbarItem[] = [
  {
    id: "administration",
    label: "Administration",
    href: "/administration",
    visibility: "all",
    icon: "shield",
  },
];

export const administrationNavbarItems: NavbarItem[] = [
  {
    id: "administration-home",
    label: "Administration",
    href: "/administration",
    visibility: "all",
    icon: "shield",
  },
  {
    id: "administration-users",
    label: "Utilisateurs",
    href: "/administration",
    visibility: "all",
    icon: "users",
  },
  {
    id: "administration-chatbot",
    label: "Chatbot",
    href: "/assistant",
    visibility: "all",
    icon: "messagesquare",
  },
];

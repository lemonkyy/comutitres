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
    id: "card",
    label: "Ma carte",
    href: "/my-card",
    visibility: "all",
    icon: "creditcard",
  },
  {
    id: "folder",
    label: "Dossier",
    href: "/my-folder",
    visibility: "all",
    icon: "folderopen",
  },
  {
    id: "account",
    label: "Mon compte",
    href: "/account",
    visibility: "all",
    icon: "userround",
  },
];

import {
  CreditCard,
  FolderOpen,
  HelpCircle,
  House,
  type LucideIcon,
  MessageSquare,
  Settings,
  UserRound,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type IconName = keyof typeof raw & string;
export type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
export type Icons = Record<IconName, IconType>;

const raw = {
  house: House,
  messagesquare: MessageSquare,
  folderopen: FolderOpen,
  creditcard: CreditCard,
  helpcircle: HelpCircle,
  settings: Settings,
  userround: UserRound,
};

export const icons: Icons = raw;
export const iconNames = Object.keys(raw) as IconName[];

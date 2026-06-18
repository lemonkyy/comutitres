import {
  CreditCard,
  FolderOpen,
  HelpCircle,
  House,
  type LucideIcon,
  MessageSquare,
  Settings,
  Ticket,
  Shield,
  Bell,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  GitBranch,
  ShieldAlert,
  Users,
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
  ticket: Ticket,
  userround: UserRound,
  shield: Shield,
  bell: Bell,
  checkcircle2: CheckCircle2,
  chevronright: ChevronRight,
  filecheck: FileCheck,
  gitbranch: GitBranch,
  shieldalert: ShieldAlert,
  users: Users
};

export const icons: Icons = raw;
export const iconNames = Object.keys(raw) as IconName[];

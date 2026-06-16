import { ComponentType, SVGProps } from 'react';
import { FolderOpen, CreditCard, HelpCircle, LucideIcon } from 'lucide-react';

export type IconName = keyof typeof raw & string;
export type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
export type Icons = Record<IconName, IconType>;

const raw = {
  folderopen: FolderOpen,
  creditcard: CreditCard,
  helpcircle: HelpCircle,
};

export const icons: Icons = raw;
export const iconNames = Object.keys(raw) as IconName[];

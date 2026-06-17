import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import { ProgressBar } from "@/components/feedback/progress-bar/progress-bar";
import { PageTabs } from "@/components/navigation/page-tabs/page-tabs";
import {
  DesktopPageHeader,
  PageHeader,
  PageHeaderIconButton,
} from "./page-header";

const navigationItems = [
  { current: true, href: "/my-card", id: "card", label: "Ma carte" },
  { href: "/my-card", id: "history", label: "Historique" },
  { href: "/my-card", id: "invoices", label: "Factures" },
  { href: "/my-card", id: "management", label: "Gestion" },
] as const;

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    backHref: "/settings",
    subtitle: "Personnalisez votre expérience",
    title: "Accessibilité & langue",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function StoryScreen({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}

export const Default: Story = {
  render: (args) => (
    <StoryScreen>
      <PageHeader {...args} />
    </StoryScreen>
  ),
};

export const WithAction: Story = {
  render: () => (
    <StoryScreen>
      <PageHeader
        action={
          <PageHeaderIconButton
            icon={Bell}
            label="Notifications"
            tone="accent"
          />
        }
        backHref="/my-folder"
        subtitle="Imagine R Étudiant · Réf. 2025-0612-SE"
        title="Suivi de dossier"
      />
    </StoryScreen>
  ),
};

export const WithNavigation: Story = {
  render: () => (
    <StoryScreen>
      <PageHeader
        backHref="/"
        subtitle="Imagine R Étudiant · Active"
        subtitleTone="profile"
        title="Ma carte Navigo"
      >
        <PageTabs items={navigationItems} />
      </PageHeader>
    </StoryScreen>
  ),
};

export const WithProgress: Story = {
  render: () => (
    <StoryScreen>
      <PageHeader
        action={<PageHeaderIconButton icon={RotateCcw} label="Recommencer" />}
        backHref="/"
        subtitle="Question 1/5"
        title="Assistant Comutitres"
      >
        <ProgressBar max={5} value={1} />
      </PageHeader>
    </StoryScreen>
  ),
};

export const DesktopWithBreadcrumbs: Story = {
  render: () => (
    <StoryScreen>
      <DesktopPageHeader
        breadcrumbAriaLabel="Fil d'Ariane"
        breadcrumbs={[
          { href: "/", id: "home", label: "Accueil" },
          { href: "/passes", id: "passes", label: "Titres et tarifs" },
          { id: "current", label: "Paiement confirmé" },
        ]}
        subtitle="Votre paiement a bien été pris en compte. Vous pouvez revenir aux titres disponibles."
        title="Paiement confirmé"
      />
    </StoryScreen>
  ),
};

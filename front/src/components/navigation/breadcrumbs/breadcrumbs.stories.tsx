import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      { href: "/", id: "home", label: "Accueil" },
      { href: "/passes", id: "passes", label: "Titres et tarifs" },
      { id: "current", label: "Paiement confirmé" },
    ],
    label: "Fil d'Ariane",
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl bg-card p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AccountTrail: Story = {
  args: {
    items: [
      { href: "/", id: "home", label: "Accueil" },
      { id: "account", label: "Mon compte" },
    ],
  },
};

export const LongTrail: Story = {
  args: {
    items: [
      { href: "/", id: "home", label: "Accueil" },
      { href: "/account", id: "account", label: "Mon compte" },
      {
        href: "/account/settings",
        id: "settings",
        label: "Paramètres",
      },
      {
        id: "current",
        label: "Préférences de notification et confidentialité",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-72 bg-card p-6">
        <Story />
      </div>
    ),
  ],
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageTabs } from "./page-tabs";

const items = [
  { current: true, href: "/my-card", id: "card", label: "Ma carte" },
  { href: "/my-card", id: "history", label: "Historique" },
  { href: "/my-card", id: "invoices", label: "Factures" },
  { href: "/my-card", id: "management", label: "Gestion" },
] as const;

const meta = {
  title: "Navigation/PageTabs",
  component: PageTabs,
  args: {
    items,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl bg-card px-4 pt-4 pb-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { href: "/my-card", id: "card", label: "Ma carte" },
      { current: true, href: "/my-card", id: "history", label: "Historique" },
      { disabled: true, id: "invoices", label: "Factures" },
      { href: "/my-card", id: "management", label: "Gestion" },
    ],
  },
};

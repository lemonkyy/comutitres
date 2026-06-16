import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";

import messages from "../../../../messages/fr.json";
import Navbar from "./navbar";

const meta = {
  title: "Layout/Navbar/Navbar",
  component: Navbar,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[28rem] overflow-hidden bg-background">
      <div className="mx-auto max-w-xl px-6 py-12 text-center text-foreground md:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Navigation principale
        </p>
        <h1 className="mt-3 text-3xl font-bold">Comutitres</h1>
      </div>
      <Navbar className="absolute" />
    </div>
  ),
};

export const AssistantActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/assistant",
      },
    },
  },
  render: () => (
    <div className="relative min-h-[28rem] overflow-hidden bg-background">
      <div className="mx-auto max-w-xl px-6 py-12 text-center text-foreground md:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Etat actif
        </p>
        <h1 className="mt-3 text-3xl font-bold">Assistant selectionne</h1>
      </div>
      <Navbar className="absolute" />
    </div>
  ),
};

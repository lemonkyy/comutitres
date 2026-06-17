import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import messages from "../../../../messages/fr.json";
import { NavbarItem } from "./navbar-item";
import { navbarItems } from "./navbar-items";

const meta = {
  title: "Layout/Navbar/Nav Items",
  component: NavbarItem,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  args: {
    item: navbarItems[0],
    layout: "mobile",
  },
} satisfies Meta<typeof NavbarItem>;

export default meta;

type Story = StoryObj<typeof meta>;

function MobileItemPreview({ children }: { children: ReactNode }) {
  return (
    <div className="w-[78px] border-[color-mix(in_srgb,var(--anthracite)_10%,transparent)] border-t bg-card/[0.97] px-1 pt-2 pb-4 backdrop-blur-md">
      <div className="grid h-14 items-stretch">{children}</div>
    </div>
  );
}

export const Active: Story = {
  render: (args) => (
    <MobileItemPreview>
      <NavbarItem {...args} />
    </MobileItemPreview>
  ),
};

export const Inactive: Story = {
  args: {
    item: navbarItems[1],
    layout: "mobile",
  },
  render: (args) => (
    <MobileItemPreview>
      <NavbarItem {...args} />
    </MobileItemPreview>
  ),
};

export const AllItems: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/my-card",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="max-w-[390px] border-[color-mix(in_srgb,var(--anthracite)_10%,transparent)] border-t bg-card/[0.97] px-1 pt-2 pb-4 backdrop-blur-md">
        <div className="grid h-14 grid-cols-5 items-stretch">
          {navbarItems.map((item) => (
            <NavbarItem key={item.id} item={item} layout="mobile" />
          ))}
        </div>
      </div>

      <div className="flex w-fit items-center gap-1.5 rounded-full bg-card/[0.97] p-2 shadow-sm">
        {navbarItems
          .filter((item) => item.visibility !== "mobile")
          .map((item) => (
            <NavbarItem key={item.id} item={item} layout="desktop" />
          ))}
      </div>
    </div>
  ),
};

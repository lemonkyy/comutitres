import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Icon from ".";
import { iconNames } from "./config";

const iconClassName = "inline-flex text-[var(--anthracite)] [&_svg]:size-7";

const meta = {
  title: "Assets/Icon",
  component: Icon,
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
  },
  args: {
    className: iconClassName,
    name: "creditcard",
    title: "creditcard",
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {iconNames.map((iconName) => (
        <div
          key={iconName}
          className="flex min-h-14 items-center gap-3 rounded-md border bg-white px-4 py-3 text-[var(--anthracite)] shadow-sm"
        >
          <Icon name={iconName} title={iconName} className={iconClassName} />
          <span className="text-sm font-semibold">{iconName}</span>
        </div>
      ))}
    </div>
  ),
};

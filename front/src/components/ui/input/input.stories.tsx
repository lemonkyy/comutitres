import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  argTypes: {
    disabled: {
      control: "boolean",
    },
    type: {
      control: "select",
      options: ["text", "email", "password"],
    },
  },
  args: {
    disabled: false,
    placeholder: "emma.durand@example.com",
    type: "email",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4 bg-background p-6">
      <Input placeholder="Adresse e-mail" type="email" />
      <Input aria-invalid placeholder="Champ invalide" type="text" />
      <Input disabled placeholder="Champ desactive" type="text" />
    </div>
  ),
};

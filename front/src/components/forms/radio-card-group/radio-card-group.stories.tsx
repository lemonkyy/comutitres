import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { type CardOption, RadioCardGroup } from "./radio-card-group";

const languageOptions: CardOption[] = [
  {
    leading: <span className="block w-9 text-center text-2xl">🇫🇷</span>,
    title: "Français",
    value: "fr",
  },
  {
    leading: <span className="block w-9 text-center text-2xl">🇬🇧</span>,
    title: "English",
    value: "en",
  },
  {
    description: "Arabe",
    dir: "rtl",
    disabled: true,
    leading: <span className="block w-9 text-center text-2xl">🇲🇦</span>,
    title: "العربية",
    value: "ar",
  },
  {
    description: "Espagnol",
    disabled: true,
    leading: <span className="block w-9 text-center text-2xl">🇪🇸</span>,
    title: "Español",
    value: "es",
  },
];

const invalidOptions: CardOption[] = languageOptions.map((option) => ({
  ...option,
  disabled: false,
}));

const meta = {
  title: "Forms/RadioCardGroup",
  component: RadioCardGroup,
  args: {
    className: "max-w-sm",
    options: languageOptions,
    value: "fr",
  },
  argTypes: {
    invalid: {
      control: "boolean",
    },
    value: {
      control: "select",
      options: ["fr", "en", "ar", "es"],
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RadioCardGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EnglishSelected: Story = {
  args: {
    value: "en",
  },
};

export const DisabledUnavailable: Story = {
  args: {
    value: "fr",
  },
};

export const RtlTitle: Story = {
  args: {
    options: invalidOptions,
    value: "ar",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    options: invalidOptions,
    value: "es",
  },
};

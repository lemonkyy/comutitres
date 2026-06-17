import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  ChoicePill,
  ChoicePillGroup,
  type ChoicePillOption,
} from "./choice-pill";

const situationOptions: ChoicePillOption[] = [
  { label: "Étudiant·e", value: "student" },
  { label: "Lycéen·ne / Collégien·ne", value: "high-school" },
  { label: "Salarié·e", value: "employee" },
  { label: "Demandeur d'emploi", value: "job-seeker" },
  { label: "Senior (60+)", value: "senior" },
  { label: "Autre", value: "other" },
];

const zoneOptions: ChoicePillOption[] = [
  { label: "Zone 1–2 (Paris centre)", value: "zones-1-2" },
  { label: "Zone 1–3", value: "zones-1-3" },
  { label: "Zone 1–5 (toute l'IDF)", value: "zones-1-5" },
  { label: "Pas sûr·e", value: "unknown" },
];

const meta = {
  title: "Assistant/ChoicePill",
  component: ChoicePillGroup,
  args: {
    ariaLabel: "Choisir une réponse",
    options: situationOptions,
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ChoicePillGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Group: Story = {};

export const SinglePill: Story = {
  render: () => <ChoicePill>Étudiant·e</ChoicePill>,
};

export const LongLabels: Story = {
  args: {
    options: zoneOptions,
  },
};

export const DisabledChoice: Story = {
  args: {
    options: situationOptions.map((option) =>
      option.value === "senior" ? { ...option, disabled: true } : option,
    ),
  },
};

export const NarrowWrap: Story = {
  args: {
    options: zoneOptions,
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export const DesktopWrap: Story = {
  args: {
    options: [...situationOptions, ...zoneOptions],
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl bg-background p-8">
        <Story />
      </div>
    ),
  ],
};

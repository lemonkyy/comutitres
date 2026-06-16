import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowRight,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  MessageSquare,
  Plus,
} from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "./button";

type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;
type ButtonSize = NonNullable<ComponentProps<typeof Button>["size"]>;

const variants: Array<{ label: string; value: ButtonVariant }> = [
  { label: "Default", value: "default" },
  { label: "Secondary", value: "secondary" },
  { label: "Outline", value: "outline" },
  { label: "Ghost", value: "ghost" },
  { label: "Destructive", value: "destructive" },
  { label: "Link", value: "link" },
];

const sizes: Array<{ label: string; value: ButtonSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
  { label: "Large", value: "lg" },
  { label: "Icon", value: "icon" },
];

const meta = {
  title: "Actions/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: variants.map(({ value }) => value),
    },
    size: {
      control: "select",
      options: sizes.map(({ value }) => value),
    },
  },
  args: {
    children: "Acheter un titre",
    size: "default",
    variant: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CreditCard data-icon="inline-start" />
        Acheter un titre
      </>
    ),
  },
};

export const AssistantLaunch: Story = {
  render: () => (
    <Button
      size={null}
      className="min-h-20 w-full max-w-[43.25rem] gap-4 rounded-[1.75rem] px-6 text-xl font-bold leading-none [--button-icon-size:1.5rem] has-[>svg]:px-6 sm:min-h-[6.5rem] sm:gap-5 sm:px-10 sm:text-3xl sm:[--button-icon-size:1.875rem]"
    >
      <MessageSquare data-icon="inline-start" />
      Démarrer l&apos;assistant
      <ChevronRight data-icon="inline-end" />
    </Button>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map(({ label, value }) => (
        <Button key={value} variant={value}>
          {label}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map(({ label, value }) =>
        value === "icon" ? (
          <Button key={value} size={value} aria-label={label}>
            <Plus data-icon="inline-start" />
          </Button>
        ) : (
          <Button key={value} size={value} variant="secondary">
            {label}
          </Button>
        ),
      )}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm uppercase text-muted-foreground">Disabled</h3>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Default</Button>
          <Button disabled variant="outline">
            Outline
          </Button>
          <Button disabled variant="ghost">
            Ghost
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm uppercase text-muted-foreground">Loading</h3>
        <Button disabled className="w-full sm:w-fit">
          <LoaderCircle className="animate-spin" data-icon="inline-start" />
          Traitement en cours
        </Button>
      </div>
    </div>
  ),
};

export const CommonActions: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <CreditCard data-icon="inline-start" />
        Acheter un titre
      </Button>
      <Button variant="outline">
        Modifier
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button variant="ghost">Annuler</Button>
      <Button size="icon" aria-label="Ajouter">
        <Plus data-icon="inline-start" />
      </Button>
    </div>
  ),
};

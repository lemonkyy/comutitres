import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eye, Keyboard, Type, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardOption } from "../radio-card-group/radio-card-group";
import { CheckboxCardGroup } from "./checkbox-card-group";

const accessibilityOptions: CardOption[] = [
  {
    description: "Contrastes renforcés, texte agrandi",
    leading: ({ selected }) => (
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          selected
            ? "bg-background text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Eye className="size-5 stroke-[1.75]" />
      </span>
    ),
    title: "Malvoyance",
    tone: "primary",
    value: "lowVision",
  },
  {
    description: "Sous-titres et alertes visuelles",
    leading: ({ selected }) => (
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          selected
            ? "bg-[color-mix(in_srgb,var(--profil-etudiant)_16%,white)] text-[var(--profil-etudiant)]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Volume2 className="size-5 stroke-[1.75]" />
      </span>
    ),
    title: "Malentendance",
    tone: "profile",
    value: "hardOfHearing",
  },
  {
    description: "Police adaptée, espacement élargi",
    leading: ({ selected }) => (
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          selected
            ? "bg-[color-mix(in_srgb,var(--profil-senior)_14%,white)] text-[var(--profil-senior)]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Type className="size-5 stroke-[1.75]" />
      </span>
    ),
    title: "Dyslexie",
    tone: "success",
    value: "dyslexia",
  },
  {
    description: "Boutons larges, navigation clavier",
    disabled: true,
    leading: ({ selected }) => (
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          selected
            ? "bg-[var(--accompagnement-moteur-bg)] text-[var(--accompagnement-moteur)]"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Keyboard className="size-5 stroke-[1.75]" />
      </span>
    ),
    title: "Motricité réduite",
    tone: "warning",
    value: "reducedMobility",
  },
];

const meta = {
  title: "Forms/CheckboxCardGroup",
  component: CheckboxCardGroup,
  args: {
    className: "max-w-sm",
    options: accessibilityOptions,
    value: ["lowVision", "hardOfHearing"],
  },
  argTypes: {
    invalid: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CheckboxCardGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiSelect: Story = {
  args: {
    value: ["lowVision", "hardOfHearing", "dyslexia"],
  },
};

export const DisabledUnavailable: Story = {
  args: {
    value: ["lowVision"],
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    value: ["reducedMobility"],
  },
};

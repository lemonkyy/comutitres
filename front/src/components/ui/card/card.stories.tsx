import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { Card } from "./card";

const meta = {
  title: "Surfaces/Card",
  component: Card,
  argTypes: {
    interactive: {
      control: "boolean",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    tone: {
      control: "select",
      options: ["default", "accent", "muted"],
    },
    variant: {
      control: "select",
      options: ["elevated", "outlined", "flat"],
    },
  },
  args: {
    children: "Carte Comutitres",
    interactive: false,
    padding: "md",
    tone: "default",
    variant: "elevated",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4 bg-background p-6 md:grid-cols-3">
      <Card variant="elevated">
        <h3 className="text-lg font-bold">Elevated</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Surface principale avec ombre douce.
        </p>
      </Card>
      <Card variant="outlined">
        <h3 className="text-lg font-bold">Outlined</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Surface calme pour les contenus secondaires.
        </p>
      </Card>
      <Card variant="flat" tone="accent">
        <h3 className="text-lg font-bold">Accent</h3>
        <p className="mt-2 text-sm">
          Surface teintee pour attirer l'attention.
        </p>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive className="max-w-sm" padding="lg">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold">Forfait recommande</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Un exemple de carte avec etat focus, survol et pression.
          </p>
        </div>
        <Button variant="outline" className="w-fit">
          Voir le detail
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </Card>
  ),
};

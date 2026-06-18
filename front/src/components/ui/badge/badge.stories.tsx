import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "En attente",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "neutral", "success", "warning", "destructive"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="neutral">Manquant</Badge>
      <Badge variant="warning">
        <Clock3 aria-hidden="true" className="size-4" />
        En attente
      </Badge>
      <Badge variant="success">
        <CheckCircle2 aria-hidden="true" className="size-4" />
        Accepté
      </Badge>
      <Badge variant="destructive">
        <XCircle aria-hidden="true" className="size-4" />
        Refusé
      </Badge>
    </div>
  ),
};

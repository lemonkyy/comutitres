import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Card } from "@/components/ui/card/card";
import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: () => (
    <div className="grid max-w-md gap-3">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};

export const CardPreview: Story = {
  render: () => (
    <Card
      className="max-w-xl border-primary/10"
      padding="none"
      variant="outlined"
    >
      <div className="grid gap-5 p-5 sm:grid-cols-[5rem_minmax(0,1fr)]">
        <Skeleton className="size-20" />
        <div className="min-w-0 self-center">
          <Skeleton className="h-6 w-56 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/5" />
        </div>
      </div>
    </Card>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  args: {
    max: 5,
    value: 1,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Values: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ProgressBar label="Question 1 sur 5" max={5} value={1} />
      <ProgressBar label="Question 3 sur 5" max={5} value={3} />
      <ProgressBar label="Question terminee" max={5} value={5} />
    </div>
  ),
};

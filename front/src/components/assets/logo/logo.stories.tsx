import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { cn } from "@/lib/utils";
import { Logo, type LogoVariant, logoVariantNames, logoVariants } from ".";

const logoPreviewClasses: Record<LogoVariant, string> = {
  blanc: "bg-foreground",
  couleur: "bg-background",
  noir: "bg-background",
};

const meta = {
  title: "Assets/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    alt: {
      control: "text",
    },
    className: {
      control: "text",
    },
    variant: {
      control: "select",
      options: logoVariantNames,
    },
  },
  args: {
    alt: "Comutitres",
    className: "w-72",
    variant: "couleur",
  },
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div className="grid w-[min(64rem,calc(100vw-2rem))] gap-4 md:grid-cols-3">
      {logoVariantNames.map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <div
            className={cn(
              "flex aspect-[1082/681] items-center justify-center rounded-md border p-6",
              logoPreviewClasses[variant],
            )}
          >
            <Logo variant={variant} className="w-full" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {logoVariants[variant].label}
          </span>
        </div>
      ))}
    </div>
  ),
};

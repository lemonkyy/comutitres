import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[1.5rem] bg-card text-card-foreground outline-none",
  {
    variants: {
      variant: {
        elevated:
          "border border-border shadow-[0_0.375rem_1.125rem_color-mix(in_srgb,var(--anthracite)_10%,transparent)]",
        outlined: "border border-border",
        flat: "border border-transparent shadow-none",
      },
      tone: {
        default: "bg-card text-card-foreground",
        accent: "bg-accent text-accent-foreground",
        muted: "bg-muted text-foreground",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        true: "transition-[background-color,border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-primary/25 hover:shadow-[0_0.625rem_1.5rem_color-mix(in_srgb,var(--anthracite)_14%,transparent)] active:scale-[0.99] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
        false: "",
      },
    },
    defaultVariants: {
      interactive: false,
      padding: "md",
      tone: "default",
      variant: "elevated",
    },
  },
);

type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  };

function Card({
  asChild = false,
  className,
  interactive,
  padding,
  tone,
  variant,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card"
      className={cn(
        cardVariants({ interactive, padding, tone, variant }),
        className,
      )}
      {...props}
    />
  );
}

export { Card, cardVariants };

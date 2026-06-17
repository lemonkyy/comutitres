import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[6px] bg-card text-card-foreground outline-none",
  {
    variants: {
      variant: {
        elevated: "border border-transparent shadow-[var(--idfm-card-shadow)]",
        buttonCard:
          "border border-transparent shadow-[var(--idfm-card-shadow-large)]",
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
        lg: "p-5",
        xl: "p-[30px]",
      },
      interactive: {
        true: "transition-[background-color,border-color,box-shadow,text-decoration] duration-200 hover:shadow-[var(--idfm-card-shadow-hover)] hover:no-underline focus-visible:shadow-[var(--idfm-card-shadow-hover)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
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

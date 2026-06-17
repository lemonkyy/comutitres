import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] border border-transparent text-base font-semibold leading-6 outline-none transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-150 [--button-icon-size:1rem] disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 focus-visible:ring-[3px] focus-visible:ring-ring/35 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[var(--button-icon-size)]",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:border-[var(--bleu-focus)] hover:bg-[var(--bleu-focus)] focus-visible:border-[var(--bleu-focus)] focus-visible:bg-[var(--bleu-focus)] active:border-[var(--bleu-focus)] active:bg-[var(--bleu-focus)] disabled:border-primary disabled:bg-primary disabled:text-primary-foreground",
        destructive:
          "border-destructive bg-destructive text-white hover:border-[var(--rouge-clair)] hover:bg-[var(--rouge-clair)] focus-visible:ring-destructive/25 disabled:opacity-70",
        outline:
          "border-primary bg-white text-primary hover:border-[var(--bleu-focus)] hover:bg-[var(--bleu-focus)] hover:text-white focus-visible:border-[var(--bleu-focus)]",
        secondary:
          "border-primary bg-white text-primary hover:border-[var(--bleu-focus)] hover:bg-[var(--bleu-focus)] hover:text-white focus-visible:border-[var(--bleu-focus)]",
        ghost:
          "border-transparent bg-transparent text-primary hover:bg-accent hover:text-[var(--bleu-focus)] focus-visible:bg-accent",
        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:text-[var(--bleu-focus)] hover:underline",
      },
      size: {
        default: "h-12 px-4 py-3 has-[>svg]:px-4",
        sm: "h-11 gap-1.5 px-5 py-[9px] has-[>svg]:px-4",
        lg: "h-12 px-6 py-3 has-[>svg]:px-5",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

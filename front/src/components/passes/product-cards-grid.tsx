"use client";

import { useEffect, useRef } from "react";

import {
  type PassProductCopy,
  productPresentationConfigs,
} from "@/components/passes/passes-config";
import { ProductCard } from "@/components/passes/product-card";
import { cn } from "@/lib/utils";

type ProductCardsGridProps = {
  highlightedPassId?: string | null;
  products: PassProductCopy[];
  unavailableLabel: string;
};

export function ProductCardsGrid({
  highlightedPassId,
  products,
  unavailableLabel,
}: ProductCardsGridProps) {
  const productRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    if (!highlightedPassId) {
      return;
    }

    const target = productRefs.current.get(highlightedPassId);

    if (!target) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const shouldReduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.dataset.motion === "reduced";
      const behavior: ScrollBehavior = shouldReduceMotion ? "auto" : "smooth";

      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior,
        block: "center",
        inline: "nearest",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [highlightedPassId]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        const isHighlighted = product.id === highlightedPassId;
        const presentation =
          productPresentationConfigs[index % productPresentationConfigs.length];

        return (
          <div
            aria-current={isHighlighted ? "true" : undefined}
            className="scroll-mt-24 rounded-[6px]"
            key={product.id}
            ref={(node) => {
              if (node) {
                productRefs.current.set(product.id, node);
                return;
              }

              productRefs.current.delete(product.id);
            }}
            tabIndex={isHighlighted ? -1 : undefined}
          >
            <ProductCard
              className={cn(
                "transition-[border-color,box-shadow] duration-300",
                isHighlighted &&
                  "border-primary shadow-[var(--idfm-card-shadow-hover)] ring-[3px] ring-primary/25",
              )}
              copy={product}
              presentation={presentation}
              unavailableLabel={unavailableLabel}
            />
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type PassProductCopy,
  productPresentationConfigs,
} from "@/components/passes/passes-config";
import { ProductCard } from "@/components/passes/product-card";
import { useApiClient } from "@/contexts/api-client";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";
import { cn } from "@/lib/utils";

type ProductCardsGridProps = {
  highlightedPassId?: string | null;
  missingPriceLabel: string;
  products: PassProductCopy[];
  purchaseErrorMessage: string;
  purchaseLabel: string;
  purchaseLoadingLabel: string;
};

export function ProductCardsGrid({
  highlightedPassId,
  missingPriceLabel,
  products,
  purchaseErrorMessage,
  purchaseLabel,
  purchaseLoadingLabel,
}: ProductCardsGridProps) {
  const { apiClient } = useApiClient();
  const { loading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const productRefs = useRef(new Map<string, HTMLDivElement>());
  const [purchaseErrors, setPurchaseErrors] = useState<Record<string, string>>(
    {},
  );
  const [purchasingPassId, setPurchasingPassId] = useState<string | null>(null);

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

  const clearPurchaseError = useCallback((productId: string) => {
    setPurchaseErrors((current) => {
      if (!(productId in current)) {
        return current;
      }

      const next = { ...current };
      delete next[productId];
      return next;
    });
  }, []);

  const handlePurchase = useCallback(
    async (product: PassProductCopy) => {
      clearPurchaseError(product.id);

      if (!product.priceId) {
        setPurchaseErrors((current) => ({
          ...current,
          [product.id]: missingPriceLabel,
        }));
        return;
      }

      if (!user) {
        router.push({
          pathname: "/login",
          query: { retour: "/passes" },
        });
        return;
      }

      setPurchasingPassId(product.id);

      try {
        const checkoutUrl = await apiClient.pass.buy(
          product.id,
          product.priceId,
        );

        if (checkoutUrl instanceof ApiClientError) {
          setPurchaseErrors((current) => ({
            ...current,
            [product.id]:
              checkoutUrl.code === 0
                ? purchaseErrorMessage
                : checkoutUrl.message || purchaseErrorMessage,
          }));
          setPurchasingPassId(null);
          return;
        }

        window.location.assign(checkoutUrl);
      } catch {
        setPurchaseErrors((current) => ({
          ...current,
          [product.id]: purchaseErrorMessage,
        }));
        setPurchasingPassId(null);
      }
    },
    [
      apiClient,
      clearPurchaseError,
      missingPriceLabel,
      purchaseErrorMessage,
      router,
      user,
    ],
  );

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
              errorMessage={purchaseErrors[product.id]}
              isPurchaseDisabled={isAuthLoading || Boolean(purchasingPassId)}
              isPurchasing={purchasingPassId === product.id}
              missingPriceLabel={missingPriceLabel}
              onPurchase={handlePurchase}
              presentation={presentation}
              purchaseLabel={purchaseLabel}
              purchaseLoadingLabel={purchaseLoadingLabel}
            />
          </div>
        );
      })}
    </div>
  );
}

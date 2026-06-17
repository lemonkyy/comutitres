import { XCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  PaymentResultScreen,
  type PaymentResultScreenCopy,
} from "@/components/payment/payment-result-screen";

export default async function PaymentCancelPage() {
  const t = await getTranslations("payment.cancel");
  const copy: PaymentResultScreenCopy = {
    backLabel: t("backLabel"),
    breadcrumbAriaLabel: t("breadcrumbAriaLabel"),
    ctaLabel: t("ctaLabel"),
    description: t("description"),
    homeLabel: t("homeLabel"),
    passesLabel: t("passesLabel"),
    title: t("title"),
  };

  return <PaymentResultScreen copy={copy} icon={XCircle} tone="error" />;
}

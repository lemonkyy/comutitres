import type { ProductTone } from "@/components/passes/passes-config";

export const toneClasses: Record<ProductTone, string> = {
  blue: "bg-[color-mix(in_srgb,var(--bleu-moyen)_76%,white)] text-primary",
  green:
    "bg-[color-mix(in_srgb,var(--profil-senior)_18%,white)] text-[var(--profil-senior)]",
  neutral: "bg-[var(--gris-clair-40)] text-muted-foreground",
  violet:
    "bg-[color-mix(in_srgb,var(--profil-etudiant)_20%,white)] text-[var(--profil-etudiant)]",
  yellow:
    "bg-[color-mix(in_srgb,var(--profil-junior)_30%,white)] text-[var(--anthracite)]",
};

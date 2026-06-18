import type { Pass } from "@/utils/types";

export const fallbackPassAsset = "/assets/passes/passe-navigo-full.svg";

const passAssetById: Record<string, string> = {
  prod_Ui102EIh2XMWhW: "/assets/fares/products/navigo-mois-oblique.svg",
  prod_UijSQtOMSTEyVg: "/assets/fares/products/navigo-annuel-oblique.svg",
  prod_UijUsBO0JFy1Lz:
    "/assets/fares/products/navigo-imagine-r-scolaire-oblique.svg",
  prod_UijUZDKnnNQEOU:
    "/assets/fares/products/navigo-imagine-r-etudiant-oblique.svg",
  prod_UijVbWCnE9RT8a:
    "/assets/fares/products/navigo-imagine-r-junior-oblique.svg",
};

export function getPassAsset(pass: Pick<Pass, "id">) {
  return passAssetById[pass.id] ?? fallbackPassAsset;
}

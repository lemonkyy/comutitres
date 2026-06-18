export const pathnames = {
  "/": "/",
  "/assistant": "/assistant",
  "/passes": {
    fr: "/titres-et-tarifs",
    en: "/passes",
  },
  "/payment-cancel": "/payment-cancel",
  "/payment-success": "/payment-success",
  "/login": {
    fr: "/connexion",
    en: "/connexion",
  },
  "/account": {
    fr: "/mon-compte",
    en: "/mon-compte",
  },
  "/account/passes": {
    fr: "/mon-compte/mes-titres",
    en: "/mon-compte/mes-titres",
  },
  "/account/documents": {
    fr: "/mon-compte/mes-documents",
    en: "/mon-compte/mes-documents",
  },
  "/account/settings": {
    fr: "/mon-compte/parametres",
    en: "/mon-compte/parametres",
  },
  "/my-card": {
    fr: "/ma-carte",
    en: "/my-card",
  },
  "/my-folder": {
    fr: "/mon-dossier",
    en: "/my-folder",
  },
  "/settings": {
    fr: "/parametres",
    en: "/parametres",
  },
  "/administration": "/administration",
  "/administration/utilisateurs": "/administration/utilisateurs",
  "/administration/documents": "/administration/documents",
  "/administration/documents/[documentId]":
  "/administration/documents/[documentId]",
  "/administration/questions": "/administration/questions",
  "/administration/questions/create": "/administration/questions/create",
  "/administration/questions/[questionId]": "/administration/questions/[questionId]",
};

export type AppPathname = keyof typeof pathnames;
export type DynamicPathname = Extract<AppPathname, `${string}[${string}`>;
export type StaticPathname = Exclude<AppPathname, DynamicPathname>;

import { z } from "zod";

export const supportedLanguageSchema = z.enum(["fr", "en"]);

export const accommodationSchema = z.enum([
  "lowVision",
  "hardOfHearing",
  "dyslexia",
  "reducedMobility",
]);

export const settingsSchema = z.object({
  accommodations: z.array(accommodationSchema),
  language: supportedLanguageSchema,
});

export type Accommodation = z.infer<typeof accommodationSchema>;
export type SettingsFormValues = z.infer<typeof settingsSchema>;
export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;

export const defaultAccommodations: Accommodation[] = [
  "lowVision",
  "hardOfHearing",
  "dyslexia",
];

export function getSupportedLanguage(locale: string): SupportedLanguage {
  return locale === "en" ? "en" : "fr";
}

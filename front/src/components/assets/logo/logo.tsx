import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

const logoDimensions = {
  height: 440,
  width: 842,
} as const;

export const logoVariants = {
  couleur: {
    label: "Couleur",
    src: "/assets/logos/comutitres-v-couleur.svg",
  },
  noir: {
    label: "Noir",
    src: "/assets/logos/comutitres-v-noir.svg",
  },
  blanc: {
    label: "Blanc",
    src: "/assets/logos/comutitres-v-blanc.svg",
  },
} as const;

export type LogoVariant = keyof typeof logoVariants;

export const logoVariantNames = Object.keys(logoVariants) as LogoVariant[];

export type LogoProps = Omit<ImageProps, "alt" | "height" | "src" | "width"> & {
  alt?: string;
  height?: ImageProps["height"];
  variant?: LogoVariant;
  width?: ImageProps["width"];
};

export function Logo({
  alt = "Comutitres",
  className,
  height = logoDimensions.height,
  unoptimized = true,
  variant = "couleur",
  width = logoDimensions.width,
  ...props
}: LogoProps) {
  const logo = logoVariants[variant];

  return (
    <Image
      alt={alt}
      className={cn("block h-auto max-w-full", className)}
      height={height}
      src={logo.src}
      unoptimized={unoptimized}
      width={width}
      {...props}
    />
  );
}

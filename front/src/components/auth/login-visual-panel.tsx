import { CreditCard, FolderOpen, MessageSquare } from "lucide-react";
import Image from "next/image";

import { Logo } from "@/components/assets/logo/logo";
import { cn } from "@/lib/utils";

export type LoginVisualPanelCopy = {
  assistantLabel: string;
  folderLabel: string;
  passLabel: string;
  subtitle: string;
  title: string;
};

type LoginVisualPanelProps = {
  className?: string;
  copy: LoginVisualPanelCopy;
};

export function LoginVisualPanel({ className, copy }: LoginVisualPanelProps) {
  return (
    <aside
      aria-label={copy.title}
      className={cn(
        "relative min-h-[24rem] overflow-hidden rounded-[6px] bg-[var(--anthracite)] text-white shadow-[var(--idfm-card-shadow-large)] lg:min-h-[39rem]",
        className,
      )}
    >
      <div className="relative z-10 flex h-full min-h-[24rem] flex-col p-5 md:p-8 lg:min-h-[39rem]">
        <div className="flex items-start">
          <Logo className="w-28" priority variant="blanc" />
        </div>

        <div className="mt-8 max-w-[34rem] md:mt-10">
          <h2 className="text-balance text-[2rem] font-bold leading-[1.15] md:text-[2.75rem]">
            {copy.title}
          </h2>
          <p className="mt-3 text-pretty text-base leading-6 text-white/86 md:text-lg md:leading-[27px]">
            {copy.subtitle}
          </p>

          <div className="mt-5 grid max-w-[40rem] gap-3 sm:grid-cols-3">
            <span className="flex min-h-14 items-center gap-3 rounded-[6px] bg-[rgba(47,61,74,0.84)] px-3 text-sm font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)] backdrop-blur-sm">
              <CreditCard aria-hidden="true" className="size-5 shrink-0" />
              {copy.passLabel}
            </span>
            <span className="flex min-h-14 items-center gap-3 rounded-[6px] bg-[rgba(47,61,74,0.84)] px-3 text-sm font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)] backdrop-blur-sm">
              <FolderOpen aria-hidden="true" className="size-5 shrink-0" />
              {copy.folderLabel}
            </span>
            <span className="flex min-h-14 items-center gap-3 rounded-[6px] bg-[rgba(47,61,74,0.84)] px-3 text-sm font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)] backdrop-blur-sm">
              <MessageSquare aria-hidden="true" className="size-5 shrink-0" />
              {copy.assistantLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 z-0 h-[17rem] w-[19rem] rounded-tl-[24px] bg-[linear-gradient(145deg,#f8fbff,var(--bleu-clair))] shadow-[-18px_-18px_44px_rgba(0,80,170,0.22)] xl:h-[19rem] xl:w-[22rem]">
        <Image
          alt=""
          className="object-contain object-bottom p-7 drop-shadow-[0_18px_26px_rgba(25,48,59,0.22)]"
          fill
          sizes="(max-width: 1023px) 368px, 400px"
          src="/assets/passes/passe-navigo-full.svg"
          unoptimized
        />
      </div>

      <div className="pointer-events-none absolute bottom-[-1.5rem] left-[-10.75rem] z-0 h-[18rem] w-[32rem] xl:bottom-[-2.5rem] xl:left-[-12rem] xl:h-[20rem] xl:w-[36rem]">
        <Image
          alt=""
          className="absolute bottom-[3.75rem] left-24 h-32 w-auto rotate-[-9deg] opacity-95 drop-shadow-[0_20px_28px_rgba(0,0,0,0.23)] xl:left-[7.25rem] xl:h-40"
          height={240}
          src="/assets/fares/products/navigo-imagine-r-etudiant-oblique.svg"
          unoptimized
          width={557}
        />
        <Image
          alt=""
          className="absolute bottom-0 left-40 h-36 w-auto rotate-[5deg] opacity-95 drop-shadow-[0_22px_30px_rgba(0,0,0,0.25)] xl:left-[12.5rem] xl:h-44"
          height={240}
          src="/assets/fares/products/ticket-metro-train-rer-oblique.svg"
          unoptimized
          width={557}
        />
      </div>
    </aside>
  );
}

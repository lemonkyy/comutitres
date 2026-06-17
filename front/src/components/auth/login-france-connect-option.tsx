import Image from "next/image";

export type LoginFranceConnectOptionCopy = {
  description: string;
  label: string;
  unavailableLabel: string;
};

type LoginFranceConnectOptionProps = {
  copy: LoginFranceConnectOptionCopy;
};

export function LoginFranceConnectOption({
  copy,
}: LoginFranceConnectOptionProps) {
  return (
    <button
      aria-disabled="true"
      className="flex w-full cursor-not-allowed items-center gap-4 rounded-[6px] border border-[#000091]/20 bg-white p-4 text-left shadow-[inset_0_0_0_1px_rgba(0,0,145,0.04)] outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-[#000091] focus-visible:ring-[3px] focus-visible:ring-[#000091]/20"
      disabled
      type="button"
    >
      <span className="grid size-12 shrink-0 place-items-center">
        <Image
          alt=""
          height={48}
          src="/assets/logos/france-connect.svg"
          unoptimized
          width={40}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-lg font-bold leading-6 text-[#000091]">
            {copy.label}
          </span>
          <span className="rounded-[6px] bg-[var(--gris-clair-40)] px-2 py-1 text-xs font-bold leading-none text-muted-foreground">
            {copy.unavailableLabel}
          </span>
        </span>
        <span className="mt-1 block text-sm font-medium leading-5 text-foreground">
          {copy.description}
        </span>
      </span>
    </button>
  );
}

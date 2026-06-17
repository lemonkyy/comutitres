import { Separator } from "@/components/ui/separator";

type LoginMethodSeparatorProps = {
  label: string;
};

export function LoginMethodSeparator({ label }: LoginMethodSeparatorProps) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold leading-5 text-muted-foreground">
      <Separator className="flex-1" />
      <span>{label}</span>
      <Separator className="flex-1" />
    </div>
  );
}

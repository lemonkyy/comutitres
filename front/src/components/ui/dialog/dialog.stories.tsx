"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/actions/button/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Ouvrir</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document</DialogTitle>
          <DialogDescription>
            Aperçu du document transmis au format PDF ou image.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid aspect-[4/3] place-items-center rounded-[6px] border border-dashed border-border bg-[var(--gris-clair-40)] text-sm font-semibold text-muted-foreground">
            Aperçu du fichier
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
};

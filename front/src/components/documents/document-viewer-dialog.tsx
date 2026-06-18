"use client";

import type * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";

type DocumentViewerDialogProps = {
  children: React.ReactNode;
  description: string;
  title: string;
  url: string;
};

function DocumentViewerDialog({
  children,
  description,
  title,
  url,
}: DocumentViewerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody className="bg-[var(--gris-clair-40)] p-0">
          <iframe
            className="h-[min(72dvh,46rem)] w-full bg-white"
            src={url}
            title={title}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export { DocumentViewerDialog };

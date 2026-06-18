"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { FileUploadZone } from "./file-upload-zone";

const meta = {
  title: "Forms/FileUploadZone",
  component: FileUploadZone,
  args: {
    accept: "application/pdf,image/png,image/jpeg",
    browseLabel: "Choisir un fichier",
    description: "PDF, JPG ou PNG jusqu'a 8 Mo",
    label: "Justificatif",
  },
} satisfies Meta<typeof FileUploadZone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [file, setFile] = useState<File | null>(null);

    return (
      <FileUploadZone
        {...args}
        onFileChange={setFile}
        selectedFileMeta={file ? formatFileSize(file.size) : undefined}
        selectedFileName={file?.name}
      />
    );
  },
};

export const Invalid: Story = {
  args: {
    errorMessage: "Le fichier depasse la taille autorisee.",
    invalid: true,
  },
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

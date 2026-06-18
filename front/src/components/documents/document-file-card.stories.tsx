"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import {
  DocumentFileCard,
  type DocumentFileCardCopy,
  type DocumentFileCardFile,
} from "./document-file-card";

const copy: DocumentFileCardCopy = {
  acceptedFormatsLabel: "PDF, JPG ou PNG jusqu'a 8 Mo",
  browseLabel: "Choisir un fichier",
  downloadLabel: "Telecharger",
  replaceLabel: "Remplacer le document",
  statusLabels: {
    approved: "Accepte",
    missing: "Manquant",
    pending: "En attente",
    rejected: "Refuse",
  },
  submitLabel: "Envoyer le document",
  submittingLabel: "Envoi en cours",
  unavailableFileLabel: "Aucun fichier transmis",
  uploadLabel: "Ajouter un document",
  viewDialogDescription: "Apercu du document transmis.",
  viewLabel: "Voir",
};

const meta = {
  title: "Documents/DocumentFileCard",
  component: DocumentFileCard,
  args: {
    copy,
    description:
      "Document permettant de confirmer votre situation pour un tarif eligible.",
    id: "school-certificate",
    onFileChange: () => undefined,
    onSubmit: () => undefined,
    status: "pending",
    title: "Justificatif de statut etudiant",
  },
} satisfies Meta<typeof DocumentFileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    file: {
      meta: "Transmis le 18 juin 2026",
      name: "Certificat de scolarite transmis",
    },
  },
};

export const Missing: Story = {
  args: {
    status: "missing",
  },
};

export const Approved: Story = {
  args: {
    file: {
      meta: "Document valide",
      name: "Justificatif accepte",
    },
    status: "approved",
  },
};

export const Rejected: Story = {
  args: {
    errorMessage: "Le document est illisible. Ajoutez un nouveau fichier.",
    file: {
      meta: "Document refuse",
      name: "Ancien justificatif",
    },
    status: "rejected",
  },
};

export const WithAvailableFileActions: Story = {
  args: {
    file: {
      downloadName: "justificatif.pdf",
      meta: "Apercu local disponible",
      name: "Justificatif selectionne",
      url: "about:blank",
    },
    status: "pending",
  },
};

export const WithSelectedFile: Story = {
  args: {
    status: "missing",
  },
  render: (args) => {
    const [selectedFile, setSelectedFile] =
      useState<DocumentFileCardFile | null>(null);

    return (
      <DocumentFileCard
        {...args}
        onFileChange={(file) => {
          setSelectedFile(
            file
              ? {
                  meta: formatFileSize(file.size),
                  name: file.name,
                }
              : null,
          );
        }}
        onSubmit={() => undefined}
        selectedFile={selectedFile ?? undefined}
      />
    );
  },
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

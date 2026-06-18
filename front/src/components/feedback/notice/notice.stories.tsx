import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileCheck2 } from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { Link } from "@/i18n/navigation";
import { Notice } from "./notice";

const meta = {
  title: "Feedback/Notice",
  component: Notice,
  args: {
    children:
      "Transmettez vos justificatifs avant la date limite pour finaliser votre dossier.",
    title: "Documents à transmettre",
    variant: "warning",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "warning", "success", "destructive"],
    },
  },
} satisfies Meta<typeof Notice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: (
      <Button asChild className="w-full sm:w-fit" variant="outline">
        <Link href="/account/documents">
          <FileCheck2 aria-hidden="true" data-icon="inline-start" />
          Mes documents
        </Link>
      </Button>
    ),
  },
};

export const Success: Story = {
  args: {
    children: "Votre justificatif a été accepté par le service client.",
    title: "Document validé",
    variant: "success",
  },
};

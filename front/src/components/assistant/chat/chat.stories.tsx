import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronLeft, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import {
  ChoicePillGroup,
  type ChoicePillOption,
} from "@/components/assistant/choice-pill/choice-pill";
import {
  AssistantMessage,
  UserMessage,
} from "@/components/assistant/message/message";
import { PageHeaderIconButton } from "@/components/layout/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Chat, type ChatProps } from "./chat";

type ChatMessage = {
  content: ReactNode;
  id: string;
  sender: "assistant" | "user";
};

type ChatExampleProps = ChatProps & {
  choiceLabel?: string;
  choiceOptions?: ChoicePillOption[];
  footerContent?: ReactNode;
  messages: ChatMessage[];
};

const situationOptions: ChoicePillOption[] = [
  { label: "Étudiant·e", value: "student" },
  { label: "Lycéen·ne / Collégien·ne", value: "high-school" },
  { label: "Salarié·e", value: "employee" },
  { label: "Demandeur d'emploi", value: "job-seeker" },
  { label: "Senior (60+)", value: "senior" },
  { label: "Autre", value: "other" },
];

const scholarshipOptions: ChoicePillOption[] = [
  { label: "Oui, boursier·ère CROUS", value: "crous" },
  { label: "Oui, aide CAF ou autre", value: "caf" },
  { label: "Non", value: "no" },
  { label: "Je ne sais pas", value: "unknown" },
];

const zoneOptions: ChoicePillOption[] = [
  { label: "Zone 1–2 (Paris centre)", value: "zones-1-2" },
  { label: "Zone 1–3", value: "zones-1-3" },
  { label: "Zone 1–5 (toute l'IDF)", value: "zones-1-5" },
  { label: "Pas sûr·e", value: "unknown" },
];

const firstQuestionMessages: ChatMessage[] = [
  {
    content: "Bonjour ! Quelle est votre situation actuelle ?",
    id: "situation",
    sender: "assistant",
  },
];

const inProgressMessages: ChatMessage[] = [
  ...firstQuestionMessages,
  {
    content: "Étudiant·e",
    id: "student",
    sender: "user",
  },
  {
    content: "Avez-vous droit à une aide ou bourse ?",
    id: "scholarship",
    sender: "assistant",
  },
];

const finalMessages: ChatMessage[] = [
  {
    content: "Avez-vous droit à une aide ou bourse ?",
    id: "scholarship",
    sender: "assistant",
  },
  {
    content: "Oui, boursier·ère CROUS",
    id: "crous",
    sender: "user",
  },
  {
    content: "Quel est votre âge ?",
    id: "age",
    sender: "assistant",
  },
  {
    content: "Moins de 16 ans",
    id: "under-16",
    sender: "user",
  },
  {
    content: "Où habitez-vous principalement ?",
    id: "location",
    sender: "assistant",
  },
  {
    content: "Paris (75)",
    id: "paris",
    sender: "user",
  },
  {
    content: "Quelle zone utilisez-vous le plus souvent ?",
    id: "zone",
    sender: "assistant",
  },
  {
    content: "Zone 1–2 (Paris centre)",
    id: "zone-1-2",
    sender: "user",
  },
  {
    content:
      "Parfait ! J'ai tout ce qu'il me faut. Voici votre recommandation personnalisée.",
    id: "loading-recommendation",
    sender: "assistant",
  },
];

const meta = {
  title: "Assistant/Chat",
  component: Chat,
  args: {
    progressLabel: "Question 1 sur 5",
    progressMax: 5,
    progressValue: 0,
    subtitle: "Question 1/5",
    title: "Assistant Comutitres",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstQuestion: Story = {
  render: (args) => (
    <ChatExample
      {...args}
      choiceLabel="Choisir votre situation"
      choiceOptions={situationOptions}
      messages={firstQuestionMessages}
    />
  ),
};

export const InProgress: Story = {
  args: {
    progressLabel: "Question 2 sur 5",
    progressValue: 1,
    subtitle: "Question 2/5",
  },
  render: (args) => (
    <ChatExample
      {...args}
      choiceLabel="Choisir une aide ou bourse"
      choiceOptions={scholarshipOptions}
      messages={inProgressMessages}
    />
  ),
};

export const FinalRecommendation: Story = {
  args: {
    progressValue: undefined,
    subtitle: "Votre recommandation",
  },
  render: (args) => (
    <ChatExample
      {...args}
      footerContent={
        <Card
          className="flex flex-col gap-3 rounded-[1.25rem] border-[color-mix(in_srgb,var(--primary)_22%,transparent)] bg-accent"
          padding="md"
          variant="outlined"
        >
          <p className="text-xs font-extrabold uppercase tracking-normal text-primary">
            Votre recommandation
          </p>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-extrabold leading-tight tracking-normal text-foreground md:text-xl">
              Forfait Imagine R
            </h2>
            <p className="text-sm font-medium leading-6 text-muted-foreground">
              Ce titre semble le plus adapté aux réponses données.
            </p>
          </div>
        </Card>
      }
      messages={finalMessages}
    />
  ),
};

export const Unavailable: Story = {
  args: {
    progressValue: undefined,
    subtitle: "Assistant indisponible",
  },
  render: (args) => (
    <ChatExample
      {...args}
      messages={[
        {
          content:
            "Aucun parcours de questions n'est configuré pour le moment.",
          id: "unavailable",
          sender: "assistant",
        },
      ]}
    />
  ),
};

export const NarrowMobile: Story = {
  args: {
    progressLabel: "Question 5 sur 5",
    progressValue: 4,
    subtitle: "Question 5/5",
  },
  render: (args) => (
    <div className="w-[20rem] max-w-full overflow-hidden bg-background">
      <ChatExample
        {...args}
        choiceLabel="Choisir une zone"
        choiceOptions={zoneOptions}
        messages={[
          {
            content: "Quelle zone utilisez-vous le plus souvent ?",
            id: "zone",
            sender: "assistant",
          },
        ]}
      />
    </div>
  ),
};

function ChatExample({
  choiceLabel,
  choiceOptions,
  footerContent,
  messages,
  ...props
}: ChatExampleProps) {
  return (
    <Chat
      {...props}
      action={<ResetButton />}
      backButton={<BackButton />}
      footer={
        choiceOptions ? (
          <ChoicePillGroup
            ariaLabel={choiceLabel ?? ""}
            options={choiceOptions}
          />
        ) : (
          footerContent
        )
      }
    >
      {messages.map((message) =>
        message.sender === "assistant" ? (
          <AssistantMessage key={message.id}>
            {message.content}
          </AssistantMessage>
        ) : (
          <UserMessage key={message.id}>{message.content}</UserMessage>
        ),
      )}
    </Chat>
  );
}

function BackButton() {
  return <PageHeaderIconButton icon={ChevronLeft} label="Retour" />;
}

function ResetButton() {
  return <PageHeaderIconButton icon={RotateCcw} label="Recommencer" />;
}

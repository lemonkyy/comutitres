import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/actions/button/button";
import {
  ChoicePillGroup,
  type ChoicePillOption,
} from "@/components/assistant/choice-pill/choice-pill";
import {
  AssistantMessage,
  UserMessage,
} from "@/components/assistant/message/message";
import { PageHeaderIconButton } from "@/components/layout/page-header/page-header";
import { Chat, type ChatProps } from "./chat";

type ChatMessage = {
  content: ReactNode;
  id: string;
  sender: "assistant" | "user";
};

type ChatExampleProps = ChatProps & {
  choiceLabel?: string;
  choiceOptions?: ChoicePillOption[];
  cta?: ReactNode;
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
      "Parfait ! J'ai tout ce qu'il me faut. Je prépare votre recommandation personnalisée...",
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

export const FinalCtaFooter: Story = {
  args: {
    progressLabel: "Question 5 sur 5",
    progressValue: 5,
    subtitle: "Question 5/5",
  },
  render: (args) => (
    <ChatExample
      {...args}
      cta={
        <Button
          size={null}
          className="min-h-14 w-full gap-2 rounded-xl text-base font-semibold [--button-icon-size:1.125rem]"
        >
          Voir ma recommandation
          <ChevronRight data-icon="inline-end" />
        </Button>
      }
      messages={finalMessages}
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
  cta,
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
          cta
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

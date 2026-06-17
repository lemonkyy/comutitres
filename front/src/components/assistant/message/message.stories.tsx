import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AssistantMessage, UserMessage } from "./message";

const meta = {
  title: "Assistant/Message",
  component: AssistantMessage,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AssistantMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Assistant: Story = {
  args: {
    children: "Bonjour ! Quelle est votre situation actuelle ?",
  },
};

export const User: Story = {
  render: () => <UserMessage>Étudiant·e</UserMessage>,
};

export const Conversation: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3 bg-background p-4">
      <AssistantMessage>
        Bonjour ! Quelle est votre situation actuelle ?
      </AssistantMessage>
      <UserMessage>Étudiant·e</UserMessage>
      <AssistantMessage>
        Avez-vous droit à une aide ou bourse ?
      </AssistantMessage>
      <UserMessage>Je ne sais pas</UserMessage>
    </div>
  ),
};

export const DesktopConversation: Story = {
  render: () => (
    <div className="flex max-w-4xl flex-col gap-4 bg-background p-8">
      <AssistantMessage>
        Bonjour ! Quelle est votre situation actuelle ?
      </AssistantMessage>
      <UserMessage>Lycéen·ne / Collégien·ne</UserMessage>
      <AssistantMessage>
        Votre établissement est-il situé en Île-de-France ?
      </AssistantMessage>
    </div>
  ),
};

export const LongMessage: Story = {
  render: () => (
    <div className="max-w-md bg-background p-4">
      <AssistantMessage>
        Parfait ! J&apos;ai tout ce qu&apos;il me faut. Je prépare votre
        recommandation personnalisée avec les informations que vous venez de
        donner.
      </AssistantMessage>
    </div>
  ),
};

export const CustomAvatar: Story = {
  render: () => (
    <AssistantMessage
      avatar={
        <span aria-hidden="true" className="text-[0.6875rem] font-extrabold">
          AI
        </span>
      }
      avatarLabel="Assistant Comutitres"
    >
      Quelle zone utilisez-vous le plus souvent ?
    </AssistantMessage>
  ),
};

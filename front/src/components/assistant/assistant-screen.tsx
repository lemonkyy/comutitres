"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Chat } from "@/components/assistant/chat/chat";
import {
  ChoicePillGroup,
  type ChoicePillOption,
} from "@/components/assistant/choice-pill/choice-pill";
import {
  AssistantMessage,
  UserMessage,
} from "@/components/assistant/message/message";
import { PageHeaderIconButton } from "@/components/layout/page-header/page-header";

export type AssistantQuestion = {
  choices: ChoicePillOption[];
  id: string;
  question: string;
};

export type AssistantScreenCopy = {
  assistantAvatarLabel: string;
  backLabel: string;
  choiceGroupLabel: string;
  completedMessage: string;
  progressLabel: string;
  recommendationLabel: string;
  resetLabel: string;
  title: string;
  questionLabel: string;
  questions: AssistantQuestion[];
};

type AssistantAnswer = {
  label: ChoicePillOption["label"];
  questionId: string;
  value: string;
};

type AssistantMessageItem = {
  content: ChoicePillOption["label"];
  id: string;
  sender: "assistant" | "user";
};

type AssistantScreenProps = {
  copy: AssistantScreenCopy;
};

export function AssistantScreen({ copy }: AssistantScreenProps) {
  const [answers, setAnswers] = useState<AssistantAnswer[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const totalQuestions = copy.questions.length;
  const completed = answers.length >= totalQuestions;
  const currentQuestion = completed
    ? undefined
    : copy.questions[answers.length];
  const currentQuestionNumber = completed
    ? totalQuestions
    : Math.min(answers.length + 1, totalQuestions);
  const messages = useMemo(() => getMessages(copy, answers), [answers, copy]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: getAssistantScrollBehavior(bottomRef.current),
    });
  });

  return (
    <Chat
      action={
        <PageHeaderIconButton
          className="assistant-pressable-motion"
          icon={RotateCcw}
          label={copy.resetLabel}
          onClick={() => {
            setAnswers([]);
          }}
        />
      }
      backButton={
        <PageHeaderIconButton
          className="assistant-pressable-motion"
          href="/"
          icon={ChevronLeft}
          label={copy.backLabel}
        />
      }
      footer={
        completed ? (
          <Button
            size={null}
            className="assistant-pressable-motion min-h-14 w-full gap-2 rounded-xl text-base font-semibold [--button-icon-size:1.125rem]"
            type="button"
          >
            {copy.recommendationLabel}
            <ChevronRight data-icon="inline-end" />
          </Button>
        ) : (
          <ChoicePillGroup
            ariaLabel={copy.choiceGroupLabel}
            options={currentQuestion?.choices ?? []}
            onValueSelect={(value) => {
              if (!currentQuestion) {
                return;
              }

              const selectedChoice = currentQuestion.choices.find(
                (choice) => choice.value === value,
              );

              if (!selectedChoice) {
                return;
              }

              setAnswers((currentAnswers) => [
                ...currentAnswers,
                {
                  label: selectedChoice.label,
                  questionId: currentQuestion.id,
                  value,
                },
              ]);
            }}
          />
        )
      }
      progressLabel={copy.progressLabel}
      progressMax={totalQuestions}
      progressValue={completed ? totalQuestions : answers.length}
      subtitle={`${copy.questionLabel} ${currentQuestionNumber}/${totalQuestions}`}
      title={copy.title}
    >
      {messages.map((message) =>
        message.sender === "assistant" ? (
          <AssistantMessage
            avatar={<span aria-hidden="true">🐦</span>}
            avatarLabel={copy.assistantAvatarLabel}
            key={message.id}
          >
            {message.content}
          </AssistantMessage>
        ) : (
          <UserMessage key={message.id}>{message.content}</UserMessage>
        ),
      )}
      <div ref={bottomRef} />
    </Chat>
  );
}

function getMessages(
  copy: AssistantScreenCopy,
  answers: AssistantAnswer[],
): AssistantMessageItem[] {
  const firstQuestion = copy.questions[0];

  if (!firstQuestion) {
    return [];
  }

  const messages: AssistantMessageItem[] = [
    {
      content: firstQuestion.question,
      id: `question-${firstQuestion.id}`,
      sender: "assistant",
    },
  ];

  answers.forEach((answer, index) => {
    messages.push({
      content: answer.label,
      id: `answer-${answer.questionId}`,
      sender: "user",
    });

    const nextQuestion = copy.questions[index + 1];

    messages.push({
      content: nextQuestion?.question ?? copy.completedMessage,
      id: nextQuestion
        ? `question-${nextQuestion.id}`
        : "assistant-completed-message",
      sender: "assistant",
    });
  });

  return messages;
}

function getAssistantScrollBehavior(element: Element | null): ScrollBehavior {
  return shouldReduceAssistantMotion(element) ? "auto" : "smooth";
}

function shouldReduceAssistantMotion(element: Element | null) {
  if (element?.closest('[data-motion="reduced"]')) {
    return true;
  }

  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

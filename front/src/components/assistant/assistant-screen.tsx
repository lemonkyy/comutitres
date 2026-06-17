"use client";

import { AlertCircle, ChevronLeft, RotateCcw, X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Chat } from "@/components/assistant/chat/chat";
import { ChoicePillGroup } from "@/components/assistant/choice-pill/choice-pill";
import {
  AssistantMessage,
  UserMessage,
} from "@/components/assistant/message/message";
import { PageHeaderIconButton } from "@/components/layout/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { useApiClient } from "@/contexts/api-client";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { WorkflowPass, WorkflowQuestion } from "@/utils/types";

export type AssistantScreenCopy = {
  assistantAvatarLabel: string;
  backLabel: string;
  choiceGroupLabel: string;
  completedMessage: string;
  errorDescription: string;
  errorTitle: string;
  loadingLabel: string;
  loadingMessage: string;
  questionLabel: string;
  recommendationDescription: string;
  recommendationTitle: string;
  resetLabel: string;
  retryLabel: string;
  stepErrorMessage: string;
  title: string;
  unavailableDescription: string;
  unavailableTitle: string;
};

type AssistantMessageItem = {
  content: ReactNode;
  id: string;
  sender: "assistant" | "user";
};

type AssistantStatus =
  | "completed"
  | "error"
  | "loading"
  | "ready"
  | "submitting"
  | "unavailable";

type AssistantScreenProps = {
  closeLabel?: string;
  copy: AssistantScreenCopy;
  onClose?: () => void;
  variant?: "page" | "panel";
};

export function AssistantScreen({
  closeLabel,
  copy,
  onClose,
  variant = "page",
}: AssistantScreenProps) {
  const { apiClient } = useApiClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const [currentQuestion, setCurrentQuestion] =
    useState<WorkflowQuestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessageItem[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [recommendation, setRecommendation] = useState<WorkflowPass | null>(
    null,
  );
  const [status, setStatus] = useState<AssistantStatus>("loading");

  const loadWorkflowStart = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setCurrentQuestion(null);
    setErrorMessage(null);
    setMessages([]);
    setQuestionCount(0);
    setRecommendation(null);
    setStatus("loading");

    const result = await apiClient.workflow.start();

    if (requestId !== requestIdRef.current) {
      return;
    }

    if (result instanceof ApiClientError) {
      setStatus(result.code === 404 ? "unavailable" : "error");
      return;
    }

    if (result.type === "pass") {
      setRecommendation(result.pass);
      setMessages([
        {
          content: copy.completedMessage,
          id: `recommendation-${result.pass.id}`,
          sender: "assistant",
        },
      ]);
      setStatus("completed");
      return;
    }

    setCurrentQuestion(result.question);
    setMessages([createQuestionMessage(result.question)]);
    setQuestionCount(1);
    setStatus("ready");
  }, [apiClient, copy.completedMessage]);

  useEffect(() => {
    loadWorkflowStart();
  }, [loadWorkflowStart]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: getAssistantScrollBehavior(bottomRef.current),
    });
  });

  const currentChoices = useMemo(
    () =>
      currentQuestion?.choices.map((choice) => ({
        label: choice.text,
        value: String(choice.id),
      })) ?? [],
    [currentQuestion],
  );

  const handleChoiceSelect = useCallback(
    async (value: string) => {
      if (!currentQuestion || status === "submitting") {
        return;
      }

      const selectedChoice = currentQuestion.choices.find(
        (choice) => choice.id === Number(value),
      );

      if (!selectedChoice) {
        return;
      }

      setErrorMessage(null);
      setStatus("submitting");

      const requestId = requestIdRef.current;
      const result = await apiClient.workflow.step(selectedChoice.id);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (result instanceof ApiClientError) {
        setErrorMessage(result.message || copy.stepErrorMessage);
        setStatus("ready");
        return;
      }

      const userMessage = createAnswerMessage(currentQuestion, selectedChoice);

      if (result.type === "pass") {
        setCurrentQuestion(null);
        setRecommendation(result.pass);
        setMessages((currentMessages) => [
          ...currentMessages,
          userMessage,
          {
            content: copy.completedMessage,
            id: `recommendation-${result.pass.id}`,
            sender: "assistant",
          },
        ]);
        setStatus("completed");
        return;
      }

      setCurrentQuestion(result.question);
      setMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
        createQuestionMessage(result.question),
      ]);
      setQuestionCount((currentCount) => currentCount + 1);
      setStatus("ready");
    },
    [
      apiClient,
      copy.completedMessage,
      copy.stepErrorMessage,
      currentQuestion,
      status,
    ],
  );

  const subtitle = getAssistantSubtitle(copy, status, questionCount);
  const isPanel = variant === "panel";
  const activeProgressValue =
    status === "ready" || status === "submitting" ? questionCount : undefined;
  const progressMax =
    typeof activeProgressValue === "number"
      ? Math.max(activeProgressValue + 1, 2)
      : undefined;

  return (
    <Chat
      as={isPanel ? "section" : "main"}
      action={
        isPanel ? (
          <div className="flex items-center gap-2">
            <PageHeaderIconButton
              className="assistant-pressable-motion"
              icon={RotateCcw}
              label={copy.resetLabel}
              onClick={loadWorkflowStart}
            />
            <PageHeaderIconButton
              className="assistant-pressable-motion"
              icon={X}
              label={closeLabel ?? copy.backLabel}
              onClick={onClose}
            />
          </div>
        ) : (
          <PageHeaderIconButton
            className="assistant-pressable-motion"
            icon={RotateCcw}
            label={copy.resetLabel}
            onClick={loadWorkflowStart}
          />
        )
      }
      backButton={
        isPanel ? null : (
          <PageHeaderIconButton
            className="assistant-pressable-motion"
            href="/"
            icon={ChevronLeft}
            label={copy.backLabel}
          />
        )
      }
      footer={
        recommendation ? (
          <RecommendationCard copy={copy} pass={recommendation} />
        ) : currentQuestion ? (
          <div className="flex flex-col gap-3">
            <ChoicePillGroup
              disabled={status === "submitting"}
              ariaLabel={copy.choiceGroupLabel}
              options={currentChoices}
              onValueSelect={handleChoiceSelect}
            />
            {errorMessage ? (
              <p
                className="text-sm font-semibold text-destructive"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        ) : null
      }
      layout={variant}
      progressLabel={subtitle}
      progressMax={progressMax}
      progressValue={activeProgressValue}
      subtitle={subtitle}
      title={copy.title}
    >
      {status === "loading" ? (
        <AssistantMessage avatarLabel={copy.assistantAvatarLabel}>
          {copy.loadingMessage}
        </AssistantMessage>
      ) : null}

      {status === "unavailable" ? (
        <AssistantStateCard
          actionLabel={copy.retryLabel}
          description={copy.unavailableDescription}
          onAction={loadWorkflowStart}
          title={copy.unavailableTitle}
        />
      ) : null}

      {status === "error" ? (
        <AssistantStateCard
          actionLabel={copy.retryLabel}
          description={copy.errorDescription}
          onAction={loadWorkflowStart}
          title={copy.errorTitle}
        />
      ) : null}

      {messages.map((message) =>
        message.sender === "assistant" ? (
          <AssistantMessage
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

function AssistantStateCard({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <Card
      className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 rounded-[1.25rem] border-[color-mix(in_srgb,var(--primary)_18%,transparent)] bg-card"
      padding="lg"
      variant="outlined"
    >
      <span className="grid size-11 place-items-center rounded-full bg-accent text-primary">
        <AlertCircle aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold leading-tight tracking-normal text-foreground">
          {title}
        </h2>
        <p className="text-sm font-medium leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <Button
        className="assistant-pressable-motion rounded-xl font-semibold"
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </Card>
  );
}

function RecommendationCard({
  copy,
  pass,
}: {
  copy: AssistantScreenCopy;
  pass: WorkflowPass;
}) {
  return (
    <Card
      className="flex flex-col gap-3 rounded-[1.25rem] border-[color-mix(in_srgb,var(--primary)_22%,transparent)] bg-accent"
      padding="md"
      variant="outlined"
    >
      <p className="text-xs font-extrabold uppercase tracking-normal text-primary">
        {copy.recommendationTitle}
      </p>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold leading-tight tracking-normal text-foreground md:text-xl">
          {pass.name}
        </h2>
        <p className="text-sm font-medium leading-6 text-muted-foreground">
          {pass.description || copy.recommendationDescription}
        </p>
      </div>
    </Card>
  );
}

function createQuestionMessage(
  question: WorkflowQuestion,
): AssistantMessageItem {
  return {
    content: question.text,
    id: `question-${question.id}`,
    sender: "assistant",
  };
}

function createAnswerMessage(
  question: WorkflowQuestion,
  choice: WorkflowQuestion["choices"][number],
): AssistantMessageItem {
  return {
    content: choice.text,
    id: `answer-${question.id}-${choice.id}`,
    sender: "user",
  };
}

function getAssistantSubtitle(
  copy: AssistantScreenCopy,
  status: AssistantStatus,
  questionCount: number,
) {
  if (status === "loading") {
    return copy.loadingLabel;
  }

  if (status === "completed") {
    return copy.recommendationTitle;
  }

  if (status === "error") {
    return copy.errorTitle;
  }

  if (status === "unavailable") {
    return copy.unavailableTitle;
  }

  return `${copy.questionLabel} ${Math.max(questionCount, 1)}`;
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

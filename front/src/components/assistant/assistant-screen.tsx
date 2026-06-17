"use client";

import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  MessageSquare,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
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
import { Link } from "@/i18n/navigation";
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
  recommendationCtaLabel: string;
  recommendationPricePrefix: string;
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
  const locale = useLocale();
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
          id: `completed-${result.pass.id}`,
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
            id: `completed-${result.pass.id}`,
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
        currentQuestion ? (
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
      {recommendation ? (
        <RecommendationMessage
          copy={copy}
          locale={locale}
          onCtaClick={onClose}
          pass={recommendation}
        />
      ) : null}
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
      className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 border-primary bg-card"
      padding="lg"
      variant="outlined"
    >
      <span className="grid size-11 place-items-center rounded-[6px] bg-accent text-primary">
        <AlertCircle aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.375rem] font-bold leading-[30.8px] tracking-normal text-foreground">
          {title}
        </h2>
        <p className="text-base font-normal leading-6 text-foreground">
          {description}
        </p>
      </div>
      <Button
        className="assistant-pressable-motion font-semibold"
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </Card>
  );
}

function RecommendationMessage({
  copy,
  locale,
  onCtaClick,
  pass,
}: {
  copy: AssistantScreenCopy;
  locale: string;
  onCtaClick?: () => void;
  pass: WorkflowPass;
}) {
  const priceLabel = getPassPriceLabel(
    pass,
    copy.recommendationPricePrefix,
    locale,
  );

  return (
    <article
      className="assistant-message-motion flex w-full items-start gap-3"
      data-slot="assistant-recommendation-message"
    >
      <span
        aria-label={copy.assistantAvatarLabel}
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[6px] bg-primary text-primary-foreground md:size-10"
        role="img"
      >
        <MessageSquare aria-hidden="true" className="size-4" />
      </span>

      <Card
        className="min-w-0 flex-1 overflow-hidden border-primary bg-card shadow-[var(--idfm-card-shadow-large)]"
        padding="none"
        variant="outlined"
      >
        <div className="grid min-[390px]:grid-cols-[minmax(0,1fr)_7.5rem] md:grid-cols-[minmax(0,1fr)_8.75rem]">
          <div className="min-w-0 p-4 md:p-5">
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[0.16em] text-primary">
              {copy.recommendationTitle}
            </p>
            <h2 className="mt-3 text-balance text-[1.5rem] font-bold leading-[1.2] tracking-normal text-foreground md:text-[1.75rem]">
              {pass.name}
            </h2>
            <p className="mt-2 text-pretty text-base font-normal leading-6 text-foreground">
              {pass.description || copy.recommendationDescription}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {priceLabel ? (
                <span className="inline-flex min-h-9 items-center rounded-[6px] bg-[var(--gris-clair-40)] px-3 text-sm font-semibold leading-5 text-foreground">
                  {priceLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[8.75rem] overflow-hidden bg-[linear-gradient(145deg,var(--bleu-clair),var(--bleu-moyen))] min-[390px]:min-h-full">
            <Image
              alt=""
              className="object-contain p-3 drop-shadow-[0_14px_22px_rgba(25,114,210,0.22)] min-[390px]:translate-x-3 min-[390px]:rotate-[8deg] min-[390px]:scale-110"
              fill
              sizes="(max-width: 767px) 140px, 160px"
              src="/assets/passes/passe-navigo-full.svg"
              unoptimized
            />
          </div>
        </div>

        <div className="border-[color-mix(in_srgb,var(--primary)_18%,transparent)] border-t bg-[color-mix(in_srgb,var(--bleu-clair)_70%,white)] p-3 md:p-4">
          <Button
            asChild
            className="assistant-pressable-motion min-h-12 w-full gap-2 rounded-[6px] text-base font-semibold"
            size={null}
          >
            <Link
              href={{
                pathname: "/passes",
                query: { pass: pass.id },
              }}
              onClick={onCtaClick}
            >
              <span>{copy.recommendationCtaLabel}</span>
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </Button>
        </div>
      </Card>
    </article>
  );
}

function getPassPriceLabel(pass: WorkflowPass, prefix: string, locale: string) {
  const amount = pass.prices?.[0]?.amount;

  if (typeof amount !== "number" || amount <= 0) {
    return null;
  }

  const formattedPrice = new Intl.NumberFormat(locale, {
    currency: "EUR",
    style: "currency",
  }).format(amount / 100);

  return `${prefix} ${formattedPrice}`;
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

import { getTranslations } from "next-intl/server";

import {
  AssistantScreen,
  type AssistantScreenCopy,
} from "@/components/assistant/assistant-screen";

const questionIds = [
  "situation",
  "scholarship",
  "age",
  "location",
  "zone",
] as const;

type QuestionId = (typeof questionIds)[number];

const choiceIds = {
  age: ["under16", "between16And25", "between26And59", "over60"],
  location: ["paris", "innerSuburbs", "outerSuburbs", "outsideIdf"],
  scholarship: ["crous", "caf", "no", "unknown"],
  situation: [
    "student",
    "middleOrHighSchool",
    "employee",
    "jobSeeker",
    "senior",
    "other",
  ],
  zone: ["zones1And2", "zones1And3", "zones1And5", "unknown"],
} as const satisfies Record<QuestionId, readonly string[]>;

export default async function AssistantPage() {
  const t = await getTranslations("assistant");
  const copy: AssistantScreenCopy = {
    assistantAvatarLabel: t("assistantAvatarLabel"),
    backLabel: t("backLabel"),
    choiceGroupLabel: t("choiceGroupLabel"),
    completedMessage: t("completedMessage"),
    progressLabel: t("progressLabel"),
    questionLabel: t("questionLabel"),
    recommendationLabel: t("recommendationLabel"),
    resetLabel: t("resetLabel"),
    title: t("title"),
    questions: questionIds.map((questionId) => ({
      choices: choiceIds[questionId].map((choiceId) => ({
        label: t(`questions.${questionId}.choices.${choiceId}`),
        value: choiceId,
      })),
      id: questionId,
      question: t(`questions.${questionId}.question`),
    })),
  };

  return <AssistantScreen copy={copy} />;
}

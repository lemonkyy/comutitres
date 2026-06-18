"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/actions/button/button";
import { Input } from "@/components/ui/input/input";
import { useApiClient } from "@/contexts/api-client";
import { WorkflowQuestion } from "@/utils/types";

export default function EditQuestionPage() {
  const { apiClient } = useApiClient();
  const router = useRouter();
  const params = useParams<{ questionId: string }>();

  const questionId = Number(params.questionId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState<WorkflowQuestion | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [choiceTexts, setChoiceTexts] = useState<Record<number, string>>({});

  const [savingQuestion, setSavingQuestion] = useState(false);
  const [savingChoiceId, setSavingChoiceId] = useState<number | null>(null);

  const [questionStatus, setQuestionStatus] = useState<null | "saved">(null);
  const [choiceStatus, setChoiceStatus] = useState<Record<number, "saved" | null>>({});

  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState(false);
  const [confirmDeleteChoiceId, setConfirmDeleteChoiceId] = useState<number | null>(null);
  const [questionDeleted, setQuestionDeleted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const response = await apiClient.workflow.getQuestion(questionId);

      if (response instanceof Error) {
        setError(response.message);
        setLoading(false);
        return;
      }

      setQuestion(response);
      setQuestionText(response.text);

      setChoiceTexts(
        Object.fromEntries(response.choices.map((c) => [c.id, c.text]))
      );

      setLoading(false);
    }

    fetchData();
  }, [questionId, apiClient]);

  async function saveQuestion() {
    setSavingQuestion(true);
    setError(null);

    const response = await apiClient.workflow.updateQuestion(questionId, {
      text: questionText,
    });

    if (response instanceof Error) {
      setError(response.message);
      setSavingQuestion(false);
      return;
    }

    setSavingQuestion(false);
    setQuestionStatus("saved");

    setTimeout(() => setQuestionStatus(null), 1500);
  }

  async function saveChoice(choiceId: number) {
    setSavingChoiceId(choiceId);
    setError(null);

    const response = await apiClient.workflow.updateChoice(choiceId, {
      text: choiceTexts[choiceId],
    });

    if (response instanceof Error) {
      setError(response.message);
      setSavingChoiceId(null);
      return;
    }

    setSavingChoiceId(null);

    setChoiceStatus((prev) => ({
      ...prev,
      [choiceId]: "saved",
    }));

    setTimeout(() => {
      setChoiceStatus((prev) => ({
        ...prev,
        [choiceId]: null,
      }));
    }, 1500);
  }

  async function deleteQuestion() {
    if (!confirmDeleteQuestion) {
      setConfirmDeleteQuestion(true);
      return;
    }

    const response = await apiClient.workflow.deleteQuestion(questionId);

    if (response instanceof Error) {
      setError(response.message);
      return;
    }

    setQuestionDeleted(true);

    setTimeout(() => {
      router.push("/administration/questions");
    }, 800);
  }

  async function deleteChoice(choiceId: number) {
    if (confirmDeleteChoiceId !== choiceId) {
      setConfirmDeleteChoiceId(choiceId);
      return;
    }

    const response = await apiClient.workflow.deleteChoice(choiceId);

    if (response instanceof Error) {
      setError(response.message);
      return;
    }

    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            choices: prev.choices.filter((c) => c.id !== choiceId),
          }
        : prev
    );

    setConfirmDeleteChoiceId(null);
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">

        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Edition de la question
              </h1>
            </div>

            <div className="flex gap-2">
              <Button
              className="min-w-36"
                variant={confirmDeleteQuestion ? "destructive" : "outline"}
                onClick={deleteQuestion}
              >
                {questionDeleted
                  ? "Supprimé"
                  : confirmDeleteQuestion
                    ? "Confirmer suppression ?"
                    : "Supprimer"}
              </Button>

              <Button asChild variant="outline">
                <Link href="/administration/questions">
                  Retour
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">
            Chargement...
          </p>
        )}

        {!loading && question && (
          <>
            <Card>
              <div className="flex flex-row w-full justify-between gap-4">
                <Input
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />

                <div className="flex justify-end">
                  <Button onClick={saveQuestion} disabled={savingQuestion} className="min-w-36">
                    {savingQuestion
                      ? "Sauvegarde..."
                      : questionStatus === "saved"
                        ? "Sauvegardé"
                        : "Sauver"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold">Choix</h2>

                {question.choices.map((choice) => (
                  <div key={choice.id} className="flex gap-2">
                    <Input
                      value={choiceTexts[choice.id] ?? ""}
                      onChange={(e) =>
                        setChoiceTexts((prev) => ({
                          ...prev,
                          [choice.id]: e.target.value,
                        }))
                      }
                    />

                    <Button
                      onClick={() => saveChoice(choice.id)}
                      disabled={savingChoiceId === choice.id}
                      className="min-w-36"
                    >
                      {savingChoiceId === choice.id
                        ? "Sauvegarde..."
                        : choiceStatus[choice.id] === "saved"
                          ? "Sauvegardé"
                          : "Sauver"}
                    </Button>

                    <Button
                      className="min-w-36"
                      variant={
                        confirmDeleteChoiceId === choice.id
                          ? "destructive"
                          : "outline"
                      }
                      onClick={() => deleteChoice(choice.id)}
                    >
                      {confirmDeleteChoiceId === choice.id
                        ? "Confirmer ?"
                        : "Supprimer"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

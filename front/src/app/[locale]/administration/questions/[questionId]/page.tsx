"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/actions/button/button";
import { Input } from "@/components/ui/input/input";
import { useApiClient } from "@/contexts/api-client";
import { WorkflowQuestion, type Pass, type WorkflowChoice } from "@/utils/types";

export default function EditQuestionPage() {
  const { apiClient } = useApiClient();
  const router = useRouter();
  const params = useParams<{ questionId: string }>();

  const questionId = Number(params.questionId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState<WorkflowQuestion | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [isFirst, setIsFirst] = useState(false);

  const [choices, setChoices] = useState<WorkflowChoice[]>([]);
  const [newChoice, setNewChoice] = useState<WorkflowChoice>({
    id: 0,
    text: "",
    nextQuestionId: null,
    recommendedPassId: null,
  });

  const [passes, setPasses] = useState<Pass[]>([]);
  const [allQuestions, setAllQuestions] = useState<WorkflowQuestion[]>([]);

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
      setIsFirst(response.isFirst);

      setChoices(
        response.choices.map((c: any) => ({
          id: c.id,
          text: c.text,
          nextQuestionId: c.nextQuestionId ?? null,
          recommendedPassId: c.recommendedPassId ?? null,
        }))
      );

      
      setLoading(false);
    }
    
    fetchData();
  }, [questionId, apiClient]);
  
  useEffect(() => {
    async function fetchPasses() {
      const response = await apiClient.pass.getCollection();
      if (response instanceof Error) return;

      const items = response["hydra:member"] ?? response.member ?? [];
      setPasses(items);
    }

    fetchPasses();
  }, [apiClient]);

  useEffect(() => {
    async function fetchAllQuestions() {
      const response = await apiClient.workflow.getCollectionQuestion({});
      if (response instanceof Error) return;

      setAllQuestions(response);
    }

    fetchAllQuestions();
  }, [apiClient]);

  async function saveQuestion() {
    setSavingQuestion(true);
    setError(null);

    const response = await apiClient.workflow.updateQuestion(questionId, {
      text: questionText,
      isFirst: isFirst
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

  async function saveChoice(choice: WorkflowChoice) {
    setSavingChoiceId(choice.id);
    setError(null);

    const response = await apiClient.workflow.updateChoice(choice.id, {
      text: choice.text,
      nextQuestionId: choice.nextQuestionId,
      recommendedPassId: choice.recommendedPassId,
    });

    if (response instanceof Error) {
      setError(response.message);
      setSavingChoiceId(null);
      return;
    }

    setSavingChoiceId(null);

    setChoiceStatus((prev) => ({
      ...prev,
      [choice.id]: "saved",
    }));

    setTimeout(() => {
      setChoiceStatus((prev) => ({
        ...prev,
        [choice.id]: null,
      }));
    }, 1500);
  }

  async function createNewChoice() {
    setSavingChoiceId(newChoice.id);
    setError(null);

    if (!question) return;

    const response = await apiClient.workflow.createChoice({
      text: newChoice.text,
      nextQuestionId: newChoice.nextQuestionId,
      recommendedPassId: newChoice.recommendedPassId,
      question: '/api/questions/'+question.id
    });

    if (response instanceof Error) {
      setError(response.message);
      return;
    }

    setChoices((prev) => [...prev, newChoice])
    
    setNewChoice({
      id: 0,
      text: "",
      nextQuestionId: null,
      recommendedPassId: null,
    })
    
    setSavingChoiceId(null);
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

    setChoices((prev) => prev.filter((c) => c.id !== choiceId));
    setConfirmDeleteChoiceId(null);
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">

        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Modifier la question
              </h1>
            </div>

            <div className="flex gap-2">
              <Button
                className="min-w-36 cursor-pointer"
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
                <Link href="/administration/questions">Retour</Link>
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
          <p className="text-sm text-muted-foreground">Chargement...</p>
        )}

        {!loading && question && (
          <>
            <Card>
              <h2 className="text-sm font-semibold">Titre</h2>
              <div className="flex justify-between gap-4 mt-2">
                <Input
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />

                <Button
                  onClick={saveQuestion}
                  disabled={savingQuestion}
                  className="min-w-56 cursor-pointer"
                >
                  {savingQuestion
                    ? "Sauvegarde..."
                    : questionStatus === "saved"
                      ? "Sauvegardé"
                      : "Sauver"}
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm mt-3">
                <input
                  type="checkbox"
                  checked={isFirst}
                  onChange={(e) =>
                    setIsFirst(e.target.checked)
                  }
                />

                Question de départ
            </label>
            </Card>
            <Card>
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold">Choix</h2>

                {choices.map((choice) => (
                  <div key={choice.id} className="flex gap-3 items-start">
                    <div className="flex flex-col w-full gap-2">
                      <Input
                        value={choice.text}
                        onChange={(e) =>
                          setChoices((prev) =>
                            prev.map((c) =>
                              c.id === choice.id
                                ? { ...c, text: e.target.value }
                                : c
                            )
                          )
                        }
                      />

                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        value={choice.nextQuestionId ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : null;

                          setChoices((prev) =>
                            prev.map((c) =>
                              c.id === choice.id
                                ? {
                                    ...c,
                                    nextQuestionId: value,
                                    recommendedPassId: value ? null : c.recommendedPassId,
                                  }
                                : c
                            )
                          );
                        }}
                      >
                        <option value="">
                          Aucune question suivante
                        </option>

                        {allQuestions
                          .filter((q) => q.id !== question.id)
                          .map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.text}
                            </option>
                          ))}
                      </select>

                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        value={choice.recommendedPassId ?? ""}
                        onChange={(e) => {
                          const value = e.target.value || null;

                          setChoices((prev) =>
                            prev.map((c) =>
                              c.id === choice.id
                                ? {
                                    ...c,
                                    recommendedPassId: value,
                                    nextQuestionId: value ? null : c.nextQuestionId,
                                  }
                                : c
                            )
                          );
                        }}
                      >
                        <option value="">
                          Aucun pass recommandé
                        </option>

                        {passes.map((pass) => (
                          <option key={pass.id} value={pass.id}>
                            {pass.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={ () => saveChoice(choice)}
                        disabled={savingChoiceId === choice.id}
                        className="min-w-56 cursor-pointer"
                      >
                        {savingChoiceId === choice.id 
                          ? "Sauvegarde..."
                          : choiceStatus === "saved"
                            ? "Sauvegardé"
                            : "Sauver"}
                      </Button>
                      <Button
                        className="min-w-56 cursor-pointer"
                        variant={confirmDeleteChoiceId === choice.id ? "destructive" : "outline"}
                        onClick={() => deleteChoice(choice.id)}
                      >
                        {confirmDeleteChoiceId === choice.id
                          ? "Confirmer suppression ?"
                          : "Supprimer"}
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 border-t pt-4 flex gap-3 items-start">
                  <div className="flex flex-col w-full gap-2">
                    <Input
                      placeholder="Nouveau choix"
                      value={newChoice.text}
                      onChange={(e) =>
                        setNewChoice((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                    />

                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={newChoice.nextQuestionId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : null;

                        setNewChoice((prev) => ({
                          ...prev,
                          nextQuestionId: value,
                          recommendedPassId: value ? null : prev.recommendedPassId,
                        }));
                      }}
                    >
                      <option value="">
                        Aucune question suivante
                      </option>

                      {allQuestions
                        .filter((q) => q.id !== question.id)
                        .map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.text}
                          </option>
                        ))}
                    </select>

                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      value={newChoice.recommendedPassId ?? ""}
                      onChange={(e) => {
                        const value = e.target.value || null;

                        setNewChoice((prev) => ({
                          ...prev,
                          recommendedPassId: value,
                          nextQuestionId: value ? null : prev.nextQuestionId,
                        }));
                      }}
                    >
                      <option value="">
                        Aucun pass recommandé
                      </option>

                      {passes.map((pass) => (
                        <option key={pass.id} value={pass.id}>
                          {pass.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                  onClick={ () => createNewChoice()}
                  disabled={savingChoiceId === 0}
                  className="min-w-56 cursor-pointer"
                  >
                    {savingChoiceId === 0
                      ? "Création..."
                      : choiceStatus === "saved"
                        ? "Créé"
                        : "Créer"}
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
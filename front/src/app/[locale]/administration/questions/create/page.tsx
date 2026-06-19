"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/actions/button/button";
import { Input } from "@/components/ui/input/input";
import { useApiClient } from "@/contexts/api-client";
import { WorkflowQuestion, WorkflowChoice, Pass } from "@/utils/types";

export default function CreateQuestionPage() {
  const { apiClient } = useApiClient();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [isFirst, setIsFirst] = useState(false);

  const [passes, setPasses] = useState<Pass[]>([]);
  const [allQuestions, setAllQuestions] = useState<WorkflowQuestion[]>([]);

  const [choices, setChoices] = useState<WorkflowChoice[]>([
    {
      id: 0,
      text: "",
      nextQuestionId: null,
      recommendedPassId: null,
    },
  ]);

  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    async function loadData() {
      const passResponse = await apiClient.pass.getCollection();

      if (!(passResponse instanceof Error)) {
        setPasses(
          passResponse["hydra:member"] ??
          passResponse.member ??
          []
        );
      }

      const questionResponse =
        await apiClient.workflow.getCollectionQuestion({});

      if (!(questionResponse instanceof Error)) {
        setAllQuestions(questionResponse);
      }
    }

    loadData();
  }, [apiClient]);


  function updateChoice(
    id: number,
    data: Partial<WorkflowChoice>
  ) {
    setChoices((prev) =>
      prev.map((choice) =>
        choice.id === id
          ? {
              ...choice,
              ...data,
            }
          : choice
      )
    );
  }


  function addChoice() {
    setChoices((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        nextQuestionId: null,
        recommendedPassId: null,
      },
    ]);
  }


  function removeChoice(id: number) {
    setChoices((prev) =>
      prev.filter((choice) => choice.id !== id)
    );
  }


  async function createQuestion() {
    setCreating(true);
    setError(null);

    const response = await apiClient.workflow.createQuestion({
      text: questionText,
      isFirst,
      choices: choices.map((choice) => ({
        text: choice.text,
        nextQuestionId: choice.nextQuestionId ?? null,
        recommendedPassId: choice.recommendedPassId ?? null,
      })),
    });


    if (response instanceof Error) {
      setError(response.message);
      setCreating(false);
      return;
    }

    setCreated(true);

    setTimeout(() => {
      router.push(
        `/administration/questions/${response.id}`
      );
    }, 800);
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
                Créer une question
              </h1>
            </div>

            <Button asChild variant="outline">
              <Link href="/administration/questions">
                Retour
              </Link>
            </Button>
          </div>
        </Card>


        {error && (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}


        <Card>
          <div className="flex flex-col gap-3">

            <h2 className="text-sm font-semibold">
              Question
            </h2>

            <Input
              placeholder="Texte de la question"
              value={questionText}
              onChange={(e) =>
                setQuestionText(e.target.value)
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFirst}
                onChange={(e) =>
                  setIsFirst(e.target.checked)
                }
              />

              Question de départ
            </label>

          </div>
        </Card>


        <Card>
          <div className="flex flex-col gap-4">

            <h2 className="text-sm font-semibold">
              Choix
            </h2>


            {choices.map((choice) => (
              <div
                key={choice.id}
                className="flex flex-row gap-3 items-start"
              >

                <div className="flex flex-col w-full gap-2">
                  <Input
                    placeholder="Texte du choix"
                    value={choice.text}
                    onChange={(e) =>
                      updateChoice(
                        choice.id,
                        {
                          text: e.target.value,
                        }
                      )
                    }
                  />


                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={choice.nextQuestionId ?? ""}
                    onChange={(e) =>
                      updateChoice(
                        choice.id,
                        {
                          nextQuestionId:
                            e.target.value
                              ? Number(e.target.value)
                              : null,

                          recommendedPassId:
                            e.target.value
                              ? null
                              : choice.recommendedPassId,
                        }
                      )
                    }
                  >

                    <option value="">
                      Aucune question suivante
                    </option>

                    {allQuestions.map((question) => (
                      <option
                        key={question.id}
                        value={question.id}
                      >
                        {question.text}
                      </option>
                    ))}

                  </select>


                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={choice.recommendedPassId ?? ""}
                    onChange={(e) =>
                      updateChoice(
                        choice.id,
                        {
                          recommendedPassId:
                            e.target.value || null,

                          nextQuestionId:
                            e.target.value
                              ? null
                              : choice.nextQuestionId,
                        }
                      )
                    }
                  >

                    <option value="">
                      Aucun pass recommandé
                    </option>

                    {passes.map((pass) => (
                      <option
                        key={pass.id}
                        value={pass.id}
                      >
                        {pass.name}
                      </option>
                    ))}

                  </select>

                </div>

                <Button
                  className="min-w-32 cursor-pointer"
                  variant="outline"
                  onClick={() =>
                    removeChoice(choice.id)
                  }
                >
                  Supprimer
                </Button>

              </div>
            ))}


            <Button
              variant="outline"
              onClick={addChoice}
              className="cursor-pointer"
            >
              Ajouter un choix
            </Button>

          </div>
        </Card>


        <Button
          className="min-w-40"
          onClick={createQuestion}
          disabled={creating}
        >
          {creating
            ? "Création..."
            : created
              ? "Créée"
              : "Créer la question"}
        </Button>

      </div>
    </main>
  );
}
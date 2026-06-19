"use client";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { WorkflowQuestion } from "@/utils/types";
import { useApiClient } from "@/contexts/api-client";

export default function QuestionsPage() {

  const { apiClient } = useApiClient();

  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<WorkflowQuestion[] | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await apiClient.workflow.getCollectionQuestion({
      });

      if (response instanceof Error) {
        setQuestionsError(response.message);
        return;
      }

      setAllQuestions(response);
    }

    fetchQuestions();
  }, []);

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Questions
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Liste complète des questions.
              </p>
            </div>
            <div>
              <Button asChild size="sm" variant="outline">
                <Link href="/administration/questions/create">Ajouter une question</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/administration">Retour au dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {questionsError ? (
              <p className="mb-4 rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
                {questionsError}
              </p>
            ) : null}

            {!allQuestions ? (
              <p className="text-sm text-muted-foreground">
                Chargement des questions...
              </p>
            ) : null}

            {allQuestions && allQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune question disponible.
              </p>
            ) : null}

            <div className="flex flex-col gap-2.5">
              {allQuestions && allQuestions.map((question) => (
                <article
                  className="flex flex-col gap-4 rounded-xl bg-accent/55 p-5"
                  key={question.id}
                >
                  <div className="flex flex-row items-center justify-between w-full">
                    <h2 className="text-lg font-bold text-foreground">
                      {question.text}
                    </h2>

                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={{
                            pathname: "/administration/questions/[questionId]",
                            params: { questionId: String(question.id) },
                          }}
                      >
                        Consulter
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!question.choices || question.choices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Aucun choix disponible.
                      </p>
                    ) : (
                      question.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className="flex items-center justify-between rounded-lg bg-background px-4 py-3 text-sm text-foreground"
                        >
                          {choice.text}
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

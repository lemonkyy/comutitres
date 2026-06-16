export const apiPaths = {
  pass: {
    collection: "/passes",
    update: "/passes/:id",
    buy: "/passes/:id/buy",
  },
  workflow: {
    start: "/workflow/start",
    step: "/workflow/step/:choiceId",
    createQuestion: "/workflow/questions",
  },
  question: {
    update: "/questions/:id",
  },
  choice: {
    update: "/choices/:id",
  },
};

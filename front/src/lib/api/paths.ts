export const apiPaths = {
  auth: {
    login: "/login",
  },
  me: {
    get: "/me",
  },
  invoice: {
    collection: "/invoices",
    item: "/invoices/:id",
  },
  pass: {
    collection: "/passes",
    update: "/passes/:id",
    buy: "/passes/:id/buy",
  },
  workflow: {
    start: "/workflow/start",
    step: "/workflow/step/:choiceId",
    createQuestion: "/questions",
  },
  question: {
    update: "/questions/:id",
  },
  choice: {
    update: "/choices/:id",
  },
};

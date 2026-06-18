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
  user: {
    collection: "/users",
  },
  document: {
    collection: "/document_proofs",
    item: "/document_proofs/:id",
    mine: "/my-documents",
    myDocuments: "/my-documents",
    upload: "/document-proof/upload",
    updateStatus: "/document-proof/:id/status",
  },
};

export const apiPaths = {
  auth: {
    login: "/login",
  },
  me: {
    get: "/me",
  },
  invoice: {
    collection: "/invoices",
    userCollection: "/users/:id/invoices",
    totalInvoices: "/total_invoice",
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
    details: "/questions/:id",
    collection: "/questions",
    update: "/questions/:id",
    delete: "/questions/:id",
  },
  choice: {
    create: "/choices",
    update: "/choices/:id",
    delete: "/choices/:id",
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

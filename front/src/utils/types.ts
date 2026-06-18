export type LoginInput = {
  email: string;
  password: string;
};

export type Address = {
  id: string;
  street?: string | null;
  city?: string | null;
  postalCode?: string | null;
  region?: string | null;
  department?: string | null;
};

export type Me = {
  id: string;
  email?: string | null;
  roles: string[];
  familyName?: string | null;
  givenName?: string | null;
  address?: Address | string | null;
};

export type User = {
  id: string;
  sub?: string;
  email?: string | null;
  roles: string[];
  familyName?: string | null;
  givenName?: string | null;
  address?: Address | string | null;
  documentProofs?: Array<string | { id: string }>;
};

export type Pass = {
  id: string;
  name: string;
  description?: string;
  prices: Price[];
};

export type Price = {
  id: string;
  amount: number;
};

export type Purchase = {
  createdAt: string;
  id: string;
  invoiceId?: string | null;
  pass: Pass;
  total: number;
};

export type WorkflowChoice = {
  id: number;
  text: string;
};

export type WorkflowQuestion = {
  id: number;
  text: string;
  choices: WorkflowChoice[];
};

export type WorkflowPass = {
  description?: string;
  id: string;
  name: string;
  prices?: Price[];
};

export type WorkflowStepResult =
  | { type: "question"; question: WorkflowQuestion }
  | { type: "pass"; pass: WorkflowPass };

export type CreateChoiceInput = {
  text: string;
  nextQuestionId?: number | null;
  recommendedPassId?: string | null;
};

export type CreateQuestionInput = {
  text: string;
  isFirst?: boolean;
  choices: CreateChoiceInput[];
};

export type UpdateQuestionInput = {
  text?: string;
  isFirst?: boolean;
};

export type UpdateChoiceInput = {
  text?: string;
  nextQuestionId?: number | null;
  recommendedPassId?: string | null;
};

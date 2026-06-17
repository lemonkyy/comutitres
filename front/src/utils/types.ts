export type LoginInput = {
  email: string;
  password: string;
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

export type WorkflowChoice = {
  id: number;
  text: string;
};

export type WorkflowQuestion = {
  id: number;
  text: string;
  choices: WorkflowChoice[];
};

export type WorkflowStepResult =
  | { type: "question"; question: WorkflowQuestion }
  | { type: "pass"; pass: Pass };

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

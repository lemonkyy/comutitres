export enum WorkflowQuestionTypeEnum {
  IMAGINE_R_JUNIOR = "imagine_r_junior",
  IMAGINE_R_SCOLAIRE = "imagine_r_scolaire",
  IMAGINE_R_ETUDIANT = "imagine_r_etudiant",
  NAVIGO = "navigo",
  SENIOR = "senior",
}

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

export const documentKinds = [
  "identity_photo",
  "school_certificate",
  "grant_certificate",
  "proof_of_residence",
] as const;

export type DocumentKind = (typeof documentKinds)[number];

export type DocumentProofStatus =
  | "missing"
  | "pending"
  | "approved"
  | "rejected";

export type DocumentProof = {
  "@id"?: string;
  id: number | string;
  path?: string | null;
  status: DocumentProofStatus;
  type: DocumentKind;
  uploadedAt?: string | null;
  user: User;
};

export type MyDocuments = Partial<Record<DocumentKind, DocumentProof | null>>;

export type WorkflowChoice = {
  id: number;
  text: string;
  nextQuestion?: {
    id: number;
    text: string;
  } | null;
  recommendedPass?: {
    id: string;
    name: string;
  } | null;
};

export type WorkflowQuestion = {
  id: number;
  text: string;
  choices: WorkflowChoice[];
  isFirst: boolean;
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

export type CollectionQuestionInput = {
  text?: string;
};

export type CreateChoiceStandaloneInput = CreateChoiceInput & {
  question: string;
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

export type DocumentProofUpload = {
  file: string;
  type: DocumentKind;
};

export type DocumentProofStatusEnum = DocumentProofStatus;

export type DocumentEnum = DocumentKind;

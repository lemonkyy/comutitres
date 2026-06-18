import type { ApiClient, DeleteResponse } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type {
  CreateChoiceStandaloneInput,
  CreateQuestionInput,
  UpdateChoiceInput,
  UpdateQuestionInput,
  WorkflowChoice,
  WorkflowQuestion,
  WorkflowQuestionTypeEnum,
  WorkflowStepResult,
} from "@/utils/types";

export class WorkflowResource {
  constructor(private apiClient: ApiClient) {}

  public async start(): Promise<WorkflowStepResult | ApiClientError> {
    return this.apiClient.get<WorkflowStepResult>(apiPaths.workflow.start);
  }

  public async step(
    choiceId: number,
  ): Promise<WorkflowStepResult | ApiClientError> {
    return this.apiClient.get<WorkflowStepResult>(
      apiPaths.workflow.step.replace(":choiceId", String(choiceId)),
    );
  }

  public async createQuestion(
    data: CreateQuestionInput,
  ): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.post<WorkflowQuestion>(
      apiPaths.workflow.createQuestion,
      data,
    );
  }

  public async getQuestion(id: number): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.get<WorkflowQuestion>(
      apiPaths.question.details.replace(":id", String(id)),
    );
  }

  public async getQuestions(text?: string, type?: WorkflowQuestionTypeEnum): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.get<WorkflowQuestion>(
      `${apiPaths.question.collection}?text=${text ?? ''}${type ? `&type=${type}` : ''}`,
    );
  }

  public async updateQuestion(
    id: number,
    data: UpdateQuestionInput,
  ): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.patch<WorkflowQuestion>(
      apiPaths.question.update.replace(":id", String(id)),
      data,
    );
  }

  public async createChoice(
    data: CreateChoiceStandaloneInput,
  ): Promise<WorkflowChoice | ApiClientError> {
    return this.apiClient.post<WorkflowChoice>(apiPaths.choice.create, data);
  }

  public async updateChoice(
    id: number,
    data: UpdateChoiceInput,
  ): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.patch<WorkflowQuestion>(
      apiPaths.choice.update.replace(":id", String(id)),
      data,
    );
  }

  public async deleteQuestion(id: number): Promise<DeleteResponse | ApiClientError> {
    return this.apiClient.delete(apiPaths.question.delete.replace(":id", String(id)));
  }

  public async deleteChoice(id: number): Promise<DeleteResponse | ApiClientError> {
    return this.apiClient.delete(apiPaths.choice.delete.replace(":id", String(id)));
  }
}

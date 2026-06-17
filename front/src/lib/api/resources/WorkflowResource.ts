import type { ApiClient } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type {
  CreateQuestionInput,
  UpdateChoiceInput,
  UpdateQuestionInput,
  WorkflowQuestion,
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

  public async updateQuestion(
    id: number,
    data: UpdateQuestionInput,
  ): Promise<WorkflowQuestion | ApiClientError> {
    return this.apiClient.patch<WorkflowQuestion>(
      apiPaths.question.update.replace(":id", String(id)),
      data,
    );
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
}

<?php

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Model\WorkflowQuestion;
use App\Repository\QuestionRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class WorkflowStartProvider implements ProviderInterface
{
    public function __construct(
        private readonly QuestionRepository $questionRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): WorkflowQuestion
    {
        $question = $this->questionRepository->findFirst();

        if (null === $question) {
            throw new NotFoundHttpException('No workflow configured.');
        }
    }
}

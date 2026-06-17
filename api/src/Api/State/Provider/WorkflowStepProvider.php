<?php

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Model\WorkflowStepResult;
use App\Repository\ChoiceRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class WorkflowStepProvider implements ProviderInterface
{
    public function __construct(
        private readonly ChoiceRepository $choiceRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): WorkflowStepResult
    {
        $choice = $this->choiceRepository->find($uriVariables['choiceId']);
        if (null === $choice) {
            throw new NotFoundHttpException('Choice not found.');
        }

        if (null !== $choice->getNextQuestion()) {
            return new WorkflowStepResult(type: 'question', question: $choice->getNextQuestion());
        }

        $pass = $choice->getRecommendedPass();
        if (null === $pass) {
            throw new \LogicException('Choice has neither nextQuestion nor recommendedPass.');
        }

        return new WorkflowStepResult(type: 'pass', pass: $pass);
    }
}

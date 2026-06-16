<?php

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Api\State\Provider\WorkflowStepProvider;
use App\Entity\Pass;
use App\Entity\Question;

#[ApiResource(operations: [
    new Get(
        uriTemplate: '/workflow/step/{choiceId}',
        provider: WorkflowStepProvider::class,
    ),
])]
final readonly class WorkflowStepResult
{
    public function __construct(
        public string $type,
        public ?Question $question = null,
        public ?Pass $pass = null,
    ) {
    }
}

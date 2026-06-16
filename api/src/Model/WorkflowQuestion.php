<?php

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Api\State\Provider\WorkflowStartProvider;
use App\Domain\Command\CreateQuestionCommand;

#[ApiResource(operations: [
    new Get(
        uriTemplate: '/workflow/start',
        provider: WorkflowStartProvider::class,
    ),
    new Post(
        uriTemplate: '/workflow/questions',
        messenger: true,
        input: CreateQuestionCommand::class,
    ),
])]
final readonly class WorkflowQuestion
{
    public function __construct(
        public ?int $id,
        public string $text,
        public array $choices = [],
    ) {
    }
}

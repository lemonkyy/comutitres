<?php

declare(strict_types=1);

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Api\State\Provider\ListPassProvider;
use App\Domain\Command\UpdateProductCommand;

#[ApiResource(operations: [
    new GetCollection(
        uriTemplate: '/passes',
        provider: ListPassProvider::class,
    ),
    new Post(
        uriTemplate: '/passes/{id}',
        messenger: true,
        input: UpdateProductCommand::class,
    ),
])]
final readonly class Pass
{
    public function __construct(
        public string $id,
        public string $name,
        public string $description,
        public array $prices = [],
    ) {
    }
}

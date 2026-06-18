<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\DocumentProofRepository;

final class DocumentProofProvider implements ProviderInterface
{
    public function __construct(
        private DocumentProofRepository $repo,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        return $this->repo->findBy($context['filters'] ?? []);
    }
}

<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Enum\DocumentEnum;
use App\Repository\DocumentProofRepository;
use Symfony\Bundle\SecurityBundle\Security;

final class DocumentProvider implements ProviderInterface
{
    public function __construct(
        private DocumentProofRepository $documentProofRepository,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        $documents = $this->documentProofRepository->findBy(['user' => $user]);

        return array_reduce($documents, function ($carry, $document) use ($documents) {
            $carry[$document->getType()->value] = $document;

            return $carry;
        }, array_fill_keys(array_map(fn ($d) => $d->value, DocumentEnum::cases()), null));
    }
}

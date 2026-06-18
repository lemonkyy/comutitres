<?php

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

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|Object
    {
        $user = $this->security->getUser();

        $documents = $this->documentProofRepository->findBy(['user' => $user]);

        $a = array_fill_keys(array_map(fn ($d) => $d->value, DocumentEnum::cases()), 'missing');

        foreach ($documents as $document) {
            $a[$document->getType()->value] = $document ?? 'missing';
        }

        return (object) $a;
    }
}

#[\AllowDynamicProperties]
class R {
}

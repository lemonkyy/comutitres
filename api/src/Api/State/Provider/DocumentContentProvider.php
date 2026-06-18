<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\DocumentProofRepository;
use Symfony\Component\HttpFoundation\Response;

final class DocumentContentProvider implements ProviderInterface
{
    public function __construct(
        private DocumentProofRepository $documentProofRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $d = $this->documentProofRepository->find($uriVariables['id']);

        $r = new Response(file_get_contents($d->getPath()));
        $r->headers->set('Content-Type', 'application/pdf');

        return $r;
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Command\Admin;

use App\Repository\DocumentProofRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class UpdateDocumentStatusHandler
{
    public function __construct(
        private DocumentProofRepository $repo,
        private EntityManagerInterface $em,
    ) {
    }

    public function __invoke(UpdateDocumentStatusCommand $command): void
    {
        $document = $this->repo->find($command->getCurrentResource());

        if (!$document) {
            throw new NotFoundHttpException();
        }

        $document->setStatus($command->status);
        $this->em->flush();
    }
}

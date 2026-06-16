<?php

declare(strict_types=1);

namespace App\Domain\Command\User;

use App\Entity\DocumentProof;
use App\Service\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class UploadDocumentHandler
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
        private DocumentManager $documentManager,
    ) {
    }

    public function __invoke(UploadDocumentCommand $command): void
    {
        $user = $this->security->getUser();

        $file = base64_decode($command->file);
        $path = $this->documentManager->save($command->type->value, $file);

        $document = new DocumentProof(
            $user,
            $path,
            $command->type,
        );

        $this->entityManager->persist($document);
        $this->entityManager->flush();
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Domain\Command\User\UploadDocumentCommand;
use App\Enum\DocumentEnum;
use App\Repository\DocumentProofRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentProofRepository::class)]
#[ApiResource(operations: [
    new Post(
        uriTemplate: 'document-proof/upload',
        messenger: true,
        input: UploadDocumentCommand::class,
    )
])]
class DocumentProof
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'documentProofs')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\Column(length: 255)]
    private string $path;

    #[ORM\Column(enumType: DocumentEnum::class)]
    private DocumentEnum $type;

    public function __construct(
        User $user,
        string $path,
        DocumentEnum $type
    ) {
        $this->user = $user;
        $this->path = $path;
        $this->type = $type;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getType(): DocumentEnum
    {
        return $this->type;
    }
}

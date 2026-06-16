<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Api\State\Provider\InvoicesProvider;
use App\Domain\Command\User\LoginCommand;
use App\Entity\Address;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: "/login",
            messenger: true,
            input: LoginCommand::class
        ),
        new GetCollection(
            uriTemplate: "/invoices",
            provider: InvoicesProvider::class
        ),
    ]
)]
class User implements UserInterface
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private string $id;

    #[ORM\Column(unique: true)]
    private string $sub;

    #[ORM\Column(unique: true, nullable: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $familyName = null;

    #[ORM\Column]
    private ?string $givenName = null;

    #[ORM\OneToOne(mappedBy: 'user', targetEntity: Address::class, cascade: ['persist', 'remove'])]
    private ?Address $address = null;

    /**
     * @var Collection<int, DocumentProof>
     */
    #[ORM\OneToMany(targetEntity: DocumentProof::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $documentProofs;

    public function __construct(string $id)
    {
        $this->id = $id;
        $this->documentProofs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSub(): string
    {
        return $this->sub;
    }

    public function setSub(string $sub): self
    {
        $this->sub = $sub;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getGivenName(): ?string
    {
        return $this->givenName;
    }

    public function setGivenName(?string $givenName): self
    {
        $this->givenName = $givenName;
        return $this;
    }

    public function getFamilyName(): ?string
    {
        return $this->familyName;
    }

    public function setFamilyName(?string $familyName): self
    {
        $this->familyName = $familyName;
        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->sub;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @return Collection<int, DocumentProof>
     */
    public function getDocumentProofs(): Collection
    {
        return $this->documentProofs;
    }

    public function addDocumentProof(DocumentProof $documentProof): static
    {
        if (!$this->documentProofs->contains($documentProof)) {
            $this->documentProofs->add($documentProof);
            $documentProof->setUser($this);
        }

        return $this;
    }

    public function removeDocumentProof(DocumentProof $documentProof): static
    {
        if ($this->documentProofs->removeElement($documentProof)) {
            // set the owning side to null (unless already changed)
            if ($documentProof->getUser() === $this) {
                $documentProof->setUser(null);
            }
        }

        return $this;
    }
}

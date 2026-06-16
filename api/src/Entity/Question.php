<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use App\Repository\QuestionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;

#[ORM\Entity(repositoryClass: QuestionRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['text' => 'partial'])]
#[ApiResource(operations: [
    new GetCollection(
        uriTemplate: '/questions',
        normalizationContext: ['groups' => ['question:collection:read']],
    ),
    new Patch(
        uriTemplate: '/questions/{id}',
        normalizationContext: ['groups' => ['question:write']],
        denormalizationContext: ['groups' => ['question:read']],
    ),
])]
class Question implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 500)]
    #[Gedmo\Translatable]
    private string $text = '';

    #[ORM\Column]
    private bool $isFirst = false;

    #[Gedmo\Locale]
    private ?string $locale = null;

    #[ORM\OneToMany(targetEntity: Choice::class, mappedBy: 'question', cascade: ['persist', 'remove'])]
    private Collection $choices;

    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function isFirst(): bool
    {
        return $this->isFirst;
    }

    public function setIsFirst(bool $isFirst): static
    {
        $this->isFirst = $isFirst;

        return $this;
    }

    public function getChoices(): Collection
    {
        return $this->choices;
    }

    public function setTranslatableLocale(?string $locale): static
    {
        $this->locale = $locale;

        return $this;
    }
}

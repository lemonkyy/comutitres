<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\ChoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;

#[ORM\Entity(repositoryClass: ChoiceRepository::class)]
#[ApiResource(operations: [
    new Post(),
    new Patch(),
    new Delete(),
])]
class Choice implements Translatable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Gedmo\Translatable]
    private string $text = '';

    #[Gedmo\Locale]
    private ?string $locale = null;

    #[ORM\ManyToOne(targetEntity: Question::class, inversedBy: 'choices')]
    #[ORM\JoinColumn(nullable: false)]
    private Question $question;

    #[ORM\ManyToOne(targetEntity: Question::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Question $nextQuestion = null;

    #[ORM\ManyToOne(targetEntity: Pass::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Pass $recommendedPass = null;

    public function __construct(Question $question)
    {
        $this->question = $question;
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

    public function getQuestion(): Question
    {
        return $this->question;
    }

    public function getNextQuestion(): ?Question
    {
        return $this->nextQuestion;
    }

    public function setNextQuestion(?Question $nextQuestion): static
    {
        $this->nextQuestion = $nextQuestion;

        return $this;
    }

    public function getRecommendedPass(): ?Pass
    {
        return $this->recommendedPass;
    }

    public function setRecommendedPass(?Pass $pass): static
    {
        $this->recommendedPass = $pass;

        return $this;
    }

    public function setTranslatableLocale(?string $locale): static
    {
        $this->locale = $locale;

        return $this;
    }
}

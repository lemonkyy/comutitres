<?php

namespace App\Entity;

use App\Repository\PassRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;

#[ORM\Entity(repositoryClass: PassRepository::class)]
class Pass implements Translatable
{
    #[ORM\Id]
    #[ORM\Column(length: 255)]
    private string $id;

    #[ORM\Column(length: 255)]
    #[Gedmo\Translatable]
    private string $name = '';

    #[ORM\Column(length: 255)]
    #[Gedmo\Translatable]
    private string $description = '';

    #[Gedmo\Locale]
    private $locale;

    public function __construct(string $id, string $name, string $description)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function setTranslatableLocale($locale)
    {
        $this->locale = $locale;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use App\Domain\Command\Address\CreateAddressCommand;
use App\Domain\Command\Address\GetAddressCommand;
use App\Domain\Command\Address\UpdateAddressCommand;
use App\Repository\AddressRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\DepartmentEnum;
use App\Enum\RegionEnum;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/me/address',
            messenger: true,
            input: GetAddressCommand::class,
        ),
        new Post(
            uriTemplate: '/me/address',
            messenger: true,
            input: CreateAddressCommand::class,
        ),
        new Put(
            uriTemplate: '/me/address',
            messenger: true,
            input: UpdateAddressCommand::class,
        ),
    ]
)]
class Address
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $street = null;

    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    private ?string $postalCode = null;

    #[ORM\Column(length: 255)]
    private ?RegionEnum $region = null;

    #[ORM\Column(length: 255)]
    private ?DepartmentEnum $department = null;

    #[ORM\OneToOne(inversedBy: 'address')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): static
    {
        $this->street = $street;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setPostalCode(string $postalCode): static
    {
        $this->postalCode = $postalCode;

        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getRegion(): RegionEnum
    {
        return $this->region;
    }

    public function setRegion(RegionEnum $region): static
    {
        $this->region = $region;

        return $this;
    }

    public function getDepartment(): DepartmentEnum
    {
        return $this->department;
    }

    public function setDepartment(DepartmentEnum $department): static
    {
        $this->department = $department;

        return $this;
    }
}

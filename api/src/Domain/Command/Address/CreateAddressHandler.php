<?php

declare(strict_types=1);

namespace App\Domain\Command\Address;

use App\Entity\Address;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class CreateAddressHandler
{
    public function __construct(private EntityManagerInterface $entityManager, private Security $security) {}

    public function __invoke(CreateAddressCommand $command): Address
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \LogicException('User must be authenticated to create an address.');
        }

        $address = new Address();

        $address->setStreet($command->street);
        $address->setCity($command->city);
        $address->setPostalCode($command->postalCode);
        $address->setRegion($command->region);
        $address->setDepartment($command->department);
        $address->setUser($user);

        $this->entityManager->persist($address);
        $this->entityManager->flush();

        return $address;
    }
}

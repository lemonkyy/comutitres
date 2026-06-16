<?php

declare(strict_types=1);

namespace App\Domain\Command\Address;

use App\Entity\Address;
use App\Entity\User;
use App\Repository\AddressRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateAddressHandler
{
    public function __construct(private EntityManagerInterface $entityManager, private AddressRepository $addressRepository, private Security $security) {}

    public function __invoke(UpdateAddressCommand $command): Address
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \LogicException('User must be authenticated to update their address.');
        }

        $address = $this->addressRepository->findOneBy([
            'user' => $user
        ]);

        if (!$address) {
            throw new NotFoundHttpException('User address not found.');
        }        

        $address->setStreet($command->street);
        $address->setCity($command->city);
        $address->setPostalCode($command->postalCode);
        $address->setRegion($command->region);
        $address->setDepartment($command->department);

        $this->entityManager->flush();

        return $address;
    }
}

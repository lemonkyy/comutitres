<?php

declare(strict_types=1);

namespace App\Domain\Command\Address;

use App\Entity\Address;
use App\Entity\User;
use App\Repository\AddressRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GetAddressHandler
{
    public function __construct(private AddressRepository $addressRepository, private Security $security) {}

    public function __invoke(GetAddressCommand $_): Address
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \LogicException('User must be authenticated to access their address.');
        }

        return $this->addressRepository->findOneBy([
            'user' => $user
        ]);
    }
}

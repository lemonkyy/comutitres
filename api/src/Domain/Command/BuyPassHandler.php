<?php

declare(strict_types=1);

namespace App\Domain\Command;

use App\Service\StripeBridge;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class BuyPassHandler
{
    public function __construct(
        private StripeBridge $stripeBridge,
        private Security $security,
    ) {
    }

    public function __invoke(BuyPassCommand $command): string
    {
        /** @var \App\Entity\User $user */
        $user = $this->security->getUser();

        //@todo récupérer si subscription ou one time
        $url = $this->stripeBridge->startPayment($command->priceId, $user->getEmail(), true);

        return $url;
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Command;

use App\Service\StripeBridge;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class BuyPassHandler
{
    public function __construct(
        private StripeBridge $stripeBridge,
    ) {
    }

    public function __invoke(BuyPassCommand $command): string
    {
        //@todo récupérer si subscription ou one time
        $url = $this->stripeBridge->startPayment($command->priceId, true);

        return $url;
    }
}

<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Service\StripeBridge;

final class ListPassProvider implements ProviderInterface
{
    public function __construct(
        private StripeBridge $stripeBridge,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        return $this->stripeBridge->getAllProducts();
    }
}

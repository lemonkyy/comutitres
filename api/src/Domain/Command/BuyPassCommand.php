<?php

declare(strict_types=1);

namespace App\Domain\Command;

use App\Api\Serializer\CurrentResourceAwareInterface;

final readonly class BuyPassCommand implements CurrentResourceAwareInterface
{
    private string $pass;

    public function __construct(
        public string $priceId,
    ) {
    }

    public function setCurrentResource(string $resource): void
    {
        $this->pass = $resource;
    }

    public function getCurrentResource(): string
    {
        return $this->pass;
    }
}

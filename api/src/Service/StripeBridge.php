<?php

declare(strict_types=1);

namespace App\Service;

use Stripe\StripeClient;

final class StripeBridge
{
    public function __construct(
        private StripeClient $client,
    ) {}

    public function getAllProducts(): array
    {
        return $this->client->products->all()->toArray();
    }
}

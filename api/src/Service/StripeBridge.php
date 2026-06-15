<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\Price;
use Stripe\Product;
use Stripe\StripeClient;

final class StripeBridge
{
    public function __construct(
        private StripeClient $client,
    ) {}

    public function getAllProducts(): array
    {
        return $this->client->products->all([
            'expand' => ['data.default_price'],
        ])->data;
    }

    public function getProduct(string $id): ?Product
    {
        try {
            return $this->client->products->retrieve($id, [
                'expand' => ['default_price'],
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return null;
        }
    }
}

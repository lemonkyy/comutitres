<?php

declare(strict_types=1);

namespace App\Service;

use Stripe\Product;
use Stripe\StripeClient;

final class StripeBridge
{
    public function __construct(
        private StripeClient $client,
        private string $frontUrl,
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

    public function startPayment(string $priceId, bool $isSubscription = false): string
    {
        $session = $this->client->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price' => $priceId,
                    'quantity' => 1, // @avoir
                ],
            ],
            'mode' => $isSubscription ? 'subscription' : 'payment',
            'success_url' => $this->frontUrl.'/payment-success',
            'cancel_url' => $this->frontUrl.'/payment-cancel',
        ]);

        return $session->url;
    }
}

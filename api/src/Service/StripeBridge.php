<?php

declare(strict_types=1);

namespace App\Service;

use Stripe\Checkout\Session;
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

    public function startPayment(string $priceId, string $email, bool $isSubscription = false): string
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
            'customer_email' => $email, // @avoir
            'success_url' => $this->frontUrl.'/payment-success',
            'cancel_url' => $this->frontUrl.'/payment-cancel',
        ]);

        return $session->url;
    }

    public function getAllPurchases(string $email): array
    {
        $sessions = $this->client->checkout->sessions->all([
            'customer_details' => ['email' => $email],
            'status' => 'complete',
            'limit' => 100,
        ]);

        return $sessions->data;
    }

    public function getProductFromSession(Session $session): string
    {
        $product = $this->client->checkout->sessions->allLineItems($session->id, [
            'limit' => 1,
            'expand' => ['data.price.product'],
        ]);

        return $product->data[0]->price->product->id;
    }

    public function getInvoice(string $invoiceId): ?\Stripe\Invoice
    {
        try {
            return $this->client->invoices->retrieve($invoiceId);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return null;
        }
    }
}

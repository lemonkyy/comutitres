<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Pass as EntityPass;
use App\Model\Pass;
use App\Model\Price;
use App\Repository\PassRepository;
use Stripe\Product;

final class PassProvider
{
    private array $passesCacheMap = [];

    public function __construct(
        private StripeBridge $stripeBridge,
        private PassRepository $passRepository,
    ) {
    }

    public function getAllPasses(?string $name = null): array
    {
        $this->passesCacheMap = array_reduce($this->passRepository->findAll(),
            fn(array $map, EntityPass $pass) => $map + [$pass->getId() => $pass],
            []
        );

        $passes = array_map($this->createPassFromProduct(...), $this->stripeBridge->getAllProducts());

        if ($name !== null) {
            $passes = array_values(array_filter(
                $passes,
                fn(Pass $pass) => str_contains(strtolower($pass->name), strtolower($name))
            ));
        }

        return $passes;
    }

    public function updatePass(string $id, string $name, string $description, ?int $price): void
    {
        $pass = $this->getPassFromId($id);
        $pass->setName($name);
        $pass->setDescription($description);
        $this->passRepository->save($pass, false);

        if ($price !== null) {
            // Update the price in Stripe
            // @todo
            // $this->stripeBridge->updateProductPrice($id, $price);
        }
    }

    private function createPassFromProduct(Product $product): Pass
    {
        $pass = $this->getPassFromId($product->id);

        return new Pass(
            id: $product['id'],
            name: $pass->getName(),
            description: $pass->getDescription(),
            prices: [new Price(
                id: $product['default_price']['id'],
                amount: $product['default_price']['unit_amount'] ?? 0,
            )],
        );
    }

    private function getPassFromId(string $id): EntityPass
    {
        return $this->passesCacheMap[$id] ?? $this->passRepository->find($id) ?? $this->handleNewPass($id);
    }

    private function handleNewPass(string $id): EntityPass
    {
        $product = $this->stripeBridge->getProduct($id);

        if (!$product) {
            throw new \RuntimeException(sprintf('Product with ID %s not found in Stripe.', $id));
        }

        $pass = new EntityPass(
            id: $product['id'],
            name: $product['name'],
            description: $product['description'] ?? '',
        );
        $this->passRepository->save($pass);
        $this->passesCacheMap[$id] = $pass;

        return $pass;
    }
}

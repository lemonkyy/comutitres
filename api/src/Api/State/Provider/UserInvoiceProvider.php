<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Model\Purchase;
use App\Repository\UserRepository;
use App\Service\PassProvider;
use App\Service\StripeBridge;

class UserInvoiceProvider implements ProviderInterface
{
    public function __construct(
        private StripeBridge $stripeBridge,
        private UserRepository $userRepository,
        private PassProvider $passProvider,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $filter = $context['filters']['pass'] ?? null;
        $id = $uriVariables['id'];
        $user = $this->userRepository->find($id);

        $sessions = $this->stripeBridge->getAllPurchases($user->getEmail());

        $purchases = [];

        foreach ($sessions as $session) {
            $purchase = new Purchase(
                $session->id,
                $session->amount_total / 100,
                (new \DateTimeImmutable())->setTimestamp($session->created),
                $pass = $this->passProvider->getPass($this->stripeBridge->getProductFromSession($session)),
                $session->invoice,
            );

            if (!$filter || $filter === $pass->id) {
                $purchases[] = $purchase;
            }
        }

        return $purchases;
    }
}

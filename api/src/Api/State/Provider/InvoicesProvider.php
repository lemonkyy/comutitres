<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Model\Purchase;
use App\Service\PassProvider;
use App\Service\StripeBridge;
use Symfony\Bundle\SecurityBundle\Security;

final class InvoicesProvider implements ProviderInterface
{
    public function __construct(
        private StripeBridge $stripeBridge,
        private PassProvider $passProvider,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $filter = $context['filters']['paf'] ?? null;

        /** @var User $user */
        $user = $this->security->getUser();

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

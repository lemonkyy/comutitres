<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\PassProvider;
use App\Service\StripeBridge;
use Symfony\Bundle\SecurityBundle\Security;

class InvoicesProvider extends UserInvoiceProvider
{
    public function __construct(
        private StripeBridge $stripeBridge,
        private PassProvider $passProvider,
        private UserRepository $userRepository,
        private Security $security,
    ) {
        parent::__construct($stripeBridge, $userRepository, $passProvider);
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $filter = $context['filters']['pass'] ?? null;

        /** @var User $user */
        $user = $this->security->getUser();

        return parent::provide($operation, ['id' => $user->getId()], $context);
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Command\User;

use App\Service\AuthService;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class LoginHandler
{
    public function __construct(
        private RequestStack $requestStack,
        private AuthService $authService,
    ) {}

    public function __invoke(LoginCommand $command): ?string
    {
        return $this->authService->authenticate($command->email, $command->password);
    }
}

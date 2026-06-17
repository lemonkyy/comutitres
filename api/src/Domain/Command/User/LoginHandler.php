<?php

declare(strict_types=1);

namespace App\Domain\Command\User;

use App\Service\AuthService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class LoginHandler
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function __invoke(LoginCommand $command)
    {
        return
            $this->authService->authenticate($command->email, $command->password);
    }
}

class LoginResponse
{
    public function __construct(
        public string $token,
    ) {}
}

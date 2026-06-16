<?php

declare(strict_types=1);

namespace App\Domain\Command\User;

final class LoginCommand
{
    public function __construct(
        public string $email,
        public string $password
    ) {}
}

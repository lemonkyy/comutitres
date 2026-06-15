<?php

declare(strict_types=1);

namespace App\Domain\Command;

final readonly class UpdateProductCommand
{
    public function __construct(
        public string $name,
        public string $description,
        public ?int $price = null,
    ) {
    }
}

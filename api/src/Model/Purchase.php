<?php

declare(strict_types=1);

namespace App\Model;

final readonly class Purchase
{
    public function __construct(
        public string $id,
        public int $total,
        public \DateTimeImmutable $createdAt,
        public Pass $pass,
    ) {
    }
}

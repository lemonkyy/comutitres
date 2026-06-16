<?php

declare(strict_types=1);

namespace App\Api\Serializer;

interface CurrentResourceAwareInterface
{
    public function setCurrentResource(string $resource): void;

    public function getCurrentResource(): string;
}

<?php

declare(strict_types=1);

namespace App\Api\Serializer;

trait CurrentResourceAwareTrait
{
    private string $id;

    public function setCurrentResource(string $resource): void
    {
        $this->id = $resource;
    }

    public function getCurrentResource(): string
    {
        return $this->id;
    }
}

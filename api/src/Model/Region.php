<?php

declare(strict_types=1);

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\Provider\RegionProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/regions',
            provider: RegionProvider::class
        )
    ]
)]
final readonly class Region
{
    public function __construct(
        public string $value,
        public string $label
    ) {}
}

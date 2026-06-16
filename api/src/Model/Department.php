<?php

declare(strict_types=1);

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\Provider\DepartmentProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/departments',
            provider: DepartmentProvider::class
        )
    ]
)]
final readonly class Department
{
    public function __construct(
        public string $value,
        public string $label
    ) {}
}

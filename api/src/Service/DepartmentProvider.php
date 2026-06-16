<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\Department;
use App\Enum\DepartmentEnum;

final class DepartmentProvider
{
    public function provide(): array
    {
        return array_map(
            fn (DepartmentEnum $department) => new Department(
                $department->value,
                $department->label()
            ),
            DepartmentEnum::cases()
        );
    }
}

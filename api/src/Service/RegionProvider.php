<?php

declare(strict_types=1);

namespace App\Service;

use App\Model\Region;
use App\Enum\RegionEnum;

final class RegionProvider
{
    public function provide(): array
    {
        return array_map(
            fn (RegionEnum $region) => new Region(
                $region->value,
                $region->label()
            ),
            RegionEnum::cases()
        );
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Command\Address;

use App\Enum\DepartmentEnum;
use App\Enum\RegionEnum;

class UpdateAddressCommand
{
    public function __construct(public string $street, public string $city, public string $country, public string $postalCode, public RegionEnum $region, public DepartmentEnum $department) {}
}

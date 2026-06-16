<?php

declare(strict_types=1);

namespace App\Enum;

enum DocumentProofStatus: string
{
    case MISSING = 'missing';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}

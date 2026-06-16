<?php

declare(strict_types=1);

namespace App\Domain\Command\Admin;

use App\Api\Serializer\CurrentResourceAwareInterface;
use App\Api\Serializer\CurrentResourceAwareTrait;
use App\Enum\DocumentProofStatus;

final class UpdateDocumentStatusCommand implements CurrentResourceAwareInterface
{
    use CurrentResourceAwareTrait;

    public function __construct(
        public DocumentProofStatus $status,
    ) {
    }
}

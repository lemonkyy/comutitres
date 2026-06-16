<?php

declare(strict_types=1);

namespace App\Domain\Command\User;

use App\Enum\DocumentEnum;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final readonly class UploadDocumentCommand
{
    public function __construct(
        public DocumentEnum $type,
        public string $file,
    ) {
    }
}

<?php

declare(strict_types=1);

namespace App\Service;

final class DocumentManager
{
    public function __construct(
        private string $directory,
    ) {
    }

    public function save(string $fileName, string $content): string
    {
        $fullPath = $this->getFullPath($fileName);

        file_put_contents($fullPath, $content);

        return $fullPath;
    }

    private function getFullPath(string $file): string
    {
        return \sprintf('%s/%s', $this->directory, $file);
    }
}

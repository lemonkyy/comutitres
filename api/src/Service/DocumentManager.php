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

    public function getDocumentContent(string $fileName): string
    {
        $fullPath = $this->getFullPath($fileName);

        if (!file_exists($fullPath)) {
            throw new \RuntimeException(\sprintf('File %s does not exist', $fullPath));
        }

        return file_get_contents($fullPath);
    }

    private function getFullPath(string $file): string
    {
        return \sprintf('%s/%s', $this->directory, $file);
    }
}

<?php

namespace App\Domain\Command;

final readonly class CreateQuestionCommand
{
    public function __construct(
        public string $text,
        public bool $isFirst = false,
        public ?string $questionType = null,
        public array $choices = [],
    ) {
    }
}

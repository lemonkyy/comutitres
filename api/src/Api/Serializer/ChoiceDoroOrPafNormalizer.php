<?php

namespace App\Api\Serializer;

use App\Entity\Choice;
use App\Entity\Pass;
use App\Entity\Question;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ChoiceDoroOrPafNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'choice_doro_or_paf_already_called';

    /**
     * @param Choice $data
     *
     * @return mixed[]
     */
    public function normalize(mixed $data, ?string $format = null, array $context = []): array
    {
        $context[self::ALREADY_CALLED] = true;

        $normalized = $this->normalizer->normalize($data, $format, $context);
        if (!\is_array($normalized)) {
            throw new \LogicException('Normalizer should return an array.');
        }

        if (!$data instanceof Choice) {
            throw new \LogicException('Data should be an instance of Choice.');
        }

        $normalized['recommendedPass'] = $this->normalizePass($data->getRecommendedPass());
        $normalized['nextQuestion'] = $this->normalizeNextQuestion($data->getNextQuestion());

        return $normalized;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return
            $data instanceof Choice
                && !(isset($context[self::ALREADY_CALLED]) && $context[self::ALREADY_CALLED])
                && ($context['call_paf_san'] ?? false);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Choice::class => false];
    }

    private function normalizePass(?Pass $pass): ?array
    {
        if (!$pass) {
            return null;
        }

        return [
            'id' => $pass->getId(),
            'text' => $pass->getName(),
        ];
    }

    private function normalizeNextQuestion(?Question $question): ?array
    {
        if (!$question) {
            return null;
        }

        return [
            'id' => $question->getId(),
            'text' => $question->getText(),
        ];
    }
}

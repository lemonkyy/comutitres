<?php

declare(strict_types=1);

namespace App\Api\Serializer;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

final class CurrentResourceDenormalizer implements DenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    public function __construct(
        private RequestStack $requestStack
    ) {
    }

    private const ALREADY_CALLED = 'current_resource_denormalizer_already_called';

    public function denormalize(mixed $data, string $type, ?string $format = null, array $context = []): mixed
    {
        /** @var CurrentResourceAwareInterface $object */
        $object = $this->denormalizer->denormalize($data, $type, $format, $context + [self::ALREADY_CALLED => true]);

        if (!$id = $this->requestStack->getCurrentRequest()->attributes->get('_route_params')['id']) {
            throw new NotFoundHttpException();
        }

        $object->setCurrentResource($id);

        return $object;
    }

    /**
     * @param array<string, mixed> $context
     */
    public function supportsDenormalization(mixed $data, string $type, ?string $format = null, array $context = []): bool
    {
        return is_subclass_of($type, CurrentResourceAwareInterface::class) && false === ($context[self::ALREADY_CALLED] ?? false);
    }

    /**
     * @return array<string, bool|null>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            CurrentResourceAwareInterface::class => false,
        ];
    }
}

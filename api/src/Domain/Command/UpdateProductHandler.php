<?php

declare(strict_types=1);

namespace App\Domain\Command;

use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use App\Service\PassProvider;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class UpdateProductHandler
{
    public function __construct(
        private PassProvider $passProvider,
        private RequestStack $requestStack,
    ) {
    }

    public function __invoke(UpdateProductCommand $command): void
    {
        /** @var string $id */
        $id = $this->requestStack->getCurrentRequest()->attributes->get('_route_params')['id'];

        $this->passProvider->updatePass(
            id: $id,
            name: $command->name,
            description: $command->description,
            price: $command->price,
        );
    }
}

<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Gedmo\Translatable\TranslatableListener;

final class SetLocaleSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private TranslatableListener $translatableListener,
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.request' => 'configureTranslatableListener',
        ];
    }

    public function configureTranslatableListener(RequestEvent $event): void
    {
        $this->translatableListener->setTranslatableLocale($event->getRequest()->getLocale());
    }
}

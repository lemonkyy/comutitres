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
        $request = $event->getRequest();
        if ('GET' !== $request->getMethod() && $request->headers->has('Content-Language')) {
            $request->setLocale($request->headers->get('Content-Language'));
        } elseif ('GET' === $request->getMethod() && $request->headers->has('Accept-Language')) {
            $request->setLocale($request->headers->get('Accept-Language'));
        }

        $this->translatableListener->setTranslatableLocale($request->getLocale());
    }
}

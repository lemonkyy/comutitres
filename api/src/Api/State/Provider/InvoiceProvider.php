<?php

declare(strict_types=1);

namespace App\Api\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Service\StripeBridge;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;

final class InvoiceProvider implements ProviderInterface
{
    public function __construct(
        private StripeBridge $stripeBridge,
        private RequestStack $stack,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $request = $this->stack->getCurrentRequest();
        $id = $request->attributes->get('_route_params')['id'];

        $url = $this->stripeBridge->getInvoice($id);

        $r = new Response(file_get_contents($url->invoice_pdf));
        $r->headers->set('Content-Type', 'application/pdf');

        return $r;
    }
}

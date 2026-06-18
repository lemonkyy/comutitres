<?php

namespace App\DataFixtures;

use App\Entity\Pass;
use App\Entity\User;
use App\Service\StripeBridge;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    private const LOCALES = ['fr', 'en'];

    public function __construct(
        private StripeBridge $stripeBridge,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // PASS
        foreach ($this->stripeBridge->getAllProducts() as $product) {
            $entity = new Pass(
                $product->id,
                $product->name,
                $product->description ?? '',
            );

            foreach (self::LOCALES as $locale) {
                $entity->setTranslatableLocale($locale);
                $entity->setName($product->name.' ('.$locale.')');
                $entity->setDescription(($product->description ?? '').' ('.$locale.')');
            }

            $manager->persist($entity);
        }

        $admin = new User('admin_zebi');
        $admin->setEmail('admin@comutitres.fr')
            ->setRoles(['ROLE_ADMIN'])
            ->setSub('admin_sub')
            ->setGivenName('Admin')
            ->setFamilyName('Admin')
        ;
        $manager->persist($admin);

        $manager->flush();
    }
}

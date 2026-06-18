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

    public const PASS_REFERENCE_PREFIX = 'pass_';

    public function __construct(
        private StripeBridge $stripeBridge,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
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

            $this->addReference(self::PASS_REFERENCE_PREFIX.$product->name, $entity);
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

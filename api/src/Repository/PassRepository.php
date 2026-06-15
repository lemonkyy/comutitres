<?php

namespace App\Repository;

use App\Entity\Pass;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Pass>
 */
class PassRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pass::class);
    }

    public function save(Pass $entity, bool $persist = true): void
    {
        if ($persist) {
            $this->getEntityManager()->persist($entity);
        }

        $this->getEntityManager()->flush();
    }
}

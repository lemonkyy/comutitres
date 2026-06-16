<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

final class AuthService
{
    private static $users = [
        'jean.dupont@example.com' => [
            'id' => 1,
            'email' => 'jean.dupont@example.com',
            'password' => 'pass',
            'sub' => 'user-1',
            'givenName' => 'Jean',
            'familyName' => 'Dupont'
        ],
        'alice.martin@example.com' => [
            'id' => 2,
            'email' => 'alice.martin@example.com',
            'password' => 'pass',
            'sub' => 'user-2',
            'givenName' => 'Alice',
            'familyName' => 'Martin'
        ],
        'bob.lefevre@example.com' => [
            'id' => 3,
            'email' => 'bob.lefevre@example.com',
            'password' => 'pass',
            'sub' => 'user-3',
            'givenName' => 'Bob',
            'familyName' => 'Lefevre'
        ],
        'emma.durand@example.com' => [
            'id' => 4,
            'email' => 'emma.durand@example.com',
            'password' => 'pass',
            'sub' => 'user-4',
            'givenName' => 'Emma',
            'familyName' => 'Durand'
        ]
    ];

    public function __construct(private JWTTokenManagerInterface $jwtTokenManager, private EntityManagerInterface $entityManager, private UserRepository $userRepository) {}

    public function authenticate(string $email, string $password): ?string
    {
        $userData = self::$users[$email] ?? null;

        if (!$userData || $userData['password'] !== $password) {
            return null;
        }

        $user = $this->userRepository->findOneBy([
            'sub' => $userData['sub']
        ]);

        if (!$user) {
            $user = new User();
            $user->setSub($userData['sub']);
            $user->setEmail($userData['email']);
            $user->setGivenName($userData['givenName']);
            $user->setFamilyName($userData['familyName']);
            $user->setRoles(['ROLE_USER']);

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        return $this->jwtTokenManager->create($user);
    }
}

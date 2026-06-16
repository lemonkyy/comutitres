<?php

declare(strict_types=1);

namespace App\Enum;

enum DocumentEnum: string
{
    case PASS_PHOTO = 'identity_photo'; // photo d'identité
    case SCHOOL_CERTIFICATE = 'school_certificate'; // certificat de scolarité
    case GRANT_CERTIFICATE = 'grant_certificate'; // attestation de bourse
    case PROOF_OF_RESIDENCE = 'proof_of_residence'; // justificatif de domicile
}

<?php

namespace App\Enum;

enum QuestionTypeEnum: string
{
    case IMAGINE_R_JUNIOR = 'imagine_r_junior';
    case IMAGINE_R_SCOLAIRE = 'imagine_r_scolaire';
    case IMAGINE_R_ETUDIANT = 'imagine_r_etudiant';
    case NAVIGO = 'navigo';
    case SENIOR = 'senior';
}

<?php

namespace App\Enum;

enum RegionEnum: string
{
    case OUTSIDE_FRANCE = 'outside_france';
    case AUVERGNE_RHONE_ALPES = 'auvergne_rhone_alpes';
    case BOURGOGNE_FRANCHE_COMTE = 'bourgogne_franche_comte';
    case BRETAGNE = 'bretagne';
    case CENTRE_VAL_DE_LOIRE = 'centre_val_de_loire';
    case CORSE = 'corse';
    case GRAND_EST = 'grand_est';
    case HAUTS_DE_FRANCE = 'hauts_de_france';
    case ILE_DE_FRANCE = 'ile_de_france';
    case NORMANDIE = 'normandie';
    case NOUVELLE_AQUITAINE = 'nouvelle_aquitaine';
    case OCCITANIE = 'occitanie';
    case PAYS_DE_LA_LOIRE = 'pays_de_la_loire';
    case PROVENCE_ALPES_COTE_D_AZUR = 'provence_alpes_cote_d_azur';

    public function label(): string
    {
        return match ($this) {
            self::OUTSIDE_FRANCE => 'Hors de France',

            self::AUVERGNE_RHONE_ALPES => 'Auvergne-Rhône-Alpes',
            self::BOURGOGNE_FRANCHE_COMTE => 'Bourgogne-Franche-Comté',
            self::BRETAGNE => 'Bretagne',
            self::CENTRE_VAL_DE_LOIRE => 'Centre-Val de Loire',
            self::CORSE => 'Corse',
            self::GRAND_EST => 'Grand Est',
            self::HAUTS_DE_FRANCE => 'Hauts-de-France',
            self::ILE_DE_FRANCE => 'Île-de-France',
            self::NORMANDIE => 'Normandie',
            self::NOUVELLE_AQUITAINE => 'Nouvelle-Aquitaine',
            self::OCCITANIE => 'Occitanie',
            self::PAYS_DE_LA_LOIRE => 'Pays de la Loire',
            self::PROVENCE_ALPES_COTE_D_AZUR => 'Provence-Alpes-Côte d’Azur',
        };
    }
}

<?php

namespace App\Enum;

enum DepartmentEnum: string
{
    case OUTSIDE_FRANCE = 'outside_france';

    case AIN = '01';
    case ALLIER = '03';
    case ARDECHE = '07';
    case CANTAL = '15';
    case DROME = '26';
    case ISERE = '38';
    case LOIRE = '42';
    case HAUTE_LOIRE = '43';
    case PUY_DE_DOME = '63';
    case RHONE = '69';
    case SAVOIE = '73';
    case HAUTE_SAVOIE = '74';

    case COTE_D_OR = '21';
    case DOUBS = '25';
    case JURA = '39';
    case NIEVRE = '58';
    case HAUTE_SAONE = '70';
    case SAONE_ET_LOIRE = '71';
    case YONNE = '89';
    case TERRITOIRE_DE_BELFORT = '90';

    case COTES_D_ARMOR = '22';
    case FINISTERE = '29';
    case ILLE_ET_VILAINE = '35';
    case MORBIHAN = '56';

    case CHER = '18';
    case EURE_ET_LOIR = '28';
    case INDRE = '36';
    case INDRE_ET_LOIRE = '37';
    case LOIR_ET_CHER = '41';
    case LOIRET = '45';

    case CORSE_DU_SUD = '2A';
    case HAUTE_CORSE = '2B';

    case ARDENNES = '08';
    case AUBE = '10';
    case MARNE = '51';
    case HAUTE_MARNE = '52';
    case MEURTHE_ET_MOSELLE = '54';
    case MEUSE = '55';
    case MOSELLE = '57';
    case BAS_RHIN = '67';
    case HAUT_RHIN = '68';
    case VOSGES = '88';

    case AISNE = '02';
    case NORD = '59';
    case OISE = '60';
    case PAS_DE_CALAIS = '62';
    case SOMME = '80';

    case PARIS = '75';
    case SEINE_ET_MARNE = '77';
    case YVELINES = '78';
    case ESSONNE = '91';
    case HAUTS_DE_SEINE = '92';
    case SEINE_SAINT_DENIS = '93';
    case VAL_DE_MARNE = '94';
    case VAL_D_OISE = '95';

    case CALVADOS = '14';
    case EURE = '27';
    case MANCHE = '50';
    case ORNE = '61';
    case SEINE_MARITIME = '76';

    case CHARENTE = '16';
    case CHARENTE_MARITIME = '17';
    case CORREZE = '19';
    case CREUSE = '23';
    case DORDOGNE = '24';
    case GIRONDE = '33';
    case LANDES = '40';
    case LOT_ET_GARONNE = '47';
    case PYRENEES_ATLANTIQUES = '64';
    case DEUX_SEVRES = '79';
    case VIENNE = '86';
    case HAUTE_VIENNE = '87';

    case ARIEGE = '09';
    case AUDE = '11';
    case AVEYRON = '12';
    case GARD = '30';
    case HAUTE_GARONNE = '31';
    case GERS = '32';
    case HERAULT = '34';
    case LOT = '46';
    case LOZERE = '48';
    case HAUTES_PYRENEES = '65';
    case PYRENEES_ORIENTALES = '66';
    case TARN = '81';
    case TARN_ET_GARONNE = '82';

    case LOIRE_ATLANTIQUE = '44';
    case MAINE_ET_LOIRE = '49';
    case MAYENNE = '53';
    case SARTHE = '72';
    case VENDEE = '85';

    case ALPES_DE_HAUTE_PROVENCE = '04';
    case HAUTES_ALPES = '05';
    case ALPES_MARITIMES = '06';
    case BOUCHES_DU_RHONE = '13';
    case VAR = '83';
    case VAUCLUSE = '84';

    public function label(): string
    {
        return match ($this) {
            self::OUTSIDE_FRANCE => 'Hors de France',

            self::AIN => 'Ain',
            self::ALLIER => 'Allier',
            self::ARDECHE => 'Ardèche',
            self::CANTAL => 'Cantal',
            self::DROME => 'Drôme',
            self::ISERE => 'Isère',
            self::LOIRE => 'Loire',
            self::HAUTE_LOIRE => 'Haute-Loire',
            self::PUY_DE_DOME => 'Puy-de-Dôme',
            self::RHONE => 'Rhône',
            self::SAVOIE => 'Savoie',
            self::HAUTE_SAVOIE => 'Haute-Savoie',

            self::COTE_D_OR => "Côte-d'Or",
            self::DOUBS => 'Doubs',
            self::JURA => 'Jura',
            self::NIEVRE => 'Nièvre',
            self::HAUTE_SAONE => 'Haute-Saône',
            self::SAONE_ET_LOIRE => 'Saône-et-Loire',
            self::YONNE => 'Yonne',
            self::TERRITOIRE_DE_BELFORT => 'Territoire de Belfort',

            self::COTES_D_ARMOR => "Côtes-d'Armor",
            self::FINISTERE => 'Finistère',
            self::ILLE_ET_VILAINE => 'Ille-et-Vilaine',
            self::MORBIHAN => 'Morbihan',

            self::CHER => 'Cher',
            self::EURE_ET_LOIR => 'Eure-et-Loir',
            self::INDRE => 'Indre',
            self::INDRE_ET_LOIRE => 'Indre-et-Loire',
            self::LOIR_ET_CHER => 'Loir-et-Cher',
            self::LOIRET => 'Loiret',

            self::CORSE_DU_SUD => 'Corse-du-Sud',
            self::HAUTE_CORSE => 'Haute-Corse',

            self::PARIS => 'Paris',
            self::SEINE_ET_MARNE => 'Seine-et-Marne',
            self::YVELINES => 'Yvelines',
            self::ESSONNE => 'Essonne',
            self::HAUTS_DE_SEINE => 'Hauts-de-Seine',
            self::SEINE_SAINT_DENIS => 'Seine-Saint-Denis',
            self::VAL_DE_MARNE => 'Val-de-Marne',
            self::VAL_D_OISE => "Val-d'Oise",

            default => str_replace('_', ' ', strtolower($this->name)),
        };
    }
}

<?php

namespace App\DataFixtures;

use App\Entity\Choice;
use App\Entity\Pass;
use App\Entity\Question;
use App\Enum\QuestionTypeEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class WorkflowFixture extends Fixture implements DependentFixtureInterface
{
    private const PASS_JUNIOR = 'Navigo imagine R Junior';
    private const PASS_SCOLAIRE = 'Navigo Imagine R scolaire';
    private const PASS_ETUDIANT = 'Navigo Imagine R etudiant';
    private const PASS_SENIOR = 'Navigo Senior';
    private const PASS_NAVIGO = 'Carte Navigo';

    public function getDependencies(): array
    {
        return [AppFixtures::class];
    }

    public function load(ObjectManager $manager): void
    {
        $questionPlace = $this->createQuestion($manager, 'Où habitez-vous principalement ?', null, true);
        $questionZone = $this->createQuestion($manager, 'Quelle zone utilisez-vous le plus souvent ?');
        $questionSituation = $this->createQuestion($manager, 'Quelle est votre situation actuelle ?');
        $questionAgeStudent = $this->createQuestion($manager, 'Quel est votre âge ?', null);
        $questionAgeScholar = $this->createQuestion($manager, 'Quel est votre âge ?', null);
        $questionScholarship = $this->createQuestion($manager, 'Avez-vous droit à une bourse ?', QuestionTypeEnum::IMAGINE_R_ETUDIANT);
        $questionHelp = $this->createQuestion($manager, 'Avez-vous droit à une aide ?', QuestionTypeEnum::NAVIGO);

        foreach (['Paris (75)', 'Petite couronne (92/93/94)', 'Grande couronne', 'Hors Île-de-France'] as $label) {
            $this->createChoice($manager, $questionPlace, $label, $questionZone);
        }

        foreach (['Zone 1-2 (Paris centre)', 'Zone 1-3', 'Zone 1-5 (Tout Paris)', 'Pas sûr-e'] as $label) {
            $this->createChoice($manager, $questionZone, $label, $questionSituation);
        }

        $this->createChoice($manager, $questionSituation, 'Étudiant·e', $questionScholarship);
        $this->createChoice($manager, $questionSituation, 'Lycéen·ne / Collégien·ne', $questionAgeScholar);
        $this->createChoice($manager, $questionSituation, 'Salarié·e', $questionHelp);
        $this->createChoice($manager, $questionSituation, "Demandeur d'emploi", $questionHelp);
        $this->createChoice($manager, $questionSituation, 'Senior (60+)', null, $this->pass(self::PASS_SENIOR));

        $this->createChoice($manager, $questionScholarship, 'Oui (CROUS)', $questionAgeStudent);
        $this->createChoice($manager, $questionScholarship, 'Non', $questionAgeStudent);

        $this->createChoice($manager, $questionHelp, 'Oui (CAF ou autre)', null, $this->pass(self::PASS_NAVIGO));
        $this->createChoice($manager, $questionHelp, 'Non', null, $this->pass(self::PASS_NAVIGO));

        $this->createChoice($manager, $questionAgeStudent, 'Moins de 16 ans', null, $this->pass(self::PASS_ETUDIANT));
        $this->createChoice($manager, $questionAgeStudent, '16 à 25 ans', null, $this->pass(self::PASS_ETUDIANT));
        $this->createChoice($manager, $questionAgeStudent, '26 à 59 ans', null, $this->pass(self::PASS_NAVIGO));
        $this->createChoice($manager, $questionAgeStudent, '60 ans et plus', null, $this->pass(self::PASS_SENIOR));

        $this->createChoice($manager, $questionAgeScholar, 'Moins de 11 ans', null, $this->pass(self::PASS_JUNIOR));
        $this->createChoice($manager, $questionAgeScholar, '11 à 18 ans', null, $this->pass(self::PASS_SCOLAIRE));

        $manager->flush();
    }

    private function createQuestion(ObjectManager $manager, string $text, ?QuestionTypeEnum $questionType = null, bool $isFirst = false): Question
    {
        $question = new Question();
        $question
            ->setText($text)
            ->setIsFirst($isFirst)
            ->setQuestionType($questionType);

        $manager->persist($question);

        return $question;
    }

    private function createChoice(
        ObjectManager $manager,
        Question $question,
        string $text,
        ?Question $nextQuestion = null,
        ?Pass $recommendedPass = null,
    ): Choice {
        $choice = new Choice($question);
        $choice
            ->setText($text)
            ->setNextQuestion($nextQuestion)
            ->setRecommendedPass($recommendedPass);

        $manager->persist($choice);

        return $choice;
    }

    private function pass(string $stripeName): Pass
    {
        return $this->getReference(AppFixtures::PASS_REFERENCE_PREFIX.$stripeName, Pass::class);
    }
}

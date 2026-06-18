<?php

namespace App\Domain\Command;

use App\Entity\Choice;
use App\Entity\Question;
use App\Enum\QuestionTypeEnum;
use App\Repository\PassRepository;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class CreateQuestionHandler
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly QuestionRepository $questionRepository,
        private readonly PassRepository $passRepository,
    ) {
    }

    public function __invoke(CreateQuestionCommand $command): Question
    {
        $question = new Question()
            ->setText($command->text)
            ->setIsFirst($command->isFirst)
            ->setQuestionType(QuestionTypeEnum::tryFrom($command->questionType));

        $this->em->persist($question);

        foreach ($command->choices as $choiceData) {
            $choice = new Choice($question)
                ->setText($choiceData['text'] ?? '');

            if (!empty($choiceData['nextQuestionId'])) {
                $nextQuestionId = $choiceData['nextQuestionId'];
                $nextQuestion = $this->questionRepository->find($nextQuestionId);
                if (null !== $nextQuestion) {
                    $choice->setNextQuestion($nextQuestion);
                }
            }

            if (!empty($choiceData['recommendedPassId'])) {
                $passId = $choiceData['recommendedPassId'];
                $pass = $this->passRepository->find($passId);
                if (null !== $pass) {
                    $choice->setRecommendedPass($pass);
                }
            }

            $this->em->persist($choice);
        }

        $this->em->flush();

        return $question;
    }
}

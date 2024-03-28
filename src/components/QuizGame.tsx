import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import questions from "../data/questions";
import { IFormInput } from "../data/answer";

export default function QuizGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [score, setScore] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      alert("Time's up for this question. Moving to next question.");
      moveToNextQuestion();
    }, 10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentQuestionIndex]);

  const moveToNextQuestion = () => {
    startTransition(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        reset();
      } else {
        alert(`Quiz completed! Your score: ${score}/${questions.length}`);
      }
    });
  };

  const onSubmit = (data: IFormInput) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (data.answer === correctAnswer) {
      alert("Correct!");
      setScore(score + 1);
    } else {
      alert(`Wrong! The correct answer was: ${correctAnswer}`);
    }

    moveToNextQuestion();
  };

  return (
    <div>
      <h2>Quiz Game</h2>
      {isPending && <div>Loading next question...</div>}
      {!isPending && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p>{questions[currentQuestionIndex].question}</p>
            {questions[currentQuestionIndex].answers.map((answer, index) => (
              <div key={index}>
                <input
                  {...register("answer", { required: true })}
                  type="radio"
                  value={answer}
                  id={answer}
                />
                <label htmlFor={answer}>{answer}</label>
              </div>
            ))}
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

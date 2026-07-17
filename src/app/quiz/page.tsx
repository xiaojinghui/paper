'use client';
import { useState, useEffect } from 'react';

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  if (questions.length === 0) return <p className="p-8">暂无题目，请先去生成题目。</p>;

  const question = questions[currentIndex];

  const handleAnswer = (ans: string) => {
    if (ans === question.answer) setScore(score + 1);
    setAnswered(true);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">练习模式 (题目 {currentIndex + 1}/{questions.length})</h1>
      <div className="border p-6 rounded shadow">
        <p className="mb-4 font-semibold">{question.stem}</p>
        {question.type === 'choice' && question.options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt.charAt(0))}
            className="block w-full text-left p-2 border my-1 hover:bg-gray-100"
          >
            {opt}
          </button>
        ))}
        {answered && (
          <div className="mt-4 p-4 bg-green-50">
            <p><strong>答案:</strong> {question.answer}</p>
            <p><strong>解析:</strong> {question.explanation}</p>
            <button 
              onClick={() => { setAnswered(false); setCurrentIndex(currentIndex + 1); }}
              className="mt-2 text-blue-600 font-bold"
            >
              下一题
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

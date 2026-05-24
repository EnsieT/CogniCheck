import { useState, useEffect } from 'react';
import { Question } from '../types';
import { generateQuestion } from '../questions';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Clock } from 'lucide-react';

interface Props {
  onComplete: (correct: number, total: number) => void;
}

export function TestRunner({ onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion());
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Allow the final state to render slightly before triggering completion
          setTimeout(() => onComplete(correct, total), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [correct, total, onComplete]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    let isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrect((p) => p + 1);
    }
    setTotal((p) => p + 1);
    
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
      setSelectedAnswer(null);
    }, 300); // 300ms delay for feedback
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-8 bg-[#1E2336]/60 border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-xl">
      <div className="flex justify-between w-full mb-8 items-center bg-black/20 p-2 pl-4 pr-4 rounded-2xl">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Time Left</span>
          <div className={cn(
            "flex items-center gap-2 font-mono text-2xl font-semibold",
            timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-emerald-400"
          )}>
            <Clock className="w-5 h-5 opacity-70" />
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Score</span>
          <div className="font-mono text-2xl font-semibold text-white">
            {correct} <span className="text-slate-500 text-lg font-normal">/ {total}</span>
          </div>
        </div>
      </div>
      
      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.2 }}
        className="w-full flex flex-col items-center min-h-[300px] justify-center"
      >
        <h2 className="text-3xl md:text-5xl font-semibold mb-12 text-white tracking-tight text-center leading-tight">
          {currentQuestion.text}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showFeedback = selectedAnswer !== null;
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback || timeLeft === 0}
                className={cn(
                  "py-5 px-6 rounded-2xl text-2xl font-semibold transition-all duration-200 border-b-4",
                  "focus:outline-none focus:ring-4 focus:ring-indigo-500/50 active:translate-y-1 active:border-b-0",
                  !showFeedback ? "bg-[#2A314A] border-[#1C2033] text-white hover:bg-[#343D5C] hover:border-[#242A42]" :
                  showFeedback && isCorrect ? "bg-emerald-500 border-emerald-700 text-white" :
                  showFeedback && isSelected && !isCorrect ? "bg-rose-500 border-rose-700 text-white" :
                  "bg-[#1A1F30] border-transparent text-white/30 opacity-50"
                )}
              >
                {option}
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  );
}

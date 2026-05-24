import { Question } from './types';

const recentQuestions: string[] = [];

const WORDS = [
  'PLANE', 'BRAIN', 'SMART', 'FOCUS', 'POWER', 'TRAIN', 'SPEED', 'LOGIC', 
  'ALERT', 'QUICK', 'THINK', 'SOLVE', 'COGNITION', 'AGILE', 'SHARP', 'AWAKE',
  'CLEAR', 'MEMORY', 'PUZZLE', 'NEURON', 'BRIGHT', 'FAST', 'SWIFT', 'RAPID',
  'STEADY', 'FORCE', 'MIGHT', 'VIGOR', 'ATTENT', 'LUCID', 'LEARN', 'STUDY'
];

export const generateQuestion = (): Question => {
  let createdQuestion: Question | null = null;
  let attempts = 0;

  do {
    const type = Math.floor(Math.random() * 4);
    
    if (type === 0) {
      // Addition & Subtraction
      const isAdd = Math.random() > 0.5;
      let a = Math.floor(Math.random() * 80) + 20; // 20 to 99
      let b = Math.floor(Math.random() * 80) + 20;
      
      if (!isAdd && a < b) {
        const temp = a;
        a = b;
        b = temp;
      }
      
      const answer = isAdd ? (a + b).toString() : (a - b).toString();
      const options = new Set([answer]);
      while (options.size < 4) {
        const wrongAnswer = isAdd ? (a + b + Math.floor(Math.random() * 30) - 15) : (a - b + Math.floor(Math.random() * 30) - 15);
        if (wrongAnswer.toString() !== answer) {
          options.add(wrongAnswer.toString());
        }
      }
      
      createdQuestion = {
        id: Math.random().toString(36).substring(7),
        text: `What is ${a} ${isAdd ? '+' : '-'} ${b}?`,
        correctAnswer: answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
      };
    } else if (type === 1) {
      // Multiplication
      const a = Math.floor(Math.random() * 15) + 3; // 3 to 17
      const b = Math.floor(Math.random() * 10) + 2; // 2 to 11
      const answer = (a * b).toString();
      const options = new Set([answer]);
      while (options.size < 4) {
        const wrongAnswer = a * b + Math.floor(Math.random() * 20) - 10;
        if (wrongAnswer.toString() !== answer) {
           options.add(wrongAnswer.toString());
        }
      }
      createdQuestion = {
        id: Math.random().toString(36).substring(7),
        text: `What is ${a} × ${b}?`,
        correctAnswer: answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
      };
    } else if (type === 2) {
      // Pattern
      const start = Math.floor(Math.random() * 15) + 2;
      const step = Math.floor(Math.random() * 10) + 2;
      const isMul = Math.random() > 0.6;
      
      let answer;
      let seq;
      let options = new Set<string>();

      if (isMul) {
        // limit step to 2 or 3 to avoid unmanageable numbers
        const mulStep = Math.floor(Math.random() * 2) + 2;
        seq = [start, start * mulStep, start * mulStep * mulStep];
        answer = (start * mulStep * mulStep * mulStep).toString();
        options.add(answer);
        while(options.size < 4) {
           const wrongAnswer = start * mulStep * mulStep * mulStep + Math.floor(Math.random() * 20) - 10;
           if (wrongAnswer.toString() !== answer) options.add(wrongAnswer.toString());
        }
      } else {
        seq = [start, start + step, start + step * 2, start + step * 3];
        answer = (start + step * 4).toString();
        options.add(answer);
        while (options.size < 4) {
          const wrongAnswer = start + step * 4 + Math.floor(Math.random() * 20) - 10;
          if (wrongAnswer.toString() !== answer) options.add(wrongAnswer.toString());
        }
      }
      
      createdQuestion = {
        id: Math.random().toString(36).substring(7),
        text: `Find the next: ${seq.join(', ')}, ...`,
        correctAnswer: answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
      };
    } else {
      // Word scramble
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      let scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
      while (scrambled === word) {
          scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
      }
      const options = new Set([word]);
      while (options.size < 4) {
          const wrongWord = WORDS[Math.floor(Math.random() * WORDS.length)];
          if (wrongWord !== word) options.add(wrongWord);
      }
      createdQuestion = {
        id: Math.random().toString(36).substring(7),
        text: `Unscramble: ${scrambled}`,
        correctAnswer: word,
        options: Array.from(options).sort(() => Math.random() - 0.5)
      };
    }
    
    attempts++;
  } while (recentQuestions.includes(createdQuestion.text) && attempts < 10);

  // Update recent questions queue
  recentQuestions.push(createdQuestion.text);
  if (recentQuestions.length > 20) {
    recentQuestions.shift();
  }

  return createdQuestion;
};

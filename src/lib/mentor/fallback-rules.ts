// Socratic Mentor Rules Engine & Contextual Feedback for Acharya AI
import { LanguagePreference, MentorMessage } from '@/types';

export interface HintRequest {
  missionId: string;
  code: string;
  errorLog?: string;
  hintTier: 1 | 2 | 3 | 4;
  language: LanguagePreference;
}

export interface HintResponse {
  message: string;
  socraticQuestion: string;
  hintTier: 1 | 2 | 3 | 4;
  isFallback: boolean;
}

export function generateSocraticGuidance(req: HintRequest): HintResponse {
  const { missionId, code, errorLog, hintTier, language } = req;
  const isRecursionMission = missionId.includes('fib') || code.includes('route_cost');

  if (isRecursionMission) {
    const hasBaseCase = code.includes('n <= 1') || code.includes('n == 0') || code.includes('n < 2');
    const hasRecursionError = errorLog?.includes('RecursionError') || !hasBaseCase;

    if (hasRecursionError) {
      if (hintTier === 1) {
        if (language === 'hi') {
          return {
            message: 'टर्मिनल का आउटपुट देखें: `RecursionError`। यह तब होता है जब कोई फ़ंक्शन बिना रुके खुद को बार-बार कॉल करता रहता है। खुद से पूछें: जब आपका वेरिएबल n शून्य (0) पर पहुंचता है, तब आपका कोड कंप्यूटर को क्या करने का निर्देश दे रहा है?',
            socraticQuestion: 'क्या आपने फ़ंक्शन के शुरू में कोई बेस कंडीशन (रुकने का नियम) लिखा है?',
            hintTier: 1,
            isFallback: true,
          };
        }
        if (language === 'hinglish') {
          return {
            message: 'Terminal ka error message dekho: `RecursionError` aa raha hai. Iska matlab function bina ruke infinite recursive calls kar raha hai. Dhyan se socho: jab `n` ghat-te hue 0 ya 1 par pahuchega, tab tumhara code rukne ke liye kya check kar raha hai?',
            socraticQuestion: 'Kya tumne code ki pehli line me base case (if n <= 1) likha hai?',
            hintTier: 1,
            isFallback: true,
          };
        }
        return {
          message: 'Observe the terminal output: `RecursionError: maximum recursion depth exceeded`. This occurs when a function calls itself infinitely without hitting a stopping rule. Ask yourself: what should the function immediately return when n is 0 or 1?',
          socraticQuestion: 'Have you specified a base case condition at the very beginning of the function?',
          hintTier: 1,
          isFallback: true,
        };
      }

      if (hintTier === 2) {
        if (language === 'hi') {
          return {
            message: 'संरचनात्मक पैटर्न: किसी भी रिकर्सिव फ़ंक्शन में दो अनिवार्य भाग होते हैं:\n1. Base Case: अगर समस्या सबसे छोटी हो गई है, तो सीधे उत्तर लौटाएं।\n2. Recursive Step: समस्या को छोटे टुकड़ों में तोड़कर खुद को कॉल करें।',
            socraticQuestion: 'यदि n <= 1 है, तो बिना किसी जोड़ के सीधे n लौटाने का प्रयास करें।',
            hintTier: 2,
            isFallback: true,
          };
        }
        if (language === 'hinglish') {
          return {
            message: 'Structural Pattern samjho: Har recursive function me 2 zaroori parts hote hain:\n1. Base Case: Jab input sabse chota ho (jaise n <= 1), seedha answer return karo.\n2. Recursive Call: Baki inputs ke liye function ko chote inputs ke sath dubara call karo.',
            socraticQuestion: 'Line 2 par condition likho: `if n <= 1: return n`. Dekho kya error gayab hota hai?',
            hintTier: 2,
            isFallback: true,
          };
        }
        return {
          message: 'Structural Pattern: Every recursive structure requires two parts:\n1. Base Case: If the input reaches the smallest boundary, return a constant value immediately.\n2. Recursive Step: Decompose the problem into sub-problems.',
          socraticQuestion: 'What happens if you place `if n <= 1: return n` at the very top of your function?',
          hintTier: 2,
          isFallback: true,
        };
      }

      if (hintTier === 3) {
        return {
          message: language === 'hinglish'
            ? 'Line-level Pinpoint: Tumhara code seedha `return route_cost(n - 1) + route_cost(n - 2)` execute kar raha hai bina n ki value check kiye. Jab n negative ho jayega, ye tab bhi chalta rahega.'
            : 'Line-level Pinpoint: Your code directly evaluates the recursive addition without first inspecting the magnitude of n. When n becomes negative, it continues indefinitely.',
          socraticQuestion: language === 'hinglish'
            ? 'Kya tum `return route_cost(...)` se pehle `if n <= 1: return n` add kar sakte ho?'
            : 'Can you insert a guard clause `if n <= 1: return n` before invoking recursive calls?',
          hintTier: 3,
          isFallback: true,
        };
      }

      // Tier 4: Parallel Analogy (Never the direct homework answer!)
      return {
        message: language === 'hinglish'
          ? 'Parallel Analogy: Ek alag example dekho — Factorial calculation:\n```python\ndef factorial(n):\n    if n <= 1:  # Base condition\n        return 1\n    return n * factorial(n - 1)  # Recursive step\n```\nNotice karo ki `if n <= 1:` call stack ko rukne ki permission deta hai. Exactly yahi logic Fibonacci me bhi lagta hai!'
          : 'Parallel Analogy: Consider calculating a factorial:\n```python\ndef factorial(n):\n    if n <= 1:  # Base condition\n        return 1\n    return n * factorial(n - 1)  # Recursive step\n```\nNotice how `if n <= 1` arrests the recursion. The exact same termination mechanism applies to Fibonacci!',
        socraticQuestion: 'How would you adapt this base case structure into your `route_cost` function?',
        hintTier: 4,
        isFallback: true,
      };
    }
  }

  // General fallback for other challenges
  return {
    message: language === 'hinglish'
      ? 'Dhyan se constraints aur input-output formats ko padho. Algorithm ko pehle rough paper par trace karo.'
      : 'Review the problem constraints and test inputs carefully. Trace the state transitions step-by-step.',
    socraticQuestion: 'What is the expected output for the simplest boundary input case?',
    hintTier: hintTier,
    isFallback: true,
  };
}

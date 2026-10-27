// Socratic Mentor Rules Engine & Contextual Feedback for Acharya AI
// Tailored for Python loops, conditional filtering, and robot navigation missions
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

  const isRescueMission = missionId.includes('rescue') || code.includes('rescue_robot');
  const isFilterMission = missionId.includes('filter') || code.includes('filter_healthy_cells');

  // =========================================================================
  // 1. PYTHON LOOPS: RESCUE THE ROBOT
  // =========================================================================
  if (isRescueMission) {
    const hasFor = /\bfor\b.*?\bin\b/.test(code);
    const hasAccumulator = code.includes('total_energy +=') || code.includes('total_energy = total_energy +');
    const hasReturn = /\breturn\s+total_energy\b/.test(code);

    if (hintTier === 1) {
      if (language === 'hi') {
        return {
          message: 'अवधारणा: कंप्यूटर को एक-एक करके हर बैटरी सेल की जांच करनी होगी। जब हमारे पास `battery_cells` नाम की लिस्ट हो, तो पायथन में प्रत्येक तत्व पर जाने के लिए कौन सा लूप प्रयोग किया जाता है?',
          socraticQuestion: 'क्या आपने `for cell in battery_cells:` सिंटैक्स का उपयोग किया है?',
          hintTier: 1,
          isFallback: true,
        };
      }
      if (language === 'hinglish') {
        return {
          message: 'Conceptual Nudge: Computer ko list ke har battery cell ko ek-ek karke count karna padega. Python me list ke har item ko visit karne ke liye `for item in list:` loop use hota hai.',
          socraticQuestion: 'Kya tumne `for cell in battery_cells:` loop likha hai?',
          hintTier: 1,
          isFallback: true,
        };
      }
      return {
        message: 'Conceptual Nudge: The computer must visit every battery cell in the sequence one by one. In Python, iteration over elements in a list is achieved with a for-in loop.',
        socraticQuestion: 'Have you structured your loop as `for cell in battery_cells:`?',
        hintTier: 1,
        isFallback: true,
      };
    }

    if (hintTier === 2) {
      if (language === 'hinglish') {
        return {
          message: 'Structural Pattern: Loop ke andar har cell ki energy ko `total_energy` variable me add karna zaroori hai. Syntax: `total_energy += cell`.',
          socraticQuestion: 'Kya tumne loop ke andar `total_energy` ko update kiya hai?',
          hintTier: 2,
          isFallback: true,
        };
      }
      return {
        message: 'Structural Pattern: Inside the indented loop block, accumulate each cell into the running total: `total_energy += cell`.',
        socraticQuestion: 'Is your accumulation statement properly indented under the for-loop?',
        hintTier: 2,
        isFallback: true,
      };
    }

    if (hintTier === 3) {
      return {
        message: language === 'hinglish'
          ? 'Line-level Pinpoint: Dhyan rakho ki `return total_energy` function ki left margin par hona chahiye, loop ke bahar. Agar ye loop ke andar hoga, toh ye pehle cell ke baad hi function terminate kar dega.'
          : 'Line-level Pinpoint: Ensure `return total_energy` is placed on the outer indentation level after the loop finishes. If indented inside the loop, the function exits after the first cell.',
        socraticQuestion: 'Is your return statement outside the loop block?',
        hintTier: 3,
        isFallback: true,
      };
    }

    // Tier 4: Parallel Analogy
    return {
      message: language === 'hinglish'
        ? 'Parallel Analogy: Ek shopping basket ka example dekho:\n```python\nbasket_total = 0\nfor price in item_prices:\n    basket_total += price\nreturn basket_total\n```\nYahi exact logic tumhare `rescue_robot` me battery cells jodne ke liye kaam karta hai!'
        : 'Parallel Analogy: Consider calculating a grocery total:\n```python\nbasket_total = 0\nfor price in item_prices:\n    basket_total += price\nreturn basket_total\n```\nThe exact same accumulator pattern calculates total battery energy!',
      socraticQuestion: 'How does your battery calculation mirror this shopping basket pattern?',
      hintTier: 4,
      isFallback: true,
    };
  }

  // =========================================================================
  // 2. CONDITIONALS & LOOPS: FILTER DAMAGED CELLS
  // =========================================================================
  if (isFilterMission) {
    if (hintTier === 1) {
      return {
        message: language === 'hinglish'
          ? 'Conceptual Nudge: Kuch battery cells me negative charge hai. Loop ke andar addition se pehle check karo: kya ye cell positive (> 0) hai?'
          : 'Conceptual Nudge: Damaged cells carry negative values. Before accumulating, check whether the cell value is strictly positive (> 0).',
        socraticQuestion: 'How do you check if a number is positive using an if-statement?',
        hintTier: 1,
        isFallback: true,
      };
    }

    return {
      message: language === 'hinglish'
        ? 'Structural Pattern: Loop ke andar conditional statement lagao:\n```python\nfor cell in battery_cells:\n    if cell > 0:\n        total_energy += cell\n```'
        : 'Structural Pattern: Combine your loop with a conditional filter:\n```python\nfor cell in battery_cells:\n    if cell > 0:\n        total_energy += cell\n```',
      socraticQuestion: 'Does your if statement prevent negative numbers from decreasing the total?',
      hintTier: hintTier,
      isFallback: true,
    };
  }

  // General Socratic fallback
  return {
    message: language === 'hinglish'
      ? 'Dhyan se constraints aur input-output formats ko padho. Har step me variable ki value kya hai use trace karo.'
      : 'Review the problem constraints and expected test outputs carefully. Trace the variable state step-by-step.',
    socraticQuestion: 'What is the expected output for the simplest boundary input case?',
    hintTier: hintTier,
    isFallback: true,
  };
}

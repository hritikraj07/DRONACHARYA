// Dronacharya Acharya AI Backend Socratic Engine
// Supports Gemini 1.5 Flash, Groq (Llama 3), OpenAI, and Deep Code Inspector fallback

import { NextRequest, NextResponse } from 'next/server';
import {
  inspectPythonCode,
  inspectWebCode,
  formatDialect,
  CodeInspectionContext,
  InspectionResult,
} from '@/lib/mentor/code-inspector';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      missionTitle = 'Coding Quest',
      missionGoal = '',
      studentCode = '',
      consoleOutputOrError = '',
      simulatorState,
      hintTier = 1,
      studentMessage = '',
      actionType = 'diagnose',
      language = 'python',
      preferredLanguage = 'en',
      conversationHistory = [],
    } = body;

    // Check for Custom API Key in headers (from user "⚙️ AI Settings" modal)
    const customKey = req.headers.get('x-custom-api-key') || '';
    const customProvider = req.headers.get('x-custom-provider') || 'auto';

    // Check environment keys
    const geminiKey = customKey && (customProvider === 'gemini' || customProvider === 'auto') ? customKey : process.env.GEMINI_API_KEY;
    const groqKey = customKey && (customProvider === 'groq' || customProvider === 'auto') ? customKey : process.env.GROQ_API_KEY;
    const openAiKey = customKey && (customProvider === 'openai' || customProvider === 'auto') ? customKey : process.env.OPENAI_API_KEY;

    // Pre-run deep code inspector so we have exact line numbers and issues ready
    const inspectCtx: CodeInspectionContext = {
      missionTitle,
      missionGoal,
      code: studentCode,
      consoleError: consoleOutputOrError,
      simulatorState,
      language,
      preferredLanguage,
      hintTier,
      studentQuery: studentMessage,
    };

    const isWeb = language === 'html' || language === 'css' || language === 'javascript';
    const localInspection: InspectionResult = isWeb ? inspectWebCode(inspectCtx) : inspectPythonCode(inspectCtx);

    // =========================================================================
    // 1. ATTEMPT REAL LLM CALL IF ANY KEY IS AVAILABLE
    // =========================================================================
    const systemPrompt = `You are Acharya AI, the revered Socratic Guru of Dronacharya ("The Digital Gurukul").
You are actively watching the student's live editor, console output, and interactive simulator.

STRICT PEDAGOGICAL INVARIANTS:
1. NEVER output the full working solution code. Never solve the homework or mission for the student.
2. Provide guidance adhering strictly to Tier ${hintTier}:
   - TIER 1 (Socratic Probe 🔍): Identify the exact Line Number (${localInspection.detectedLine || 'in their code'}) where an issue occurs and ask 1 targeted question to make the student spot their own bug.
   - TIER 2 (Conceptual Clue 🧭): Explain WHY their code behaved that way (Expected State vs. Actual State) and highlight the exact syntax construct or method to change.
   - TIER 3 (Skeleton Blueprint 🛠️): Provide a single masked 1-line skeleton with blanks (e.g. \`for step in range(___):\`).
3. Always reference the student's ACTUAL variable names and EXACT line numbers (${localInspection.detectedLine ? `Line ${localInspection.detectedLine}` : 'their written code'}).
4. Language dialect preference: ${preferredLanguage === 'hi' ? 'Hindi (Devanagari)' : preferredLanguage === 'hinglish' ? 'Conversational Indian Hinglish (e.g., "Shishya, Line 4 par dekho...")' : 'English'}.
5. Tone: Wise, encouraging, ancient Vedic master blended with modern senior computer scientist. Address student as "Apprentice" or "Shishya".`;

    const userPayloadText = `Active Mission: ${missionTitle}
Mission Goal: ${missionGoal || 'Complete the programming challenge'}
Programming Language: ${language}
Student's Current Code:
\`\`\`${language}
${studentCode || '# No code written yet'}
\`\`\`
Latest Console / Error Output:
${consoleOutputOrError || 'None reported'}
Simulator Telemetry:
${JSON.stringify(simulatorState || { status: 'idle' }, null, 2)}
Student Prompt / Question:
${studentMessage || `Please provide a Tier ${hintTier} Socratic hint for my code.`}
Detected Potential Issue on Line ${localInspection.detectedLine}: "${localInspection.lineContent}" (${localInspection.issueCategory})`;

    // Option A: Groq (Fastest inference)
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.slice(-4),
              { role: 'user', content: userPayloadText },
            ],
            temperature: 0.5,
            max_tokens: 450,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              success: true,
              data: {
                message: reply,
                socraticQuestion: localInspection.socraticQuestion,
                hintTier,
                detectedLine: localInspection.detectedLine,
                issueCategory: localInspection.issueCategory,
                isFallback: false,
                providerUsed: 'Groq (Llama 3.3 70B)',
              },
            });
          }
        }
      } catch (groqErr) {
        console.warn('Groq API call failed:', groqErr);
      }
    }

    // Option B: Gemini 1.5 Flash
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userPayloadText}` }],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              success: true,
              data: {
                message: reply,
                socraticQuestion: localInspection.socraticQuestion,
                hintTier,
                detectedLine: localInspection.detectedLine,
                issueCategory: localInspection.issueCategory,
                isFallback: false,
                providerUsed: 'Google Gemini 1.5 Flash',
              },
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed:', geminiErr);
      }
    }

    // Option C: OpenAI (gpt-4o-mini)
    if (openAiKey) {
      try {
        const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.slice(-4),
              { role: 'user', content: userPayloadText },
            ],
            temperature: 0.5,
            max_tokens: 450,
          }),
        });

        if (oaiRes.ok) {
          const oaiData = await oaiRes.json();
          const reply = oaiData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              success: true,
              data: {
                message: reply,
                socraticQuestion: localInspection.socraticQuestion,
                hintTier,
                detectedLine: localInspection.detectedLine,
                issueCategory: localInspection.issueCategory,
                isFallback: false,
                providerUsed: 'OpenAI (GPT-4o mini)',
              },
            });
          }
        }
      } catch (oaiErr) {
        console.warn('OpenAI API call failed:', oaiErr);
      }
    }

    // =========================================================================
    // 2. ZERO-KEY INTELLIGENT DEEP CODE INSPECTOR (Deterministic Fallback)
    // =========================================================================
    const formatted = formatDialect(localInspection, hintTier, preferredLanguage);

    return NextResponse.json({
      success: true,
      data: {
        message: formatted.message,
        socraticQuestion: formatted.socraticQuestion,
        hintTier,
        detectedLine: localInspection.detectedLine,
        issueCategory: localInspection.issueCategory,
        isFallback: true,
        providerUsed: 'Local Deep Code Inspector (AST)',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/acharya:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Acharya error' },
      { status: 500 }
    );
  }
}

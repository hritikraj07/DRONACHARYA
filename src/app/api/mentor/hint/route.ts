import { NextRequest, NextResponse } from 'next/server';
import { generateSocraticGuidance } from '@/lib/mentor/fallback-rules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { missionId, code, errorLog, hintTier = 1, language = 'hinglish' } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt live model invocation
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are Acharya AI, the Socratic mentor of Dronacharya.
Rules:
1. NEVER output direct homework solution code for the active mission.
2. Provide a Tier ${hintTier} hint (${hintTier === 1 ? 'Conceptual Nudge' : hintTier === 2 ? 'Structural Pattern' : hintTier === 3 ? 'Line Pinpoint' : 'Parallel Analogy'}).
3. Language preference: ${language}.
Student code:
${code}
Error:
${errorLog || 'None'}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const aiData = await response.json();
          const generatedText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              success: true,
              data: {
                message: generatedText,
                socraticQuestion: 'How does this perspective adjust your mental model?',
                hintTier,
                isFallback: false,
              },
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using Socratic rulebook:', geminiErr);
      }
    }

    // Default to deterministic, rich Socratic rulebook
    const fallbackGuidance = generateSocraticGuidance({
      missionId: missionId || 'mission-fib-labyrinth',
      code: code || '',
      errorLog: errorLog || '',
      hintTier,
      language,
    });

    return NextResponse.json({
      success: true,
      data: fallbackGuidance,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process hint request' },
      { status: 500 }
    );
  }
}

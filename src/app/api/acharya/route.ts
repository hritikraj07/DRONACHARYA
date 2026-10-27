import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are an expert interactive AI Mentor. Never give generic, textbook, or vague responses. Analyze the exact problem statement and the user's current attempt/code provided in the context. Diagnose the exact issue or knowledge gap, explain why it is happening, and provide a direct, working solution tailored specifically to this problem.

Formatting & Style Guidelines:
1. Be direct, clear, and encouraging.
2. If the user's code has a bug or syntax issue, clearly point out the exact line and explain what is causing it.
3. Always supply the exact, working code snippet inside markdown code blocks (e.g. \`\`\`python ... \`\`\`) with comments explaining the critical fix.
4. If the question asks for conceptual understanding, ground your explanation in the specific problem or simulator they are working on right now.
5. Use clean markdown with clear headings, bullet points, and code formatting so the solution is effortless to read and apply.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      missionTitle = 'Coding Quest',
      missionGoal = '',
      studentCode = '',
      consoleOutputOrError = '',
      simulatorState,
      studentMessage = '',
      language = 'python',
      conversationHistory = [],
      testResults,
    } = body;

    const customKey = req.headers.get('x-custom-api-key') || '';
    const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'GEMINI_API_KEY is not configured in your environment variables (.env.local). Please set GEMINI_API_KEY=your_key or configure it in the AI Settings dialog.',
          isConfigError: true,
        },
        { status: 401 }
      );
    }

    const contextBlock = `--- ACTIVE WORKSPACE CONTEXT ---
Active Topic / Mission: ${missionTitle}
Exact Problem Statement: ${missionGoal || 'Complete the programming challenge'}
Language: ${language}
User's Current Code / Attempt:
\`\`\`${language}
${studentCode || '# No code written yet'}
\`\`\`
Latest Console / Error Output:
${consoleOutputOrError || 'None reported'}
Simulator Telemetry / Parameters:
${JSON.stringify(simulatorState || { status: 'idle' }, null, 2)}
${testResults ? `Test Results: ${JSON.stringify(testResults)}` : ''}
--- END CONTEXT ---`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    const recentHistory = (conversationHistory || []).slice(-10);
    for (const h of recentHistory) {
      const role = h.role === 'assistant' ? 'model' : h.role;
      contents.push({
        role: role as 'user' | 'model',
        parts: [{ text: h.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `${contextBlock}

User Message / Inquiry:
${studentMessage || 'Please analyze my current code, diagnose any errors or incomplete logic, and provide the exact working solution.'}`,
        },
      ],
    });

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const reply = response.text || 'I analyzed your problem, but could not produce a text response.';

    return NextResponse.json({
      success: true,
      data: {
        message: reply,
        isFallback: false,
        providerUsed: 'Google Gemini 2.5 Flash',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/acharya:', err);
    return NextResponse.json(
      {
        success: false,
        error: `AI Mentor Error: ${err?.message || 'Failed to generate solution from Gemini AI.'}`,
      },
      { status: 500 }
    );
  }
}

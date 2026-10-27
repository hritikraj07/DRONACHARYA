// Dronacharya Context-Aware Live AI Mentor API
// Powered by official Google Gemini SDK (@google/genai) and model gemini-2.5-flash
// Inspects active problem statement, user code, runtime errors, and provides tailored, direct working solutions.

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface MentorHistoryItem {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

interface MentorContext {
  missionTitle?: string;
  topicTitle?: string;
  problemStatement?: string;
  missionGoal?: string;
  code?: string;
  currentAttempt?: string;
  language?: string;
  consoleOutput?: string;
  errorLog?: string;
  simulationParameters?: Record<string, any>;
  simulationState?: Record<string, any>;
  testResults?: Array<{ description: string; passed: boolean; expected?: string }>;
  currentStep?: string | number;
}

interface MentorAskRequestBody {
  // Direct parameters requested
  user_query?: string;
  problem_context?: string | MentorContext;
  user_attempt?: string;
  history?: MentorHistoryItem[];
  // Legacy / drawer format compatibility
  message?: string;
  context?: MentorContext;
}

const SYSTEM_INSTRUCTION = `You are an expert interactive AI Mentor. Never give generic, textbook, or vague responses. Analyze the exact problem statement and the user's current attempt/code provided in the context. Diagnose the exact issue, specific bottlenecks or knowledge gaps, explain why it is happening, and provide tailored, actionable, direct working solutions rather than generic definitions.

Formatting & Style Guidelines:
1. Be concise, direct, and empathetic. Address the learner as an apprentice or coder.
2. If the user's code has a bug, bottleneck, or syntax error, pinpoint the exact line and explain why it is failing.
3. Always supply the exact, working code snippet inside markdown code blocks (e.g. \`\`\`python ... \`\`\`) with comments explaining the critical fix.
4. If explaining concepts, ground them directly in the user's active problem and code attempt rather than generic dictionary definitions.
5. Use clean markdown with clear headings, bullet points, and code formatting so the solution is effortless to read and execute.`;

export async function POST(req: NextRequest) {
  try {
    const body: MentorAskRequestBody = await req.json();

    // Support both user_query and message
    const query = (body.user_query || body.message || '').trim();
    const history = body.history || [];

    // Support problem_context and user_attempt alongside context object
    const rawProblemContext = body.problem_context;
    const directUserAttempt = body.user_attempt;
    const legacyContext = body.context || {};

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: "user_query" or "message" string must be provided.',
        },
        { status: 400 }
      );
    }

    // Check for API key in environment or client header override
    const customHeaderKey = req.headers.get('x-custom-api-key');
    const apiKey = customHeaderKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'GEMINI_API_KEY is not configured in your environment variables (.env.local). Please set GEMINI_API_KEY=your_key or enter your key in the AI Settings modal.',
          isConfigError: true,
        },
        { status: 401 }
      );
    }

    // Build rich contextual problem overview
    let title = legacyContext.missionTitle || legacyContext.topicTitle || 'Active Coding Quest';
    let problem = '';
    
    if (typeof rawProblemContext === 'string') {
      problem = rawProblemContext;
    } else if (rawProblemContext && typeof rawProblemContext === 'object') {
      title = (rawProblemContext as MentorContext).missionTitle || title;
      problem = (rawProblemContext as MentorContext).problemStatement || (rawProblemContext as MentorContext).missionGoal || '';
    }
    
    if (!problem) {
      problem = legacyContext.problemStatement || legacyContext.missionGoal || 'Solve the active programming challenge';
    }

    const code = directUserAttempt || legacyContext.code || legacyContext.currentAttempt || '';
    const lang = legacyContext.language || 'python';
    const error = legacyContext.errorLog || legacyContext.consoleOutput || '';
    const simState = legacyContext.simulationState || legacyContext.simulationParameters;
    const testResults = legacyContext.testResults;

    let contextBlock = `--- ACTIVE WORKSPACE CONTEXT ---
Active Topic / Mission: ${title}
Exact Problem Statement: ${problem}
Language: ${lang}
`;

    if (code) {
      contextBlock += `User's Current Code / Attempt:
\`\`\`${lang}
${code}
\`\`\`
`;
    }

    if (error) {
      contextBlock += `Runtime Console / Error Log:
${error}
`;
    }

    if (testResults && testResults.length > 0) {
      const failed = testResults.filter((t) => !t.passed);
      contextBlock += `Test Suite Status: ${testResults.length - failed.length}/${testResults.length} Passed
Failed Tests: ${failed.map((f) => f.description).join('; ') || 'None'}
`;
    }

    if (simState && Object.keys(simState).length > 0) {
      contextBlock += `Simulator Telemetry / Parameters:
${JSON.stringify(simState, null, 2)}
`;
    }

    contextBlock += `--- END CONTEXT ---`;

    // Construct multi-turn contents for the Google GenAI SDK
    // Map prior conversation turns (Gemini uses 'user' and 'model')
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Prior history turns (up to last 10 messages for rich conversational context)
    const recentHistory = history.slice(-10);
    for (const h of recentHistory) {
      const role = h.role === 'assistant' ? 'model' : h.role;
      contents.push({
        role: role as 'user' | 'model',
        parts: [{ text: h.content }],
      });
    }

    // Current turn: combine active context with user message
    const promptWithContext = `${contextBlock}

User Message / Inquiry:
${query}`;

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });

    // Initialize Google Gemini SDK client
    const ai = new GoogleGenAI({ apiKey });

    // Primary model: gemini-2.5-flash with strict System Instruction
    let response;
    let activeModel = 'gemini-2.5-flash';

    try {
      response = await ai.models.generateContent({
        model: activeModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for high accuracy and deterministic coding solutions
        },
      });
    } catch (modelErr: any) {
      // If gemini-2.5-flash is not available for this key, fall back to recommended next-gen model
      const msg = modelErr?.message || '';
      if (msg.includes('not found') || msg.includes('no longer available') || msg.includes('404')) {
        activeModel = 'gemini-3.8-flash';
        response = await ai.models.generateContent({
          model: activeModel,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
          },
        });
      } else {
        throw modelErr;
      }
    }

    const replyText = response?.text || 'I analyzed your problem, but could not produce a text response. Please check your prompt.';

    return NextResponse.json({
      success: true,
      reply: replyText,
      response: replyText,
      data: {
        reply: replyText,
        model: 'gemini-2.5-flash',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Error in /api/mentor/ask:', err);
    const errMsg = err?.message || 'Failed to generate solution from Gemini AI.';
    const isQuotaOrKey =
      errMsg.includes('API_KEY') ||
      errMsg.includes('API key') ||
      errMsg.includes('quota') ||
      errMsg.includes('403') ||
      errMsg.includes('401');

    return NextResponse.json(
      {
        success: false,
        error: isQuotaOrKey
          ? `Gemini API authentication/quota error: ${errMsg}. Please verify your GEMINI_API_KEY in .env.local.`
          : `AI Mentor Error: ${errMsg}`,
      },
      { status: 500 }
    );
  }
}

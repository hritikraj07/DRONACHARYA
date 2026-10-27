// Dronacharya Context-Aware Live AI Mentor Client Service
// Integrates directly with POST /api/mentor/ask (Google Gemini gemini-2.5-flash)
// Passes live code, problem statements, and simulation context for tailored, exact solutions.

export interface AISettings {
  provider: 'auto' | 'gemini' | 'groq' | 'openai' | 'local';
  apiKey: string;
  model?: string;
}

const AI_SETTINGS_STORAGE_KEY = 'dronacharya_ai_settings_v1';

export function getStoredAISettings(): AISettings {
  if (typeof window === 'undefined') {
    return { provider: 'auto', apiKey: '' };
  }
  try {
    const raw = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { provider: 'auto', apiKey: '' };
}

export function saveAISettings(settings: AISettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('dronacharya_ai_settings_changed'));
  } catch (e) {}
}

export interface MentorHistoryItem {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface MentorContext {
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

export interface AskMentorPayload {
  message: string;
  history?: MentorHistoryItem[];
  context?: MentorContext;
}

export interface AskMentorResult {
  success: boolean;
  reply: string;
  model?: string;
  error?: string;
  isConfigError?: boolean;
}

/**
 * Send inquiry and live workspace context to POST /api/mentor/ask
 */
export async function askMentorAI(payload: AskMentorPayload): Promise<AskMentorResult> {
  const settings = getStoredAISettings();

  try {
    const res = await fetch('/api/mentor/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.apiKey ? { 'x-custom-api-key': settings.apiKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success && data?.data) {
      return {
        success: true,
        reply: data.data.reply,
        model: data.data.model || 'gemini-2.5-flash',
      };
    }

    // Handle authentication / configuration error
    if (res.status === 401 || data?.isConfigError) {
      return {
        success: false,
        reply: '',
        error:
          data?.error ||
          'GEMINI_API_KEY is missing. Please set GEMINI_API_KEY=your_key in your `.env.local` file, or enter your key in the AI Settings dialog (⚙️) in the top-right of the mentor drawer.',
        isConfigError: true,
      };
    }

    return {
      success: false,
      reply: '',
      error: data?.error || `API returned status ${res.status}: Failed to get solution from AI Mentor.`,
    };
  } catch (err: any) {
    console.error('Network request to /api/mentor/ask failed:', err);
    return {
      success: false,
      reply: '',
      error:
        'Network error: Unable to connect to the AI Mentor server. Please check your internet connection or dev server terminal.',
    };
  }
}

/**
 * Backward-compatible wrapper for existing components
 */
export interface AcharyaRequestPayload {
  missionTitle: string;
  missionGoal?: string;
  studentCode: string;
  consoleOutputOrError?: string;
  simulatorState?: Record<string, any>;
  hintTier?: number;
  studentMessage?: string;
  actionType?: string;
  language?: 'python' | 'html' | 'css' | 'javascript';
  preferredLanguage?: 'en' | 'hinglish' | 'hi';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  testResults?: Array<{ description: string; passed: boolean; expected?: string }>;
}

export interface AcharyaResponse {
  message: string;
  socraticQuestion?: string;
  hintTier?: number;
  detectedLine?: number;
  issueCategory?: string;
  isFallback: boolean;
  providerUsed: string;
}

export async function queryAcharyaAI(payload: AcharyaRequestPayload): Promise<AcharyaResponse> {
  const result = await askMentorAI({
    message:
      payload.studentMessage ||
      'Please analyze my current code and problem statement, diagnose any issues, and provide the exact working solution.',
    history: payload.conversationHistory || [],
    context: {
      missionTitle: payload.missionTitle,
      problemStatement: payload.missionGoal,
      code: payload.studentCode,
      language: payload.language || 'python',
      errorLog: payload.consoleOutputOrError,
      simulationState: payload.simulatorState,
      testResults: payload.testResults,
    },
  });

  if (result.success && result.reply) {
    return {
      message: result.reply,
      isFallback: false,
      providerUsed: result.model || 'Google Gemini 2.5 Flash',
    };
  }

  return {
    message:
      result.error ||
      'Could not generate a response. Please check your GEMINI_API_KEY in .env.local.',
    isFallback: true,
    providerUsed: 'Configuration / Network Error',
  };
}

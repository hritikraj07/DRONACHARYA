// Dronacharya Acharya AI Client Engine
// Coordinates live telemetry, API integration (Gemini / Groq / OpenAI), and client-side AST inspection

import {
  CodeInspectionContext,
  inspectPythonCode,
  inspectWebCode,
  formatDialect,
  InspectionResult,
} from './code-inspector';

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

export interface AcharyaRequestPayload {
  missionTitle: string;
  missionGoal?: string;
  studentCode: string;
  consoleOutputOrError?: string;
  simulatorState?: {
    roverPos?: [number, number];
    targetPos?: [number, number];
    battery?: number;
    heartsLeft?: number;
    status?: 'crashed_obstacle' | 'syntax_error' | 'infinite_loop' | 'incomplete_goal' | 'battery_depleted' | 'success';
    lastCollisionCoord?: [number, number];
  };
  hintTier: 1 | 2 | 3;
  studentMessage?: string;
  actionType?: 'diagnose' | 'explain_error' | 'next_hint' | 'check_logic' | 'chat';
  language?: 'python' | 'html' | 'css' | 'javascript';
  preferredLanguage?: 'en' | 'hinglish' | 'hi';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AcharyaResponse {
  message: string;
  socraticQuestion: string;
  hintTier: 1 | 2 | 3;
  detectedLine?: number;
  issueCategory?: string;
  isFallback: boolean;
  providerUsed: string;
}

/**
 * Send request to backend Acharya AI endpoint with intelligent offline code inspection fallback
 */
export async function queryAcharyaAI(payload: AcharyaRequestPayload): Promise<AcharyaResponse> {
  const settings = getStoredAISettings();

  // If set strictly to local, run the deep code inspector directly
  if (settings.provider === 'local') {
    return runLocalInspector(payload);
  }

  try {
    const res = await fetch('/api/acharya', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.apiKey ? { 'x-custom-api-key': settings.apiKey } : {}),
        ...(settings.provider ? { 'x-custom-provider': settings.provider } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (netErr) {
    console.warn('Network call to /api/acharya failed, falling back to Deep Code Inspector:', netErr);
  }

  // Fallback to offline Deep Code Inspector
  return runLocalInspector(payload);
}

function runLocalInspector(payload: AcharyaRequestPayload): AcharyaResponse {
  const ctx: CodeInspectionContext = {
    missionTitle: payload.missionTitle,
    missionGoal: payload.missionGoal,
    code: payload.studentCode,
    consoleError: payload.consoleOutputOrError,
    simulatorState: payload.simulatorState,
    language: payload.language || 'python',
    preferredLanguage: payload.preferredLanguage || 'en',
    hintTier: payload.hintTier,
    studentQuery: payload.studentMessage,
  };

  const isWeb = payload.language === 'html' || payload.language === 'css' || payload.language === 'javascript';
  const inspection: InspectionResult = isWeb ? inspectWebCode(ctx) : inspectPythonCode(ctx);

  const localized = formatDialect(inspection, payload.hintTier, payload.preferredLanguage || 'en');

  return {
    message: localized.message,
    socraticQuestion: localized.socraticQuestion,
    hintTier: payload.hintTier,
    detectedLine: inspection.detectedLine,
    issueCategory: inspection.issueCategory,
    isFallback: true,
    providerUsed: 'Local Deep Code Inspector (AST)',
  };
}

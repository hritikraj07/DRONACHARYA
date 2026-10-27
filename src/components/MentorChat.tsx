'use client';

// Dronacharya Interactive Context-Aware AI Mentor Chat Component
// Powered by Google Gemini 2.5 Flash SDK (@google/genai) via POST /api/mentor/ask

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  Lightbulb,
  X,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

export interface MentorChatProps {
  /** Active problem context or description */
  problemContext?: string | Record<string, any>;
  /** Current user attempt, source code, or solution draft */
  userAttempt?: string;
  /** Custom title for the chat header */
  title?: string;
  /** Subtitle for the chat header */
  subtitle?: string;
  /** Optional close callback if rendered in a modal/drawer */
  onClose?: () => void;
  /** Custom className for the container */
  className?: string;
  /** Initial welcome message */
  initialMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export function MentorChat({
  problemContext = 'Solve the active programming challenge',
  userAttempt = '',
  title = 'Acharya AI Mentor',
  subtitle = 'Context-Aware Interactive Solver (gemini-2.5-flash)',
  onClose,
  className = '',
  initialMessage,
}: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        initialMessage ||
        `Greetings, Coder! I am your AI Mentor powered by **Gemini 2.5 Flash**. I have direct visibility into your active problem statement and live code attempt. Ask me anything to get immediate diagnoses, tailored explanations, and working solutions.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    // Format conversation history for multi-turn memory
    const historyPayload = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/mentor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: query,
          problem_context: problemContext,
          user_attempt: userAttempt,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorText =
          data.error || 'Failed to generate solution. Please check your GEMINI_API_KEY.';
        setErrorMessage(errorText);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ ${errorText}`,
            timestamp: 'Just now',
            isError: true,
          },
        ]);
      } else {
        const reply = data.reply || data.response || data.data?.reply || 'Solution generated.';
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err: any) {
      const netErr = `Network error connecting to Mentor AI API: ${err?.message || 'Server unreachable'}`;
      setErrorMessage(netErr);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${netErr}`,
          timestamp: 'Just now',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActionChips = [
    { label: '💡 Exact Solution', prompt: 'Provide the exact working code solution to this problem with explanations.' },
    { label: '🔍 Diagnose Error', prompt: 'Analyze my current code attempt against the problem requirements. What is the bottleneck or bug?' },
    { label: '⚡ Explain Concepts', prompt: 'Explain the core programming concepts required to solve this problem clearly.' },
    { label: '🛠️ Optimize Code', prompt: 'How can I optimize and clean up my current attempt for maximum efficiency?' },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-[#FAF6EE] text-[#1E1E24] rounded-2xl border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 bg-[#EDE9FE] border-b-2 border-[#1E1E24]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] text-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24] shrink-0">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-serif font-black text-sm text-[#1E1E24] leading-none">
              {title}
            </h3>
            <p className="text-[10px] font-mono text-[#6C5CE7] font-semibold mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {userAttempt && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4EDDA] text-[#155724] border border-[#155724]/30">
              <Code2 className="w-3 h-3" />
              Code Attached
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/5 text-[#1E1E24] transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                {msg.role === 'user' ? 'You' : 'Acharya AI'}
              </span>
              <span className="text-[9px] text-[#94A3B8]">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[90%] rounded-xl p-3 border-2 ${
                msg.role === 'user'
                  ? 'bg-[#6C5CE7] text-white border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]'
                  : msg.isError
                  ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444] shadow-[3px_3px_0px_#EF4444]'
                  : 'bg-white text-[#1E1E24] border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]'
              }`}
            >
              <MessageMarkdownRenderer content={msg.content} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7]">
                Acharya AI
              </span>
              <span className="text-[9px] text-[#94A3B8]">Analyzing...</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-xs font-semibold text-[#6C5CE7]">
              <Loader2 className="w-4 h-4 animate-spin text-[#6C5CE7]" />
              <span>Analyzing code & diagnosing bottlenecks...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-[#1E1E24]/10 bg-white/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(chip.prompt)}
            className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#1E1E24] bg-white hover:bg-[#EDE9FE] text-[#1E1E24] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[1px_1px_0px_#1E1E24]"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t-2 border-[#1E1E24]">
        {errorMessage && (
          <div className="mb-2 p-2 rounded-lg bg-[#FEF2F2] border border-[#F87171] text-[#991B1B] text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs hover:underline shrink-0 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? 'AI Mentor is thinking...' : 'Ask how to solve, fix a bug, or write code...'
            }
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#FAF6EE] text-[#1E1E24] border-2 border-[#1E1E24] rounded-xl focus:outline-hidden focus:border-[#6C5CE7] transition-all disabled:opacity-60 placeholder:text-[#94A3B8]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:shadow-[3px_3px_0px_#1E1E24] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0"
            title="Send query"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Markdown & Code Renderer with Copy-to-Clipboard */
function MessageMarkdownRenderer({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (isUser) {
    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
  }

  // Parse code blocks with ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-2 leading-relaxed text-[#1E1E24]">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : 'python';
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div
              key={idx}
              className="my-2 rounded-lg bg-[#0F172A] text-slate-100 border border-slate-700 overflow-hidden font-mono text-[11px] sm:text-xs"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E293B] border-b border-slate-700 text-[10px] text-slate-300">
                <span className="font-bold uppercase tracking-wider">{lang}</span>
                <button
                  onClick={() => handleCopyCode(codeBody, idx)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto whitespace-pre leading-relaxed text-[#38BDF8]">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Render formatted text with bold, bullet points, and inline code
        const textLines = part.split('\n');
        return (
          <div key={idx} className="space-y-1">
            {textLines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1" />;

              // Bullet points
              const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
              const cleanLine = isBullet ? line.trim().slice(2) : line;

              // Parse bold **text** and inline `code`
              const formattedTokens = renderFormattedText(cleanLine);

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                    <span className="text-[#6C5CE7] font-black leading-none mt-1">•</span>
                    <span className="flex-1">{formattedTokens}</span>
                  </div>
                );
              }

              return <p key={lIdx}>{formattedTokens}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode[] {
  // Regex splits on bold `**bold**` and inline `` `code` ``
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0F172A]">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md bg-[#EDE9FE] text-[#6C5CE7] font-mono text-[11px] border border-[#6C5CE7]/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
  Wind,
  Clock,
  Compass,
  ArrowRight,
  RotateCcw,
  Volume1,
  Award,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Sun,
  Moon,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getActiveSession } from '@/lib/db/auth-db';

interface Track {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  durationSec: number;
  durationLabel: string;
  tag: string;
  accentBg: string;
  accentBorder: string;
  desc: string;
}

const MEDITATION_TRACKS: Track[] = [
  {
    id: 'gurukul-dawn',
    title: 'Gurukul Dawn Raga',
    subtitle: '432 Hz Healing Harmonics & Tambura Drone',
    src: '/audio/meditation/gurukul-dawn.mp3',
    durationSec: 225,
    durationLabel: '3:45',
    tag: 'Grounding • 432 Hz',
    accentBg: '#E0F2FE',
    accentBorder: '#0284C7',
    desc: 'Traditional meditative drone inspired by dawn rituals at the ancient hermitage. Calms the nervous system and restores mental clarity before tackling complex logic.',
  },
  {
    id: 'deep-dhyana',
    title: 'Deep Dhyana Sanctuary',
    subtitle: '528 Hz Solfeggio Waves & Resonant Bowls',
    src: '/audio/meditation/deep-dhyana.mp3',
    durationSec: 252,
    durationLabel: '4:12',
    tag: 'Deep Focus • 528 Hz',
    accentBg: '#EDE9FE',
    accentBorder: '#6C5CE7',
    desc: 'Resonant harmonic frequencies tuned to 528 Hz for neural coherence, deep introspection, and tranquil problem solving without distraction.',
  },
  {
    id: 'saraswati-stream',
    title: 'Saraswati Flow Stream',
    subtitle: 'Sacred Forest Creek & Sitar Arpeggios',
    src: '/audio/meditation/saraswati-stream.mp3',
    durationSec: 210,
    durationLabel: '3:30',
    tag: 'Flow State • Water Zen',
    accentBg: '#DCFCE7',
    accentBorder: '#059669',
    desc: 'Gentle mountain stream acoustics paired with delicate acoustic strings. Melts syntax anxiety and invokes an effortless coding flow state.',
  },
  {
    id: 'cosmic-nirvana',
    title: 'Cosmic 8-Bit Nirvana',
    subtitle: 'Retro Chiptune Zen & Astral Lofi Waves',
    src: '/audio/meditation/cosmic-nirvana.mp3',
    durationSec: 230,
    durationLabel: '3:50',
    tag: 'Arcade Zen • 8-Bit Lofi',
    accentBg: '#FEF3C7',
    accentBorder: '#D97706',
    desc: 'Nostalgic 8-bit soundscapes tuned down to peaceful ambient tempos. Specially arranged for programmers seeking quiet zen in an arcade universe.',
  },
  {
    id: 'evening-hermitage',
    title: 'Evening Hermitage Bells',
    subtitle: 'Temple Singing Bowls & Twilight Mountain Breeze',
    src: '/audio/meditation/evening-hermitage.mp3',
    durationSec: 240,
    durationLabel: '4:00',
    tag: 'Wind Down • Evening Calm',
    accentBg: '#FFE4E6',
    accentBorder: '#E11D48',
    desc: 'Deep resonating bronze bells echoing across dusk hermitage valleys. Perfect for post-quest reflection, clearing mental fatigue, and peaceful focus.',
  },
];

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathPattern {
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: 'Sama Vritti (Box Breathing)',
    description: 'Equal 4-second cycles to balance the nervous system and sharpen acute focus.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    name: 'Pranava Shanti (4-7-8 Relax)',
    description: 'Extended exhalation to purge residual stress and quiet hyperactive thoughts.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    name: 'Anulom Rhythm (Calm Focus)',
    description: 'Gentle centering rhythm for swift mental reset between difficult coding quests.',
    inhale: 4,
    hold1: 2,
    exhale: 4,
    hold2: 2,
  },
];

const GURUKUL_WISDOM = [
  {
    quote: 'A turbulent mind perceives syntax errors everywhere. A tranquil mind perceives the algorithm with effortless clarity.',
    source: 'Acharya Dronacharya • Sutra of Mindful Logic',
  },
  {
    quote: 'Yoga is the settling of the mind into stillness. When the mind settles, pure problem solving flows.',
    source: 'Patanjali Yoga Sutras (1.2)',
  },
  {
    quote: 'Perform your sacred duty with an equipoise mind, abandoning all attachment to anxiety.',
    source: 'Bhagavad Gita (2.48)',
  },
  {
    quote: 'Steady your breath as the archer steadies the bowstring; release only with quiet certainty.',
    source: 'Dronacharya Chronicles',
  },
];

export default function MeditationPage() {
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  // Ambience mode
  const [isNightMode, setIsNightMode] = useState(false);

  // Breathing Guide State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  // Meditation Timer State
  const [selectedTimerMin, setSelectedTimerMin] = useState<number | null>(5);
  const [timerRemainingSec, setTimerRemainingSec] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasCompletedSession, setHasCompletedSession] = useState(false);

  // Wisdom index
  const [wisdomIndex, setWisdomIndex] = useState(0);

  const activeTrack = MEDITATION_TRACKS[currentTrackIndex];
  const activePattern = BREATH_PATTERNS[currentPatternIndex];

  // Rotate wisdom quote periodically
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setWisdomIndex((prev) => (prev + 1) % GURUKUL_WISDOM.length);
    }, 12000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Sync audio element volume and loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isMuted, isLooping]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeTrack.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch(() => setIsPlaying(false));
      }
    }
    setCurrentTime(0);
  }, [currentTrackIndex]);

  // Audio Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio play blocked:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MEDITATION_TRACKS.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MEDITATION_TRACKS.length) % MEDITATION_TRACKS.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (isMuted && newVol > 0) setIsMuted(false);
  };

  // Breathing loop timer
  useEffect(() => {
    if (!isBreathingActive) return;

    const pattern = BREATH_PATTERNS[currentPatternIndex];
    const timer = setInterval(() => {
      setBreathCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        if (breathPhase === 'inhale') {
          if (pattern.hold1 > 0) {
            setBreathPhase('hold1');
            return pattern.hold1;
          } else {
            setBreathPhase('exhale');
            return pattern.exhale;
          }
        } else if (breathPhase === 'hold1') {
          setBreathPhase('exhale');
          return pattern.exhale;
        } else if (breathPhase === 'exhale') {
          if (pattern.hold2 > 0) {
            setBreathPhase('hold2');
            return pattern.hold2;
          } else {
            setBreathPhase('inhale');
            setCompletedBreathCycles((c) => c + 1);
            return pattern.inhale;
          }
        } else {
          // hold2 -> inhale
          setBreathPhase('inhale');
          setCompletedBreathCycles((c) => c + 1);
          return pattern.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, currentPatternIndex]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase('inhale');
      setBreathCountdown(activePattern.inhale);
      setIsBreathingActive(true);
    } else {
      setIsBreathingActive(false);
    }
  };

  // Meditation Session Timer
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimerRemainingSec((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setHasCompletedSession(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#6C5CE7', '#FFD214', '#00B894', '#FF7675'],
            });
          } catch (_) {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartTimer = (mins: number) => {
    setSelectedTimerMin(mins);
    setTimerRemainingSec(mins * 60);
    setIsTimerRunning(true);
    setHasCompletedSession(false);
  };

  const handleToggleTimer = () => {
    if (timerRemainingSec <= 0 && selectedTimerMin) {
      setTimerRemainingSec(selectedTimerMin * 60);
      setHasCompletedSession(false);
    }
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setHasCompletedSession(false);
    if (selectedTimerMin) {
      setTimerRemainingSec(selectedTimerMin * 60);
    }
  };

  const formatSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic instruction text and scale for breathing guide
  let phaseInstruction = 'Inhale Slowly';
  let phaseColor = '#6C5CE7';
  let circleScale = 'scale-100';

  if (breathPhase === 'inhale') {
    phaseInstruction = 'Inhale Peace';
    phaseColor = '#00B894';
    circleScale = 'scale-125';
  } else if (breathPhase === 'hold1') {
    phaseInstruction = 'Hold Stillness';
    phaseColor = '#FFD214';
    circleScale = 'scale-125';
  } else if (breathPhase === 'exhale') {
    phaseInstruction = 'Exhale Clutter';
    phaseColor = '#74B9FF';
    circleScale = 'scale-90';
  } else if (breathPhase === 'hold2') {
    phaseInstruction = 'Rest in Void';
    phaseColor = '#A29BFE';
    circleScale = 'scale-90';
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex flex-col items-center select-none ${
        isNightMode ? 'bg-[#0F1017] text-[#FAF6EE]' : 'bg-[#FAF6EE] text-[#1E1E24]'
      }`}
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={activeTrack.src}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || activeTrack.durationSec);
          }
        }}
        onEnded={() => {
          if (!isLooping) {
            handleNextTrack();
          }
        }}
      />

      {/* Main Container */}
      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* =========================================================================
            HEADER & TOP CONTROLS (Atmosphere Mode, Title, Subtitle)
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-current/15">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] bg-[#FFD214] text-[#1E1E24] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#1E1E24]" />
              <span>DHYANA GURUKUL SANCTUARY • ZEN LAB</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
              Meditation Hermitage
            </h1>

            <p
              className={`text-xs sm:text-sm max-w-2xl font-bold leading-relaxed ${
                isNightMode ? 'text-gray-300' : 'text-[#4A4A58]'
              }`}
            >
              Quiet your mental fluctuations, recalibrate neural focus, and cultivate an effortless coding flow state with ancient Vedic harmonic frequencies and retro arcade ambient peace.
            </p>
          </div>

          {/* Right Top HUD: Day/Night Atmosphere Toggle & Back to Hub */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setIsNightMode((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-[#1E1E24] transition-all flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1E1E24] ${
                isNightMode
                  ? 'bg-[#1E1E28] text-amber-300 hover:bg-[#2A2B38]'
                  : 'bg-white text-slate-800 hover:bg-slate-100'
              }`}
              title="Toggle Day / Twilight Hermitage Ambience"
            >
              {isNightMode ? (
                <>
                  <Moon className="w-4 h-4 text-amber-300" />
                  <span>Hermitage Night</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Gurukul Daylight</span>
                </>
              )}
            </button>

            <Link
              href="/dashboard"
              className="btn-arcade btn-arcade-white text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-[#6C5CE7]" />
              <span>Quest Hub</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            PHILOSOPHICAL GURUKUL SUTRA TICKER BANNER
           ========================================================================= */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex items-center gap-4 transition-all ${
            isNightMode ? 'bg-[#191A24]' : 'bg-[#EDE9FE]'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-serif font-black italic tracking-wide leading-snug">
              &ldquo;{GURUKUL_WISDOM[wisdomIndex].quote}&rdquo;
            </p>
            <span className="text-[10px] font-mono font-bold text-[#6C5CE7] block mt-1">
              — {GURUKUL_WISDOM[wisdomIndex].source}
            </span>
          </div>
        </div>

        {/* =========================================================================
            CORE SANCTUARY GRID: AUDIO PLAYER & BREATHING GUIDE
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: RETRO GURUKUL AUDIO PLAYER (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* The Vintage Cassette / Hermitage Audio Console */}
            <div
              className={`rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-8 space-y-6 transition-all ${
                isNightMode ? 'bg-[#181924]' : 'bg-white'
              }`}
            >
              {/* Console Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-current/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 border border-[#1E1E24] animate-pulse" />
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[#6C5CE7]">
                    HARMONIC TAPE DECK • 432HZ–528HZ
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-pixel border border-[#1E1E24] bg-[#FFD214] text-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                  STEREO MASTER
                </span>
              </div>

              {/* Animated Tape Visualizer / Active Track Card */}
              <div
                className="relative rounded-2xl border-2 border-[#1E1E24] p-6 overflow-hidden shadow-[4px_4px_0px_#1E1E24]"
                style={{ backgroundColor: activeTrack.accentBg }}
              >
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-pixel uppercase font-bold text-[#1E1E24] bg-white/90 border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                      {activeTrack.tag}
                    </span>
                    <span className="text-xs font-mono font-black text-[#1E1E24]">
                      Track {currentTrackIndex + 1} of {MEDITATION_TRACKS.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1E1E24] leading-tight">
                    {activeTrack.title}
                  </h3>

                  <p className="text-xs font-bold text-[#1E1E24]/80 leading-relaxed max-w-lg">
                    {activeTrack.subtitle}
                  </p>

                  {/* Retro Equalizer Visualizer Bars (Bouncing when playing) */}
                  <div className="pt-2 flex items-end gap-1.5 h-8">
                    {[12, 24, 18, 28, 20, 32, 16, 26, 30, 14, 22, 29, 17, 25, 20].map((baseHeight, idx) => {
                      const dynamicHeight = isPlaying
                        ? Math.min(32, Math.max(6, (baseHeight + (idx % 4) * 5) % 32))
                        : 6;
                      return (
                        <div
                          key={idx}
                          className="w-1.5 sm:w-2 rounded-t-sm bg-[#1E1E24] transition-all duration-150"
                          style={{
                            height: `${dynamicHeight}px`,
                            opacity: isPlaying ? 0.9 : 0.35,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scrubbable Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={duration || activeTrack.durationSec}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7] border border-[#1E1E24]"
                />
                <div className="flex justify-between text-xs font-mono font-black">
                  <span>{formatSec(currentTime)}</span>
                  <span>{formatSec(duration || activeTrack.durationSec)}</span>
                </div>
              </div>

              {/* Tactile Player Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                {/* Loop Button */}
                <button
                  onClick={() => setIsLooping((prev) => !prev)}
                  className={`p-2.5 rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] transition-all cursor-pointer ${
                    isLooping ? 'bg-[#FFD214] text-[#1E1E24]' : 'bg-white/80 text-gray-500'
                  }`}
                  title={isLooping ? 'Loop Active (Repeats indefinitely)' : 'Loop Inactive'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Core Playback Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevTrack}
                    className="btn-arcade btn-arcade-white p-3 text-xs"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="btn-arcade btn-arcade-gold px-6 py-3.5 flex items-center gap-2 text-sm shadow-[4px_4px_0px_#1E1E24]"
                    title={isPlaying ? 'Pause Meditation Track' : 'Play Meditation Track'}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" />
                        <span>Pause Track</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        <span>Play Meditation</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="btn-arcade btn-arcade-white p-3 text-xs"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume & Mute Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="p-2 rounded-lg text-current hover:text-[#6C5CE7] transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-rose-500" />
                    ) : volume < 0.4 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 sm:w-24 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7]"
                  />
                </div>
              </div>
            </div>

            {/* TRACK SELECTION LIST (All 5 options clickable with description) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#6C5CE7] flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  Select Meditation Soundscape
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {MEDITATION_TRACKS.length} Custom Frequencies Available
                </span>
              </div>

              <div className="space-y-3">
                {MEDITATION_TRACKS.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`p-4 rounded-2xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? isNightMode
                            ? 'bg-[#252738] border-[#FFD214]'
                            : 'bg-white border-[#6C5CE7] -translate-y-0.5'
                          : isNightMode
                          ? 'bg-[#181924]/80 hover:bg-[#202230]'
                          : 'bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] flex items-center justify-center shrink-0 font-serif font-black text-xs text-[#1E1E24]"
                          style={{ backgroundColor: track.accentBg }}
                        >
                          {isCurrent && isPlaying ? (
                            <span className="w-2 h-2 rounded-full bg-[#1E1E24] animate-ping" />
                          ) : (
                            <span>0{idx + 1}</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-serif font-black leading-tight">
                              {track.title}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-pixel bg-[#6C5CE7] text-white">
                                {isPlaying ? 'PLAYING' : 'READY'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-gray-500 line-clamp-1">
                            {track.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className="text-[10px] font-pixel px-2 py-0.5 rounded border border-[#1E1E24]/30 bg-slate-100 text-slate-700">
                          {track.tag.split('•')[1]?.trim() || track.tag}
                        </span>
                        <span className="text-xs font-mono font-black text-gray-500">
                          {track.durationLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRANAYAMA BREATHING GUIDE & SESSION TIMER (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. INTERACTIVE PRANAYAMA GUIDE (Breathing Circle) */}
            <div
              className={`rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-7 space-y-6 transition-all text-center ${
                isNightMode ? 'bg-[#181924]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-left border-b-2 border-current/10 pb-3">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#00B894]" />
                  <span className="text-xs font-mono font-black uppercase text-[#00B894]">
                    Pranayama Breath Guide
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {completedBreathCycles} Cycles Completed
                </span>
              </div>

              {/* Pattern Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-mono font-bold text-gray-500 uppercase">
                  Breathing Discipline:
                </label>
                <select
                  value={currentPatternIndex}
                  onChange={(e) => {
                    setCurrentPatternIndex(parseInt(e.target.value));
                    setBreathCountdown(BREATH_PATTERNS[parseInt(e.target.value)].inhale);
                    setBreathPhase('inhale');
                  }}
                  className={`w-full p-2.5 rounded-xl border-2 border-[#1E1E24] text-xs font-black shadow-[2px_2px_0px_#1E1E24] cursor-pointer ${
                    isNightMode ? 'bg-[#252738] text-white' : 'bg-[#FAF6EE] text-[#1E1E24]'
                  }`}
                >
                  {BREATH_PATTERNS.map((pat, idx) => (
                    <option key={pat.name} value={idx}>
                      {pat.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-bold text-gray-500 italic pt-1">
                  {activePattern.description}
                </p>
              </div>

              {/* Interactive Breathing Sphere / Mandala Animation */}
              <div className="py-6 flex flex-col items-center justify-center relative min-h-[220px]">
                <div
                  className={`w-36 h-36 rounded-full border-4 border-[#1E1E24] flex flex-col items-center justify-center shadow-[6px_6px_0px_#1E1E24] transition-all duration-1000 ${circleScale}`}
                  style={{
                    backgroundColor: isBreathingActive ? phaseColor : '#E0E7FF',
                  }}
                >
                  <span className="text-3xl font-mono font-black text-[#1E1E24]">
                    {isBreathingActive ? breathCountdown : '4'}
                  </span>
                  <span className="text-[11px] font-serif font-black uppercase tracking-wider text-[#1E1E24] mt-0.5">
                    {isBreathingActive ? phaseInstruction : 'Ready'}
                  </span>
                </div>

                {isBreathingActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#6C5CE7]/40 animate-spin" />
                  </div>
                )}
              </div>

              {/* Start / Stop Breath Guide */}
              <button
                onClick={toggleBreathing}
                className={`w-full btn-arcade text-xs py-3 shadow-[3px_3px_0px_#1E1E24] flex items-center justify-center gap-2 ${
                  isBreathingActive ? 'btn-arcade-cyan' : 'btn-arcade-purple'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>{isBreathingActive ? 'Pause Breath Guide' : 'Start Pranayama Guidance'}</span>
              </button>
            </div>

            {/* 2. MEDITATION SESSION TIMER & FOCUS XP REWARD */}
            <div
              className={`rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-7 space-y-5 transition-all ${
                isNightMode ? 'bg-[#181924]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between border-b-2 border-current/10 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-mono font-black uppercase text-amber-500">
                    Session Focus Timer
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-100 text-amber-900 border border-amber-300">
                  +25 Focus XP
                </span>
              </div>

              {/* Preset Selection Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleStartTimer(mins)}
                    className={`py-2 px-1 text-xs font-mono font-black rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] transition-all cursor-pointer ${
                      selectedTimerMin === mins && !hasCompletedSession
                        ? 'bg-[#FFD214] text-[#1E1E24]'
                        : isNightMode
                        ? 'bg-[#252738] text-gray-300 hover:bg-[#303348]'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Big Display Clock */}
              <div className="p-5 rounded-2xl border-2 border-[#1E1E24] bg-slate-900 text-[#00B894] font-mono text-center shadow-[4px_4px_0px_#1E1E24] space-y-1">
                <div className="text-4xl sm:text-5xl font-black tracking-widest">
                  {formatSec(timerRemainingSec)}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400">
                  {hasCompletedSession
                    ? 'Session Completed • Mental Focus Attained'
                    : isTimerRunning
                    ? 'Mindfulness in progress • Breathe deeply'
                    : 'Timer Paused • Ready when you are'}
                </div>
              </div>

              {/* Session Completed Banner */}
              {hasCompletedSession && (
                <div className="p-3.5 rounded-xl border-2 border-[#1E1E24] bg-[#DCFCE7] text-[#059669] flex items-center gap-2.5 shadow-[2px_2px_0px_#1E1E24]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div className="text-xs font-bold leading-tight">
                    <span className="font-black">Dhyana Completed!</span> Mind settled with crystal clarity. Ready to tackle coding quests.
                  </div>
                </div>
              )}

              {/* Timer Control Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleToggleTimer}
                  className="flex-1 btn-arcade btn-arcade-gold py-2.5 text-xs shadow-[2px_2px_0px_#1E1E24]"
                >
                  {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="btn-arcade btn-arcade-white py-2.5 px-3 text-xs shadow-[2px_2px_0px_#1E1E24]"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CALL TO ACTION: TRANSITION FROM MEDITATION TO CODING
           ========================================================================= */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
            isNightMode ? 'bg-[#181924]' : 'bg-[#FAF6EE]'
          }`}
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B894] text-white border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] text-[11px] font-pixel font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FLOW STATE ATTAINED</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-current">
              Mind Cleared? Return to Your Coding Quests
            </h3>
            <p className="text-xs sm:text-sm font-bold opacity-80 max-w-xl">
              Apply your grounded focus to Python algorithms, HTML web layouts, and interactive logic challenges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/courses"
              className="btn-arcade btn-arcade-gold px-6 py-3 flex items-center gap-2 text-xs shadow-[3px_3px_0px_#1E1E24]"
            >
              <Compass className="w-4 h-4 text-[#071426]" />
              <span>Explore Courses</span>
            </Link>
            <Link
              href="/simulator"
              className="btn-arcade btn-arcade-purple px-6 py-3 flex items-center gap-2 text-xs shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Open Code Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

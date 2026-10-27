// Dronacharya Odyssey 8-Bit Web Audio Synthesizer
// Zero-asset retro chiptune audio effects with global mute toggle

class OdysseyAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('dronacharya_odyssey_audio_muted');
      this.isMuted = storedMute === 'true';
    }
  }

  private initCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dronacharya_odyssey_audio_muted', String(muted));
      window.dispatchEvent(new Event('dronacharya_odyssey_audio_change'));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.1) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Rover step / propulsion pulse
  public playStepSound() {
    this.playTone(180, 'triangle', 0.08, 0.08);
  }

  // Energy pulse incantation awakening
  public playAwakenSound() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.15, 0.12);
      }, idx * 60);
    });
  }

  // Energy cell / crystal collection
  public playCollectSound() {
    if (this.isMuted) return;
    this.playTone(523.25, 'square', 0.08, 0.1);
    setTimeout(() => {
      this.playTone(659.25, 'square', 0.12, 0.1);
    }, 70);
  }

  // Shield deflecting laser barrier
  public playShieldDeflectSound() {
    if (this.isMuted) return;
    this.playTone(880, 'sine', 0.1, 0.15);
    setTimeout(() => {
      this.playTone(1046.5, 'triangle', 0.15, 0.12);
    }, 60);
  }

  // Error / collision / spark rejection
  public playErrorSound() {
    if (this.isMuted) return;
    this.playTone(140, 'sawtooth', 0.18, 0.15);
    setTimeout(() => {
      this.playTone(95, 'sawtooth', 0.22, 0.18);
    }, 100);
  }

  // Quest victory fanfare
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const fanfare = [
      { f: 523.25, d: 0.1 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.1 },
      { f: 1046.5, d: 0.3 },
    ];
    let offset = 0;
    fanfare.forEach((n) => {
      setTimeout(() => {
        this.playTone(n.f, 'square', n.d, 0.12);
      }, offset);
      offset += n.d * 1000 + 30;
    });
  }
}

export const odysseyAudio = new OdysseyAudioManager();

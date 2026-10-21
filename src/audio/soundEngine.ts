/**
 * Web Audio API synthesizer for 'The Love Algorithm'.
 * Fully self-contained, no external MP3 dependencies, no autoplay,
 * and zero licensing or CORS risks.
 */

class LoveSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic: boolean = false;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private heartbeatInterval: number | null = null;
  private listeners: Set<() => void> = new Set();

  private chordIndex: number = 0;
  // Cinematic romantic progression in F/Dm: Dm9, Bbmaj7, Fmaj7, Cadd9
  private readonly chords: number[][] = [
    [146.83, 220.00, 261.63, 329.63, 440.00], // D3, A3, C4, E4, A4 (Dm9)
    [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4 (Bbmaj7)
    [174.61, 261.63, 329.63, 392.00, 523.25], // F3, C4, E4, G4, C5 (Fmaj7)
    [130.81, 196.00, 261.63, 293.66, 392.00], // C3, G3, C4, D4, G4 (Cadd9)
  ];

  private initContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      return this.ctx;
    } catch {
      return null;
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public getStatus() {
    return {
      isPlaying: this.isPlayingMusic,
      isMuted: this.isMuted,
    };
  }

  public togglePlay(): boolean {
    const ctx = this.initContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (this.isPlayingMusic) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
    this.notify();
    return this.isPlayingMusic;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime, 0.05);
    }
    this.notify();
    return this.isMuted;
  }

  private startMusic() {
    if (!this.ctx || this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.playNextChord();

    // Change ambient chord every 4.2 seconds
    this.musicInterval = window.setInterval(() => {
      this.playNextChord();
    }, 4200);

    // Heartbeat sub-bass pulse every 1.4 seconds
    this.heartbeatInterval = window.setInterval(() => {
      if (this.isPlayingMusic) {
        this.playHeartPulse(0.3);
      }
    }, 1400);
  }

  private pauseMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private playNextChord() {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    const now = this.ctx.currentTime;
    const duration = 4.4;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm triangle / soft sine blend
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Slight warm detune
      osc.detune.setValueAtTime((idx - 2) * 3, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + duration);

      // Soft swelling envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06 / chord.length, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  // SFX: Heartbeat thump
  public playHeartPulse(volumeMultiplier = 0.5) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // First beat (lub)
    this.triggerThump(now, 58, 30, 0.18, 0.35 * volumeMultiplier);
    // Second beat (dub)
    this.triggerThump(now + 0.18, 48, 25, 0.22, 0.25 * volumeMultiplier);
  }

  private triggerThump(time: number, startFreq: number, endFreq: number, dur: number, vol: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  // SFX: Mini-game heart collect sparkle chime
  public playCollectSparkle(pitchShift = 1) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 arpeggio

    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchShift, now + i * 0.04);

      gain.gain.setValueAtTime(0.001, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.09, now + i * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.36);
    });
  }

  // SFX: Laser scan sweep
  public playScanBeam() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  // SFX: Glitch frequency hop
  public playGlitchSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const stepTime = now + i * 0.07;

      osc.type = 'square';
      osc.frequency.setValueAtTime([320, 640, 210, 480][i], stepTime);

      gain.gain.setValueAtTime(0.04, stepTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(stepTime);
      osc.stop(stepTime + 0.06);
    }
  }

  // SFX: Celebration burst
  public playCelebrationBurst() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    // Low swell
    this.triggerThump(now, 120, 40, 0.6, 0.4);

    // Shimmer chord
    [440, 554.37, 659.25, 880, 1108.73].forEach((f) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.1);

      gain.gain.setValueAtTime(0.001, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + 0.1);
      osc.stop(now + 1.5);
    });
  }

  // Soft UI click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

export const soundEngine = new LoveSoundEngine();

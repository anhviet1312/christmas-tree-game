// Web Audio API Christmas Music Engine & Sound Effects
// Tự tạo giai điệu chuông Giáng Sinh du dương (Celesta / Music Box), không phụ thuộc file MP3 ngoài, chạy mượt trên mọi thiết bị.

class ChristmasAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.3; // Mặc định âm lượng 30%
    this.currentTrackIndex = 0;
    this.timerId = null;
    this.noteIndex = 0;
    this.listeners = new Set();

    // Tần số các nốt nhạc (Hz)
    this.NOTES = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      REST: 0
    };

    // Danh sách các bản nhạc Giáng Sinh kinh điển
    this.TRACKS = [
      {
        name: "Jingle Bells 🔔",
        tempo: 220, // ms per beat
        melody: [
          ["E5", 1], ["E5", 1], ["E5", 2],
          ["E5", 1], ["E5", 1], ["E5", 2],
          ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
          ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
          ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
          ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1], ["D5", 2], ["G5", 2],
          ["E5", 1], ["E5", 1], ["E5", 2],
          ["E5", 1], ["E5", 1], ["E5", 2],
          ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
          ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
          ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
          ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1], ["C5", 4], ["REST", 2]
        ]
      },
      {
        name: "We Wish You A Merry Christmas 🎄",
        tempo: 260,
        melody: [
          ["D4", 1], ["G4", 1], ["G4", 0.5], ["A4", 0.5], ["G4", 0.5], ["F4", 0.5],
          ["E4", 1], ["E4", 1], ["E4", 1],
          ["A4", 1], ["A4", 0.5], ["B4", 0.5], ["A4", 0.5], ["G4", 0.5],
          ["F4", 1], ["D4", 1], ["D4", 1],
          ["B4", 1], ["B4", 0.5], ["C5", 0.5], ["B4", 0.5], ["A4", 0.5],
          ["G4", 1], ["E4", 1], ["D4", 0.5], ["D4", 0.5],
          ["E4", 1], ["A4", 1], ["F4", 1], ["G4", 2], ["REST", 2]
        ]
      },
      {
        name: "Deck The Halls ✨",
        tempo: 200,
        melody: [
          ["G5", 1.5], ["F5", 0.5], ["E5", 1], ["D5", 1],
          ["C5", 1], ["D5", 1], ["E5", 1], ["C5", 1],
          ["D5", 0.5], ["E5", 0.5], ["F5", 0.5], ["D5", 0.5], ["E5", 1.5], ["D5", 0.5],
          ["C5", 1], ["B4", 1], ["C5", 2], ["REST", 2]
        ]
      }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Âm sắc tiếng chuông hộp nhạc Giáng sinh (Music Box Bell)
  playChimeTone(freq, duration = 0.5) {
    if (!this.ctx || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Hòa âm cao hơn 1 quãng tạo độ trong trẻo như chuông bạc
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    // Envelope tiếng chuông: vang nhẹ và tắt dần
    const masterGain = this.volume;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(masterGain * 0.7, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  playNextNote() {
    if (!this.isPlaying) return;

    const track = this.TRACKS[this.currentTrackIndex];
    if (this.noteIndex >= track.melody.length) {
      this.noteIndex = 0; // Lặp lại bài
    }

    const [noteName, beats] = track.melody[this.noteIndex];
    const freq = this.NOTES[noteName] || 0;
    const noteDurationMs = beats * track.tempo;

    if (freq > 0) {
      this.playChimeTone(freq, (noteDurationMs / 1000) * 1.5);
    }

    this.noteIndex++;
    this.timerId = setTimeout(() => {
      this.playNextNote();
    }, noteDurationMs);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playNextNote();
    this.notify();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.TRACKS.length;
    this.noteIndex = 0;
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    if (this.isPlaying) {
      this.playNextNote();
    }
    this.notify();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.notify();
  }

  // --- Hiệu ứng âm thanh thao tác (Sound Effects - SFX) ---
  playSuccessSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Arpeggio nốt C5 -> E5 -> G5 vui tươi
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.08);
    osc.frequency.setValueAtTime(783.99, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.volume * 0.8, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  playEquipSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Hiệu ứng "Bling" lấp lánh khi cắm đồ lên cây
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(this.volume * 0.6, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Quản lý Observer cập nhật UI
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach((fn) =>
      fn({
        isPlaying: this.isPlaying,
        volume: this.volume,
        currentTrack: this.TRACKS[this.currentTrackIndex]
      })
    );
  }
}

export const christmasAudio = new ChristmasAudioEngine();

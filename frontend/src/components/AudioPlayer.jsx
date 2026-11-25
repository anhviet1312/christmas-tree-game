import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Music, Play, Pause } from 'lucide-react';
import { christmasAudio } from '../services/audio';

export default function AudioPlayer() {
  const [audioState, setAudioState] = useState({
    isPlaying: christmasAudio.isPlaying,
    volume: christmasAudio.volume,
    currentTrack: christmasAudio.TRACKS[christmasAudio.currentTrackIndex]
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = christmasAudio.subscribe(setAudioState);
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    christmasAudio.toggle();
  };

  const handleNext = () => {
    christmasAudio.nextTrack();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    christmasAudio.setVolume(val);
  };

  return (
    <div className="relative">
      {/* Main Pill Button in Navbar */}
      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-full px-2.5 py-1 transition-all">
        <button
          onClick={handleToggle}
          title={audioState.isPlaying ? 'Tắt nhạc Giáng Sinh' : 'Bật nhạc Giáng Sinh'}
          className={`flex items-center justify-center p-1 rounded-full transition-all ${
            audioState.isPlaying
              ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {audioState.isPlaying ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Track Title + Popover Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs text-slate-300 font-medium hover:text-amber-300 transition-colors max-w-[110px] sm:max-w-[140px] truncate"
        >
          <Music className={`w-3 h-3 text-amber-400 ${audioState.isPlaying ? 'animate-bounce' : ''}`} />
          <span className="truncate">{audioState.currentTrack.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* Mini Controller Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 max-w-[85vw] bg-slate-900 border border-amber-500/30 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md z-50 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>🎶</span> Nhạc Giáng Sinh
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              Hộp Nhạc Celesta
            </span>
          </div>

          <p className="text-xs font-bold text-white mb-3 truncate">
            {audioState.currentTrack.name}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={handleToggle}
              className="p-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-full shadow-lg active:scale-95 transition-all"
            >
              {audioState.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              title="Đổi bài tiếp theo"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full transition-colors active:scale-95"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume slider */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Âm lượng</span>
              <span>{Math.round(audioState.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Track playlist */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
            {christmasAudio.TRACKS.map((t, idx) => (
              <button
                key={t.name}
                onClick={() => {
                  christmasAudio.currentTrackIndex = idx;
                  christmasAudio.noteIndex = 0;
                  if (!christmasAudio.isPlaying) {
                    christmasAudio.start();
                  } else {
                    christmasAudio.playNextNote();
                  }
                }}
                className={`w-full text-left text-xs px-2 py-1 rounded-lg truncate transition-colors ${
                  christmasAudio.currentTrackIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

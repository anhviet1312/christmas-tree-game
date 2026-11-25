import React, { useState, useEffect } from 'react';
import { Clock, CalendarCheck, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResourceCard({
  resources,
  onClaim,
  onDailyCheckin,
  isLoading
}) {
  const [secondsLeft, setSecondsLeft] = useState(resources?.remaining_claim_seconds || 0);

  useEffect(() => {
    setSecondsLeft(resources?.remaining_claim_seconds || 0);
  }, [resources?.remaining_claim_seconds]);

  // Bộ đếm ngược thời gian thực (Live Countdown)
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClaimClick = async () => {
    const success = await onClaim();
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#60a5fa', '#93c5fd', '#ffffff']
      });
    }
  };

  const handleDailyClick = async () => {
    const success = await onDailyCheckin();
    if (success) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f8b229', '#c41e3a', '#165b33']
      });
    }
  };

  const canClaim = secondsLeft <= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {/* 1. Thu Hoạch Tuyết Chu Kỳ (30 Phút) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-white text-base">Thu Hoạch Tuyết</h3>
                <p className="text-xs text-slate-400">Tuyết rơi tích lũy mỗi 30 phút</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              +25 ❄️
            </span>
          </div>

          <div className="my-3 py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Thời gian chờ:</span>
            <span className={`text-sm font-mono font-bold ${canClaim ? 'text-green-400' : 'text-amber-400'}`}>
              {canClaim ? 'Đã sẵn sàng! 🎉' : formatTime(secondsLeft)}
            </span>
          </div>
        </div>

        <button
          onClick={handleClaimClick}
          disabled={!canClaim || isLoading}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            canClaim
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-98 animate-pulse-glow'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {canClaim ? 'Thu Hoạch Ngay (+25 ❄️)' : `Chờ (${formatTime(secondsLeft)})`}
        </button>
      </div>

      {/* 2. Điểm Danh Nhận Quà Ngày */}
      <div className="bg-gradient-to-br from-slate-900 via-red-950/30 to-slate-900 border border-red-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-500/20 text-red-400 rounded-xl">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-white text-base">Điểm Danh Ngày</h3>
                <p className="text-xs text-slate-400">Mỗi ngày nhận 100+ bông tuyết</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              🔥 Chuỗi: {resources?.login_streak || 0} ngày
            </span>
          </div>

          <div className="my-3 py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Phần thưởng hôm nay:</span>
            <span className="text-sm font-bold text-amber-300">
              +{100 + ((resources?.login_streak || 1) - 1) * 15} ❄️
            </span>
          </div>
        </div>

        <button
          onClick={handleDailyClick}
          disabled={!resources?.can_daily_checkin || isLoading}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            resources?.can_daily_checkin
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-500/25 active:scale-98 animate-pulse-glow'
              : 'bg-slate-800/80 text-emerald-400 border border-slate-700/60 cursor-not-allowed'
          }`}
        >
          <Gift className="w-4 h-4" />
          {resources?.can_daily_checkin ? 'Điểm Danh Nhận Quà 🎁' : 'Đã Nhận Hôm Nay ✔️'}
        </button>
      </div>
    </div>
  );
}

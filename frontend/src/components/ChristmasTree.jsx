import React from 'react';
import { Plus, X, Lock, Sparkles, ArrowUpCircle } from 'lucide-react';
import ItemIcon from './ItemIcon';

export default function ChristmasTree({
  treeData,
  onSelectSlot,
  onUnequipSlot,
  onUpgradeLayer,
  isOwner = true,
  isLoading
}) {
  if (!treeData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <span className="text-5xl animate-bounce mb-3">🎄</span>
        <p>Đang tải cây thông Noel...</p>
      </div>
    );
  }

  const { layers, total_festive_score, owner_name } = treeData;

  return (
    <div className="flex flex-col items-center relative my-4 max-w-xl mx-auto">
      {/* Tiêu đề cây thông */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span>🎄</span> Cây Thông Của {owner_name}
        </h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tổng Điểm Không Khí: <strong>{total_festive_score} ⭐</strong></span>
          <span className="text-slate-400">|</span>
          <span className="text-blue-300">+{Math.floor(total_festive_score / 10)} ❄️ Buff Claim</span>
        </div>
      </div>

      {/* Container Cây Thông */}
      <div className="relative flex flex-col items-center w-full select-none">
        {layers.map((layer) => {
          const isUnlocked = layer.is_unlocked;
          const isTop = layer.layer_index === 0;

          // Chiều rộng theo tầng để tạo hình tam giác cây thông tự nhiên
          const layerWidths = [
            'w-40 sm:w-48', // Đỉnh
            'w-64 sm:w-72', // Tầng 1
            'w-80 sm:w-96', // Tầng 2
            'w-96 sm:w-[420px]' // Tầng 3
          ];

          return (
            <div
              key={layer.layer_index}
              className={`relative ${layerWidths[layer.layer_index]} -mt-4 transition-all duration-300 group`}
            >
              {/* Tán lá cây thông SVG / CSS */}
              <div
                className={`w-full py-6 px-4 rounded-3xl relative shadow-xl transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-emerald-700 via-green-800 to-emerald-950 border-t-2 border-green-500/50 shadow-green-950/60'
                    : 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-dashed border-slate-700/80 opacity-75'
                }`}
                style={{
                  clipPath: isTop
                    ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    : 'polygon(50% 0%, 15% 15%, 0% 100%, 100% 100%, 85% 15%)',
                  minHeight: isTop ? '110px' : '90px'
                }}
              >
                {/* Viền tuyết giả định đọng trên mép cành thông */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
              </div>

              {/* Lớp phủ nội dung Slots */}
              <div className="absolute inset-0 flex items-center justify-center pt-3">
                {isUnlocked ? (
                  <div className="flex items-center justify-center gap-4 sm:gap-6 z-10">
                    {layer.slots.map((slot) => {
                      const hasItem = !!slot.item;
                      return (
                        <div key={slot.slot_index} className="relative group/slot">
                          {hasItem ? (
                            /* Slot đã gắn vật phẩm */
                            <div className="flex flex-col items-center">
                              <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950/70 border-2 border-amber-400/60 flex items-center justify-center shadow-lg shadow-amber-400/20 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform"
                                title={`${slot.item.name} (+${slot.item.festive_score} điểm)`}
                              >
                                <ItemIcon code={slot.item.code} category={slot.item.category} size="text-2xl sm:text-3xl" />
                              </div>

                              {/* Nút gỡ vật phẩm khi chủ sở hữu hover */}
                              {isOwner && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUnequipSlot(layer.layer_index, slot.slot_index);
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/slot:opacity-100 transition-opacity"
                                  title="Gỡ vật phẩm cất vào túi"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            /* Slot còn trống */
                            isOwner && (
                              <button
                                onClick={() => onSelectSlot(layer.layer_index, slot.slot_index, layer.layer_name)}
                                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                                  isTop
                                    ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 animate-pulse'
                                    : 'border-white/50 bg-black/30 text-white/70 hover:bg-white/20 hover:scale-105'
                                }`}
                                title={isTop ? 'Gắn Ngôi sao đỉnh cây' : 'Bấm để trang trí'}
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Tầng chưa mở khóa */
                  <div className="z-10 flex flex-col items-center justify-center text-center px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700 mb-2">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{layer.layer_name} (Khóa)</span>
                    </div>
                    {isOwner && layer.unlock_cost && (
                      <button
                        onClick={() => onUpgradeLayer(layer.layer_index, layer.unlock_cost)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        Mở Khóa ({layer.unlock_cost} ❄️)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thân Cây (Gỗ nâu) */}
        <div className="w-12 sm:w-16 h-12 bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 rounded-b-lg border-x-2 border-amber-950/80 shadow-2xl relative -mt-1 z-0">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Lớp Tuyết Phủ Dưới Chân Cây */}
        <div className="w-72 sm:w-96 h-8 bg-gradient-to-t from-white/90 via-slate-100 to-white/70 rounded-full blur-[1px] -mt-4 shadow-xl shadow-blue-500/10 flex items-center justify-center">
          <span className="text-xs text-slate-600 font-semibold tracking-wider">❄️ MÙA GIÁNG SINH AN LÀNH ❄️</span>
        </div>
      </div>
    </div>
  );
}

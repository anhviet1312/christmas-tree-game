import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import ItemIcon from './ItemIcon';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'ALL', label: 'Tất Cả 🌟' },
  { id: 'TOPPER', label: 'Đỉnh Cây ⭐️' },
  { id: 'ORNAMENT', label: 'Treo Cành 🔴' },
  { id: 'LIGHT', label: 'Dây Đèn ✨' },
  { id: 'GIFT', label: 'Hộp Quà 🎁' },
];

export default function ShopModal({
  isOpen,
  onClose,
  items,
  snowflakes,
  onBuyItem,
  isLoading
}) {
  const [selectedCat, setSelectedCat] = useState('ALL');

  if (!isOpen) return null;

  const filteredItems = items.filter(
    (item) => selectedCat === 'ALL' || item.category === selectedCat
  );

  const handleBuy = async (item) => {
    const success = await onBuyItem(item.id, 1);
    if (success) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-red-500/20 text-red-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Cửa Hàng Giáng Sinh</h3>
              <p className="text-xs text-slate-400">Dùng Bông tuyết ❄️ để sắm đồ trang trí</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-950/80 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-bold text-blue-300">
              Số dư: {snowflakes.toLocaleString()} ❄️
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Item List */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const canAfford = snowflakes >= item.price;
            return (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col justify-between transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <ItemIcon code={item.code} category={item.category} size="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> +{item.festive_score} Điểm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="font-bold text-sm text-blue-400">
                    {item.price} ❄️
                  </span>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford || isLoading}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-red-600 hover:bg-red-500 text-white active:scale-95 shadow-md shadow-red-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Mua Ngay' : 'Thiếu Tuyết'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

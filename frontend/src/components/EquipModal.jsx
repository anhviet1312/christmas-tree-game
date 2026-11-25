import React from 'react';
import { X, Sparkles, ShoppingBag } from 'lucide-react';
import ItemIcon from './ItemIcon';
import confetti from 'canvas-confetti';

export default function EquipModal({
  isOpen,
  onClose,
  selectedSlot,
  inventory,
  onEquipItem,
  onOpenShop,
  isLoading
}) {
  if (!isOpen || !selectedSlot) return null;

  const { layerIndex, slotIndex, layerName } = selectedSlot;
  const isTop = layerIndex === 0;

  // Lọc các món đồ phù hợp với tầng này
  const eligibleItems = inventory.filter((inv) => {
    if (isTop) {
      return inv.item.category === 'TOPPER';
    }
    return inv.item.category !== 'TOPPER';
  });

  const handleEquip = async (itemId) => {
    const success = await onEquipItem(layerIndex, slotIndex, itemId);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#f8b229', '#c41e3a', '#ffffff']
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-green-500/30 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎀</span> Trang Trí Vào {layerName}
            </h3>
            <p className="text-xs text-slate-400">
              Vị trí Slot {slotIndex + 1} {isTop && '(Chỉ nhận Ngôi sao / Topper)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách vật phẩm có thể gắn */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {eligibleItems.length > 0 ? (
            eligibleItems.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-green-500/50 rounded-2xl p-3 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <ItemIcon code={inv.item.code} category={inv.item.category} size="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{inv.item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{inv.item.festive_score} điểm
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        (Còn {inv.quantity} món)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEquip(inv.item_id)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold rounded-xl shadow-md shadow-green-600/20 active:scale-95 transition-all"
                >
                  Gắn Lên
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <span className="text-4xl block mb-2">🎁</span>
              <p className="text-sm text-slate-300 font-semibold">Túi đồ của bạn chưa có món phù hợp!</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {isTop
                  ? 'Bạn cần mua một Ngôi sao hoặc Thiên thần trong Cửa hàng để gắn lên đỉnh cây.'
                  : 'Hãy ghé Cửa hàng Giáng sinh để sắm thêm quả cầu, chuông hoặc vớ quà nhé.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenShop();
                }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                Vào Cửa Hàng Ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

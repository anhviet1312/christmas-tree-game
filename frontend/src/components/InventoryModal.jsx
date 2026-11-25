import React from 'react';
import { X, Backpack, Sparkles, ShoppingBag } from 'lucide-react';
import ItemIcon from './ItemIcon';

export default function InventoryModal({
  isOpen,
  onClose,
  inventory,
  onOpenShop
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-green-500/30 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-green-500/20 text-green-400 rounded-xl">
              <Backpack className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Túi Đồ Trang Trí</h3>
              <p className="text-xs text-slate-400">Các món đồ Giáng sinh bạn đang sở hữu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {inventory.length > 0 ? (
            inventory.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <ItemIcon code={inv.item.code} category={inv.item.category} size="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{inv.item.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{inv.item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> +{inv.item.festive_score} Điểm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-xl text-center shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Số lượng</span>
                  <span className="text-sm font-bold text-green-400">{inv.quantity}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4">
              <span className="text-5xl block mb-2">🎒</span>
              <p className="text-sm text-slate-300 font-semibold">Túi đồ của bạn đang trống!</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Hãy dùng Bông tuyết nhận được hàng ngày để mua sắm vật phẩm trang trí.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenShop();
                }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                Vào Cửa Hàng Mua Sắm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

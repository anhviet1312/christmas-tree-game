import React from 'react';
import { ShoppingBag, Backpack, Eye, Shield } from 'lucide-react';

export default function BottomNav({
  user,
  onOpenShop,
  onOpenInventory,
  onOpenVisit,
  onOpenAdmin
}) {
  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Cửa Hàng */}
        <button
          onClick={onOpenShop}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl active:scale-95 transition-all text-slate-300 hover:text-red-400 group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-md">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold">Cửa Hàng</span>
        </button>

        {/* Túi Đồ */}
        <button
          onClick={onOpenInventory}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl active:scale-95 transition-all text-slate-300 hover:text-green-400 group"
        >
          <div className="w-9 h-9 rounded-xl bg-green-700/20 text-green-400 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shadow-md">
            <Backpack className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold">Túi Đồ</span>
        </button>

        {/* Ghé Thăm */}
        <button
          onClick={onOpenVisit}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl active:scale-95 transition-all text-slate-300 hover:text-blue-400 group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold">Ghé Thăm</span>
        </button>

        {/* Admin (Nếu có quyền) */}
        {user.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl active:scale-95 transition-all text-slate-300 hover:text-amber-400 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-amber-300">Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
}

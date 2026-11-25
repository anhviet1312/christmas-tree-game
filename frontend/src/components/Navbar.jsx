import React from 'react';
import { Sparkles, ShoppingBag, Backpack, Eye, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({
  user,
  snowflakes,
  festiveScore,
  onOpenShop,
  onOpenInventory,
  onOpenVisit,
  onOpenAuth,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-red-900/40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-3xl animate-bounce">🎄</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-400 via-amber-300 to-green-400 bg-clip-text text-transparent">
              Noel Magic Tree
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Giáng Sinh Ấm Áp 2026</p>
          </div>
        </div>

        {/* Resources & Status */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Snowflakes Counter */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/40 px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/10">
              <span className="text-xl animate-spin" style={{ animationDuration: '8s' }}>❄️</span>
              <div className="flex flex-col">
                <span className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Tuyết</span>
                <span className="text-sm sm:text-base font-bold text-white tabular-nums">
                  {snowflakes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Festive Score */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/40 px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs text-amber-300 uppercase tracking-wider font-semibold">Khí Thế</span>
                <span className="text-sm sm:text-base font-bold text-amber-200 tabular-nums">
                  {festiveScore} ⭐
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions & User */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={onOpenShop}
                className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-red-600/20 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline">Cửa Hàng</span>
              </button>

              <button
                onClick={onOpenInventory}
                className="flex items-center gap-1.5 bg-green-700/90 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-green-700/20 active:scale-95"
              >
                <Backpack className="w-4 h-4" />
                <span className="hidden md:inline">Túi Đồ</span>
              </button>

              <button
                onClick={onOpenVisit}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-700 transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Ghé Thăm</span>
              </button>

              {/* User Dropdown / Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="text-xs text-slate-300 font-medium hidden lg:inline max-w-[120px] truncate">
                  {user.display_name || user.username}
                </span>
                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              Đăng Nhập / Đăng Ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

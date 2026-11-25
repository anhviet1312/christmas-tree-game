import React, { useState, useEffect, useCallback } from 'react';
import { X, Shield, Search, Sparkles, UserCheck, UserX, Gift, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminModal({
  isOpen,
  onClose,
  onGetUsers,
  onBuffUser,
  onSetRole,
  currentUserId,
  onRefreshCurrentUserData
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buffModalUser, setBuffModalUser] = useState(null);
  const [buffAmount, setBuffAmount] = useState(500);
  const [buffReason, setBuffReason] = useState('Admin thưởng Giáng Sinh');
  const [actionMessage, setActionMessage] = useState('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await onGetUsers();
      setUsers(data);
    } catch (err) {
      setActionMessage(`Lỗi tải danh sách: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [onGetUsers]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.display_name && u.display_name.toLowerCase().includes(q))
    );
  });

  const handleExecuteBuff = async (e) => {
    e.preventDefault();
    if (!buffModalUser) return;

    try {
      const res = await onBuffUser(buffModalUser.id, parseInt(buffAmount, 10), buffReason);
      setActionMessage(res.message);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setBuffModalUser(null);
      await fetchUsers();
      if (buffModalUser.id === currentUserId && onRefreshCurrentUserData) {
        onRefreshCurrentUserData();
      }
    } catch (err) {
      setActionMessage(`Lỗi buff tài nguyên: ${err.message}`);
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'phong làm Admin' : 'hạ xuống User';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} cho người chơi [${targetUser.username}]?`)) {
      return;
    }

    try {
      const res = await onSetRole(targetUser.id, newRole);
      setActionMessage(res.message);
      await fetchUsers();
    } catch (err) {
      setActionMessage(`Lỗi cập nhật quyền: ${err.message}`);
    }
  };

  const totalSnowflakes = users.reduce((acc, cur) => acc + (cur.snowflakes || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                Quản Trị Viên (Admin Panel)
              </h3>
              <p className="text-xs text-slate-400">Quản lý người chơi & Buff tài nguyên Giáng Sinh</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              title="Làm mới dữ liệu"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action message banner */}
        {actionMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between">
            <span>✨ {actionMessage}</span>
            <button onClick={() => setActionMessage('')} className="text-emerald-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Stats summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border-b border-slate-800/80 bg-slate-950/40 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium">Tổng Người Chơi</span>
            <span className="text-base font-bold text-white">{users.length} tài khoản</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-400 block font-medium">Tổng Tuyết Trong Game</span>
            <span className="text-base font-bold text-blue-300">{totalSnowflakes.toLocaleString()} ❄️</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-slate-400 block font-medium">Số Lượng Admin</span>
            <span className="text-base font-bold text-amber-300">
              {users.filter((u) => u.role === 'admin').length} Quản trị viên
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/20">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo username hoặc tên hiển thị..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Users table */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            {filteredUsers.map((u) => {
              const isAdmin = u.role === 'admin';
              return (
                <div
                  key={u.id}
                  className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-3 sm:p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  {/* Left: User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                      {isAdmin ? '🛡️' : '⛄'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{u.display_name || u.username}</span>
                        <span className="text-xs text-slate-400 font-mono">(@{u.username})</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isAdmin ? 'Admin' : 'Player'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1">
                        <span>Số dư: <strong className="text-blue-300 font-mono">{u.snowflakes.toLocaleString()} ❄️</strong></span>
                        <span>Tầng: <strong className="text-green-400">{u.unlocked_layers}/4</strong></span>
                        <span>Điểm: <strong className="text-amber-300">{u.total_festive_score} ⭐</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 shrink-0">
                    {/* Buff Snowflakes Button */}
                    <button
                      onClick={() => {
                        setBuffModalUser(u);
                        setBuffAmount(500);
                      }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Buff Tuyết ❄️
                    </button>

                    {/* Toggle Role Button */}
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => handleToggleRole(u)}
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all ${
                          isAdmin
                            ? 'border-red-500/40 text-red-300 hover:bg-red-500/20'
                            : 'border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                        }`}
                        title={isAdmin ? 'Hạ quyền xuống User' : 'Phong quyền Admin'}
                      >
                        {isAdmin ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        <span className="hidden md:inline">{isAdmin ? 'Hạ Quyền' : 'Lên Admin'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm font-semibold">Không tìm thấy người chơi nào khớp từ khóa!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Modal Buff Tuyết */}
      {buffModalUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl w-full max-w-sm p-5 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <div>
                  <h4 className="font-bold text-white text-sm">Buff Bông Tuyết</h4>
                  <p className="text-xs text-slate-400">Cho người chơi: <strong>@{buffModalUser.username}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setBuffModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteBuff} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Số lượng Bông tuyết ❄️
                </label>
                <input
                  type="number"
                  required
                  value={buffAmount}
                  onChange={(e) => setBuffAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                />

                {/* Preset quick buttons */}
                <div className="flex gap-1.5 mt-2">
                  {[100, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBuffAmount(val)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg text-xs font-semibold"
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lý do buff
                </label>
                <input
                  type="text"
                  value={buffReason}
                  onChange={(e) => setBuffReason(e.target.value)}
                  placeholder="vd: Quà sự kiện Giáng Sinh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuffModalUser(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  Xác Nhận Buff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

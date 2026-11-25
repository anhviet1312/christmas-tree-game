import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import ChristmasTree from './ChristmasTree';

export default function VisitModal({
  isOpen,
  onClose,
  onFetchPublicTree,
  isLoading
}) {
  const [targetUsername, setTargetUsername] = useState('');
  const [visitedTree, setVisitedTree] = useState(null);
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    setSearchError('');
    try {
      const tree = await onFetchPublicTree(targetUsername.trim());
      setVisitedTree(tree);
    } catch (err) {
      setSearchError(err.message || 'Không tìm thấy người chơi này!');
      setVisitedTree(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-blue-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👀</span>
            <div>
              <h3 className="font-bold text-white text-base">Ghé Thăm Cây Thông Bạn Bè</h3>
              <p className="text-xs text-slate-400">Xem và chiêm ngưỡng tác phẩm của người khác</p>
            </div>
          </div>
          <button
            onClick={() => {
              setVisitedTree(null);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="Nhập username của bạn bè (vd: player_1)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              Tìm Kiếm
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-400 mt-2 font-medium">⚠️ {searchError}</p>
          )}
        </div>

        {/* Tree Display */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {visitedTree ? (
            <div className="w-full">
              <ChristmasTree
                treeData={visitedTree}
                isOwner={false}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <span className="text-5xl block mb-2">🔍</span>
              <p className="text-sm font-semibold">Nhập username người chơi để xem cây thông của họ!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

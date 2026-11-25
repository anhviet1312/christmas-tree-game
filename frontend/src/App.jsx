import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Snowfall from './components/Snowfall';
import ChristmasTree from './components/ChristmasTree';
import ResourceCard from './components/ResourceCard';
import ShopModal from './components/ShopModal';
import EquipModal from './components/EquipModal';
import InventoryModal from './components/InventoryModal';
import AuthModal from './components/AuthModal';
import VisitModal from './components/VisitModal';
import AdminModal from './components/AdminModal';
import BottomNav from './components/BottomNav';
import { api } from './services/api';
import { Sparkles, Gift, ShoppingBag, Eye, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { christmasAudio } from './services/audio';

export default function App() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Modals state
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Tải dữ liệu toàn diện của người chơi
  const loadUserData = useCallback(async () => {
    try {
      const [userData, resData, tree, inv] = await Promise.all([
        api.getMe(),
        api.getResources(),
        api.getMyTree(),
        api.getInventory()
      ]);
      setUser(userData);
      setResources(resData);
      setTreeData(tree);
      setInventory(inv);
    } catch (err) {
      console.warn('Chưa đăng nhập hoặc token hết hạn:', err.message);
      localStorage.removeItem('token');
      setUser(null);
      setResources(null);
      setTreeData(null);
    }
  }, []);

  // Tải dữ liệu shop công khai
  const loadShopItems = useCallback(async () => {
    try {
      const items = await api.getShopItems();
      setShopItems(items);
    } catch (err) {
      console.error('Lỗi tải cửa hàng:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserData();
    }
    loadShopItems();
  }, [loadUserData, loadShopItems]);

  // Handler: Thu hoạch chu kỳ (Claim 30m)
  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const data = await api.claimResource();
      christmasAudio.playSuccessSound();
      showToast(data.message, 'success');
      // Cập nhật lại tài nguyên và cây
      const updatedRes = await api.getResources();
      setResources(updatedRes);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Điểm danh ngày
  const handleDailyCheckin = async () => {
    setIsLoading(true);
    try {
      const data = await api.dailyCheckin();
      christmasAudio.playSuccessSound();
      showToast(data.message, 'success');
      const updatedRes = await api.getResources();
      setResources(updatedRes);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Mua vật phẩm từ shop
  const handleBuyItem = async (itemId, quantity) => {
    setIsLoading(true);
    try {
      const data = await api.buyItem(itemId, quantity);
      christmasAudio.playSuccessSound();
      showToast(data.message, 'success');
      const [updatedRes, updatedInv] = await Promise.all([
        api.getResources(),
        api.getInventory()
      ]);
      setResources(updatedRes);
      setInventory(updatedInv);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Gắn vật phẩm vào slot
  const handleEquipItem = async (layerIndex, slotIndex, itemId) => {
    setIsLoading(true);
    try {
      const data = await api.equipSlot(layerIndex, slotIndex, itemId);
      christmasAudio.playEquipSound();
      showToast(data.message, 'success');
      const [updatedTree, updatedInv] = await Promise.all([
        api.getMyTree(),
        api.getInventory()
      ]);
      setTreeData(updatedTree);
      setInventory(updatedInv);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Gỡ vật phẩm khỏi slot
  const handleUnequipItem = async (layerIndex, slotIndex) => {
    setIsLoading(true);
    try {
      const data = await api.unequipSlot(layerIndex, slotIndex);
      showToast(data.message, 'success');
      const [updatedTree, updatedInv] = await Promise.all([
        api.getMyTree(),
        api.getInventory()
      ]);
      setTreeData(updatedTree);
      setInventory(updatedInv);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Mở khóa tầng cây
  const handleUpgradeLayer = async (layerIndex, cost) => {
    if (!window.confirm(`Bạn có chắc muốn dùng ${cost} ❄️ để mở khóa tầng này không?`)) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.upgradeLayer();
      showToast(data.message, 'success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      const [updatedTree, updatedRes] = await Promise.all([
        api.getMyTree(),
        api.getResources()
      ]);
      setTreeData(updatedTree);
      setResources(updatedRes);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Auth
  const handleLogin = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('token', data.access_token);
      await loadUserData();
      showToast(`Chào mừng ${data.user.display_name || data.user.username} trở lại! 🎅`, 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username, password, displayName) => {
    setIsLoading(true);
    try {
      const data = await api.register(username, password, displayName);
      localStorage.setItem('token', data.access_token);
      await loadUserData();
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      showToast(`Đăng ký thành công! Bạn nhận được +100 ❄️ khởi đầu! 🎁`, 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setResources(null);
    setTreeData(null);
    showToast('Đã đăng xuất tài khoản.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-24 md:pb-12">
      {/* Hiệu ứng tuyết rơi tự nhiên */}
      <Snowfall count={40} />

      {/* Navbar */}
      <Navbar
        user={user}
        snowflakes={resources?.snowflakes || 0}
        festiveScore={treeData?.total_festive_score || 0}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenVisit={() => setIsVisitOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-red-900/90 border-red-500 text-red-100'
                : 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
            }`}
          >
            <span>{toast.type === 'error' ? '❌' : '✨'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 mt-4">
        {user ? (
          <>
            {/* Thanh tài nguyên (Tích lũy chu kỳ + Điểm danh ngày) */}
            <ResourceCard
              resources={resources}
              onClaim={handleClaim}
              onDailyCheckin={handleDailyCheckin}
              isLoading={isLoading}
            />

            {/* Cây Thông Noel Của Người Chơi */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <ChristmasTree
                treeData={treeData}
                onSelectSlot={(layerIndex, slotIndex, layerName) => {
                  setSelectedSlot({ layerIndex, slotIndex, layerName });
                }}
                onUnequipSlot={handleUnequipItem}
                onUpgradeLayer={handleUpgradeLayer}
                isOwner={true}
                isLoading={isLoading}
              />
            </div>
          </>
        ) : (
          /* Hero Banner khi chưa đăng nhập */
          <div className="my-12 text-center py-16 px-6 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-900/90 border border-red-500/30 rounded-3xl shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-green-600/15 rounded-full blur-3xl pointer-events-none" />

            <span className="text-6xl sm:text-7xl block mb-4 animate-bounce">🎄</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Xây Dựng Cây Thông Giáng Sinh Của Riêng Bạn!
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mt-3 mb-8">
              Thu thập Bông tuyết ❄️ mỗi ngày, mua sắm những quả cầu lấp lánh, ngôi sao vàng và trang trí từng tầng cây để đón mùa Giáng Sinh an lành.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Đăng Ký Nhận 100 ❄️ Khởi Đầu
              </button>

              <button
                onClick={() => setIsVisitOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Ghé Thăm Cây Bạn Bè
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 text-left">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-2xl block mb-1">🎁</span>
                <h4 className="font-bold text-white text-sm">Điểm Danh Hàng Ngày</h4>
                <p className="text-xs text-slate-400 mt-1">Chuỗi điểm danh càng cao, bông tuyết nhận được càng nhiều.</p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-2xl block mb-1">⭐️</span>
                <h4 className="font-bold text-white text-sm">Mở Khóa Tầng & Slot</h4>
                <p className="text-xs text-slate-400 mt-1">Cây thông có nhiều tầng, mỗi tầng sở hữu các slot trang trí độc đáo.</p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <span className="text-2xl block mb-1">✨</span>
                <h4 className="font-bold text-white text-sm">Càng Đẹp Càng Lợi</h4>
                <p className="text-xs text-slate-400 mt-1">Điểm khí thế trang trí sẽ cộng thêm tài nguyên mỗi lần thu hoạch.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 mt-auto pt-8">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Christmas 2026
        </p>
      </footer>

      {/* Modals */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        items={shopItems}
        snowflakes={resources?.snowflakes || 0}
        onBuyItem={handleBuyItem}
        isLoading={isLoading}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={inventory}
        onOpenShop={() => {
          setIsInventoryOpen(false);
          setIsShopOpen(true);
        }}
      />

      <EquipModal
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        selectedSlot={selectedSlot}
        inventory={inventory}
        onEquipItem={handleEquipItem}
        onOpenShop={() => {
          setSelectedSlot(null);
          setIsShopOpen(true);
        }}
        isLoading={isLoading}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />

      <VisitModal
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
        onFetchPublicTree={api.getPublicTree}
        isLoading={isLoading}
      />

      {user?.role === 'admin' && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onGetUsers={api.adminGetUsers}
          onBuffUser={api.adminBuffUser}
          onSetRole={api.adminSetRole}
          currentUserId={user?.id}
          onRefreshCurrentUserData={loadUserData}
        />
      )}

      {/* Mobile Bottom Navigation Bar (Hiển thị cố định dưới cùng trên màn hình điện thoại) */}
      <BottomNav
        user={user}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenVisit={() => setIsVisitOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}

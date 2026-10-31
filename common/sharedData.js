/**
 * Pojok Makanan - Shared Data & State Manager
 * Menyediakan data bersama dan menyimpan perubahan secara persisten di localStorage.
 */

(function () {
  const STORAGE_KEY = 'POJOK_MAKANAN_SHARED_V5';

  // Hapus semua data contoh dummy agar dimulai dari kosong sesuai permintaan pengguna
  const DEFAULT_FOODS = [];

  const DEFAULT_STATS = {
    portions: 0,
    impactKg: 0,
    co2SavedKg: 0,
    totalDonations: 0,
  };

  const DEFAULT_PANTRIES = [
    {
      id: 'pantry-1',
      name: 'Pojok Berbagi Tebet Ramah Warga',
      address: 'Jl. Tebet Barat Dalam Raya No. 14 (Depan Balai Warga RW 02)',
      city: 'Jakarta Selatan',
      operationalHours: '06.00 - 20.00 WIB',
      status: 'Banyak Makanan',
      itemsCount: 0,
      hasRefrigerator: true,
      distanceKm: 0.9,
    },
    {
      id: 'pantry-2',
      name: 'Lemari Pangan Berkah Kemang',
      address: 'Jl. Kemang Timur No. 3A (Samping Masjid Baitul Hikmah)',
      city: 'Jakarta Selatan',
      operationalHours: '24 Jam',
      status: 'Stok Sedang',
      itemsCount: 0,
      hasRefrigerator: true,
      distanceKm: 2.8,
    },
    {
      id: 'pantry-3',
      name: 'Dapur Solidaritas Cikini',
      address: 'Jl. Cikini Raya No. 73, Menteng',
      city: 'Jakarta Pusat',
      operationalHours: '07.00 - 18.00 WIB',
      status: 'Siap Terima Donasi',
      itemsCount: 0,
      hasRefrigerator: false,
      distanceKm: 4.5,
    },
    {
      id: 'pantry-4',
      name: 'Pojok Makanan Mahasiswa UI Depok',
      address: 'Pusat Kegiatan Mahasiswa UI, Pondok Cina',
      city: 'Depok',
      operationalHours: '08.00 - 19.00 WIB',
      status: 'Siap Terima Donasi',
      itemsCount: 0,
      hasRefrigerator: true,
      distanceKm: 14.2,
    },
  ];

  const DEFAULT_USER = {
    name: 'Dzaky Muthohary',
    email: 'dzakymuthohary@gmail.com',
    phone: '0812-9876-5432',
    role: 'Pahlawan Pangan Komunitas',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    city: 'Jakarta Selatan',
    address: 'Jl. Tebet Raya No. 28, Tebet',
    points: 0,
    impactKg: 0,
    portionsShared: 0,
    co2SavedKg: 0,
    totalDonations: 0,
    totalClaimed: 0,
  };

  const DEFAULT_CHATS = [
    {
      id: 'chat-1',
      participantName: 'Katering Sedap Nusantara',
      participantRole: 'Pemberi Makanan',
      participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      isOnline: true,
      lastMessage: 'Halo Kak, ada yang bisa dibantu terkait donasi pangan?',
      lastTimestamp: 'Baru saja',
      unreadCount: 0,
      relatedFoodTitle: 'Pojok Makanan Komunitas',
      messages: [
        {
          id: 'm1',
          senderName: 'Katering Sedap Nusantara',
          text: 'Halo Kak! Selamat datang di Pojok Makanan.',
          timestamp: 'Baru saja',
          isUser: false,
        },
      ],
    },
  ];

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.stats) parsed.stats = { ...DEFAULT_STATS };
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat shared data:', e);
    }
    return {
      foods: DEFAULT_FOODS,
      pantries: DEFAULT_PANTRIES,
      user: { ...DEFAULT_USER },
      stats: { ...DEFAULT_STATS },
      chats: DEFAULT_CHATS,
      activeChatId: DEFAULT_CHATS[0].id,
    };
  }

  const dataStore = loadData();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataStore));
    } catch (e) {
      console.warn('Gagal menyimpan shared data:', e);
    }
  }

  window.PM_DATA = {
    getFoods() {
      return dataStore.foods;
    },
    getFoodById(id) {
      return dataStore.foods.find((f) => f.id === id);
    },
    getStats() {
      if (!dataStore.stats) dataStore.stats = { ...DEFAULT_STATS };
      return dataStore.stats;
    },
    addFood(food) {
      dataStore.foods.unshift(food);

      // Metrik sistem bertambah dinamis
      if (!dataStore.stats) dataStore.stats = { ...DEFAULT_STATS };
      dataStore.stats.portions += Number(food.portions) || 0;
      dataStore.stats.impactKg = parseFloat(((dataStore.stats.impactKg || 0) + (Number(food.weightKg) || 0)).toFixed(1));
      dataStore.stats.co2SavedKg = parseFloat(((dataStore.stats.co2SavedKg || 0) + (Number(food.weightKg) || 0) * 2.5).toFixed(1));
      dataStore.stats.totalDonations += 1;

      // Metrik user profil bertambah dinamis
      dataStore.user.totalDonations = (dataStore.user.totalDonations || 0) + 1;
      dataStore.user.portionsShared = (dataStore.user.portionsShared || 0) + (Number(food.portions) || 0);
      dataStore.user.impactKg = parseFloat(((dataStore.user.impactKg || 0) + (Number(food.weightKg) || 0)).toFixed(1));
      dataStore.user.co2SavedKg = parseFloat(((dataStore.user.co2SavedKg || 0) + (Number(food.weightKg) || 0) * 2.5).toFixed(1));
      dataStore.user.points = (dataStore.user.points || 0) + 50;

      persist();
    },
    claimFood(foodId, qty) {
      const food = dataStore.foods.find((f) => f.id === foodId);
      if (food) {
        food.portions = Math.max(0, food.portions - qty);
        if (food.portions === 0) food.status = 'completed';
        dataStore.user.totalClaimed = (dataStore.user.totalClaimed || 0) + qty;
        dataStore.user.points = (dataStore.user.points || 0) + 15;
        persist();
      }
    },
    getPantries() {
      return dataStore.pantries;
    },
    getUser() {
      return dataStore.user;
    },
    updateUser(updated) {
      dataStore.user = { ...dataStore.user, ...updated };
      persist();
    },
    getChats() {
      return dataStore.chats;
    },
    getActiveChatId() {
      return dataStore.activeChatId || dataStore.chats[0]?.id;
    },
    setActiveChatId(id) {
      dataStore.activeChatId = id;
      persist();
    },
    addChatMessage(threadId, text, isUser, senderName) {
      const thread = dataStore.chats.find((c) => c.id === threadId);
      if (thread) {
        thread.messages.push({
          id: `msg-${Date.now()}`,
          senderName: senderName || (isUser ? dataStore.user.name : thread.participantName),
          text,
          timestamp: 'Baru saja',
          isUser,
        });
        thread.lastMessage = text;
        thread.lastTimestamp = 'Baru saja';
        persist();
      }
    },
    getUrgencyBadge(hoursRemaining) {
      if (hoursRemaining <= 3) {
        return {
          label: `Segera! Sisa ${hoursRemaining} Jam`,
          classes: 'bg-red-50 text-red-700 border-red-200',
          badgeBg: 'bg-red-600 text-white',
        };
      }
      if (hoursRemaining <= 8) {
        return {
          label: `Sisa ${hoursRemaining} Jam Hari Ini`,
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          badgeBg: 'bg-amber-600 text-white',
        };
      }
      return {
        label: `Aman (Sisa ${hoursRemaining} Jam)`,
        classes: 'bg-emerald-50 text-[#2D6A4F] border-emerald-200',
        badgeBg: 'bg-[#2D6A4F] text-white',
      };
    },
  };
})();

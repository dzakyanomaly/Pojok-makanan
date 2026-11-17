/**
 * Pojok Makanan - Shared Data & State Manager
 * V8 — Data food direset bersih, login validasi nama+password,
 * poin mulai dari 0, +10 poin per kg donasi.
 */

(function () {
  const STORAGE_KEY = 'POJOK_MAKANAN_V8';

  // Tidak ada data makanan contoh — semua dimulai dari kosong
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

  // Default user: belum login, poin 0
  const DEFAULT_USER = {
    isLoggedIn: false,
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Pahlawan Pangan Komunitas',
    avatar: '',
    city: '',
    address: '',
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
      participantName: 'Admin Pojok Makanan',
      participantRole: 'Pemberi Makanan',
      participantAvatar: '',
      isOnline: true,
      lastMessage: 'Halo! Selamat datang di Pojok Makanan. Ada yang bisa dibantu?',
      lastTimestamp: 'Baru saja',
      unreadCount: 0,
      relatedFoodTitle: 'Pojok Makanan Komunitas',
      messages: [
        {
          id: 'm1',
          senderName: 'Admin Pojok Makanan',
          text: 'Halo! Selamat datang di Pojok Makanan. Silakan donasikan makanan surplus Anda atau klaim makanan tersedia di sekitar Anda.',
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
        if (!parsed.user) parsed.user = { ...DEFAULT_USER };
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat shared data:', e);
    }
    return {
      foods: [...DEFAULT_FOODS],
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
    isLoggedIn() {
      return Boolean(dataStore.user && dataStore.user.isLoggedIn);
    },

    /**
     * Login — validasi nama + password harus cocok dengan yang tersimpan.
     * Kalau belum punya akun (pertama kali), daftarkan otomatis.
     * Returns: { success: true/false, message: string }
     */
    login(name, password) {
      if (!name || !password) {
        return { success: false, message: 'Nama dan kata sandi tidak boleh kosong.' };
      }

      const trimmedName = name.trim();
      const trimmedPwd = password.trim();

      if (!dataStore.user) dataStore.user = { ...DEFAULT_USER };

      // Kalau sudah pernah daftar (ada nama & password tersimpan)
      if (dataStore.user.name && dataStore.user.password) {
        // Validasi: nama DAN password harus cocok
        if (
          dataStore.user.name.toLowerCase() !== trimmedName.toLowerCase() ||
          dataStore.user.password !== trimmedPwd
        ) {
          return { success: false, message: 'Nama atau kata sandi salah. Silakan coba lagi.' };
        }
        // Cocok → login
        dataStore.user.isLoggedIn = true;
        persist();
        return { success: true, message: `Selamat datang kembali, ${dataStore.user.name}!` };
      }

      // Belum pernah daftar → buat akun baru
      dataStore.user.isLoggedIn = true;
      dataStore.user.name = trimmedName;
      dataStore.user.password = trimmedPwd;
      dataStore.user.email = `${trimmedName.toLowerCase().replace(/\s+/g, '')}@pojok.id`;
      dataStore.user.phone = '';
      dataStore.user.city = '';
      dataStore.user.avatar = '';
      dataStore.user.points = 0;
      persist();
      return { success: true, message: `Akun baru berhasil dibuat! Selamat datang, ${trimmedName}!`, isNewUser: true };
    },

    logout() {
      if (dataStore.user) {
        dataStore.user.isLoggedIn = false;
        persist();
      }
    },

    /**
     * Ganti akun: logout dan hapus data user lama,
     * sehingga orang lain bisa daftar/login dengan nama baru.
     */
    switchAccount() {
      dataStore.user = { ...DEFAULT_USER };
      persist();
    },

    getUser() {
      return dataStore.user;
    },

    updateUser(updated) {
      dataStore.user = { ...dataStore.user, ...updated };
      persist();
      return dataStore.user;
    },

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
      const weight = Number(food.weightKg) || 1;
      // +10 poin per kg makanan yang didonasikan
      const earnedPoints = Math.max(1, Math.round(weight * 10));

      food.earnedPoints = earnedPoints;
      dataStore.foods.unshift(food);

      if (!dataStore.stats) dataStore.stats = { ...DEFAULT_STATS };
      dataStore.stats.portions += Number(food.portions) || 0;
      dataStore.stats.impactKg = parseFloat(((dataStore.stats.impactKg || 0) + weight).toFixed(1));
      dataStore.stats.co2SavedKg = parseFloat(((dataStore.stats.co2SavedKg || 0) + weight * 2.5).toFixed(1));
      dataStore.stats.totalDonations += 1;

      if (dataStore.user) {
        dataStore.user.totalDonations = (dataStore.user.totalDonations || 0) + 1;
        dataStore.user.portionsShared = (dataStore.user.portionsShared || 0) + (Number(food.portions) || 0);
        dataStore.user.impactKg = parseFloat(((dataStore.user.impactKg || 0) + weight).toFixed(1));
        dataStore.user.co2SavedKg = parseFloat(((dataStore.user.co2SavedKg || 0) + weight * 2.5).toFixed(1));
        dataStore.user.points = (dataStore.user.points || 0) + earnedPoints;
      }

      persist();
      return earnedPoints;
    },

    claimFood(foodId, qty) {
      const food = dataStore.foods.find((f) => f.id === foodId);
      if (food) {
        food.portions = Math.max(0, food.portions - qty);
        if (food.portions === 0) food.status = 'completed';
        if (dataStore.user) {
          dataStore.user.totalClaimed = (dataStore.user.totalClaimed || 0) + qty;
        }
        persist();
      }
    },

    getPantries() {
      return dataStore.pantries;
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
          senderName: senderName || (isUser ? (dataStore.user?.name || 'Saya') : thread.participantName),
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

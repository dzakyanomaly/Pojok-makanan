/**
 * Controller untuk Modal Dialogs: Detail, Klaim, Profil, dan Artikel
 */

import { state, saveState, getUrgencyBadge } from '../js/state.js';
import { ARTICLES } from '../js/data.js';

export function openFoodDetail(foodId) {
  const food = state.foods.find((f) => f.id === foodId);
  if (!food) return;

  const modal = document.getElementById('food-detail-modal');
  const content = document.getElementById('modal-detail-content');
  if (!modal || !content) return;

  const badge = getUrgencyBadge(food.hoursRemaining);
  const percentLeft = Math.round((food.portions / food.initialPortions) * 100);

  content.innerHTML = `
    <div class="relative h-64 w-full bg-[#FAF6F0]">
      <img src="${food.imageUrl}" alt="${food.title}" class="w-full h-full object-cover" />
      <div class="absolute top-4 left-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${badge.classes}">
          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
          <span>${badge.label}</span>
        </span>
      </div>
      <div class="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
        <span>${food.distanceKm} km dari Anda</span>
      </div>
    </div>
    <div class="p-6 sm:p-7 space-y-6">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">${food.categoryLabel}</span>
          ${food.halalVerified ? '<span class="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i> Halal Terverifikasi</span>' : ''}
          <span class="text-[#6C6259] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#E8DFD1]">Metode: ${food.distributionMethod}</span>
        </div>
        <h2 class="font-serif text-2xl font-bold text-[#24201D] leading-tight">${food.title}</h2>
        <p class="text-sm text-[#594A38] leading-relaxed pt-1">${food.description}</p>
      </div>

      <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-[#594A38]">Kondisi Makanan:</span>
          <span class="font-bold text-[#24201D]">${food.condition}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#594A38]">Waktu Masak / Dibuat:</span>
          <span class="text-[#6C6259]">${food.cookedTime}</span>
        </div>
        <div class="pt-2 border-t border-[#E8DFD1] space-y-1">
          <div class="flex justify-between">
            <span class="text-[#594A38]">Porsi Tersedia:</span>
            <span class="font-bold text-[#2D6A4F]">${food.portions} / ${food.initialPortions} Porsi (${food.weightKg} kg)</span>
          </div>
          <div class="w-full bg-white rounded-full h-2 overflow-hidden border border-[#D9CDBF]">
            <div class="bg-[#2D6A4F] h-full rounded-full transition-all duration-500" style="width: ${percentLeft}%"></div>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-2xl border border-[#E8DFD1] bg-white flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="${food.donorAvatar}" class="w-11 h-11 rounded-full object-cover border border-[#D9CDBF]" />
          <div>
            <div class="font-bold text-xs sm:text-sm text-[#24201D]">${food.donorName} ✓</div>
            <div class="text-[11px] text-[#7D7166]">${food.donorType} • Penderma Terdaftar</div>
          </div>
        </div>
        <button onclick="window.app.startChatWithDonor('${food.donorName}', '${food.title}')" class="px-3.5 py-1.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#2D6A4F] hover:bg-[#FAF6F0] cursor-pointer flex items-center gap-1.5 transition">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Chat</span>
        </button>
      </div>

      <div class="text-xs text-[#594A38]">
        <strong>📍 Titik Lokasi Pengambilan:</strong>
        <p class="text-[#6C6259] mt-0.5">${food.pickupLocation}, ${food.city}</p>
      </div>

      <div class="pt-2 border-t border-[#F0EAE1]">
        <button onclick="window.app.openClaimModal('${food.id}')" class="w-full py-3 px-6 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer flex items-center justify-center gap-2">
          <i data-lucide="heart" class="w-4 h-4"></i>
          <span>Klaim Makanan Ini Sekarang (${food.portions} Tersedia)</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function openClaimModal(foodId) {
  const food = state.foods.find((f) => f.id === foodId);
  if (!food) return;

  // Tutup detail modal
  document.getElementById('food-detail-modal')?.classList.add('hidden');

  const claimModal = document.getElementById('claim-modal');
  const body = document.getElementById('claim-modal-body');
  if (!claimModal || !body) return;

  body.innerHTML = `
    <div class="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] flex items-center gap-3">
      <img src="${food.imageUrl}" class="w-14 h-14 rounded-xl object-cover shrink-0" />
      <div class="text-xs min-w-0">
        <h4 class="font-bold text-[#24201D] truncate">${food.title}</h4>
        <p class="text-[#6C6259]">${food.donorName}</p>
        <p class="text-[#2D6A4F] font-semibold">Tersedia ${food.portions} porsi</p>
      </div>
    </div>

    <div>
      <label class="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-2">Jumlah Porsi yang Diambil:</label>
      <input type="number" id="claim-portion-input" min="1" max="${Math.min(5, food.portions)}" value="2" class="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm font-bold text-[#24201D]" />
      <span class="text-[11px] text-[#6C6259] mt-1 block">Maks. 5 porsi per klaim agar merata bagi warga lain.</span>
    </div>

    <div>
      <label class="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">Tujuan Penyaluran:</label>
      <select id="claim-intention" class="w-full px-3.5 py-2 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-xs text-[#24201D]">
        <option>Konsumsi Pribadi / Keluarga di Rumah</option>
        <option>Dibagikan ke Warga Dhuafa Sekitar</option>
        <option>Disalurkan ke Panti Asuhan</option>
      </select>
    </div>

    <label class="flex items-start gap-2 p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DFD1] text-xs cursor-pointer">
      <input type="checkbox" checked class="w-4 h-4 rounded text-[#2D6A4F] mt-0.5" />
      <span class="text-[#594A38]"><strong>Bawa Wadah Sendiri:</strong> Saya bersedia membawa tas atau kotak makan sendiri saat mengambil donasi demi menjaga lingkungan.</span>
    </label>

    <div class="pt-2 flex justify-end gap-2">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] cursor-pointer">Batal</button>
      <button onclick="window.app.confirmClaim('${food.id}')" class="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] active:scale-95 transition cursor-pointer">
        Konfirmasi Klaim Pangan
      </button>
    </div>
  `;

  claimModal.classList.remove('hidden');
}

export function confirmClaim(foodId) {
  const food = state.foods.find((f) => f.id === foodId);
  if (!food) return;

  const qtyInput = document.getElementById('claim-portion-input');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  // Kurangi porsi
  food.portions = Math.max(0, food.portions - qty);
  if (food.portions === 0) food.status = 'completed';

  // Update profil user
  state.user.totalClaimed += qty;
  state.user.points += 15;
  saveState();

  const code = `PM-${Math.floor(1000 + Math.random() * 9000)}`;

  const body = document.getElementById('claim-modal-body');
  if (body) {
    body.innerHTML = `
      <div class="text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-[#2D6A4F] mx-auto flex items-center justify-center">
          <i data-lucide="check-circle" class="w-10 h-10"></i>
        </div>
        <span class="text-[10px] font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Klaim Berhasil Dicatat
        </span>
        <h3 class="font-serif text-xl font-bold text-[#24201D]">Tiket Pengambilan Pangan</h3>
        <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
          <div class="flex justify-center py-2 text-[#2D6A4F]">
            <i data-lucide="qr-code" class="w-16 h-16"></i>
          </div>
          <div class="font-mono text-lg font-bold text-[#24201D] bg-white py-1.5 rounded-lg border border-[#E8DFD1]">#${code}</div>
          <p class="text-xs text-[#594A38]"><strong>Item:</strong> ${food.title} (${qty} Porsi)</p>
          <p class="text-xs text-[#6C6259]">📍 ${food.pickupLocation}</p>
        </div>
        <button onclick="document.getElementById('claim-modal').classList.add('hidden'); window.app.startChatWithDonor('${food.donorName}', '${food.title}')" class="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer flex items-center justify-center gap-2">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Chat dengan Penderma</span>
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // Refresh tampilan halaman yang aktif
  if (window.app.refreshCurrentPage) {
    window.app.refreshCurrentPage();
  }
}

export function startChatWithDonor(donorName, foodTitle) {
  let thread = state.chats.find((c) => c.participantName.toLowerCase() === donorName.toLowerCase());
  if (!thread) {
    thread = {
      id: `chat-${Date.now()}`,
      participantName: donorName,
      participantRole: 'Pemberi Makanan',
      participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      isOnline: true,
      lastMessage: `Halo Kak, terkait donasi "${foodTitle}"`,
      lastTimestamp: 'Baru saja',
      unreadCount: 0,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderName: state.user.name,
          text: `Halo ${donorName}! Saya ingin berkoordinasi mengenai donasi "${foodTitle}". Kapan waktu terbaik untuk mengambilnya?`,
          timestamp: 'Baru saja',
          isUser: true,
        },
      ],
    };
    state.chats.unshift(thread);
    saveState();
  }

  state.activeChatId = thread.id;
  document.getElementById('food-detail-modal')?.classList.add('hidden');
  document.getElementById('claim-modal')?.classList.add('hidden');
  window.app.navigateTo('pesan');
}

export function openArticleModal(articleId) {
  const art = ARTICLES.find((a) => a.id === articleId);
  if (!art) return;

  const modal = document.getElementById('article-modal');
  const content = document.getElementById('article-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <span class="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2D6A4F]">${art.category}</span>
    <h2 class="font-serif text-2xl font-bold text-[#24201D] mt-2">${art.title}</h2>
    <div class="text-xs text-[#7D7166] mt-1">${art.author} • ${art.date} • ${art.readTime}</div>
    <img src="${art.imageUrl}" alt="${art.title}" class="w-full h-52 object-cover rounded-2xl my-4" />
    <div class="space-y-3 text-sm text-[#4A4036] leading-relaxed">
      ${art.content.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-1.5 mt-4 text-xs">
      <div class="font-bold text-[#2D6A4F] flex items-center gap-1.5">
        <i data-lucide="check-circle-2" class="w-4 h-4"></i>
        <span>Tips Praktis:</span>
      </div>
      <ul class="list-disc pl-5 space-y-1 text-[#594A38]">
        ${art.tips.map((t) => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function openEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (!modal) return;

  const nameInput = document.getElementById('edit-name');
  const phoneInput = document.getElementById('edit-phone');
  const cityInput = document.getElementById('edit-city');

  if (nameInput) nameInput.value = state.user.name;
  if (phoneInput) phoneInput.value = state.user.phone;
  if (cityInput) cityInput.value = state.user.city;

  modal.classList.remove('hidden');
}

export function initModalsEvents() {
  // Close buttons
  document.getElementById('btn-close-detail')?.addEventListener('click', () => {
    document.getElementById('food-detail-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-close-claim')?.addEventListener('click', () => {
    document.getElementById('claim-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-close-article')?.addEventListener('click', () => {
    document.getElementById('article-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-close-edit-profile')?.addEventListener('click', () => {
    document.getElementById('edit-profile-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-cancel-edit-profile')?.addEventListener('click', () => {
    document.getElementById('edit-profile-modal')?.classList.add('hidden');
  });

  // Edit profile form submit
  document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name')?.value;
    const phone = document.getElementById('edit-phone')?.value;
    const city = document.getElementById('edit-city')?.value;

    if (name) state.user.name = name;
    if (phone) state.user.phone = phone;
    if (city) state.user.city = city;

    saveState();
    document.getElementById('edit-profile-modal')?.classList.add('hidden');
    if (window.app.refreshCurrentPage) {
      window.app.refreshCurrentPage();
    }
  });

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    const modals = [
      document.getElementById('food-detail-modal'),
      document.getElementById('claim-modal'),
      document.getElementById('article-modal'),
      document.getElementById('edit-profile-modal'),
    ];
    modals.forEach((m) => {
      if (m && e.target === m) {
        m.classList.add('hidden');
      }
    });
  });
}

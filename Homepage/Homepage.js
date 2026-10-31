/**
 * Homepage Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  renderHomepage();
  initModals();
  if (window.lucide) window.lucide.createIcons();
});

function renderHomepage() {
  const foods = window.PM_DATA ? window.PM_DATA.getFoods() : [];
  const pantries = window.PM_DATA ? window.PM_DATA.getPantries() : [];
  const urgentFoods = foods.filter((f) => f.hoursRemaining <= 5 && f.status === 'available');

  // Render Dynamic Stats (Live Impact Bar)
  const stats = window.PM_DATA ? window.PM_DATA.getStats() : { portions: 0, impactKg: 0, co2SavedKg: 0, totalDonations: 0 };
  const elPortions = document.getElementById('home-stat-portions');
  const elPortionsSub = document.getElementById('home-stat-portions-sub');
  const elKg = document.getElementById('home-stat-kg');
  const elKgSub = document.getElementById('home-stat-kg-sub');
  const elCo2 = document.getElementById('home-stat-co2');
  const elDonations = document.getElementById('home-stat-donations');
  const elDonationsSub = document.getElementById('home-stat-donations-sub');

  if (elPortions) elPortions.textContent = `${stats.portions.toLocaleString('id-ID')} Porsi`;
  if (elPortionsSub) elPortionsSub.textContent = stats.portions > 0 ? `↑ ${stats.portions} porsi disalurkan` : 'Mulai donasi pertamamu';

  if (elKg) elKg.textContent = `${stats.impactKg.toLocaleString('id-ID')} kg`;
  if (elKgSub) elKgSub.textContent = stats.impactKg > 0 ? `Setara ${(stats.impactKg * 0.035).toFixed(1)} ton sampah TPA` : '0 kg sampah dicegah';

  if (elCo2) elCo2.textContent = `${stats.co2SavedKg.toLocaleString('id-ID')} kg`;

  if (elDonations) elDonations.textContent = `${stats.totalDonations.toLocaleString('id-ID')} Donasi`;
  if (elDonationsSub) elDonationsSub.textContent = stats.totalDonations > 0 ? `${stats.totalDonations} donasi aktif terdaftar` : 'Aksi nyata komunitas';

  // Featured Card in Hero
  const featured = foods[0];
  const featuredContainer = document.getElementById('hero-featured-card');
  if (featuredContainer) {
    if (featured) {
      featuredContainer.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">Klaim Terhangat Hari Ini</span>
          </div>
          <span class="text-xs text-[#7D7166]">Diperbarui live</span>
        </div>
        <div class="relative h-44 rounded-xl overflow-hidden mb-3">
          <img src="${featured.imageUrl}" alt="${featured.title}" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
          <div class="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
            Sisa ${featured.hoursRemaining} Jam
          </div>
          <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
            <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i>
            <span>${featured.distanceKm} km dari Anda</span>
          </div>
        </div>
        <h3 class="font-bold text-[#24201D] text-base hover:text-[#2D6A4F] transition line-clamp-1">${featured.title}</h3>
        <p class="text-xs text-[#6C6259] line-clamp-2 mt-1 leading-relaxed">${featured.description}</p>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EAE1]">
          <div class="flex items-center gap-2">
            <img src="${featured.donorAvatar}" class="w-6 h-6 rounded-full object-cover" />
            <span class="text-xs font-medium text-[#4A4036]">${featured.donorName}</span>
          </div>
          <span class="text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
            ${featured.portions} Porsi Tersisa
          </span>
        </div>
      `;
      featuredContainer.onclick = () => openFoodDetail(featured.id);
    } else {
      featuredContainer.innerHTML = `
        <div class="text-center py-6 sm:py-8 space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="heart-handshake" class="w-8 h-8"></i>
          </div>
          <div class="space-y-1.5 max-w-xs mx-auto">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">Klaim Terhangat</span>
            <h3 class="font-serif text-lg font-bold text-[#24201D]">Belum Ada Donasi Hari Ini</h3>
            <p class="text-xs text-[#6C6259] leading-relaxed">
              Jadilah pahlawan pangan pertama! Ambil foto makanan Anda dan bagikan sekarang.
            </p>
          </div>
          <a href="../Donasikan/donasikan.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] active:scale-95 transition shadow-sm">
            <i data-lucide="camera" class="w-4 h-4"></i>
            <span>Donasikan Makanan Sekarang</span>
          </a>
        </div>
      `;
      featuredContainer.onclick = null;
    }
  }

  // Urgent Food Grid
  const urgentGrid = document.getElementById('urgent-food-grid');
  if (urgentGrid) {
    if (urgentFoods.length > 0) {
      urgentGrid.innerHTML = urgentFoods
        .slice(0, 3)
        .map((item) => {
          const badge = window.PM_DATA.getUrgencyBadge(item.hoursRemaining);
          return `
            <div class="bg-white rounded-2xl border border-red-200 hover:border-red-400 p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="openFoodDetail('${item.id}')">
              <div class="space-y-3">
                <div class="relative h-44 rounded-xl overflow-hidden">
                  <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div class="absolute top-2.5 left-2.5">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                      ${badge.label}
                    </span>
                  </div>
                  <div class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i>
                    <span>${item.distanceKm} km</span>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold mb-1">
                    <span>${item.categoryLabel}</span>
                    ${item.halalVerified ? '<span class="bg-[#E8F5E9] text-[#2D6A4F] px-1.5 py-0.2 rounded text-[10px]">Halal</span>' : ''}
                  </div>
                  <h3 class="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">${item.title}</h3>
                  <p class="text-xs text-[#6C6259] line-clamp-2 mt-1 leading-relaxed">${item.description}</p>
                </div>
              </div>
              <div class="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                <span class="text-[#594A38] truncate max-w-[150px]">📍 ${item.city}</span>
                <span class="font-bold text-[#2D6A4F] bg-[#FAF6F0] border border-[#E8DFD1] px-2.5 py-1 rounded-lg">
                  ${item.portions} Porsi Tersisa
                </span>
              </div>
            </div>
          `;
        })
        .join('');
    } else {
      urgentGrid.innerHTML = `
        <div class="col-span-full py-8 px-6 text-center bg-white rounded-2xl border border-[#E8DFD1] space-y-3">
          <div class="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto">
            <i data-lucide="check-circle" class="w-6 h-6"></i>
          </div>
          <div class="space-y-1">
            <h3 class="font-serif text-base font-bold text-[#24201D]">Semua Makanan Aman & Terkendali</h3>
            <p class="text-xs text-[#6C6259]">
              Saat ini tidak ada makanan yang mendekati batas waktu kadaluwarsa (&lt; 5 jam).
            </p>
          </div>
          <a href="../Jelajahi/jelajahi.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline">
            <span>Buka Katalog Jelajahi</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      `;
    }
  }

  // Pantries Grid
  const pantryGrid = document.getElementById('home-pantry-grid');
  if (pantryGrid) {
    pantryGrid.innerHTML = pantries
      .map(
        (p) => `
        <div class="p-4 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0]/60 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold text-base text-[#24201D]">${p.name}</h3>
              <p class="text-xs text-[#6C6259] mt-1">📍 ${p.address}</p>
            </div>
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800">
              ${p.status}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-xs text-[#594A38] pt-2 border-t border-[#E8DFD1]">
            <span>🕒 ${p.operationalHours}</span>
            ${p.hasRefrigerator ? '<span class="text-[#2D6A4F] font-medium">❄️ Kulkas Tersedia</span>' : ''}
            <span class="ml-auto font-bold text-[#2D6A4F]">${p.itemsCount} Paket Tersedia</span>
          </div>
        </div>
      `
      )
      .join('');
  }
}

// Modals Handling
function openFoodDetail(foodId) {
  const food = window.PM_DATA.getFoodById(foodId);
  if (!food) return;

  const modal = document.getElementById('food-detail-modal');
  const content = document.getElementById('modal-detail-content');
  if (!modal || !content) return;

  const badge = window.PM_DATA.getUrgencyBadge(food.hoursRemaining);
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
        <a href="../Pesan/pesan.html" class="px-3.5 py-1.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#2D6A4F] hover:bg-[#FAF6F0] cursor-pointer flex items-center gap-1.5 transition">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Chat</span>
        </a>
      </div>

      <div class="text-xs text-[#594A38]">
        <strong>📍 Titik Lokasi Pengambilan:</strong>
        <p class="text-[#6C6259] mt-0.5">${food.pickupLocation}, ${food.city}</p>
      </div>

      <div class="pt-2 border-t border-[#F0EAE1]">
        <button onclick="openClaimModal('${food.id}')" class="w-full py-3 px-6 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer flex items-center justify-center gap-2">
          <i data-lucide="heart" class="w-4 h-4"></i>
          <span>Klaim Makanan Ini Sekarang (${food.portions} Tersedia)</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function openClaimModal(foodId) {
  const food = window.PM_DATA.getFoodById(foodId);
  if (!food) return;

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
      <span class="text-[11px] text-[#6C6259] mt-1 block">Maks. 5 porsi per klaim agar adil untuk sesama.</span>
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
      <span class="text-[#594A38]"><strong>Bawa Wadah Sendiri:</strong> Saya bersedia membawa tas atau kotak makan sendiri saat mengambil donasi.</span>
    </label>

    <div class="pt-2 flex justify-end gap-2">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] cursor-pointer">Batal</button>
      <button onclick="confirmClaim('${food.id}')" class="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] active:scale-95 transition cursor-pointer">
        Konfirmasi Klaim Pangan
      </button>
    </div>
  `;

  claimModal.classList.remove('hidden');
}

function confirmClaim(foodId) {
  const food = window.PM_DATA.getFoodById(foodId);
  if (!food) return;

  const qtyInput = document.getElementById('claim-portion-input');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  window.PM_DATA.claimFood(foodId, qty);
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
        <a href="../Pesan/pesan.html" class="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer flex items-center justify-center gap-2">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Chat dengan Penderma</span>
        </a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  renderHomepage();
}

function initModals() {
  document.getElementById('btn-close-detail')?.addEventListener('click', () => {
    document.getElementById('food-detail-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-close-claim')?.addEventListener('click', () => {
    document.getElementById('claim-modal')?.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    const detail = document.getElementById('food-detail-modal');
    const claim = document.getElementById('claim-modal');
    if (e.target === detail) detail.classList.add('hidden');
    if (e.target === claim) claim.classList.add('hidden');
  });
}

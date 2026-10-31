/**
 * Jelajahi Interactive Logic
 */

let filters = {
  search: '',
  category: 'semua',
  maxDistance: 10,
  halalOnly: false,
  urgentOnly: false,
};

document.addEventListener('DOMContentLoaded', () => {
  // Check URL query param for category
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    filters.category = catParam;
    syncCategoryChips(catParam);
  }

  renderExplore();
  initFilterEvents();
  initModals();
  if (window.lucide) window.lucide.createIcons();
});

function renderExplore() {
  const container = document.getElementById('explore-cards-container');
  const countEl = document.getElementById('explore-count');
  const allFoods = window.PM_DATA ? window.PM_DATA.getFoods() : [];

  const filtered = allFoods.filter((item) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.donorName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.category !== 'semua' && item.category !== filters.category) {
      return false;
    }
    if (item.distanceKm > filters.maxDistance) {
      return false;
    }
    if (filters.halalOnly && !item.halalVerified) {
      return false;
    }
    if (filters.urgentOnly && item.hoursRemaining > 5) {
      return false;
    }
    return true;
  });

  if (countEl) countEl.textContent = filtered.length;

  if (container) {
    if (filtered.length === 0) {
      if (allFoods.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center space-y-4 bg-white rounded-3xl border border-[#E8DFD1] p-8 max-w-lg mx-auto shadow-sm">
            <div class="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto">
              <i data-lucide="package-open" class="w-8 h-8"></i>
            </div>
            <div class="space-y-1">
              <h3 class="font-serif text-xl font-bold text-[#24201D]">Belum Ada Makanan yang Didonasikan</h3>
              <p class="text-xs sm:text-sm text-[#6C6259]">
                Semua donasi sebelumnya telah disalurkan atau belum ada makanan yang didaftarkan. Ayo jadi yang pertama berbagi surplus makanan!
              </p>
            </div>
            <a href="../Donasikan/donasikan.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold hover:bg-[#1B4332] active:scale-95 transition shadow-xs">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>Beri Donasi Makanan Sekarang</span>
            </a>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-[#E8DFD1] p-8">
            <div class="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#7D7166] flex items-center justify-center mx-auto text-2xl">
              <i data-lucide="search-x" class="w-8 h-8 text-[#7D7166]"></i>
            </div>
            <h3 class="font-serif text-xl font-bold text-[#24201D]">Tidak Ada Makanan yang Cocok</h3>
            <p class="text-xs sm:text-sm text-[#6C6259] max-w-md mx-auto">
              Coba atur ulang filter pencarian atau perluas radius jarak pantau Anda untuk menemukan donasi surplus lainnya.
            </p>
            <button id="btn-reset-filters" class="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] cursor-pointer inline-flex items-center gap-1.5 transition">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Reset Semua Filter</span>
            </button>
          </div>
        `;
        document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
      }
    } else {
      container.innerHTML = filtered
        .map((item) => {
          const badge = window.PM_DATA.getUrgencyBadge(item.hoursRemaining);
          const percentLeft = Math.round((item.portions / item.initialPortions) * 100);

          return `
            <div class="food-card bg-white rounded-2xl border border-[#E8DFD1] hover:border-[#2D6A4F] p-4 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="openFoodDetail('${item.id}')">
              <div class="space-y-3">
                <div class="relative h-48 rounded-xl overflow-hidden">
                  <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div class="absolute top-2.5 left-2.5">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge.badgeBg} shadow-xs">
                      ${badge.label}
                    </span>
                  </div>
                  <div class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400"></i>
                    <span>${item.distanceKm} km</span>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between text-xs mb-1.5">
                    <span class="font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2 py-0.5 rounded-full text-[11px]">${item.categoryLabel}</span>
                    ${item.halalVerified ? '<span class="text-emerald-800 text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✓ Halal</span>' : ''}
                  </div>
                  <h3 class="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">${item.title}</h3>
                  <p class="text-xs text-[#6C6259] line-clamp-2 mt-1 leading-relaxed">${item.description}</p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-[#F0EAE1] space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5 truncate max-w-[170px]">
                    <img src="${item.donorAvatar}" class="w-5 h-5 rounded-full object-cover shrink-0" />
                    <span class="text-[#594A38] text-[11px] truncate font-medium">${item.donorName}</span>
                  </div>
                  <span class="font-bold text-xs text-[#2D6A4F]">${item.portions} Porsi</span>
                </div>
                <div class="w-full bg-[#FAF6F0] rounded-full h-1.5 overflow-hidden border border-[#E8DFD1]">
                  <div class="bg-[#2D6A4F] h-full rounded-full" style="width: ${percentLeft}%"></div>
                </div>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  if (window.lucide) window.lucide.createIcons();
  renderMap();
}

function renderMap() {
  const mapSurface = document.getElementById('interactive-map-surface');
  if (!mapSurface) return;

  const foods = window.PM_DATA ? window.PM_DATA.getFoods() : [];
  const pantries = window.PM_DATA ? window.PM_DATA.getPantries() : [];

  mapSurface.innerHTML = `
    <div class="absolute inset-0 bg-[#E8DFD1]/40 flex items-center justify-center pointer-events-none opacity-40">
      <div class="w-96 h-96 rounded-full border-2 border-dashed border-[#2D6A4F]/30"></div>
    </div>
    ${foods
      .map((f, i) => {
        const top = 20 + ((i * 27) % 55);
        const left = 15 + ((i * 33) % 70);
        return `
          <div style="top: ${top}%; left: ${left}%;" class="absolute z-20 group cursor-pointer" onclick="openFoodDetail('${f.id}')">
            <div class="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg border-2 border-white map-pin-pulse text-sm">
              🍲
            </div>
            <div class="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-xl border border-[#D9CDBF] shadow-lg text-xs font-bold text-[#24201D] z-30">
              ${f.title} (${f.portions} porsi)
            </div>
          </div>
        `;
      })
      .join('')}
    ${pantries
      .map((p, i) => {
        const top = 30 + ((i * 35) % 50);
        const left = 30 + ((i * 25) % 60);
        return `
          <div style="top: ${top}%; left: ${left}%;" class="absolute z-10 group cursor-pointer">
            <div class="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white text-sm">
              📍
            </div>
            <div class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-xl border border-[#D9CDBF] shadow-lg text-xs font-bold text-[#24201D] z-30">
              ${p.name}
            </div>
          </div>
        `;
      })
      .join('')}
  `;
}

function syncCategoryChips(cat) {
  document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((c) => {
    if (c.getAttribute('data-cat') === cat) {
      c.className =
        'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#2D6A4F] text-white';
    } else {
      c.className =
        'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#FAF6F0] text-[#594A38] border border-[#E8DFD1]';
    }
  });
}

function syncDistanceButtons(dist) {
  document.querySelectorAll('#distance-buttons .dist-btn').forEach((b) => {
    const d = parseInt(b.getAttribute('data-dist'), 10);
    if (d === dist) {
      b.className = 'dist-btn px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#2D6A4F] text-white';
    } else {
      b.className = 'dist-btn px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-[#6C6259]';
    }
  });
}

function resetFilters() {
  filters.search = '';
  filters.category = 'semua';
  filters.maxDistance = 10;
  filters.halalOnly = false;
  filters.urgentOnly = false;

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const filterHalal = document.getElementById('filter-halal');
  if (filterHalal) filterHalal.checked = false;

  const filterUrgent = document.getElementById('filter-urgent');
  if (filterUrgent) filterUrgent.checked = false;

  syncCategoryChips('semua');
  syncDistanceButtons(10);
  renderExplore();
}

function initFilterEvents() {
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    filters.search = e.target.value;
    renderExplore();
  });

  document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.getAttribute('data-cat');
      if (cat) {
        filters.category = cat;
        syncCategoryChips(cat);
        renderExplore();
      }
    });
  });

  document.getElementById('filter-halal')?.addEventListener('change', (e) => {
    filters.halalOnly = e.target.checked;
    renderExplore();
  });

  document.getElementById('filter-urgent')?.addEventListener('change', (e) => {
    filters.urgentOnly = e.target.checked;
    renderExplore();
  });

  document.querySelectorAll('#distance-buttons .dist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.getAttribute('data-dist'), 10);
      filters.maxDistance = d;
      syncDistanceButtons(d);
      renderExplore();
    });
  });

  // Switch between Grid and Map
  document.getElementById('view-mode-grid')?.addEventListener('click', () => {
    document.getElementById('explore-cards-container')?.classList.remove('hidden');
    document.getElementById('explore-map-container')?.classList.add('hidden');
    document.getElementById('view-mode-grid').className =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer bg-white text-[#2D6A4F] shadow-xs';
    document.getElementById('view-mode-map').className =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer text-[#6C6259] hover:text-[#24201D]';
  });

  document.getElementById('view-mode-map')?.addEventListener('click', () => {
    document.getElementById('explore-cards-container')?.classList.add('hidden');
    document.getElementById('explore-map-container')?.classList.remove('hidden');
    document.getElementById('view-mode-map').className =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer bg-white text-[#2D6A4F] shadow-xs';
    document.getElementById('view-mode-grid').className =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer text-[#6C6259] hover:text-[#24201D]';
    renderMap();
  });
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

  renderExplore();
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

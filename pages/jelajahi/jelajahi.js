/**
 * Controller untuk Halaman Jelajahi & Filter Pangan
 */

import { state, getUrgencyBadge } from '../../js/state.js';

export function initJelajahi() {
  const container = document.getElementById('explore-cards-container');
  const countEl = document.getElementById('explore-count');

  function renderCards() {
    // Filter items
    const filtered = state.foods.filter((item) => {
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.donorName.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (state.filters.category !== 'semua' && item.category !== state.filters.category) {
        return false;
      }
      if (item.distanceKm > state.filters.maxDistance) {
        return false;
      }
      if (state.filters.halalOnly && !item.halalVerified) {
        return false;
      }
      if (state.filters.urgentOnly && item.hoursRemaining > 5) {
        return false;
      }
      return true;
    });

    if (countEl) countEl.textContent = filtered.length;

    if (container) {
      if (filtered.length === 0) {
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
      } else {
        container.innerHTML = filtered
          .map((item) => {
            const badge = getUrgencyBadge(item.hoursRemaining);
            const percentLeft = Math.round((item.portions / item.initialPortions) * 100);

            return `
              <div class="food-card bg-white rounded-2xl border border-[#E8DFD1] hover:border-[#2D6A4F] p-4 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="window.app.openFoodDetail('${item.id}')">
                <div class="space-y-3">
                  <div class="relative h-48 rounded-xl overflow-hidden">
                    <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div class="absolute top-2.5 left-2.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${badge.badgeBg} shadow-xs">
                        ${badge.label}
                      </span>
                    </div>
                    <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
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

    mapSurface.innerHTML = `
      <div class="absolute inset-0 bg-[#E8DFD1]/40 flex items-center justify-center pointer-events-none opacity-40">
        <div class="w-96 h-96 rounded-full border-2 border-dashed border-[#2D6A4F]/30"></div>
      </div>
      ${state.foods
        .map((f, i) => {
          const top = 20 + ((i * 27) % 55);
          const left = 15 + ((i * 33) % 70);
          return `
            <div style="top: ${top}%; left: ${left}%;" class="absolute z-20 group cursor-pointer" onclick="window.app.openFoodDetail('${f.id}')">
              <div class="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg border-2 border-white map-pin-pulse">
                🍲
              </div>
              <div class="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-xl border border-[#D9CDBF] shadow-lg text-xs font-bold text-[#24201D] z-30">
                ${f.title} (${f.portions} porsi)
              </div>
            </div>
          `;
        })
        .join('')}
      ${state.pantries
        .map((p, i) => {
          const top = 30 + ((i * 35) % 50);
          const left = 30 + ((i * 25) % 60);
          return `
            <div style="top: ${top}%; left: ${left}%;" class="absolute z-10 group cursor-pointer">
              <div class="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-white">
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

  function resetFilters() {
    state.filters.search = '';
    state.filters.category = 'semua';
    state.filters.maxDistance = 10;
    state.filters.halalOnly = false;
    state.filters.urgentOnly = false;

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const filterHalal = document.getElementById('filter-halal');
    if (filterHalal) filterHalal.checked = false;

    const filterUrgent = document.getElementById('filter-urgent');
    if (filterUrgent) filterUrgent.checked = false;

    syncCategoryChips('semua');
    syncDistanceButtons(10);
    renderCards();
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

  // Event Listeners
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderCards();
  });

  document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.getAttribute('data-cat');
      if (cat) {
        state.filters.category = cat;
        syncCategoryChips(cat);
        renderCards();
      }
    });
  });

  document.getElementById('filter-halal')?.addEventListener('change', (e) => {
    state.filters.halalOnly = e.target.checked;
    renderCards();
  });

  document.getElementById('filter-urgent')?.addEventListener('change', (e) => {
    state.filters.urgentOnly = e.target.checked;
    renderCards();
  });

  document.querySelectorAll('#distance-buttons .dist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.getAttribute('data-dist'), 10);
      state.filters.maxDistance = d;
      syncDistanceButtons(d);
      renderCards();
    });
  });

  // View switch: Grid vs Map
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

  // Set initial sync
  syncCategoryChips(state.filters.category);
  syncDistanceButtons(state.filters.maxDistance);
  renderCards();
}

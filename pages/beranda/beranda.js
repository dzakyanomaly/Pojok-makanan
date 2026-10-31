/**
 * Logic Controller untuk Halaman Beranda
 */

import { state, getUrgencyBadge } from '../../js/state.js';

export function initBeranda() {
  const urgentFoods = state.foods.filter((f) => f.hoursRemaining <= 5 && f.status === 'available');

  // Hero Featured Card
  const featured = state.foods[0];
  const featuredContainer = document.getElementById('hero-featured-card');
  if (featuredContainer && featured) {
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
      <p class="text-xs text-[#6C6259] line-clamp-2 mt-1">${featured.description}</p>
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EAE1]">
        <div class="flex items-center gap-2">
          <img src="${featured.donorAvatar}" class="w-6 h-6 rounded-full object-cover" />
          <span class="text-xs font-medium text-[#4A4036]">${featured.donorName}</span>
        </div>
        <span class="text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2 py-1 rounded-lg">
          ${featured.portions} Porsi Tersisa
        </span>
      </div>
    `;
    featuredContainer.onclick = () => window.app.openFoodDetail(featured.id);
  }

  // Urgent Food Grid
  const urgentGrid = document.getElementById('urgent-food-grid');
  if (urgentGrid) {
    urgentGrid.innerHTML = urgentFoods
      .slice(0, 3)
      .map((item) => {
        const badge = getUrgencyBadge(item.hoursRemaining);
        return `
          <div class="bg-white rounded-2xl border border-red-200 hover:border-red-400 p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="window.app.openFoodDetail('${item.id}')">
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
                <p class="text-xs text-[#6C6259] line-clamp-2 mt-1">${item.description}</p>
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
  }

  // Pantries Grid
  const pantryGrid = document.getElementById('home-pantry-grid');
  if (pantryGrid) {
    pantryGrid.innerHTML = state.pantries
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

  // Setup Event Listeners
  document.getElementById('hero-btn-donate')?.addEventListener('click', () => {
    window.app.navigateTo('donasi');
  });

  document.getElementById('hero-btn-explore')?.addEventListener('click', () => {
    window.app.navigateTo('jelajahi');
  });

  document.querySelectorAll('.nav-explore-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.app.navigateTo('jelajahi');
    });
  });

  // Category quick filter
  document.querySelectorAll('.home-cat-card').forEach((card) => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      if (cat) {
        state.filters.category = cat;
        window.app.navigateTo('jelajahi');
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

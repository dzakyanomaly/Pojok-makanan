import {
  INITIAL_FOODS,
  PANTRIES,
  STORAGE_GUIDES,
  ARTICLES,
  INITIAL_CHATS,
  INITIAL_USER,
} from './data.js';

// Application State Store
const state = {
  currentPage: 'home',
  foods: [...INITIAL_FOODS],
  pantries: [...PANTRIES],
  chats: [...INITIAL_CHATS],
  activeChatId: INITIAL_CHATS[0].id,
  user: { ...INITIAL_USER },
  filters: {
    search: '',
    category: 'semua',
    maxDistance: 10,
    halalOnly: false,
    urgentOnly: false,
    viewMode: 'grid', // 'grid' | 'map'
  },
  selectedShelfKey: 'nasi',
  selectedFundPackage: {
    amount: 25000,
    title: 'Paket Sarapan Berkah',
  },
  quizAnswers: {},
};

// Expiry urgency helper
function getUrgencyBadge(hoursRemaining) {
  if (hoursRemaining <= 3) {
    return {
      label: `Segera! Sisa ${hoursRemaining} Jam`,
      classes: 'bg-red-50 text-red-700 border-red-200',
    };
  }
  if (hoursRemaining <= 8) {
    return {
      label: `Sisa ${hoursRemaining} Jam Hari Ini`,
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    label: `Aman (Sisa ${hoursRemaining} Jam)`,
    classes: 'bg-emerald-50 text-[#2D6A4F] border-emerald-200',
  };
}

// ----------------------------------------------------
// Navigation Controller
// ----------------------------------------------------
function navigateTo(pageId) {
  state.currentPage = pageId;

  // Toggle page visibility
  const pages = ['home', 'jelajahi', 'donasi', 'edukasi', 'pesan', 'akun'];
  pages.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) {
      if (p === pageId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Update desktop navigation button styling
  document.querySelectorAll('#desktop-nav .nav-link').forEach((btn) => {
    const p = btn.getAttribute('data-page');
    if (p === pageId) {
      btn.className =
        'nav-link relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer bg-[#2D6A4F] text-white shadow-xs';
    } else {
      btn.className =
        'nav-link relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F] hover:bg-[#EFE8DC]/60';
    }
  });

  // Update mobile bottom nav styling
  document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    const p = btn.getAttribute('data-page');
    if (p === 'donasi') return; // Middle circle button has fixed style
    if (p === pageId) {
      btn.classList.add('text-[#2D6A4F]');
      btn.classList.remove('text-[#7D7166]');
      btn.querySelector('span:last-child')?.classList.add('font-bold');
      btn.querySelector('span:last-child')?.classList.remove('font-medium');
    } else {
      btn.classList.remove('text-[#2D6A4F]');
      btn.classList.add('text-[#7D7166]');
      btn.querySelector('span:last-child')?.classList.remove('font-bold');
      btn.querySelector('span:last-child')?.classList.add('font-medium');
    }
  });

  // Render specific page contents if needed
  if (pageId === 'home') renderHome();
  if (pageId === 'jelajahi') renderExplore();
  if (pageId === 'pesan') renderChat();
  if (pageId === 'akun') renderAccount();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------
// Page: Homepage Rendering
// ----------------------------------------------------
function renderHome() {
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
        <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
          ${featured.distanceKm} km dari Anda
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
    featuredContainer.onclick = () => openFoodDetail(featured.id);
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
                <div class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                  ${item.distanceKm} km
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
}

// ----------------------------------------------------
// Page: Jelajahi (Explore) Rendering
// ----------------------------------------------------
function renderExplore() {
  const container = document.getElementById('explore-cards-container');
  const countEl = document.getElementById('explore-count');

  // Filter items
  const filtered = state.foods.filter((item) => {
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.donorName.toLowerCase().includes(q);
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
    return item.status === 'available';
  });

  if (countEl) countEl.textContent = String(filtered.length);

  if (container) {
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full bg-white rounded-3xl border border-[#E8DFD1] p-12 text-center space-y-4">
          <div class="text-4xl text-[#7D7166]">🔍</div>
          <h3 class="font-serif text-xl font-bold text-[#24201D]">Tidak ada makanan yang cocok</h3>
          <p class="text-xs sm:text-sm text-[#6C6259]">Coba perluas radius pencarian Anda atau hapus filter aktif.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered
        .map((item) => {
          const badge = getUrgencyBadge(item.hoursRemaining);
          const percentLeft = Math.round((item.portions / item.initialPortions) * 100);

          return `
            <div class="bg-white rounded-2xl border border-[#E8DFD1] hover:border-[#2D6A4F]/60 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group overflow-hidden" onclick="window.app.openFoodDetail('${item.id}')">
              <div>
                <div class="relative h-48 w-full overflow-hidden bg-[#F0EAE1]">
                  <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div class="absolute top-2.5 left-2.5">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${badge.classes}">
                      ${badge.label}
                    </span>
                  </div>
                  <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                    📍 ${item.distanceKm} km
                  </div>
                </div>
                <div class="p-4 space-y-2.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-[#2D6A4F]">${item.categoryLabel}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF6F0] text-[#6C6259] border border-[#E8DFD1]">${item.distributionMethod}</span>
                  </div>
                  <h3 class="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">${item.title}</h3>
                  <p class="text-xs text-[#6C6259] line-clamp-2 leading-relaxed">${item.description}</p>
                  <div class="pt-2 space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-[#6C6259]">Tersisa:</span>
                      <span class="font-bold text-[#2D6A4F]">${item.portions} / ${item.initialPortions} Porsi (${item.weightKg} kg)</span>
                    </div>
                    <div class="w-full bg-[#FAF6F0] rounded-full h-1.5 overflow-hidden border border-[#E8DFD1]">
                      <div class="bg-[#2D6A4F] h-full rounded-full" style="width: ${percentLeft}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 pt-3 border-t border-[#F0EAE1] bg-[#FCFAF6] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img src="${item.donorAvatar}" class="w-7 h-7 rounded-full object-cover border border-[#D9CDBF]" />
                  <div class="text-left">
                    <div class="text-xs font-semibold text-[#3D332A] truncate max-w-[120px]">${item.donorName}</div>
                    <div class="text-[10px] text-[#7D7166]">${item.donorType}</div>
                  </div>
                </div>
                <button class="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] active:scale-95 transition cursor-pointer">
                  Detail & Klaim
                </button>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  // Render Map Pins
  const mapSurface = document.getElementById('interactive-map-surface');
  if (mapSurface) {
    const pinsHtml = filtered
      .map((item, idx) => {
        const top = 20 + ((idx * 23) % 60);
        const left = 15 + ((idx * 31) % 70);
        return `
          <button style="top: ${top}%; left: ${left}%" class="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10" onclick="window.app.openFoodDetail('${item.id}')">
            <div class="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-125 transition">🍲</div>
            <div class="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap text-[#24201D] font-bold z-20">
              ${item.title} (${item.portions} porsi)
            </div>
          </button>
        `;
      })
      .join('');

    const pantryPinsHtml = state.pantries
      .map((p, idx) => {
        const top = 30 + ((idx * 29) % 55);
        const left = 25 + ((idx * 37) % 70);
        return `
          <div style="top: ${top}%; left: ${left}%" class="absolute -translate-x-1/2 -translate-y-1/2 group z-10">
            <div class="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white">🏛️</div>
            <div class="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-2.5 py-1.5 rounded shadow text-xs whitespace-nowrap text-[#24201D] z-20">
              <strong>${p.name}</strong><br/><span class="text-amber-700">${p.itemsCount} Paket Tersedia</span>
            </div>
          </div>
        `;
      })
      .join('');

    mapSurface.innerHTML = pinsHtml + pantryPinsHtml;
  }
}

// ----------------------------------------------------
// Page: Edukasi Rendering
// ----------------------------------------------------
function renderEducation() {
  // Shelf food selectors
  const selectorContainer = document.getElementById('shelf-food-selector');
  if (selectorContainer) {
    selectorContainer.innerHTML = Object.entries(STORAGE_GUIDES)
      .map(([key, item]) => {
        const isSelected = state.selectedShelfKey === key;
        return `
          <button data-key="${key}" class="shelf-key-btn p-3 rounded-2xl border text-center transition cursor-pointer ${
            isSelected
              ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs'
              : 'bg-[#FAF6F0] text-[#594A38] border-[#E8DFD1] hover:bg-[#F2ECE1]'
          }">
            <div class="font-bold text-xs truncate">${item.name.split('(')[0]}</div>
            <div class="text-[10px] mt-0.5 opacity-80">${item.category}</div>
          </button>
        `;
      })
      .join('');

    selectorContainer.querySelectorAll('.shelf-key-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedShelfKey = btn.getAttribute('data-key');
        renderEducation();
      });
    });
  }

  // Shelf Display
  const guide = STORAGE_GUIDES[state.selectedShelfKey] || STORAGE_GUIDES['nasi'];
  const displayContainer = document.getElementById('shelf-guide-display');
  if (displayContainer) {
    displayContainer.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 class="font-bold text-lg text-[#24201D]">${guide.name}</h3>
          <p class="text-xs text-[#6C6259]">Kategori: ${guide.category}</p>
        </div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9CDBF] text-xs font-bold text-[#2D6A4F]">
          <span>Rekomendasi Utama:</span>
          <span class="text-[#24201D] underline">${guide.recommendedStorage}</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-1">
          <div class="text-xs font-bold text-amber-700">☀️ Suhu Ruang (25° - 30°C)</div>
          <div class="font-serif text-lg font-bold text-[#24201D]">${guide.roomTempDays}</div>
          <p class="text-[11px] text-[#6C6259]">Tempat sejuk kering terhindar matahari</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-1">
          <div class="text-xs font-bold text-[#2D6A4F]">❄️ Kulkas Bawah (2° - 4°C)</div>
          <div class="font-serif text-lg font-bold text-[#24201D]">${guide.fridgeDays}</div>
          <p class="text-[11px] text-[#6C6259]">Wadah kedap udara (airtight container)</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-1">
          <div class="text-xs font-bold text-sky-700">🧊 Freezer Beku (-18°C)</div>
          <div class="font-serif text-lg font-bold text-[#24201D]">${guide.freezerDays}</div>
          <p class="text-[11px] text-[#6C6259]">Bungkus rapat kedap oksigen</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
        <div class="bg-white p-3.5 rounded-xl border border-[#E8DFD1] space-y-1">
          <span class="font-bold text-[#2D6A4F]">✨ Trik Penyimpanan Awet:</span>
          <p class="text-[#594A38] leading-relaxed">${guide.tips}</p>
        </div>
        <div class="bg-white p-3.5 rounded-xl border border-red-200 space-y-1">
          <span class="font-bold text-red-700">⚠️ Ciri Makanan Mulai Basi:</span>
          <p class="text-[#594A38] leading-relaxed">${guide.spoilage}</p>
        </div>
      </div>
    `;
  }

  // Articles Grid
  const articlesContainer = document.getElementById('education-articles-grid');
  if (articlesContainer) {
    articlesContainer.innerHTML = ARTICLES.map(
      (art) => `
      <div class="bg-white rounded-3xl border border-[#E8DFD1] hover:border-[#2D6A4F]/60 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="window.app.openArticleModal('${art.id}')">
        <div>
          <div class="relative h-44 w-full overflow-hidden">
            <img src="${art.imageUrl}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#2D6A4F]">${art.category}</span>
          </div>
          <div class="p-5 space-y-2">
            <h3 class="font-serif text-lg font-bold text-[#24201D] group-hover:text-[#2D6A4F] transition line-clamp-2">${art.title}</h3>
            <p class="text-xs text-[#6C6259] line-clamp-2 leading-relaxed">${art.excerpt}</p>
          </div>
        </div>
        <div class="p-5 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#7D7166]">
          <span>${art.author}</span>
          <span class="font-semibold text-[#2D6A4F]">Baca Selengkapnya →</span>
        </div>
      </div>
    `
    ).join('');
  }

  // Quiz Setup
  renderQuiz();
}

const QUIZ_QUESTIONS = [
  {
    q: 'Seberapa sering Anda membuat rencana makan (Meal Planning) sebelum belanja mingguan?',
    options: [
      { text: 'Hampir selalu saya rencanakan dengan rapi', score: 3 },
      { text: 'Kadang-kadang saja jika sempat', score: 2 },
      { text: 'Tidak pernah, belanja spontan', score: 1 },
    ],
  },
  {
    q: 'Apa yang biasa Anda lakukan dengan nasi atau lauk pauk yang tersisa di rumah?',
    options: [
      { text: 'Disimpan di kulkas & diolah kembali (dibuat cireng/arancini/hangatkan)', score: 3 },
      { text: 'Diberikan ke tetangga atau donasi', score: 3 },
      { text: 'Sering dibiarkan basi lalu dibuang', score: 1 },
    ],
  },
  {
    q: 'Bagaimana pemahaman Anda mengenai label tanggal "Best Before"?',
    options: [
      { text: 'Paham bahwa itu mutu rasa, jika aroma & wujud masih bagus tetap aman', score: 3 },
      { text: 'Ragu-ragu, tapi kadang saya cicip sedikit dulu', score: 2 },
      { text: 'Langsung saya buang tepat saat tanggal terlewati', score: 1 },
    ],
  },
];

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  container.innerHTML = QUIZ_QUESTIONS.map(
    (q, qIdx) => `
    <div class="bg-white p-5 rounded-2xl border border-[#E8DFD1] space-y-3">
      <h3 class="font-bold text-sm text-[#24201D]">${qIdx + 1}. ${q.q}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        ${q.options
          .map((opt, optIdx) => {
            const isSelected = state.quizAnswers[qIdx] === opt.score;
            return `
            <button data-q="${qIdx}" data-score="${opt.score}" class="quiz-opt-btn p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
              isSelected
                ? 'bg-[#E8F5E9] border-[#2D6A4F] text-[#2D6A4F] font-bold'
                : 'bg-[#FAF6F0] border-[#E8DFD1] text-[#594A38] hover:bg-[#F2ECE1]'
            }">
              ${opt.text}
            </button>
          `;
          })
          .join('')}
      </div>
    </div>
  `
  ).join('');

  container.querySelectorAll('.quiz-opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qIdx = parseInt(btn.getAttribute('data-q'), 10);
      const score = parseInt(btn.getAttribute('data-score'), 10);
      state.quizAnswers[qIdx] = score;
      renderQuiz();
      checkQuizResult();
    });
  });
}

function checkQuizResult() {
  const answeredCount = Object.keys(state.quizAnswers).length;
  const resultBox = document.getElementById('quiz-result-box');
  if (!resultBox) return;

  if (answeredCount === QUIZ_QUESTIONS.length) {
    const totalScore = Object.values(state.quizAnswers).reduce((a, b) => a + b, 0);
    resultBox.classList.remove('hidden');

    let badge = '🏆';
    let title = 'Pahlawan Zero Waste!';
    let desc =
      'Luar biasa! Dapur Anda sangat ramah lingkungan dan menginspirasi sesama untuk mencegah food waste.';

    if (totalScore <= 5) {
      badge = '🌱';
      title = 'Langkah Awal Peduli Pangan';
      desc =
        'Anda mulai menyadari pentingnya cegah food waste. Terapkan penyimpanan wadah tertutup agar sayur bertahan lebih lama!';
    }

    resultBox.innerHTML = `
      <div class="text-4xl">${badge}</div>
      <div class="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">Hasil Evaluasi Dapur</div>
      <h3 class="font-serif text-xl font-bold text-[#24201D]">${title}</h3>
      <p class="text-xs text-[#594A38] leading-relaxed">${desc}</p>
    `;
  } else {
    resultBox.classList.add('hidden');
  }
}

// ----------------------------------------------------
// Page: Pesan (Chat) Rendering
// ----------------------------------------------------
function renderChat() {
  const threadListContainer = document.getElementById('chat-thread-list');
  const chatHeader = document.getElementById('chat-header');
  const messagesContainer = document.getElementById('chat-messages-container');

  const activeThread = state.chats.find((c) => c.id === state.activeChatId) || state.chats[0];

  if (threadListContainer) {
    threadListContainer.innerHTML = state.chats
      .map((c) => {
        const isSelected = c.id === activeThread.id;
        return `
          <button data-id="${c.id}" class="chat-thread-btn w-full p-4 flex items-start gap-3 text-left transition cursor-pointer ${
          isSelected ? 'bg-[#EFE8DC]/70' : 'hover:bg-[#FAF6F0]'
        }">
            <div class="relative shrink-0">
              <img src="${c.participantAvatar}" class="w-11 h-11 rounded-full object-cover border border-[#D9CDBF]" />
              ${c.isOnline ? '<span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>' : ''}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <span class="font-bold text-xs text-[#24201D] truncate">${c.participantName}</span>
                <span class="text-[10px] text-[#7D7166]">${c.lastTimestamp}</span>
              </div>
              <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-[#FAF6F0] text-[#2D6A4F] border border-[#E8DFD1]">
                ${c.participantRole}
              </span>
              <p class="text-xs text-[#6C6259] truncate mt-1">${c.lastMessage}</p>
            </div>
          </button>
        `;
      })
      .join('');

    threadListContainer.querySelectorAll('.chat-thread-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeChatId = btn.getAttribute('data-id');
        renderChat();
      });
    });
  }

  if (chatHeader && activeThread) {
    chatHeader.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="relative">
          <img src="${activeThread.participantAvatar}" class="w-10 h-10 rounded-full object-cover border border-[#D9CDBF]" />
          ${activeThread.isOnline ? '<span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>' : ''}
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h3 class="font-bold text-sm text-[#24201D]">${activeThread.participantName}</h3>
            <span class="text-[#2D6A4F]">✓</span>
          </div>
          <div class="text-[11px] text-[#6C6259]">${activeThread.participantRole} • Online aktif</div>
        </div>
      </div>
      <button onclick="alert('Menghubungi telepon ${activeThread.participantName}...')" class="p-2 rounded-xl bg-white border border-[#D9CDBF] text-[#2D6A4F] hover:bg-[#E8F5E9] cursor-pointer">
        📞 Panggil
      </button>
    `;
  }

  if (messagesContainer && activeThread) {
    messagesContainer.innerHTML = activeThread.messages
      .map(
        (m) => `
        <div class="flex flex-col ${m.isUser ? 'items-end' : 'items-start'}">
          <div class="max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
            m.isUser
              ? 'bg-[#2D6A4F] text-white rounded-br-xs'
              : 'bg-white text-[#24201D] border border-[#E8DFD1] rounded-bl-xs'
          }">
            ${m.text}
          </div>
          <div class="flex items-center gap-1 mt-1 text-[10px] text-[#7D7166] px-1">
            <span>${m.timestamp}</span>
            ${m.isUser ? '<span class="text-[#2D6A4F]">✓✓</span>' : ''}
          </div>
        </div>
      `
      )
      .join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function sendChatMessage(text) {
  if (!text || !text.trim()) return;
  const activeThread = state.chats.find((c) => c.id === state.activeChatId);
  if (!activeThread) return;

  const newMsg = {
    id: `m-${Date.now()}`,
    senderName: state.user.name,
    text: text.trim(),
    timestamp: 'Baru saja',
    isUser: true,
  };

  activeThread.messages.push(newMsg);
  activeThread.lastMessage = text.trim();
  activeThread.lastTimestamp = 'Baru saja';
  renderChat();

  // Simulated auto-reply after 1.2s
  setTimeout(() => {
    const replies = [
      'Siap Kak, paket donasi sudah kami siapkan di meja lobi ya!',
      'Terima kasih banyak atas konfirmasinya, semoga berkah makanannya!',
      'Relawan kami sedang bersiap di titik lemari berbagi, sampai bertemu!',
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    activeThread.messages.push({
      id: `reply-${Date.now()}`,
      senderName: activeThread.participantName,
      text: replyText,
      timestamp: 'Baru saja',
      isUser: false,
    });
    activeThread.lastMessage = replyText;
    renderChat();
  }, 1200);
}

// ----------------------------------------------------
// Page: Akun Rendering
// ----------------------------------------------------
function renderAccount() {
  const nameEl = document.getElementById('user-display-name');
  const emailEl = document.getElementById('user-display-email');
  const phoneEl = document.getElementById('user-display-phone');
  const cityEl = document.getElementById('user-display-city');

  const statKg = document.getElementById('profile-stat-kg');
  const statPortions = document.getElementById('profile-stat-portions');
  const statCo2 = document.getElementById('profile-stat-co2');
  const statPoints = document.getElementById('profile-stat-points');

  if (nameEl) nameEl.textContent = state.user.name;
  if (emailEl) emailEl.textContent = `📧 ${state.user.email}`;
  if (phoneEl) phoneEl.textContent = `📞 ${state.user.phone}`;
  if (cityEl) cityEl.textContent = `📍 ${state.user.city}`;

  if (statKg) statKg.textContent = `${state.user.impactKg} kg`;
  if (statPortions) statPortions.textContent = `${state.user.portionsShared} Porsi`;
  if (statCo2) statCo2.textContent = `${state.user.co2SavedKg} kg`;
  if (statPoints) statPoints.textContent = `${state.user.points} Poin`;
}

// ----------------------------------------------------
// Modals Handling
// ----------------------------------------------------
function openFoodDetail(foodId) {
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
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${badge.classes}">
          ${badge.label}
        </span>
      </div>
      <div class="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white backdrop-blur-xs">
        📍 ${food.distanceKm} km dari Anda
      </div>
    </div>
    <div class="p-6 sm:p-7 space-y-6">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">${food.categoryLabel}</span>
          ${food.halalVerified ? '<span class="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Halal Terverifikasi</span>' : ''}
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
            <div class="bg-[#2D6A4F] h-full rounded-full" style="width: ${percentLeft}%"></div>
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
        <button onclick="window.app.startChatWithDonor('${food.donorName}', '${food.title}')" class="px-3 py-1.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#2D6A4F] hover:bg-[#FAF6F0] cursor-pointer">
          💬 Chat
        </button>
      </div>

      <div class="text-xs text-[#594A38]">
        <strong>📍 Titik Lokasi Pengambilan:</strong>
        <p class="text-[#6C6259] mt-0.5">${food.pickupLocation}, ${food.city}</p>
      </div>

      <div class="pt-2 border-t border-[#F0EAE1]">
        <button onclick="window.app.openClaimModal('${food.id}')" class="w-full py-3 px-6 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer">
          Klaim Makanan Ini Sekarang (${food.portions} Tersedia)
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function openClaimModal(foodId) {
  const food = state.foods.find((f) => f.id === foodId);
  if (!food) return;

  // Close detail modal if open
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
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38]">Batal</button>
      <button onclick="window.app.confirmClaim('${food.id}')" class="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer">
        Konfirmasi Klaim Pangan
      </button>
    </div>
  `;

  claimModal.classList.remove('hidden');
}

function confirmClaim(foodId) {
  const food = state.foods.find((f) => f.id === foodId);
  if (!food) return;

  const qtyInput = document.getElementById('claim-portion-input');
  const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

  // Reduce portions
  food.portions = Math.max(0, food.portions - qty);
  if (food.portions === 0) food.status = 'completed';

  // Increment user profile claims
  state.user.totalClaimed += qty;
  state.user.points += 15;

  const code = `PM-${Math.floor(1000 + Math.random() * 9000)}`;

  const body = document.getElementById('claim-modal-body');
  if (body) {
    body.innerHTML = `
      <div class="text-center space-y-4">
        <div class="text-4xl">🎉</div>
        <span class="text-[10px] font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Klaim Berhasil Dicatat
        </span>
        <h3 class="font-serif text-xl font-bold text-[#24201D]">Tiket Pengambilan Pangan</h3>
        <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
          <div class="text-5xl font-mono text-[#2D6A4F] py-2">📱</div>
          <div class="font-mono text-lg font-bold text-[#24201D] bg-white py-1 rounded-lg border border-[#E8DFD1]">#${code}</div>
          <p class="text-xs text-[#594A38]"><strong>Item:</strong> ${food.title} (${qty} Porsi)</p>
          <p class="text-xs text-[#6C6259]">📍 ${food.pickupLocation}</p>
        </div>
        <button onclick="document.getElementById('claim-modal').classList.add('hidden'); window.app.startChatWithDonor('${food.donorName}', '${food.title}')" class="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer">
          💬 Chat dengan Penderma
        </button>
      </div>
    `;
  }

  renderExplore();
  renderHome();
}

function startChatWithDonor(donorName, foodTitle) {
  // Check if thread exists or create
  let thread = state.chats.find((c) => c.participantName.toLowerCase() === donorName.toLowerCase());
  if (!thread) {
    thread = {
      id: `chat-${Date.now()}`,
      participantName: donorName,
      participantRole: 'Pemberi Makanan',
      participantAvatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
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
  }

  state.activeChatId = thread.id;
  document.getElementById('food-detail-modal')?.classList.add('hidden');
  document.getElementById('claim-modal')?.classList.add('hidden');
  navigateTo('pesan');
}

function openArticleModal(articleId) {
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
      <div class="font-bold text-[#2D6A4F]">✓ Tips Praktis:</div>
      <ul class="list-disc pl-4 space-y-1 text-[#594A38]">
        ${art.tips.map((t) => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `;

  modal.classList.remove('hidden');
}

// ----------------------------------------------------
// Event Listeners Initialization
// ----------------------------------------------------
function initEventListeners() {
  // Desktop Nav links
  document.querySelectorAll('#desktop-nav .nav-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  // Mobile Bottom Nav links
  document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  // Logo & CTAs
  document.getElementById('btn-logo')?.addEventListener('click', () => navigateTo('home'));
  document.getElementById('btn-header-donate')?.addEventListener('click', () => navigateTo('donasi'));
  document.getElementById('hero-btn-donate')?.addEventListener('click', () => navigateTo('donasi'));
  document.getElementById('hero-btn-explore')?.addEventListener('click', () => navigateTo('jelajahi'));

  // Nav Explore quicklinks in Home
  document.querySelectorAll('.nav-explore-link').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo('jelajahi'));
  });

  // Home Category Cards
  document.querySelectorAll('.home-cat-card').forEach((card) => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      if (cat) {
        state.filters.category = cat;
        // Sync chip style in explore
        document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((c) => {
          if (c.getAttribute('data-cat') === cat) {
            c.className =
              'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#2D6A4F] text-white';
          } else {
            c.className =
              'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#FAF6F0] text-[#594A38] border border-[#E8DFD1]';
          }
        });
        navigateTo('jelajahi');
      }
    });
  });

  // Explore Search Input
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderExplore();
  });

  // Explore Category Chips
  document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.filters.category = chip.getAttribute('data-cat');
      document.querySelectorAll('#explore-cat-chips .cat-chip').forEach((c) => {
        c.className =
          'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#FAF6F0] text-[#594A38] border border-[#E8DFD1]';
      });
      chip.className =
        'cat-chip px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer bg-[#2D6A4F] text-white';
      renderExplore();
    });
  });

  // Explore Distance Buttons
  document.querySelectorAll('#distance-buttons .dist-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filters.maxDistance = parseInt(btn.getAttribute('data-dist'), 10);
      document.querySelectorAll('#distance-buttons .dist-btn').forEach((b) => {
        b.className = 'dist-btn px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-[#6C6259]';
      });
      btn.className = 'dist-btn px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#2D6A4F] text-white';
      renderExplore();
    });
  });

  // Explore Checkboxes
  document.getElementById('filter-halal')?.addEventListener('change', (e) => {
    state.filters.halalOnly = e.target.checked;
    renderExplore();
  });

  document.getElementById('filter-urgent')?.addEventListener('change', (e) => {
    state.filters.urgentOnly = e.target.checked;
    renderExplore();
  });

  // Explore View Mode: Grid vs Map
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
    renderExplore();
  });

  // Donation Tab Switcher
  document.getElementById('tab-donate-food')?.addEventListener('click', () => {
    document.getElementById('donate-food-container')?.classList.remove('hidden');
    document.getElementById('donate-fund-container')?.classList.add('hidden');
    document.getElementById('tab-donate-food').className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm';
    document.getElementById('tab-donate-fund').className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]';
  });

  document.getElementById('tab-donate-fund')?.addEventListener('click', () => {
    document.getElementById('donate-food-container')?.classList.add('hidden');
    document.getElementById('donate-fund-container')?.classList.remove('hidden');
    document.getElementById('tab-donate-fund').className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm';
    document.getElementById('tab-donate-food').className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]';
  });

  // Food Donation Form Submission
  document.getElementById('food-donation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('input-food-title');
    const categoryInput = document.getElementById('input-food-category');
    const conditionInput = document.getElementById('input-food-condition');
    const portionsInput = document.getElementById('input-food-portions');
    const weightInput = document.getElementById('input-food-weight');
    const hoursInput = document.getElementById('input-food-hours');
    const locationInput = document.getElementById('input-food-location');
    const halalInput = document.getElementById('input-food-halal');

    const portions = parseInt(portionsInput.value, 10) || 10;
    const weightKg = parseFloat(weightInput.value) || 3.5;

    const newFood = {
      id: `food-${Date.now()}`,
      title: titleInput.value.trim(),
      category: categoryInput.value,
      categoryLabel: categoryInput.options[categoryInput.selectedIndex].text.split('(')[0].trim(),
      portions,
      initialPortions: portions,
      weightKg,
      donorName: state.user.name,
      donorType: 'Individu',
      donorAvatar: state.user.avatar,
      isVerified: true,
      donorPhone: state.user.phone,
      pickupLocation: locationInput.value.trim(),
      city: state.user.city,
      distanceKm: 0.6,
      hoursRemaining: parseInt(hoursInput.value, 10),
      cookedTime: 'Baru saja didaftarkan',
      condition: conditionInput.value,
      halalVerified: halalInput.checked,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: `Donasi surplus makanan bersih dan higienis dari ${state.user.name}.`,
      allergenNotes: [],
      status: 'available',
      distributionMethod: 'Ambil di Tempat',
    };

    state.foods.unshift(newFood);
    state.user.totalDonations += 1;
    state.user.impactKg += weightKg;
    state.user.portionsShared += portions;
    state.user.co2SavedKg += parseFloat((weightKg * 2.5).toFixed(1));
    state.user.points += 50;

    alert(`Alhamdulillah! Donasi "${newFood.title}" berhasil diterbitkan ke katalog Pojok Makanan.`);
    titleInput.value = '';
    renderExplore();
    renderHome();
    navigateTo('jelajahi');
  });

  // Fund cards select
  document.querySelectorAll('.fund-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.fund-card').forEach((c) => {
        c.className =
          'fund-card p-4 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0] text-left transition cursor-pointer hover:border-[#2D6A4F]';
      });
      card.className =
        'fund-card p-4 rounded-2xl border border-[#2D6A4F] bg-[#E8F5E9] text-left transition cursor-pointer';

      const amount = parseInt(card.getAttribute('data-amount'), 10);
      const pkg = card.getAttribute('data-pkg');
      state.selectedFundPackage = { amount, title: pkg };
      document.getElementById('fund-selected-display').textContent = `Rp ${amount.toLocaleString('id-ID')}`;
    });
  });

  document.getElementById('btn-confirm-fund')?.addEventListener('click', () => {
    state.user.totalDonations += 1;
    state.user.points += Math.floor(state.selectedFundPackage.amount / 1000);
    alert(
      `Terima kasih banyak! Donasi "${state.selectedFundPackage.title}" sebesar Rp ${state.selectedFundPackage.amount.toLocaleString(
        'id-ID'
      )} berhasil dicatat.`
    );
    navigateTo('akun');
  });

  // Chat input
  document.getElementById('btn-send-chat')?.addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    if (input && input.value) {
      sendChatMessage(input.value);
      input.value = '';
    }
  });

  document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage(e.target.value);
      e.target.value = '';
    }
  });

  // Quick reply buttons
  document.querySelectorAll('.quick-reply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sendChatMessage(btn.textContent);
    });
  });

  // Edit Profile Modal
  document.getElementById('btn-open-edit-profile')?.addEventListener('click', () => {
    document.getElementById('edit-name').value = state.user.name;
    document.getElementById('edit-phone').value = state.user.phone;
    document.getElementById('edit-city').value = state.user.city;
    document.getElementById('edit-profile-modal')?.classList.remove('hidden');
  });

  document.getElementById('btn-cancel-edit-profile')?.addEventListener('click', () => {
    document.getElementById('edit-profile-modal')?.classList.add('hidden');
  });

  document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.user.name = document.getElementById('edit-name').value.trim();
    state.user.phone = document.getElementById('edit-phone').value.trim();
    state.user.city = document.getElementById('edit-city').value.trim();
    document.getElementById('edit-profile-modal')?.classList.add('hidden');
    renderAccount();
  });

  // Close modals buttons
  document.getElementById('btn-close-detail')?.addEventListener('click', () => {
    document.getElementById('food-detail-modal')?.classList.add('hidden');
  });

  document.getElementById('btn-close-claim')?.addEventListener('click', () => {
    document.getElementById('claim-modal')?.classList.add('hidden');
  });

  document.getElementById('btn-close-article')?.addEventListener('click', () => {
    document.getElementById('article-modal')?.classList.add('hidden');
  });
}

// Attach window object for inline HTML event triggers
window.app = {
  openFoodDetail,
  openClaimModal,
  confirmClaim,
  startChatWithDonor,
  openArticleModal,
  navigateTo,
};

// Initial DOM Boot
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderHome();
  renderExplore();
  renderEducation();
  renderChat();
  renderAccount();
});

/**
 * Controller untuk Halaman Edukasi, Kalkulator Masa Simpan, dan Kuis Food Waste
 */

import { state } from '../../js/state.js';
import { STORAGE_GUIDES, ARTICLES } from '../../js/data.js';

export function initEdukasi() {
  // Shelf food selectors
  const selectorContainer = document.getElementById('shelf-food-selector');
  if (selectorContainer) {
    const keys = Object.keys(STORAGE_GUIDES);
    selectorContainer.innerHTML = keys
      .map((key) => {
        const item = STORAGE_GUIDES[key];
        const isSelected = key === state.selectedShelfKey;
        return `
          <button data-key="${key}" class="shelf-select-btn p-3 rounded-2xl border text-left transition cursor-pointer ${
            isSelected
              ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs'
              : 'bg-[#FAF6F0] text-[#4A4036] border-[#E8DFD1] hover:border-[#2D6A4F]'
          }">
            <h4 class="font-bold text-xs truncate leading-snug">${item.name}</h4>
            <span class="text-[10px] block mt-0.5 opacity-80 truncate">${item.category}</span>
          </button>
        `;
      })
      .join('');

    selectorContainer.querySelectorAll('.shelf-select-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-key');
        if (k) {
          state.selectedShelfKey = k;
          initEdukasi();
        }
      });
    });
  }

  // Shelf Guide Display Box
  const activeGuide = STORAGE_GUIDES[state.selectedShelfKey] || STORAGE_GUIDES.nasi;
  const guideDisplay = document.getElementById('shelf-guide-display');
  if (guideDisplay && activeGuide) {
    guideDisplay.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD1] pb-3">
        <div>
          <h3 class="font-serif text-xl font-bold text-[#24201D]">${activeGuide.name}</h3>
          <p class="text-xs text-[#6C6259]">Kategori: ${activeGuide.category} • Rekomendasi: <span class="font-bold text-[#2D6A4F]">${activeGuide.recommendedStorage}</span></p>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500"></i> Suhu Ruang</span>
          <div class="font-bold text-sm sm:text-base text-[#24201D]">${activeGuide.roomTempDays}</div>
        </div>
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="refrigerator" class="w-3.5 h-3.5 text-sky-500"></i> Kulkas Bawah</span>
          <div class="font-bold text-sm sm:text-base text-[#2D6A4F]">${activeGuide.fridgeDays}</div>
        </div>
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="snowflake" class="w-3.5 h-3.5 text-blue-500"></i> Lemari Pembeku (Freezer)</span>
          <div class="font-bold text-sm sm:text-base text-[#24201D]">${activeGuide.freezerDays}</div>
        </div>
      </div>
      <div class="space-y-2 pt-2 border-t border-[#E8DFD1] text-xs">
        <div>
          <strong class="text-[#2D6A4F]">💡 Tips Praktis Penyimpanan:</strong>
          <p class="text-[#594A38] mt-0.5 leading-relaxed">${activeGuide.tips}</p>
        </div>
        <div class="pt-1">
          <strong class="text-red-700">⚠️ Tanda-tanda Sudah Basi / Rusak:</strong>
          <p class="text-[#6C6259] mt-0.5">${activeGuide.spoilage}</p>
        </div>
      </div>
    `;
  }

  // Articles Grid
  const articlesGrid = document.getElementById('education-articles-grid');
  if (articlesGrid) {
    articlesGrid.innerHTML = ARTICLES.map((art) => `
      <div class="article-card bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="window.app.openArticleModal('${art.id}')">
        <div>
          <div class="h-44 overflow-hidden relative">
            <img src="${art.imageUrl}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#2D6A4F] text-white shadow-xs">
              ${art.category}
            </span>
          </div>
          <div class="p-5 space-y-2">
            <span class="text-[11px] text-[#7D7166]">${art.author} • ${art.readTime}</span>
            <h3 class="font-serif text-lg font-bold text-[#24201D] group-hover:text-[#2D6A4F] transition line-clamp-2 leading-snug">${art.title}</h3>
            <p class="text-xs text-[#6C6259] line-clamp-3 leading-relaxed">${art.excerpt}</p>
          </div>
        </div>
        <div class="px-5 pb-5 pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-bold text-[#2D6A4F]">
          <span>Baca Selengkapnya</span>
          <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
        </div>
      </div>
    `).join('');
  }

  // Quiz Rendering
  const quizContainer = document.getElementById('quiz-container');
  const quizQuestions = [
    {
      id: 1,
      q: 'Seberapa sering Anda membuat rencana makan (Meal Planning) sebelum belanja mingguan?',
      options: [
        { text: 'Hampir selalu saya rencanakan dengan rapi', score: 3 },
        { text: 'Kadang-kadang saja jika sempat', score: 2 },
        { text: 'Tidak pernah, belanja spontan', score: 1 },
      ],
    },
    {
      id: 2,
      q: 'Apa yang biasa Anda lakukan dengan nasi atau lauk pauk yang tersisa di rumah?',
      options: [
        { text: 'Disimpan di kulkas & diolah kembali (nasi goreng/hangatkan)', score: 3 },
        { text: 'Diberikan ke tetangga atau hewan peliharaan', score: 3 },
        { text: 'Sering dibiarkan basi di meja makan lalu dibuang ke tong sampah', score: 1 },
      ],
    },
    {
      id: 3,
      q: 'Bagaimana pemahaman Anda mengenai label tanggal "Best Before"?',
      options: [
        { text: 'Paham bahwa itu mutu rasa, jika aroma & wujud masih bagus tetap aman', score: 3 },
        { text: 'Ragu-ragu, tapi kadang saya cicip sedikit dulu', score: 2 },
        { text: 'Langsung saya buang tepat saat tanggal tertera terlewati', score: 1 },
      ],
    },
  ];

  if (quizContainer) {
    quizContainer.innerHTML = quizQuestions
      .map(
        (qq, idx) => `
        <div class="bg-white p-5 rounded-2xl border border-[#E8DFD1] space-y-3">
          <h4 class="font-bold text-sm text-[#24201D]">${idx + 1}. ${qq.q}</h4>
          <div class="space-y-2">
            ${qq.options
              .map(
                (opt, oIdx) => `
                <label class="quiz-option-label flex items-center gap-3 p-3 rounded-xl border border-[#E8DFD1] text-xs cursor-pointer select-none">
                  <input type="radio" name="quiz-${qq.id}" value="${opt.score}" class="w-4 h-4 text-[#2D6A4F] focus:ring-[#2D6A4F]" />
                  <span class="text-[#4A4036]">${opt.text}</span>
                </label>
              `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');

    quizContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="pt-2 text-center">
        <button id="btn-submit-quiz" class="px-8 py-3 rounded-xl bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold hover:bg-[#1B4332] active:scale-95 transition cursor-pointer shadow-sm inline-flex items-center gap-2">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>Lihat Hasil Evaluasi Kebiasaan Dapur Anda</span>
        </button>
      </div>
    `
    );

    document.getElementById('btn-submit-quiz')?.addEventListener('click', () => {
      let total = 0;
      let answered = 0;

      quizQuestions.forEach((q) => {
        const checked = document.querySelector(`input[name="quiz-${q.id}"]:checked`);
        if (checked) {
          total += parseInt(checked.value, 10);
          answered++;
        }
      });

      if (answered < quizQuestions.length) {
        alert('Silakan jawab seluruh 3 pertanyaan kuis terlebih dahulu ya Kak!');
        return;
      }

      const resBox = document.getElementById('quiz-result-box');
      if (resBox) {
        let title = '';
        let desc = '';

        if (total >= 8) {
          title = '🌟 Sang Juara Dapur Bijak (Zero Waste Champion)';
          desc = 'Luar biasa! Rumah tangga Anda telah mempraktikkan kebiasaan ramah pangan tingkat tinggi. Pertahankan dan bagikan inspirasi ini ke sesama!';
        } else if (total >= 5) {
          title = '🌿 Dapur Bijak Berkembang (Good Learner)';
          desc = 'Bagus! Anda sudah punya kepedulian yang baik. Coba optimalkan meal planning dan pemanfaatan sisa bahan olahan di panduan artikel kami.';
        } else {
          title = '🌱 Pemula Peduli Pangan (Fresh Starter)';
          desc = 'Belum terlambat untuk memulai! Coba mulai dengan menyimpan sayur memakai teknik tisu kering dan membedakan label Best Before vs Use By.';
        }

        resBox.innerHTML = `
          <div class="text-3xl">🎉</div>
          <h3 class="font-serif text-lg font-bold text-[#2D6A4F]">${title}</h3>
          <p class="text-xs text-[#594A38] leading-relaxed max-w-md mx-auto">${desc}</p>
          <div class="pt-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2D6A4F]">
              Skor Anda: ${total} / 9
            </span>
          </div>
        `;
        resBox.classList.remove('hidden');
        resBox.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

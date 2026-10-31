/**
 * Edukasi Interactive Logic
 */

const STORAGE_GUIDES = {
  nasi: {
    name: 'Nasi Putih / Nasi Kuning',
    category: 'Karbohidrat Olahan',
    roomTempDays: 'Maks. 6-8 jam',
    fridgeDays: '3-4 hari',
    freezerDays: '1-2 bulan',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Dinginkan nasi di wadah terbuka sebentar sebelum dimasukkan wadah kedap udara ke kulkas. Jangan biarkan di rice cooker lebih dari 24 jam.',
    spoilage: 'Berlendir, berbau asam, warna menguning.',
  },
  roti: {
    name: 'Roti Tawar & Pastry',
    category: 'Roti & Bakery',
    roomTempDays: '3-5 hari',
    fridgeDays: 'Kurang disarankan (cepat kering)',
    freezerDays: '3 bulan (iris dulu)',
    recommendedStorage: 'Suhu Ruang',
    tips: 'Simpan di tempat kering dan sejuk dalam kantong tertutup rapat. Jika ingin tahan lama, bekukan dalam irisan.',
    spoilage: 'Bercak jamur kehijauan/hitam, aroma apek.',
  },
  sayur_hijau: {
    name: 'Sayur Hijau (Bayam, Kangkung)',
    category: 'Sayuran',
    roomTempDays: '1 hari',
    fridgeDays: '4-7 hari',
    freezerDays: '8-10 bulan (blanching)',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Bungkus dengan tisu dapur kering atau kain serbet lalu masukkan kotak kedap udara di kulkas.',
    spoilage: 'Daun berlendir basah, menghitam, aroma busuk.',
  },
  daging_ayam: {
    name: 'Daging Ayam / Sapi Olahan',
    category: 'Protein',
    roomTempDays: 'Maks. 2 jam',
    fridgeDays: '2-3 hari',
    freezerDays: '4-6 bulan',
    recommendedStorage: 'Freezer',
    tips: 'Bagi menjadi porsi sekali masak sebelum dibekukan. Hangatkan minimal hingga mencapai 75°C.',
    spoilage: 'Permukaan lengket/licin, warna pucat keabuan, bau menyengat.',
  },
  telur: {
    name: 'Telur Ayam Segar',
    category: 'Protein Segar',
    roomTempDays: '1-2 minggu',
    fridgeDays: '3-5 minggu',
    freezerDays: 'Hanya telur kocok (1 tahun)',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Simpan di rak utama kulkas dengan ujung runcing menghadap ke bawah agar kantung udara di atas tetap stabil.',
    spoilage: 'Uji apung: telur yang mengapung di wadah air menandakan kantung udara sudah rusak.',
  },
  buah_pisang: {
    name: 'Pisang & Buah Tropis',
    category: 'Buah',
    roomTempDays: '3-5 hari',
    fridgeDays: '5-7 hari (kulit gelap tapi daging manis)',
    freezerDays: '3 bulan (kupas dulu)',
    recommendedStorage: 'Suhu Ruang',
    tips: 'Bungkus pangkal tandan pisang dengan plastic wrap untuk memperlambat pengeluaran gas etilen.',
    spoilage: 'Daging buah lembek cair berbau fermentasi asam menyengat.',
  },
};

const ARTICLES = [
  {
    id: 'art-1',
    title: 'Perbedaan "Best Before" vs "Use By": Jangan Buru-buru Buang Makanan!',
    category: 'Edukasi Lingkungan',
    readTime: '4 menit baca',
    author: 'dr. Siti Rahma & Tim Pojok Pangan',
    date: '12 Okt 2026',
    excerpt: 'Banyak makanan aman yang terbuang sia-sia hanya karena kesalahpahaman membaca label tanggal di kemasan makanan.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    content: [
      'Di Indonesia, ribuan ton makanan terbuang karena konsumen mengira "Best Before" berarti makanan beracun jika lewat satu hari.',
      '1. "Use By": Mengacu pada KEAMANAN biologis pangan (daging segar, susu dingin). Konsumsi sebelum tanggal ini.',
      '2. "Best Before": Mengacu pada MUTU & RASA puncak. Lewat tanggal ini, makanan kaleng, biskuit, dan pasta masih sangat aman dimakan jika aromanya masih segar.',
    ],
    tips: [
      'Gunakan indera alami Anda: Lihat kemasan, Cium aromanya, Cicipi sedikit jika kemasan masih utuh.',
      'Jangan simpan makanan kaleng terbuka di kulkas; pindahkan ke kotak kaca/plastik tertutup.',
    ],
  },
  {
    id: 'art-2',
    title: '5 Resep Kreatif & Lezat dari Nasi Sisa Semalam',
    category: 'Resep Olahan Sisa',
    readTime: '3 menit baca',
    author: 'Chef Adrian (Komunitas Zero Waste)',
    date: '10 Okt 2026',
    excerpt: 'Nasi sisa di rice cooker jangan dibuang! Sulap menjadi cireng renyah atau arancini gurih yang disukai keluarga.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    content: [
      'Nasi adalah komoditas pangan yang paling sering tersisa di meja makan Indonesia. Menyelamatkan nasi sisa adalah aksi nyata cinta bumi.',
      '• Cireng Nasi Crispy: Haluskan nasi dengan air hangat, campur tepung tapioka, daun bawang iris, dan bawang putih goreng.',
      '• Arancini Bola Nasi: Campur nasi dingin dengan telur dan potongan keju, balur tepung panir lalu goreng keemasan.',
    ],
    tips: [
      'Simpan nasi sisa di kulkas dalam waktu maksimal 2 jam setelah matang.',
      'Tekstur nasi dingin kulkas sangat pas untuk nasi goreng restoran!',
    ],
  },
  {
    id: 'art-3',
    title: 'Rahasia Menyimpan Sayur Hijau Tetap Renyah Hingga 2 Minggu',
    category: 'Tips Dapur',
    readTime: '5 menit baca',
    author: 'Lina Kusuma (Urban Farmer)',
    date: '08 Okt 2026',
    excerpt: 'Sering kecewa sayur bayam baru beli 2 hari sudah berlendir di kulkas? Coba metode pembungkus kering ini.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    content: [
      'Musuh utama sayuran hijau adalah kelembapan basah yang terperangkap dalam kantong plastik pasar.',
      'Jangan cuci sayur sebelum disimpan, lapisi wadah dengan 2 lembar tisu dapur kering, lalu tutup rapat di kulkas bawah.',
    ],
    tips: [
      'Untuk daun bawang: masukkan akarnya ke toples berisi 2 cm air seperti bunga vas.',
      'Ganti tisu pengering jika terasa lembap setiap 4-5 hari.',
    ],
  },
];

let selectedKey = 'nasi';

document.addEventListener('DOMContentLoaded', () => {
  renderShelfGuide();
  renderArticles();
  initQuiz();
  initArticleModal();
  if (window.lucide) window.lucide.createIcons();
});

function renderShelfGuide() {
  const selector = document.getElementById('shelf-food-selector');
  if (selector) {
    selector.innerHTML = Object.keys(STORAGE_GUIDES)
      .map((k) => {
        const item = STORAGE_GUIDES[k];
        const isSel = k === selectedKey;
        return `
          <button data-key="${k}" class="shelf-select-btn p-3 rounded-2xl border text-left transition cursor-pointer ${
            isSel
              ? 'bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs'
              : 'bg-[#FAF6F0] text-[#4A4036] border-[#E8DFD1] hover:border-[#2D6A4F]'
          }">
            <h4 class="font-bold text-xs truncate leading-snug">${item.name}</h4>
            <span class="text-[10px] block mt-0.5 opacity-80 truncate">${item.category}</span>
          </button>
        `;
      })
      .join('');

    selector.querySelectorAll('.shelf-select-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedKey = btn.getAttribute('data-key');
        renderShelfGuide();
      });
    });
  }

  const guide = STORAGE_GUIDES[selectedKey] || STORAGE_GUIDES.nasi;
  const display = document.getElementById('shelf-guide-display');
  if (display && guide) {
    display.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD1] pb-3">
        <div>
          <h3 class="font-serif text-xl font-bold text-[#24201D]">${guide.name}</h3>
          <p class="text-xs text-[#6C6259]">Kategori: ${guide.category} • Rekomendasi: <span class="font-bold text-[#2D6A4F]">${guide.recommendedStorage}</span></p>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500"></i> Suhu Ruang</span>
          <div class="font-bold text-sm sm:text-base text-[#24201D]">${guide.roomTempDays}</div>
        </div>
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="refrigerator" class="w-3.5 h-3.5 text-sky-500"></i> Kulkas Bawah</span>
          <div class="font-bold text-sm sm:text-base text-[#2D6A4F]">${guide.fridgeDays}</div>
        </div>
        <div class="p-4 rounded-xl bg-white border border-[#E8DFD1] space-y-1">
          <span class="text-xs text-[#7D7166] flex items-center gap-1.5"><i data-lucide="snowflake" class="w-3.5 h-3.5 text-blue-500"></i> Freezer</span>
          <div class="font-bold text-sm sm:text-base text-[#24201D]">${guide.freezerDays}</div>
        </div>
      </div>
      <div class="space-y-2 pt-2 border-t border-[#E8DFD1] text-xs">
        <div>
          <strong class="text-[#2D6A4F]">💡 Tips Praktis Penyimpanan:</strong>
          <p class="text-[#594A38] mt-0.5 leading-relaxed">${guide.tips}</p>
        </div>
        <div class="pt-1">
          <strong class="text-red-700">⚠️ Tanda-tanda Sudah Basi / Rusak:</strong>
          <p class="text-[#6C6259] mt-0.5">${guide.spoilage}</p>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

function renderArticles() {
  const container = document.getElementById('education-articles-grid');
  if (container) {
    container.innerHTML = ARTICLES.map((art) => `
      <div class="article-card bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onclick="openArticleModal('${art.id}')">
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
}

function initQuiz() {
  const container = document.getElementById('quiz-container');
  const questions = [
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

  if (container) {
    container.innerHTML = questions
      .map(
        (qq, idx) => `
        <div class="bg-white p-5 rounded-2xl border border-[#E8DFD1] space-y-3">
          <h4 class="font-bold text-sm text-[#24201D]">${idx + 1}. ${qq.q}</h4>
          <div class="space-y-2">
            ${qq.options
              .map(
                (opt) => `
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

    container.insertAdjacentHTML(
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
      let count = 0;
      questions.forEach((q) => {
        const sel = document.querySelector(`input[name="quiz-${q.id}"]:checked`);
        if (sel) {
          total += parseInt(sel.value, 10);
          count++;
        }
      });

      if (count < questions.length) {
        alert('Silakan jawab semua 3 pertanyaan kuis terlebih dahulu ya Kak!');
        return;
      }

      const resBox = document.getElementById('quiz-result-box');
      if (resBox) {
        let title = '';
        let desc = '';
        if (total >= 8) {
          title = '🌟 Sang Juara Dapur Bijak (Zero Waste Champion)';
          desc = 'Luar biasa! Dapur Anda telah menjalankan praktik hemat pangan tingkat tinggi.';
        } else if (total >= 5) {
          title = '🌿 Dapur Bijak Berkembang (Good Learner)';
          desc = 'Bagus! Coba optimalkan meal planning dan pemanfaatan sisa bahan olahan di panduan artikel kami.';
        } else {
          title = '🌱 Pemula Peduli Pangan (Fresh Starter)';
          desc = 'Belum terlambat untuk memulai! Coba mulai dengan teknik menyimpan sayur memakai tisu kering.';
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

function initArticleModal() {
  document.getElementById('btn-close-article')?.addEventListener('click', () => {
    document.getElementById('article-modal')?.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('article-modal');
    if (e.target === modal) modal.classList.add('hidden');
  });
}

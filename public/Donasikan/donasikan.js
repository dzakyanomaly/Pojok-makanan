/**
 * Donasikan Interactive Logic
 */

let selectedFund = {
  amount: 25000,
  title: 'Paket Sarapan Berkah',
};

let uploadedImageDataUrl = '';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPhotoUpload();
  initForm();
  initFund();
  if (window.lucide) window.lucide.createIcons();
});

function initTabs() {
  const tabFood = document.getElementById('tab-donate-food');
  const tabFund = document.getElementById('tab-donate-fund');
  const containerFood = document.getElementById('donate-food-container');
  const containerFund = document.getElementById('donate-fund-container');

  tabFood?.addEventListener('click', () => {
    tabFood.className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm';
    tabFund.className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]';
    containerFood?.classList.remove('hidden');
    containerFund?.classList.add('hidden');
  });

  tabFund?.addEventListener('click', () => {
    tabFund.className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm';
    tabFood.className =
      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]';
    containerFund?.classList.remove('hidden');
    containerFood?.classList.add('hidden');
  });
}

function initPhotoUpload() {
  const inputCam = document.getElementById('input-camera');
  const inputFile = document.getElementById('input-file');
  const btnRemove = document.getElementById('btn-remove-photo');

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimasi skala gambar maksimal 800px agar penyimpanan localStorage tetap cepat & hemat
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        uploadedImageDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        const previewImg = document.getElementById('food-photo-preview');
        const placeholderBox = document.getElementById('photo-placeholder-box');
        const previewBox = document.getElementById('photo-preview-box');

        if (previewImg) previewImg.src = uploadedImageDataUrl;
        placeholderBox?.classList.add('hidden');
        previewBox?.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  inputCam?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });

  inputFile?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });

  btnRemove?.addEventListener('click', () => {
    uploadedImageDataUrl = '';
    if (inputCam) inputCam.value = '';
    if (inputFile) inputFile.value = '';
    document.getElementById('photo-placeholder-box')?.classList.remove('hidden');
    document.getElementById('photo-preview-box')?.classList.add('hidden');
  });
}

function initForm() {
  const form = document.getElementById('food-donation-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!uploadedImageDataUrl) {
      alert('⚠️ Harap ambil foto dengan kamera atau unggah foto makanan terlebih dahulu sebelum menerbitkan donasi.');
      document.getElementById('photo-dropzone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const title = document.getElementById('input-food-title')?.value;
    const category = document.getElementById('input-food-category')?.value;
    const condition = document.getElementById('input-food-condition')?.value;
    const portions = parseInt(document.getElementById('input-food-portions')?.value, 10) || 10;
    const weightKg = parseFloat(document.getElementById('input-food-weight')?.value) || 3.5;
    const hoursRemaining = parseInt(document.getElementById('input-food-hours')?.value, 10) || 6;
    const pickupLocation = document.getElementById('input-food-location')?.value || 'Jakarta Selatan';
    const halalVerified = document.getElementById('input-food-halal')?.checked ?? true;

    const categoryLabels = {
      makanan_berat: 'Makanan Siap Santap',
      roti_kue: 'Roti & Pastry',
      sayur_buah: 'Sayur & Buah Tani',
      sembako: 'Sembako & Pangan Pokok',
      minuman: 'Minuman Sehat',
    };

    const user = window.PM_DATA.getUser();

    const newFood = {
      id: `food-${Date.now()}`,
      title,
      category,
      categoryLabel: categoryLabels[category] || 'Makanan Layak',
      portions,
      initialPortions: portions,
      weightKg,
      donorName: user.name,
      donorType: 'Individu',
      donorAvatar: user.avatar,
      isVerified: true,
      donorPhone: user.phone,
      pickupLocation,
      city: user.city || 'Jakarta Selatan',
      distanceKm: 0.5,
      hoursRemaining,
      cookedTime: 'Baru saja didaftarkan',
      condition,
      halalVerified,
      imageUrl: uploadedImageDataUrl,
      description: `Donasi surplus dari ${user.name}. Makanan higienis dan siap diambil di titik lokasi.`,
      allergenNotes: ['Harap konfirmasi dengan penderma'],
      status: 'available',
      distributionMethod: 'Ambil di Tempat',
    };

    window.PM_DATA.addFood(newFood);
    alert(`🎉 Terima kasih Kak ${user.name}! Donasi "${title}" dengan foto asli Anda berhasil diterbitkan. Data metrik porsi dan makanan diselamatkan kini bertambah.`);
    window.location.href = '../Jelajahi/jelajahi.html';
  });
}

function initFund() {
  document.querySelectorAll('.fund-card').forEach((card) => {
    card.addEventListener('click', () => {
      const amount = parseInt(card.getAttribute('data-amount'), 10);
      const pkg = card.getAttribute('data-pkg');

      selectedFund = { amount, title: pkg };

      document.querySelectorAll('.fund-card').forEach((c) => {
        c.className =
          'fund-card p-4 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0] text-left transition cursor-pointer hover:border-[#2D6A4F]';
      });
      card.className =
        'fund-card p-4 rounded-2xl border border-[#2D6A4F] bg-[#E8F5E9] text-left transition cursor-pointer';

      const display = document.getElementById('fund-selected-display');
      if (display) {
        display.textContent = `Rp ${amount.toLocaleString('id-ID')}`;
      }
    });
  });

  document.getElementById('btn-confirm-fund')?.addEventListener('click', () => {
    const user = window.PM_DATA.getUser();
    user.points += Math.floor(selectedFund.amount / 1000);
    user.totalDonations += 1;
    window.PM_DATA.updateUser(user);

    alert(`💚 Terima kasih atas donasi ${selectedFund.title} sebesar Rp ${selectedFund.amount.toLocaleString('id-ID')}! Pembayaran QRIS Anda berhasil diverifikasi.`);
    window.location.href = '../Akun/akun.html';
  });
}

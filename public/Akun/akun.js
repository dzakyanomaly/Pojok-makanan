/**
 * Akun Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAccount();
  initEditProfile();
  if (window.lucide) window.lucide.createIcons();
});

function renderAccount() {
  const user = window.PM_DATA ? window.PM_DATA.getUser() : {};

  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-display-role');
  const emailEl = document.getElementById('user-display-email');
  const phoneEl = document.getElementById('user-display-phone');
  const cityEl = document.getElementById('user-display-city');

  const statKg = document.getElementById('profile-stat-kg');
  const statPortions = document.getElementById('profile-stat-portions');
  const statCo2 = document.getElementById('profile-stat-co2');
  const statPoints = document.getElementById('profile-stat-points');

  if (nameEl) nameEl.textContent = user.name || 'Dzaky Muthohary';
  if (roleEl) roleEl.textContent = `✨ ${user.role || 'Pahlawan Pangan Komunitas'}`;
  if (emailEl) emailEl.innerHTML = `<i data-lucide="mail" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.email || 'dzakymuthohary@gmail.com'}</span>`;
  if (phoneEl) phoneEl.innerHTML = `<i data-lucide="phone" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.phone || '0812-9876-5432'}</span>`;
  if (cityEl) cityEl.innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.city || 'Jakarta Selatan'}</span>`;

  if (statKg) statKg.textContent = `${user.impactKg ?? 0} kg`;
  if (statPortions) statPortions.textContent = `${user.portionsShared ?? 0} Porsi`;
  if (statCo2) statCo2.textContent = `${user.co2SavedKg ?? 0} kg`;
  if (statPoints) statPoints.textContent = `${user.points ?? 0} Poin`;

  // Render History
  const historyContainer = document.getElementById('profile-history-container');
  const foods = window.PM_DATA ? window.PM_DATA.getFoods() : [];
  if (historyContainer) {
    if (foods.length > 0) {
      historyContainer.innerHTML = foods
        .map(
          (f) => `
          <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img src="${f.imageUrl}" alt="${f.title}" class="w-12 h-12 rounded-xl object-cover border border-[#D9CDBF]" />
              <div>
                <span class="font-bold text-xs sm:text-sm text-[#24201D]">${f.title}</span>
                <p class="text-xs text-[#6C6259]">📍 ${f.pickupLocation} • ${f.portions} porsi</p>
              </div>
            </div>
            <span class="font-bold text-xs text-[#2D6A4F] bg-white px-3 py-1.5 rounded-lg border border-[#D9CDBF] self-start sm:self-auto">
              ${f.weightKg} kg • Aktif Tersedia ✓
            </span>
          </div>
        `
        )
        .join('');
    } else {
      historyContainer.innerHTML = `
        <div class="p-6 rounded-2xl bg-[#FAF6F0]/60 border border-[#E8DFD1] text-center space-y-2">
          <p class="text-xs text-[#6C6259]">Belum ada riwayat makanan yang didonasikan.</p>
          <a href="../Donasikan/donasikan.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline">
            <span>Beri Donasi Pertama Sekarang</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      `;
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

function initEditProfile() {
  const modal = document.getElementById('edit-profile-modal');
  const btnOpen = document.getElementById('btn-open-edit-profile');
  const btnClose = document.getElementById('btn-close-edit-profile');
  const btnCancel = document.getElementById('btn-cancel-edit-profile');
  const form = document.getElementById('edit-profile-form');

  btnOpen?.addEventListener('click', () => {
    const user = window.PM_DATA.getUser();
    const nameInput = document.getElementById('edit-name');
    const phoneInput = document.getElementById('edit-phone');
    const cityInput = document.getElementById('edit-city');

    if (nameInput) nameInput.value = user.name;
    if (phoneInput) phoneInput.value = user.phone;
    if (cityInput) cityInput.value = user.city;

    modal?.classList.remove('hidden');
  });

  btnClose?.addEventListener('click', () => modal?.classList.add('hidden'));
  btnCancel?.addEventListener('click', () => modal?.classList.add('hidden'));

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal?.classList.add('hidden');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name')?.value;
    const phone = document.getElementById('edit-phone')?.value;
    const city = document.getElementById('edit-city')?.value;

    window.PM_DATA.updateUser({ name, phone, city });
    modal?.classList.add('hidden');
    renderAccount();
  });
}

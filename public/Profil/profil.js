/**
 * Pojok Makanan - Profil Pengguna Logic
 * - Belum login: tampil form login langsung di halaman
 * - Sudah login: tampil nama, foto, poin, pengaturan logout/ganti akun
 */

let pendingModalAvatar = '';

document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
  initLoginForm();
  initEditProfile();
  initQuickAvatarUpload();
  if (window.lucide) window.lucide.createIcons();
});

function renderProfile() {
  const isLoggedIn = window.PM_DATA ? window.PM_DATA.isLoggedIn() : false;
  const guestEl = document.getElementById('guest-view-container');
  const authEl = document.getElementById('auth-view-container');

  if (!isLoggedIn) {
    guestEl?.classList.remove('hidden');
    authEl?.classList.add('hidden');
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  guestEl?.classList.add('hidden');
  authEl?.classList.remove('hidden');

  const user = window.PM_DATA.getUser() || {};

  // Avatar — gunakan avatar user, atau inisial jika kosong
  const avatarEl = document.getElementById('user-display-avatar');
  const avatarInitialEl = document.getElementById('user-display-initial');
  if (user.avatar) {
    if (avatarEl) { avatarEl.src = user.avatar; avatarEl.classList.remove('hidden'); }
    if (avatarInitialEl) avatarInitialEl.classList.add('hidden');
  } else {
    if (avatarEl) avatarEl.classList.add('hidden');
    if (avatarInitialEl) {
      avatarInitialEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
      avatarInitialEl.classList.remove('hidden');
    }
  }

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  setEl('user-display-name', user.name || 'Pengguna');
  setEl('user-display-role', `✨ ${user.role || 'Pahlawan Pangan Komunitas'}`);
  setHtml('user-display-email', `<i data-lucide="mail" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.email || '-'}</span>`);
  setHtml('user-display-phone', `<i data-lucide="phone" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.phone || '-'}</span>`);
  setHtml('user-display-city', `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${user.city || '-'}</span>`);

  setEl('profile-stat-kg', `${user.impactKg ?? 0} kg`);
  setEl('profile-stat-portions', `${user.portionsShared ?? 0} Porsi`);
  setEl('profile-stat-co2', `${user.co2SavedKg ?? 0} kg`);
  setEl('profile-stat-points', `${user.points ?? 0} Poin`);

  // Riwayat donasi
  const historyEl = document.getElementById('profile-history-container');
  const foods = window.PM_DATA ? window.PM_DATA.getFoods() : [];
  if (historyEl) {
    if (foods.length > 0) {
      historyEl.innerHTML = foods.map((f) => `
        <div class="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${f.imageUrl}" alt="${f.title}" class="w-12 h-12 rounded-xl object-cover border border-[#D9CDBF]" />
            <div>
              <span class="font-bold text-xs sm:text-sm text-[#24201D]">${f.title}</span>
              <p class="text-xs text-[#6C6259]">📍 ${f.pickupLocation} • ${f.portions} porsi • +${f.earnedPoints || Math.round((f.weightKg || 1) * 10)} poin</p>
            </div>
          </div>
          <span class="font-bold text-xs text-[#2D6A4F] bg-white px-3 py-1.5 rounded-lg border border-[#D9CDBF] self-start sm:self-auto">
            ${f.weightKg} kg ✓
          </span>
        </div>
      `).join('');
    } else {
      historyEl.innerHTML = `
        <div class="p-6 rounded-2xl bg-[#FAF6F0]/60 border border-[#E8DFD1] text-center space-y-2">
          <p class="text-xs text-[#6C6259]">Belum ada makanan yang didonasikan.</p>
          <a href="../Donasikan/donasikan.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline">
            <span>Donasikan Makanan Sekarang</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      `;
    }
  }

  // Wire up tombol logout
  const doLogout = () => {
    if (confirm('Yakin ingin keluar dari akun?')) {
      window.PM_DATA.logout();
      renderProfile();
    }
  };
  document.getElementById('btn-logout')?.addEventListener ? (document.getElementById('btn-logout').onclick = doLogout) : null;
  document.getElementById('btn-setting-logout') && (document.getElementById('btn-setting-logout').onclick = doLogout);

  // Wire up tombol ganti akun
  const doSwitch = () => {
    if (confirm('Ganti akun? Data akun saat ini akan keluar dan kamu bisa masuk dengan akun lain.')) {
      window.PM_DATA.switchAccount();
      renderProfile();
    }
  };
  document.getElementById('btn-switch-account') && (document.getElementById('btn-switch-account').onclick = doSwitch);

  if (window.lucide) window.lucide.createIcons();
}

function initLoginForm() {
  const form = document.getElementById('profil-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('login-name-input')?.value?.trim();
    const pwd = document.getElementById('login-password-input')?.value?.trim();
    const errEl = document.getElementById('profil-login-error');

    const showErr = (msg) => {
      if (errEl) {
        const span = document.getElementById('profil-login-error-text');
        if (span) span.textContent = msg; else errEl.textContent = msg;
        errEl.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      }
    };

    if (!name || !pwd) {
      showErr('Nama dan kata sandi tidak boleh kosong.');
      return;
    }

    const result = window.PM_DATA.login(name, pwd);

    if (!result.success) {
      showErr(result.message);
      return;
    }

    if (errEl) errEl.classList.add('hidden');
    renderProfile();
  });
}

function processImageFile(file, callback) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Harap pilih file gambar (JPG/PNG/WebP).');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 500;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function initQuickAvatarUpload() {
  document.getElementById('quick-avatar-upload')?.addEventListener('change', (e) => {
    if (e.target.files?.[0]) {
      processImageFile(e.target.files[0], (dataUrl) => {
        window.PM_DATA.updateUser({ avatar: dataUrl });
        renderProfile();
      });
    }
  });
}

function initEditProfile() {
  const modal = document.getElementById('edit-profile-modal');
  const avatarPreview = document.getElementById('edit-avatar-preview');

  const openModal = () => {
    if (!window.PM_DATA.isLoggedIn()) return;
    const user = window.PM_DATA.getUser() || {};
    document.getElementById('edit-name') && (document.getElementById('edit-name').value = user.name || '');
    document.getElementById('edit-phone') && (document.getElementById('edit-phone').value = user.phone || '');
    document.getElementById('edit-city') && (document.getElementById('edit-city').value = user.city || '');
    if (avatarPreview) avatarPreview.src = user.avatar || '';
    pendingModalAvatar = '';
    modal?.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  };

  document.getElementById('btn-open-edit-profile')?.addEventListener('click', openModal);
  document.getElementById('btn-setting-edit-profile')?.addEventListener('click', openModal);
  document.getElementById('btn-close-edit-profile')?.addEventListener('click', () => modal?.classList.add('hidden'));
  document.getElementById('btn-cancel-edit-profile')?.addEventListener('click', () => modal?.classList.add('hidden'));
  window.addEventListener('click', (e) => { if (e.target === modal) modal?.classList.add('hidden'); });

  document.getElementById('edit-avatar-input')?.addEventListener('change', (e) => {
    if (e.target.files?.[0]) {
      processImageFile(e.target.files[0], (dataUrl) => {
        pendingModalAvatar = dataUrl;
        if (avatarPreview) avatarPreview.src = dataUrl;
      });
    }
  });

  document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name')?.value?.trim();
    if (!name) { alert('Nama tidak boleh kosong.'); return; }

    const updates = {
      name,
      phone: document.getElementById('edit-phone')?.value?.trim() || '',
      city: document.getElementById('edit-city')?.value?.trim() || '',
    };
    if (pendingModalAvatar) { updates.avatar = pendingModalAvatar; pendingModalAvatar = ''; }

    window.PM_DATA.updateUser(updates);
    modal?.classList.add('hidden');
    renderProfile();
  });
}

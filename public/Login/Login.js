/**
 * Pojok Makanan - Login Page Logic
 * - Validasi nama + password (harus cocok kalau sudah pernah daftar)
 * - Kalau belum pernah daftar, buat akun baru otomatis
 * - Redirect ke halaman yang diminta setelah login berhasil
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  if (window.lucide) window.lucide.createIcons();
});

function initLoginPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect');

  // Kalau sudah login, langsung redirect
  if (window.PM_DATA && window.PM_DATA.isLoggedIn()) {
    redirectAfterLogin(redirectTarget);
    return;
  }

  // Tampilkan banner peringatan jika ada query redirect
  const banner = document.getElementById('login-alert-banner');
  const alertMsg = document.getElementById('login-alert-msg');
  if (redirectTarget && banner) {
    banner.classList.remove('hidden');
    if (alertMsg) {
      if (redirectTarget === 'donasi') {
        alertMsg.textContent = 'Silakan masuk terlebih dahulu untuk dapat mendonasikan makanan.';
      } else if (redirectTarget === 'claim') {
        alertMsg.textContent = 'Silakan masuk terlebih dahulu untuk dapat memesan atau mengklaim makanan.';
      } else {
        alertMsg.textContent = 'Silakan masuk terlebih dahulu untuk melanjutkan.';
      }
    }
  }

  // Toggle tampilan password (show/hide)
  const btnToggle = document.getElementById('btn-toggle-pwd');
  const pwdInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('eye-icon');
  btnToggle?.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
      pwdInput.type = 'password';
      if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // Handle submit form login
  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('login-error-msg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('login-name')?.value?.trim();
    const password = document.getElementById('login-password')?.value?.trim();

    if (!name || !password) {
      showError('Nama dan kata sandi tidak boleh kosong.');
      return;
    }

    if (!window.PM_DATA) {
      showError('Terjadi kesalahan sistem. Coba muat ulang halaman.');
      return;
    }

    const result = window.PM_DATA.login(name, password);

    if (!result.success) {
      // Login gagal — nama atau password salah
      showError(result.message);
      // Goyang field password sebagai feedback visual
      pwdInput?.classList.add('border-red-400', 'ring-1', 'ring-red-400');
      setTimeout(() => {
        pwdInput?.classList.remove('border-red-400', 'ring-1', 'ring-red-400');
      }, 2000);
      return;
    }

    // Login berhasil
    hideError();

    if (result.isNewUser) {
      // Akun baru dibuat
      showSuccess(`✅ Akun baru berhasil dibuat! Selamat datang, ${name}!`);
    } else {
      showSuccess(`✅ Selamat datang kembali, ${name}!`);
    }

    setTimeout(() => {
      redirectAfterLogin(redirectTarget);
    }, 800);
  });

  function showError(msg) {
    const el = document.getElementById('login-error-msg');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    }
  }

  function hideError() {
    const el = document.getElementById('login-error-msg');
    if (el) el.classList.add('hidden');
  }

  function showSuccess(msg) {
    const el = document.getElementById('login-success-msg');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    }
  }
}

function redirectAfterLogin(redirectTarget) {
  if (redirectTarget === 'donasi') {
    window.location.href = '../Donasikan/donasikan.html';
  } else if (redirectTarget === 'claim') {
    window.location.href = '../Jelajahi/jelajahi.html';
  } else if (redirectTarget && (redirectTarget.startsWith('http') || redirectTarget.includes('.html'))) {
    window.location.href = redirectTarget;
  } else {
    window.location.href = '../Profil/profil.html';
  }
}

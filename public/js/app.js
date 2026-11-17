/**
 * Pojok Makanan - Application Hub & Router
 * Mengatur modul halaman, komponen bersama, dan interaksi aplikasi
 */

import { state } from './state.js';
import { updateNavbarActive, updateUnreadBadge } from '../components/navbar.js';
import {
  openFoodDetail,
  openClaimModal,
  confirmClaim,
  startChatWithDonor,
  openArticleModal,
  openEditProfileModal,
  initModalsEvents,
} from '../components/modals.js';

// Cache untuk menyimpan HTML halaman agar tidak perlu fetch berulang
const pageHtmlCache = {};

// Halaman & Controller Map
const pageModules = {
  beranda: () => import('../pages/beranda/beranda.js').then((m) => m.initBeranda),
  home: () => import('../pages/beranda/beranda.js').then((m) => m.initBeranda),
  jelajahi: () => import('../pages/jelajahi/jelajahi.js').then((m) => m.initJelajahi),
  donasi: () => import('../pages/donasi/donasi.js').then((m) => m.initDonasi),
  edukasi: () => import('../pages/edukasi/edukasi.js').then((m) => m.initEdukasi),
  pesan: () => import('../pages/pesan/pesan.js').then((m) => m.initPesan),
  akun: () => import('../pages/akun/akun.js').then((m) => m.initAkun),
};

/**
 * Navigasi antar halaman modular
 */
export async function navigateTo(targetPage) {
  let pageId = targetPage === 'home' ? 'beranda' : targetPage;
  if (!pageModules[pageId]) pageId = 'beranda';

  state.currentPage = pageId;
  window.location.hash = pageId;

  const container = document.getElementById('page-container');
  if (!container) return;

  try {
    // 1. Ambil HTML halaman
    let html = pageHtmlCache[pageId];
    if (!html) {
      const response = await fetch(`./pages/${pageId}/${pageId}.html`);
      if (!response.ok) throw new Error(`HTTP ${response.status} loading ${pageId}.html`);
      html = await response.text();
      pageHtmlCache[pageId] = html;
    }

    container.innerHTML = html;

    // 2. Tambahkan CSS halaman jika belum ada
    const cssId = `style-page-${pageId}`;
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = `./pages/${pageId}/${pageId}.css`;
      document.head.appendChild(link);
    }

    // 3. Inisialisasi JS controller halaman
    const initController = await pageModules[pageId]();
    if (initController) {
      initController();
    }

    // 4. Update Navigasi Aktif
    updateNavbarActive(pageId);

    // 5. Inisialisasi Ikon Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(`Gagal memuat modul halaman "${pageId}":`, err);
    container.innerHTML = `
      <div class="py-16 text-center space-y-4 bg-white rounded-3xl border border-[#E8DFD1] p-8 max-w-xl mx-auto my-8">
        <div class="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl font-bold">!</div>
        <h2 class="font-serif text-2xl font-bold text-[#24201D]">Gagal Memuat Halaman</h2>
        <p class="text-xs sm:text-sm text-[#6C6259]">
          Terjadi kendala saat membaca file template <code>./pages/${pageId}/${pageId}.html</code>.
        </p>
        <div class="pt-2">
          <button onclick="window.app.navigateTo('beranda')" class="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold cursor-pointer">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Muat Komponen Bersama: Navbar, Modals, Footer
 */
async function loadComponents() {
  try {
    // 1. Muat Navbar
    const navResp = await fetch('./components/navbar.html');
    if (navResp.ok) {
      const navHtml = await navResp.text();
      document.getElementById('navbar-container').innerHTML = navHtml;
    }

    // 2. Muat Modals
    const modalsResp = await fetch('./components/modals.html');
    if (modalsResp.ok) {
      const modalsHtml = await modalsResp.text();
      document.getElementById('modals-container').innerHTML = modalsHtml;
      initModalsEvents();
    }

    // 3. Muat Footer
    const footerResp = await fetch('./components/footer.html');
    if (footerResp.ok) {
      const footerHtml = await footerResp.text();
      document.getElementById('footer-container').innerHTML = footerHtml;
    }

    // Event listener untuk tombol navigasi
    document.querySelectorAll('#desktop-nav .nav-link').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-page');
        if (p) navigateTo(p);
      });
    });

    document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-page');
        if (p) navigateTo(p);
      });
    });

    document.getElementById('btn-logo')?.addEventListener('click', () => navigateTo('beranda'));
    document.getElementById('btn-header-donate')?.addEventListener('click', () => navigateTo('donasi'));

    // Hitung unread chat badge
    const totalUnread = state.chats.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
    updateUnreadBadge(totalUnread);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  } catch (err) {
    console.error('Gagal memuat komponen bersama:', err);
  }
}

// Global API
window.app = {
  navigateTo,
  openFoodDetail,
  openClaimModal,
  confirmClaim,
  startChatWithDonor,
  openArticleModal,
  openEditProfileModal,
  refreshCurrentPage: () => navigateTo(state.currentPage),
};

// Inisialisasi Aplikasi Saat DOM Siap
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();

  // Cek hash URL (misal #jelajahi atau #donasi)
  const initialHash = window.location.hash.replace('#', '').trim();
  const validPages = ['beranda', 'jelajahi', 'donasi', 'edukasi', 'pesan', 'akun'];
  const startPage = validPages.includes(initialHash) ? initialHash : 'beranda';

  await navigateTo(startPage);

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && hash !== state.currentPage && validPages.includes(hash)) {
      navigateTo(hash);
    }
  });
});

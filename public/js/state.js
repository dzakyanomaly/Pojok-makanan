/**
 * Pojok Makanan - Central State Management
 * Menyimpan data aktif dan menyinkronkan dengan localStorage
 */

import {
  INITIAL_FOODS,
  PANTRIES,
  STORAGE_GUIDES,
  ARTICLES,
  INITIAL_CHATS,
  INITIAL_USER,
} from './data.js';

const STORAGE_KEY = 'POJOK_MAKANAN_STATE_V1';

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        currentPage: 'beranda',
        foods: parsed.foods || [...INITIAL_FOODS],
        pantries: parsed.pantries || [...PANTRIES],
        chats: parsed.chats || [...INITIAL_CHATS],
        activeChatId: parsed.activeChatId || INITIAL_CHATS[0].id,
        user: parsed.user || { ...INITIAL_USER },
        filters: {
          search: '',
          category: 'semua',
          maxDistance: 10,
          halalOnly: false,
          urgentOnly: false,
          viewMode: 'grid',
        },
        selectedShelfKey: 'nasi',
        selectedFundPackage: {
          amount: 25000,
          title: 'Paket Sarapan Berkah',
        },
        quizAnswers: {},
      };
    }
  } catch (e) {
    console.warn('Gagal memuat state dari localStorage, menggunakan default:', e);
  }

  return {
    currentPage: 'beranda',
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
      viewMode: 'grid',
    },
    selectedShelfKey: 'nasi',
    selectedFundPackage: {
      amount: 25000,
      title: 'Paket Sarapan Berkah',
    },
    quizAnswers: {},
  };
}

export const state = getInitialState();

export function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        foods: state.foods,
        pantries: state.pantries,
        chats: state.chats,
        activeChatId: state.activeChatId,
        user: state.user,
      })
    );
  } catch (e) {
    console.warn('Gagal menyimpan state:', e);
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/**
 * Helper untuk menentukan badge sisa waktu makanan
 */
export function getUrgencyBadge(hoursRemaining) {
  if (hoursRemaining <= 3) {
    return {
      label: `Segera! Sisa ${hoursRemaining} Jam`,
      classes: 'bg-red-50 text-red-700 border-red-200',
      badgeBg: 'bg-red-600 text-white',
    };
  }
  if (hoursRemaining <= 8) {
    return {
      label: `Sisa ${hoursRemaining} Jam Hari Ini`,
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
    };
  }
  return {
    label: `Aman (Sisa ${hoursRemaining} Jam)`,
    classes: 'bg-emerald-50 text-[#2D6A4F] border-emerald-200',
    badgeBg: 'bg-[#2D6A4F] text-white',
  };
}

/**
 * Hitung kalkulasi dampak lingkungan
 */
export function calculateImpactMetrics(weightKg) {
  const co2PreventedKg = parseFloat((weightKg * 2.5).toFixed(1));
  const waterSavedLiters = Math.round(weightKg * 850);
  return { co2PreventedKg, waterSavedLiters };
}

import type { FoodItem } from '../types.ts';

/**
 * Calculates environmental and social impact metrics from saved food
 */
export function calculateImpact(portions: number, explicitWeightKg?: number) {
  const weightKg = explicitWeightKg !== undefined ? explicitWeightKg : portions * 0.35;
  // Standard benchmark: ~2.5 kg CO2e prevented per 1 kg food saved
  const co2PreventedKg = parseFloat((weightKg * 2.5).toFixed(1));
  // Standard benchmark: ~850 liters virtual water footprint saved per kg food
  const waterSavedLiters = Math.round(weightKg * 850);
  const mealsEquivalent = portions;

  return {
    weightKg: parseFloat(weightKg.toFixed(1)),
    co2PreventedKg,
    waterSavedLiters,
    mealsEquivalent,
  };
}

export type ExpiryUrgencyLevel = 'urgent' | 'warning' | 'safe';

export interface ExpiryStatus {
  level: ExpiryUrgencyLevel;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
}

/**
 * Categorizes food availability urgency based on hours remaining
 */
export function getExpiryStatus(hoursRemaining: number): ExpiryStatus {
  if (hoursRemaining <= 0) {
    return {
      level: 'urgent',
      label: 'Waktu Habis',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      borderClass: 'border-red-200',
    };
  }
  if (hoursRemaining <= 3) {
    return {
      level: 'urgent',
      label: `Segera! Sisa ${hoursRemaining} Jam`,
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      badgeText: 'text-red-700',
      borderClass: 'border-red-300',
    };
  }
  if (hoursRemaining <= 8) {
    return {
      level: 'warning',
      label: `Sisa ${hoursRemaining} Jam Hari Ini`,
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeText: 'text-amber-700',
      borderClass: 'border-amber-300',
    };
  }
  return {
    level: 'safe',
    label: `Aman (Sisa ${hoursRemaining} Jam)`,
    badgeBg: 'bg-emerald-50 text-[#2D6A4F] border-emerald-200',
    badgeText: 'text-[#2D6A4F]',
    borderClass: 'border-emerald-200',
  };
}

export interface FilterParams {
  query?: string;
  category?: string;
  maxDistanceKm?: number;
  halalOnly?: boolean;
  status?: string;
}

/**
 * Filter food items based on user criteria
 */
export function filterFoods(foods: FoodItem[], params: FilterParams): FoodItem[] {
  return foods.filter((item) => {
    // Search query
    if (params.query && params.query.trim() !== '') {
      const q = params.query.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.pickupLocation.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
      const matchDonor = item.donorName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchDonor) {
        return false;
      }
    }

    // Category filter
    if (params.category && params.category !== 'semua' && item.category !== params.category) {
      return false;
    }

    // Distance filter
    if (params.maxDistanceKm && params.maxDistanceKm > 0 && item.distanceKm > params.maxDistanceKm) {
      return false;
    }

    // Halal filter
    if (params.halalOnly && !item.halalVerified) {
      return false;
    }

    // Status filter
    if (params.status && params.status !== 'all' && item.status !== params.status) {
      return false;
    }

    return true;
  });
}

/**
 * Food storage & shelf-life calculator data
 */
export interface StorageGuide {
  name: string;
  category: string;
  roomTempDays: string;
  fridgeDays: string;
  freezerDays: string;
  recommendedStorage: 'Suhu Ruang' | 'Kulkas Bawah' | 'Freezer';
  tips: string;
  indicatorsOfSpoilage: string;
}

export const STORAGE_GUIDES: Record<string, StorageGuide> = {
  nasi: {
    name: 'Nasi Putih / Nasi Kuning',
    category: 'Karbohidrat Olahan',
    roomTempDays: 'Maks. 6-8 jam',
    fridgeDays: '3-4 hari',
    freezerDays: '1-2 bulan',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Dinginkan nasi cepat di piring datar sebelum dimasukkan wadah kedap udara ke kulkas. Jangan biarkan di magic com lebih dari 24 jam.',
    indicatorsOfSpoilage: 'Berlendir, berbau asam atau apek, warna menguning.',
  },
  roti: {
    name: 'Roti Tawar & Pastry',
    category: 'Roti & Bakery',
    roomTempDays: '3-5 hari',
    fridgeDays: 'Tidak disarankan (cepat kering & kaku)',
    freezerDays: '3 bulan (iris dulu)',
    recommendedStorage: 'Suhu Ruang',
    tips: 'Simpan di tempat kering dan sejuk dalam bungkus rapat. Jika ingin tahan lama, bekukan dalam bentuk irisan lalu panggang langsung dari freezer.',
    indicatorsOfSpoilage: 'Bercak jamur kehijauan/hitam, aroma tengik.',
  },
  sayur_hijau: {
    name: 'Sayur Hijau (Bayam, Kangkung, Sawi)',
    category: 'Sayuran',
    roomTempDays: '1 hari',
    fridgeDays: '4-7 hari',
    freezerDays: '8-10 bulan (blanching dulu)',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Jangan dicuci sebelum disimpan. Bungkus dengan tisu dapur atau handuk kain bersih lalu masukkan wadah tertutup di laci sayur kulkas.',
    indicatorsOfSpoilage: 'Daun berlendir basah, menghitam, aroma busuk.',
  },
  daging_ayam: {
    name: 'Daging Ayam / Daging Sapi Olahan',
    category: 'Protein',
    roomTempDays: 'Maks. 2 jam',
    fridgeDays: '2-3 hari',
    freezerDays: '4-6 bulan',
    recommendedStorage: 'Freezer',
    tips: 'Bagi menjadi porsi sekali masak sebelum dibekukan agar tidak perlu thawing berulang kali. Hangatkan hingga mencapai suhu minimal 75°C.',
    indicatorsOfSpoilage: 'Permukaan lengket/licin, warna pucat keabuan, bau menyengat.',
  },
  telur: {
    name: 'Telur Ayam',
    category: 'Protein Segar',
    roomTempDays: '1-2 minggu',
    fridgeDays: '3-5 minggu',
    freezerDays: 'Hanya telur kocok (1 tahun)',
    recommendedStorage: 'Kulkas Bawah',
    tips: 'Simpan di rak utama kulkas (bukan pintu agar suhu stabil). Bagian runcing menghadap ke bawah agar kantung udara di atas tetap utuh.',
    indicatorsOfSpoilage: 'Uji apung: telur yang mengapung di air biasanya sudah rusak/terlalu lama.',
  },
  buah_pisang: {
    name: 'Pisang & Buah Tropis',
    category: 'Buah',
    roomTempDays: '3-5 hari',
    fridgeDays: '5-7 hari (kulit menghitam tapi daging tetap segar)',
    freezerDays: '3 bulan (kupas & potong)',
    recommendedStorage: 'Suhu Ruang',
    tips: 'Bungkus pangkal tandan pisang dengan aluminium foil / plastic wrap untuk memperlambat pelepasan gas etilen.',
    indicatorsOfSpoilage: 'Daging buah lembek cair berbau fermentasi asam keras.',
  },
};

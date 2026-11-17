import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImpact, getExpiryStatus, filterFoods, STORAGE_GUIDES } from './foodLogic.ts';
import type { FoodItem } from '../types.ts';

test('calculateImpact computes correct CO2 and water savings for portions', () => {
  const result = calculateImpact(10);
  // 10 portions * 0.35kg = 3.5kg
  assert.equal(result.weightKg, 3.5);
  // 3.5kg * 2.5 = 8.75 -> 8.8
  assert.equal(result.co2PreventedKg, 8.8);
  // 3.5kg * 850 = 2975
  assert.equal(result.waterSavedLiters, 2975);
  assert.equal(result.mealsEquivalent, 10);
});

test('calculateImpact respects explicit weightKg when provided', () => {
  const result = calculateImpact(5, 4.0);
  assert.equal(result.weightKg, 4.0);
  assert.equal(result.co2PreventedKg, 10.0);
  assert.equal(result.waterSavedLiters, 3400);
});

test('getExpiryStatus accurately flags urgency thresholds', () => {
  const urgent = getExpiryStatus(2);
  assert.equal(urgent.level, 'urgent');
  assert.ok(urgent.label.includes('Sisa 2 Jam'));

  const warning = getExpiryStatus(6);
  assert.equal(warning.level, 'warning');
  assert.ok(warning.label.includes('Sisa 6 Jam'));

  const safe = getExpiryStatus(14);
  assert.equal(safe.level, 'safe');
  assert.ok(safe.label.includes('Aman'));
});

test('filterFoods correctly filters by query, category and halal verified', () => {
  const mockFoods: FoodItem[] = [
    {
      id: '1',
      title: 'Nasi Kotak Ayam Bakar',
      category: 'makanan_berat',
      categoryLabel: 'Makanan Berat',
      portions: 15,
      initialPortions: 15,
      weightKg: 5.2,
      donorName: 'Katering Berkah',
      donorType: 'Katering',
      donorAvatar: '',
      isVerified: true,
      donorPhone: '08123456789',
      pickupLocation: 'Tebet Barat, Jakarta Selatan',
      city: 'Jakarta Selatan',
      distanceKm: 1.5,
      hoursRemaining: 3,
      cookedTime: '3 jam lalu',
      condition: 'Baru Masak (Hangat)',
      halalVerified: true,
      imageUrl: '',
      description: 'Nasi kotak sisa prasmanan seminar',
      allergenNotes: [],
      status: 'available',
      distributionMethod: 'Ambil di Tempat',
      createdAt: '2026-10-15T08:00:00Z',
    },
    {
      id: '2',
      title: 'Roti Sourdough & Croissant',
      category: 'roti_kue',
      categoryLabel: 'Roti & Kue',
      portions: 20,
      initialPortions: 20,
      weightKg: 3.0,
      donorName: 'Artisan Bakery',
      donorType: 'Restoran',
      donorAvatar: '',
      isVerified: true,
      donorPhone: '08198765432',
      pickupLocation: 'Kemang, Jakarta Selatan',
      city: 'Jakarta Selatan',
      distanceKm: 4.2,
      hoursRemaining: 9,
      cookedTime: 'Hari ini',
      condition: 'Kue / Roti Hari Ini',
      halalVerified: false,
      imageUrl: '',
      description: 'Bake surplus pagi ini masih sangat lembut',
      allergenNotes: ['Gluten'],
      status: 'available',
      distributionMethod: 'Pojok Drop-off',
      createdAt: '2026-10-15T07:00:00Z',
    },
  ];

  // Test query search
  const foundAyam = filterFoods(mockFoods, { query: 'Ayam' });
  assert.equal(foundAyam.length, 1);
  assert.equal(foundAyam[0].id, '1');

  // Test category filter
  const foundBakery = filterFoods(mockFoods, { category: 'roti_kue' });
  assert.equal(foundBakery.length, 1);
  assert.equal(foundBakery[0].id, '2');

  // Test halal only filter
  const halalFoods = filterFoods(mockFoods, { halalOnly: true });
  assert.equal(halalFoods.length, 1);
  assert.equal(halalFoods[0].id, '1');

  // Test distance limit
  const nearFoods = filterFoods(mockFoods, { maxDistanceKm: 2.0 });
  assert.equal(nearFoods.length, 1);
  assert.equal(nearFoods[0].id, '1');
});

test('STORAGE_GUIDES has detailed data for common foods', () => {
  assert.ok(STORAGE_GUIDES.nasi);
  assert.ok(STORAGE_GUIDES.roti);
  assert.equal(STORAGE_GUIDES.nasi.recommendedStorage, 'Kulkas Bawah');
  assert.ok(STORAGE_GUIDES.daging_ayam.tips.length > 10);
});

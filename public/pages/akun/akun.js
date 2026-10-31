/**
 * Controller untuk Halaman Akun & Profil Pengguna
 */

import { state } from '../../js/state.js';

export function initAkun() {
  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-display-role');
  const emailEl = document.getElementById('user-display-email');
  const phoneEl = document.getElementById('user-display-phone');
  const cityEl = document.getElementById('user-display-city');

  const statKg = document.getElementById('profile-stat-kg');
  const statPortions = document.getElementById('profile-stat-portions');
  const statCo2 = document.getElementById('profile-stat-co2');
  const statPoints = document.getElementById('profile-stat-points');

  if (nameEl) nameEl.textContent = state.user.name;
  if (roleEl) roleEl.textContent = `✨ ${state.user.role}`;
  if (emailEl) emailEl.innerHTML = `<i data-lucide="mail" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${state.user.email}</span>`;
  if (phoneEl) phoneEl.innerHTML = `<i data-lucide="phone" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${state.user.phone}</span>`;
  if (cityEl) cityEl.innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#2D6A4F]"></i><span>${state.user.city}</span>`;

  if (statKg) statKg.textContent = `${state.user.impactKg} kg`;
  if (statPortions) statPortions.textContent = `${state.user.portionsShared} Porsi`;
  if (statCo2) statCo2.textContent = `${state.user.co2SavedKg} kg`;
  if (statPoints) statPoints.textContent = `${state.user.points} Poin`;

  // Button Open Edit Profile
  document.getElementById('btn-open-edit-profile')?.addEventListener('click', () => {
    window.app.openEditProfileModal();
  });

  if (window.lucide) window.lucide.createIcons();
}

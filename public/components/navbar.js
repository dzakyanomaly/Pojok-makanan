/**
 * Controller untuk Navbar Desktop & Mobile
 */

export function updateNavbarActive(pageId) {
  // Desktop Nav Links
  document.querySelectorAll('#desktop-nav .nav-link').forEach((btn) => {
    const p = btn.getAttribute('data-page');
    if (p === pageId) {
      btn.className =
        'nav-link relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer bg-[#2D6A4F] text-white shadow-xs';
    } else {
      btn.className =
        'nav-link relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F] hover:bg-[#EFE8DC]/60';
    }
  });

  // Mobile Bottom Nav Links
  document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
    const p = btn.getAttribute('data-page');
    if (p === 'donasi') return;
    if (p === pageId) {
      btn.classList.add('text-[#2D6A4F]');
      btn.classList.remove('text-[#7D7166]');
      btn.querySelector('span:last-child')?.classList.add('font-bold');
      btn.querySelector('span:last-child')?.classList.remove('font-medium');
    } else {
      btn.classList.remove('text-[#2D6A4F]');
      btn.classList.add('text-[#7D7166]');
      btn.querySelector('span:last-child')?.classList.remove('font-bold');
      btn.querySelector('span:last-child')?.classList.add('font-medium');
    }
  });
}

export function updateUnreadBadge(count) {
  const badge = document.getElementById('nav-unread-badge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

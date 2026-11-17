/**
 * Controller untuk Halaman Donasi (Makanan & Dana)
 */

import { state, saveState, calculateImpactMetrics } from "../../js/state.js";

export function initDonasi() {
  const tabFood = document.getElementById("tab-donate-food");
  const tabFund = document.getElementById("tab-donate-fund");
  const containerFood = document.getElementById("donate-food-container");
  const containerFund = document.getElementById("donate-fund-container");

  // Tab switching
  tabFood?.addEventListener("click", () => {
    tabFood.className =
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm";
    tabFund.className =
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]";
    containerFood?.classList.remove("hidden");
    containerFund?.classList.add("hidden");
  });

  tabFund?.addEventListener("click", () => {
    tabFund.className =
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer bg-[#2D6A4F] text-white shadow-sm";
    tabFood.className =
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-[#594A38] hover:text-[#2D6A4F]";
    containerFund?.classList.remove("hidden");
    containerFood?.classList.add("hidden");
  });

  // Food Donation Form Submission
  const form = document.getElementById("food-donation-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("input-food-title")?.value;
    const category = document.getElementById("input-food-category")?.value;
    const condition = document.getElementById("input-food-condition")?.value;
    const portions =
      parseInt(document.getElementById("input-food-portions")?.value, 10) || 10;
    const weightKg =
      parseFloat(document.getElementById("input-food-weight")?.value) || 3.5;
    const hoursRemaining =
      parseInt(document.getElementById("input-food-hours")?.value, 1) || 1;
    const pickupLocation =
      document.getElementById("input-food-location")?.value ||
      "Jakarta Selatan";
    const halalVerified =
      document.getElementById("input-food-halal")?.checked ?? true;

    const categoryLabels = {
      makanan_berat: "Makanan Siap Santap",
      roti_kue: "Roti & Pastry",
      sayur_buah: "Sayur & Buah Tani",
      sembako: "Sembako & Pangan Pokok",
      minuman: "Minuman Sehat",
    };

    const categoryImages = {
      makanan_berat:
        "https://images.unsplash.com/photo-15460699301-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      roti_kue:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      sayur_buah:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      sembako:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      minuman:
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",
    };

    const newFood = {
      id: `food-${Date.now()}`,
      title,
      category,
      categoryLabel: categoryLabels[category] || "Makanan Layak",
      portions,
      initialPortions: portions,
      weightKg,
      donorName: state.user.name,
      donorType: "Individu",
      donorAvatar: state.user.avatar,
      isVerified: true,
      donorPhone: state.user.phone,
      pickupLocation,
      city: state.user.city || "Jakarta Selatan",
      distanceKm: 0.5,
      hoursRemaining,
      cookedTime: "Baru saja didaftarkan",
      condition,
      halalVerified,
      imageUrl: categoryImages[category] || categoryImages.makanan_berat,
      description: `Donasi surplus dari ${state.user.name}. Makanan higienis dan siap diambil di titik lokasi.`,
      allergenNotes: ["Harap konfirmasi dengan penderma"],
      status: "available",
      distributionMethod: "Ambil di Tempat",
    };

    // Update state
    state.foods.unshift(newFood);
    state.user.totalDonations += 1;
    state.user.portionsShared += portions;
    state.user.impactKg = parseFloat(
      (state.user.impactKg + weightKg).toFixed(1),
    );

    const { co2PreventedKg } = calculateImpactMetrics(weightKg);
    state.user.co2SavedKg = parseFloat(
      (state.user.co2SavedKg + co2PreventedKg).toFixed(1),
    );
    state.user.points += 50;

    saveState();

    alert(
      `🎉 Terima kasih Kak ${state.user.name}! Donasi "${title}" berhasil diterbitkan dan langsung tampil di katalog jelajahi.`,
    );
    form.reset();
    window.app.navigateTo("jelajahi");
  });

  // Fund package selector
  document.querySelectorAll(".fund-card").forEach((card) => {
    card.addEventListener("click", () => {
      const amount = parseInt(card.getAttribute("data-amount"), 10);
      const pkg = card.getAttribute("data-pkg");

      state.selectedFundPackage = { amount, title: pkg };

      // Highlight card
      document.querySelectorAll(".fund-card").forEach((c) => {
        c.className =
          "fund-card p-4 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0] text-left transition cursor-pointer hover:border-[#2D6A4F]";
      });
      card.className =
        "fund-card p-4 rounded-2xl border border-[#2D6A4F] bg-[#E8F5E9] text-left transition cursor-pointer";

      const display = document.getElementById("fund-selected-display");
      if (display) {
        display.textContent = `Rp ${amount.toLocaleString("id-ID")}`;
      }
    });
  });

  // Confirm fund donation
  document.getElementById("btn-confirm-fund")?.addEventListener("click", () => {
    const pkg = state.selectedFundPackage;
    state.user.points += Math.floor(pkg.amount / 1000);
    state.user.totalDonations += 1;
    saveState();

    alert(
      `💚 Terima kasih atas donasi ${pkg.title} sebesar Rp ${pkg.amount.toLocaleString("id-ID")}! Pembayaran QRIS Anda berhasil diverifikasi.`,
    );
    window.app.navigateTo("akun");
  });

  if (window.lucide) window.lucide.createIcons();
}

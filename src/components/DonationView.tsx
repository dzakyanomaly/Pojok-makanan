import React, { useState } from "react";
import { FoodItem, CommunityPantry, FoodCategory } from "../types.ts";
import { calculateImpact } from "../utils/foodLogic.ts";
import {
  Heart,
  PlusCircle,
  Upload,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  DollarSign,
  Package,
  Soup,
  Croissant,
  Apple,
  Coffee,
  Utensils,
  ChevronRight,
  ArrowLeft,
  Info,
  Sprout,
  Recycle,
  Handshake,
} from "lucide-react";

interface DonationViewProps {
  pantries: CommunityPantry[];
  onAddFoodDonation: (newFood: Omit<FoodItem, "id" | "createdAt">) => void;
  onAddPackageDonation: (amount: number, packageName: string) => void;
  onNavigateToExplore: () => void;
}

export const DonationView: React.FC<DonationViewProps> = ({
  pantries,
  onAddFoodDonation,
  onAddPackageDonation,
  onNavigateToExplore,
}) => {
  const [activeTab, setActiveTab] = useState<"food" | "fund">("food");

  // Food Donation Form State
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<FoodCategory>("makanan_berat");
  const [portions, setPortions] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [condition, setCondition] = useState<
    | "Baru Masak (Hangat)"
    | "Segar Belum Diolah"
    | "Kue / Roti Hari Ini"
    | "Kemasan Masih Utuh"
  >("Baru Masak (Hangat)");
  const [hoursRemaining, setHoursRemaining] = useState<number>(6);
  const [halalVerified, setHalalVerified] = useState<boolean>(true);
  const [description, setDescription] = useState("");
  const [allergenInput, setAllergenInput] = useState("");

  // Step 2 State
  const [distributionMethod, setDistributionMethod] = useState<
    "Ambil di Tempat" | "Pojok Drop-off" | "Diantar Relawan"
  >("Pojok Drop-off");
  const [selectedPantryId, setSelectedPantryId] = useState<string>(
    pantries[0]?.id || "",
  );
  const [pickupAddress, setPickupAddress] = useState(
    "Jl. Tebet Barat Dalam Raya No. 42",
  );
  const [city, setCity] = useState("Jakarta Selatan");

  // Step 3 State
  const [donorName, setDonorName] = useState("Dzaky Muthohary");
  const [donorType, setDonorType] = useState<
    "Restoran" | "Katering" | "Individu" | "Supermarket" | "Hotel"
  >("Individu");
  const [donorPhone, setDonorPhone] = useState("0812-9876-5432");
  const [agreedHygiene, setAgreedHygiene] = useState<boolean>(false);
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  );

  // Form submission success popup
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [lastDonatedTitle, setLastDonatedTitle] = useState<string>("");

  // Fund Donation State
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    title: string;
    amount: number;
    description: string;
    icon: string;
  }>({
    id: "pkg-1",
    title: "Paket Sarapan Berkah",
    amount: 25000,
    description:
      "Menyediakan 2 porsi sarapan bergizi untuk dhuafa & pekerja jalanan.",
    icon: "🥣",
  });
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "gopay" | "bca" | "mandiri"
  >("qris");
  const [fundSuccess, setFundSuccess] = useState<boolean>(false);

  const imagePresets = [
    {
      name: "Nasi Kotak / Hidangan Hangat",
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Roti Artisan & Bakery",
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sayur & Buah Segar",
      url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Beras & Paket Sembako",
      url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const categoryLabels: Record<FoodCategory, string> = {
    semua: "Semua",
    makanan_berat: "Makanan Siap Santap",
    roti_kue: "Roti & Pastry",
    sayur_buah: "Sayur & Buah Tani",
    sembako: "Sembako & Pangan Pokok",
    minuman: "Minuman Sehat",
    katering: "Katering & Hotel",
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!title.trim()) return;
      setStep(2);
    } else if (step === 2) {
      if (!pickupAddress.trim()) return;
      setStep(3);
    }
  };

  const handleSubmitFoodDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedHygiene) return;

    const allergens = allergenInput
      ? allergenInput
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [];

    const selectedPantry = pantries.find((p) => p.id === selectedPantryId);
    const finalPickupLocation =
      distributionMethod === "Pojok Drop-off" && selectedPantry
        ? selectedPantry.name
        : pickupAddress;

    onAddFoodDonation({
      title,
      category: category === "semua" ? "makanan_berat" : category,
      categoryLabel:
        categoryLabels[category === "semua" ? "makanan_berat" : category],
      portions: Number(portions),
      initialPortions: Number(portions),
      weightKg: Number(weightKg),
      donorName,
      donorType,
      donorAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      isVerified: true,
      donorPhone,
      pickupLocation: finalPickupLocation,
      city,
      distanceKm: 0.5,
      hoursRemaining: Number(hoursRemaining),
      cookedTime: "Baru saja didaftarkan",
      condition,
      halalVerified,
      imageUrl: selectedImagePreset,
      description:
        description ||
        `Donasi surplus makanan layak konsumsi dari ${donorName}. Masih dalam kondisi ${condition}.`,
      allergenNotes: allergens,
      status: "available",
      distributionMethod,
    });

    setLastDonatedTitle(title);
    setShowSuccessModal(true);

    // Reset Form
    setTitle("");
    setDescription("");
    setStep(1);
    setAgreedHygiene(false);
  };

  const handlePackageDonate = () => {
    const finalAmount = customAmount
      ? parseInt(customAmount, 10)
      : selectedPackage.amount;
    onAddPackageDonation(finalAmount, selectedPackage.title);
    setFundSuccess(true);
  };

  const impactEstimation = calculateImpact(portions, weightKg);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
          Salurkan Berkah Pangan
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24201D]">
          Pojok Donasi & Solidaritas Pangan
        </h1>
        <p className="text-sm text-[#6C6259]">
          Pilih antara mendonasikan surplus makanan layak konsumsi atau inisiatif
          pengalihan pakan maggot.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1.5 bg-white border border-[#E8DFD1] rounded-2xl shadow-xs mt-4">
          <button
            onClick={() => setActiveTab("food")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "food"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-[#594A38] hover:text-[#2D6A4F]"
            }`}
          >
            <Soup className="w-4 h-4" />
            <span>Donasi Makanan Surplus (Gratis)</span>
          </button>
          <button
            onClick={() => setActiveTab("fund")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "fund"
                ? "bg-[#2D6A4F] text-white shadow-sm"
                : "text-[#594A38] hover:text-[#2D6A4F]"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Pakan Maggot</span>
            <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded-full font-bold">
              Coming Soon
            </span>
          </button>
        </div>
      </div>

      {/* Mode A: Surplus Food Wizard */}
      {activeTab === "food" && (
        <div className="max-w-3xl mx-auto">
          {/* Wizard Step Tracker */}
          <div className="mb-6 bg-white p-4 rounded-2xl border border-[#E8DFD1] shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6C6259]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 1
                      ? "bg-[#2D6A4F] text-white"
                      : "bg-[#FAF6F0] text-[#7D7166]"
                  }`}
                >
                  1
                </span>
                <span className={step === 1 ? "text-[#2D6A4F] font-bold" : ""}>
                  Info Makanan
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D9CDBF]" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 2
                      ? "bg-[#2D6A4F] text-white"
                      : "bg-[#FAF6F0] text-[#7D7166]"
                  }`}
                >
                  2
                </span>
                <span className={step === 2 ? "text-[#2D6A4F] font-bold" : ""}>
                  Lokasi & Titik Ambil
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D9CDBF]" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 3
                      ? "bg-[#2D6A4F] text-white"
                      : "bg-[#FAF6F0] text-[#7D7166]"
                  }`}
                >
                  3
                </span>
                <span className={step === 3 ? "text-[#2D6A4F] font-bold" : ""}>
                  Foto & Konfirmasi
                </span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-xs">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <div className="border-b border-[#F0EAE1] pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#24201D]">
                    Langkah 1: Rincian Makanan Surplus
                  </h2>
                  <p className="text-xs text-[#6C6259]">
                    Pastikan makanan dalam kondisi higienis dan layak
                    dikonsumsi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                    Nama Makanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: 20 Box Nasi Padang Rendang & Sayur Nangka"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Kategori Pangan
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as FoodCategory)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      <option value="makanan_berat">
                        Makanan Siap Santap (Nasi/Lauk)
                      </option>
                      <option value="roti_kue">Roti & Pastry</option>
                      <option value="sayur_buah">Sayur & Buah Tani</option>
                      <option value="sembako">Sembako & Pangan Pokok</option>
                      <option value="minuman">Minuman Sehat</option>
                      <option value="katering">Katering & Hotel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Kondisi Saat Ini
                    </label>
                    <select
                      value={condition}
                      onChange={(e) =>
                        setCondition(
                          e.target.value as
                            | "Baru Masak (Hangat)"
                            | "Segar Belum Diolah"
                            | "Kue / Roti Hari Ini"
                            | "Kemasan Masih Utuh",
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      <option value="Baru Masak (Hangat)">
                        Baru Masak (Hangat)
                      </option>
                      <option value="Kue / Roti Hari Ini">
                        Kue / Roti Hari Ini
                      </option>
                      <option value="Segar Belum Diolah">
                        Segar Belum Diolah (Sayur/Buah)
                      </option>
                      <option value="Kemasan Masih Utuh">
                        Kemasan Masih Utuh / Bersegel
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Jumlah Porsi
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={portions}
                      onChange={(e) =>
                        setPortions(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Perkiraan Berat (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0.1}
                      value={weightKg}
                      onChange={(e) =>
                        setWeightKg(parseFloat(e.target.value) || 1)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Maks. Waktu Konsumsi
                    </label>
                    <select
                      value={hoursRemaining}
                      onChange={(e) =>
                        setHoursRemaining(parseInt(e.target.value))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      <option value={3}>3 Jam ke depan (Mendesak)</option>
                      <option value={6}>6 Jam ke depan</option>
                      <option value={12}>12 Jam (Hari ini)</option>
                      <option value={24}>24 Jam (Besok)</option>
                      <option value={72}>3 Hari (Makanan tahan lama)</option>
                    </select>
                  </div>
                </div>

                {/* Halal & Allergen */}
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={halalVerified}
                      onChange={(e) => setHalalVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] border-[#D9CDBF]"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-[#2D6A4F]">
                      Saya menjamin bahan dan proses makanan ini 100% Halal
                    </span>
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#594A38] mb-1">
                      Catatan Alergen (Opsional, pisahkan dengan koma):
                    </label>
                    <input
                      type="text"
                      value={allergenInput}
                      onChange={(e) => setAllergenInput(e.target.value)}
                      placeholder="Contoh: Mengandung kacang, telur, terasi, gluten"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9CDBF] bg-white text-xs text-[#24201D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                    Deskripsi Tambahan
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ceritakan asal makanan (misal: sisa prasmanan rapat kantor belum tersentuh, dikemas rapi dalam lunch box)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                  />
                </div>

                {/* Impact Preview Widget */}
                <div className="bg-[#E8F5E9]/60 border border-[#2D6A4F]/20 p-4 rounded-2xl flex items-center justify-between text-xs text-[#2D6A4F]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      Estimasi dampak: Berbagi <strong>{portions} porsi</strong>{" "}
                      mencegah{" "}
                      <strong>
                        {impactEstimation.co2PreventedKg} kg emisi CO2
                      </strong>{" "}
                      & menghemat{" "}
                      <strong>{impactEstimation.waterSavedLiters} L air</strong>
                      !
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] active:scale-95 transition shadow-xs cursor-pointer"
                  >
                    <span>Lanjut ke Lokasi Penyaluran</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-5">
                <div className="border-b border-[#F0EAE1] pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#24201D]">
                    Langkah 2: Lokasi & Metode Penyaluran
                  </h2>
                  <p className="text-xs text-[#6C6259]">
                    Tentukan bagaimana penerima atau relawan dapat mengambil
                    donasi Anda.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-2">
                    Metode Penyaluran
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "Pojok Drop-off",
                        title: "Titik Lemari Berbagi",
                        desc: "Dititipkan di lemari/kulkas warga terdekat",
                      },
                      {
                        id: "Ambil di Tempat",
                        title: "Ambil Langsung",
                        desc: "Penerima mengambil di rumah/kantor Anda",
                      },
                      {
                        id: "Diantar Relawan",
                        title: "Dijemput Relawan",
                        desc: "Relawan motor Pojok Makanan mengambil",
                      },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setDistributionMethod(
                            m.id as
                              | "Ambil di Tempat"
                              | "Pojok Drop-off"
                              | "Diantar Relawan",
                          )
                        }
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                          distributionMethod === m.id
                            ? "bg-[#E8F5E9] border-[#2D6A4F] text-[#2D6A4F]"
                            : "bg-[#FAF6F0] border-[#E8DFD1] text-[#594A38] hover:border-[#D9CDBF]"
                        }`}
                      >
                        <div className="font-bold text-xs">{m.title}</div>
                        <div className="text-[11px] text-[#6C6259] mt-0.5">
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {distributionMethod === "Pojok Drop-off" && (
                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Pilih Lemari / Kulkas Berbagi Tujuan
                    </label>
                    <select
                      value={selectedPantryId}
                      onChange={(e) => setSelectedPantryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      {pantries.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.operationalHours}) - {p.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                    Alamat Lengkap Penjemputan / Titik Temu{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Contoh: Jl. Tebet Barat Dalam Raya No. 42 (Lobi Penerima Tamu)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Kota / Wilayah
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      <option value="Jakarta Selatan">Jakarta Selatan</option>
                      <option value="Jakarta Pusat">Jakarta Pusat</option>
                      <option value="Jakarta Timur">Jakarta Timur</option>
                      <option value="Jakarta Barat">Jakarta Barat</option>
                      <option value="Depok">Depok</option>
                      <option value="Bandung">Bandung</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Instruksi Khusus untuk Pengambil
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Titip ke satpam pos depan, sebut kode Pojok Makanan"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] active:scale-95 transition shadow-xs cursor-pointer"
                  >
                    <span>Lanjut ke Foto & Konfirmasi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmitFoodDonation} className="space-y-5">
                <div className="border-b border-[#F0EAE1] pb-4">
                  <h2 className="font-serif text-xl font-bold text-[#24201D]">
                    Langkah 3: Foto Makanan & Kontak Donatur
                  </h2>
                  <p className="text-xs text-[#6C6259]">
                    Unggah atau pilih foto perwakilan makanan dan isi kontak
                    untuk koordinasi klaim.
                  </p>
                </div>

                {/* Photo selector presets */}
                <div>
                  <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-2">
                    Pilih Foto Representatif Makanan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImagePreset(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 text-left transition cursor-pointer group ${
                          selectedImagePreset === preset.url
                            ? "border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20"
                            : "border-[#E8DFD1] hover:border-[#D9CDBF]"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-20 object-cover group-hover:scale-105 transition"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-medium text-[#3D332A] truncate">
                          {preset.name}
                        </div>
                        {selectedImagePreset === preset.url && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Nama Donatur / Instansi
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      Tipe Donatur
                    </label>
                    <select
                      value={donorType}
                      onChange={(e) =>
                        setDonorType(
                          e.target.value as
                            | "Restoran"
                            | "Katering"
                            | "Individu"
                            | "Supermarket"
                            | "Hotel",
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    >
                      <option value="Individu">
                        Perseorangan / Rumah Tangga
                      </option>
                      <option value="Katering">Jasa Katering</option>
                      <option value="Restoran">Restoran / Kafe</option>
                      <option value="Hotel">Hotel / Banquet</option>
                      <option value="Supermarket">
                        Toko Buah / Supermarket
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                      No. WhatsApp Aktif
                    </label>
                    <input
                      type="text"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                    />
                  </div>
                </div>

                {/* Hygiene Commitment Pledge */}
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Komitmen Higienitas & Kelayakan Pangan</span>
                  </div>
                  <p className="text-xs text-[#6C6259] leading-relaxed">
                    Saya menyatakan dengan jujur bahwa makanan yang didonasikan
                    tidak basi, belum kadaluarsa, disimpan dengan bersih, dan
                    aman dikonsumsi oleh sesama.
                  </p>
                  <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={agreedHygiene}
                      onChange={(e) => setAgreedHygiene(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] border-[#D9CDBF]"
                    />
                    <span className="text-xs font-bold text-[#24201D]">
                      Saya menyetujui syarat & ketentuan higienitas di atas
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedHygiene}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#2D6A4F] disabled:bg-[#D9CDBF] text-white text-sm font-bold hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Terbitkan Donasi Pangan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mode B: Pakan Maggot (Coming Soon) */}
      {activeTab === "fund" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DFD1] p-8 sm:p-10 shadow-xs text-center space-y-6 relative overflow-hidden">
            {/* Hiasan Latar Halus */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E8F5E9] rounded-full blur-2xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-50 rounded-full blur-2xl opacity-60 pointer-events-none" />

            {/* Badge Status & Ikon Utama */}
            <div className="relative z-10 flex flex-col items-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Fitur Segera Hadir • Coming Soon</span>
              </div>

              <div className="w-20 h-20 rounded-3xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2D6A4F] shadow-sm my-2">
                <Sprout className="w-10 h-10" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
                Pengalihan Pangan ke Pakan Maggot
              </h2>
              <p className="text-xs sm:text-sm text-[#6C6259] max-w-xl leading-relaxed">
                Solusi biokonversi ramah lingkungan untuk makanan yang telah melewati batas waktu konsumsi aman manusia agar tidak terbuang sia-sia menjadi limbah.
              </p>
            </div>

            {/* Kartu Penjelasan Alasan & Konsep */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#24201D]">
                  <Recycle className="w-4 h-4 text-[#2D6A4F]" />
                  <span>Tujuan Inisiatif Ini</span>
                </div>
                <p className="text-xs text-[#6C6259] leading-relaxed">
                  Pangan surplus yang sudah lewat jam aman konsumsi akan dialihkan sebagai pakan larva Maggot BSF <em>(Black Soldier Fly)</em> untuk diolah kembali menjadi pakan ternak tinggi protein dan pupuk organik kasgot.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFF8E7] border border-[#FFE082] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#8C5827]">
                  <Info className="w-4 h-4 text-[#A36B2B]" />
                  <span>Status: Tahap Penjajakan Mitra</span>
                </div>
                <p className="text-xs text-[#6C6259] leading-relaxed">
                  Fitur ini berstatus <strong>Coming Soon</strong> karena kami sedang mencari dan mengumpulkan mitra pembudidaya maggot terpercaya yang siap menampung serta mendistribusikan pangan lewat jam ini secara rutin.
                </p>
              </div>
            </div>

            {/* Ajakan Menjadi Mitra / Hubungi Kami */}
            <div className="relative z-10 pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <div className="font-bold text-sm text-[#24201D]">Anda Pembudidaya Maggot atau Pengolah Organik?</div>
                <div className="text-xs text-[#6C6259]">Mari berkolaborasi menampung pangan lewat jam agar tercapai misi Nol Sampah Makanan (Zero Food Waste).</div>
              </div>
              <a
                href="mailto:kemitraan@pojokmakanan.id?subject=Ketertarikan%20Menjadi%20Mitra%20Pakan%20Maggot%20Pojok%20Makanan"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] transition shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Handshake className="w-4 h-4" />
                <span>Hubungi Kemitraan</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal for Surplus Food Submission */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E8DFD1] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#24201D]">
                Alhamdulillah, Berhasil!
              </h3>
              <p className="text-xs sm:text-sm text-[#6C6259]">
                Donasi <strong>&ldquo;{lastDonatedTitle}&rdquo;</strong> telah
                berhasil diterbitkan ke katalog Pojok Makanan.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] text-xs text-[#594A38] text-left space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#2D6A4F]">
                <Sparkles className="w-4 h-4" />
                <span>Dampak Langsung:</span>
              </div>
              <p>• Mencegah emisi gas metana di tempat pembuangan akhir.</p>
              <p>• Notifikasi instan dikirim ke relawan di radius 3 km.</p>
              <p>• Poin reputasi penderma Anda telah bertambah +30 poin!</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigateToExplore();
                }}
                className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
              >
                Lihat di Menu Jelajahi
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal for Fund Donation */}
      {fundSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E8DFD1] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-8 h-8 fill-[#2D6A4F]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#24201D]">
                Terima Kasih Banyak!
              </h3>
              <p className="text-xs sm:text-sm text-[#6C6259]">
                Pembayaran donasi paket pangan berhasil diverifikasi. Kwitansi
                kebaikan telah dicatat di profil Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] text-xs text-left space-y-2">
              <div className="flex justify-between text-[#6C6259]">
                <span>Kode Transaksi:</span>
                <span className="font-mono font-bold text-[#24201D]">
                  #PM-DON-{Date.now() % 100000}
                </span>
              </div>
              <div className="flex justify-between text-[#6C6259]">
                <span>Penyaluran:</span>
                <span className="font-bold text-[#2D6A4F]">
                  {selectedPackage.title}
                </span>
              </div>
              <div className="flex justify-between text-[#6C6259]">
                <span>Status:</span>
                <span className="text-emerald-700 font-bold">
                  Lunas (Tervalidasi)
                </span>
              </div>
            </div>

            <button
              onClick={() => setFundSuccess(false)}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
            >
              Kembali ke Halaman
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

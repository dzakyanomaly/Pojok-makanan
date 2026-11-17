import React from "react";
import { FoodItem, CommunityPantry, PageType, FoodCategory } from "../types.ts";
import { getExpiryStatus } from "../utils/foodLogic.ts";
import {
  Heart,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Leaf,
  Utensils,
  Soup,
  Croissant,
  Apple,
  Package,
  Coffee,
  CheckCircle2,
  Users,
  Building2,
  Refrigerator,
} from "lucide-react";

interface HomeViewProps {
  foodItems: FoodItem[];
  pantries: CommunityPantry[];
  onNavigate: (page: PageType) => void;
  onSelectFood: (item: FoodItem) => void;
  onSelectCategory: (cat: FoodCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  foodItems,
  pantries,
  onNavigate,
  onSelectFood,
  onSelectCategory,
}) => {
  // Urgent food items (sisa waktu <= 4 jam)
  const urgentFoods = foodItems.filter(
    (f) => f.hoursRemaining <= 5 && f.status === "available",
  );

  const categories: {
    id: FoodCategory;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    desc: string;
  }[] = [
    {
      id: "makanan_berat",
      name: "Siap Santap",
      icon: Soup,
      count: foodItems.filter((f) => f.category === "makanan_berat").length,
      desc: "Nasi kotak, lauk hangat, prasmanan",
    },
    {
      id: "roti_kue",
      name: "Roti & Pastry",
      icon: Croissant,
      count: foodItems.filter((f) => f.category === "roti_kue").length,
      desc: "Roti artisan, bakery harian",
    },
    {
      id: "sayur_buah",
      name: "Sayur & Buah",
      icon: Apple,
      count: foodItems.filter((f) => f.category === "sayur_buah").length,
      desc: "Panen tani segar & buah matang",
    },
    {
      id: "sembako",
      name: "Sembako",
      icon: Package,
      count: foodItems.filter((f) => f.category === "sembako").length,
      desc: "Beras, minyak, bahan pangan pokok",
    },
    {
      id: "minuman",
      name: "Minuman",
      icon: Coffee,
      count: foodItems.filter((f) => f.category === "minuman").length,
      desc: "Jus murni, susu kedelai segar",
    },
    {
      id: "katering",
      name: "Katering & Hotel",
      icon: Utensils,
      count: foodItems.filter((f) => f.category === "katering").length,
      desc: "Surplus banquet & acara resmi",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F4EFE6] via-[#FAF6F0] to-[#EAE2D5] border border-[#E5DACB] p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Soft decorative background circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#2D6A4F]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#E5DACB]/50 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2D6A4F]/20 text-xs font-semibold text-[#2D6A4F] shadow-xs">
              <Leaf className="w-3.5 h-3.5" />
              <span>Gerakan Peduli Pangan & Zero Food Waste</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24201D] leading-[1.2]">
              Setiap Porsi Punya Cerita, Jangan Biarkan Berakhir Jadi{" "}
              <span className="text-[#2D6A4F] underline decoration-[#52B788]/40 decoration-wavy underline-offset-6">
                Sampah Pangan
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#594A38] leading-relaxed max-w-2xl">
              Salurkan surplus makanan dari katering, restoran, kebun, dan dapur
              rumah tangga Anda ke komunitas yang membutuhkan atau temukan
              lemari berbagi terdekat di sekitar Anda.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate("donasi")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-md shadow-[#2D6A4F]/20 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Mulai Donasi Makanan</span>
              </button>
              <button
                onClick={() => onNavigate("jelajahi")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#D9CDBF] text-[#3D332A] font-semibold text-sm hover:bg-[#F5EFEB] hover:border-[#2D6A4F] active:scale-95 transition cursor-pointer"
              >
                <span>Jelajahi Makanan Tersedia</span>
                <ChevronRight className="w-4 h-4 text-[#6C6259]" />
              </button>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-4 border-t border-[#E8DFD1] flex flex-wrap items-center gap-6 text-xs text-[#6C6259]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                <span>Pemeriksaan Kelayakan & Higienitas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>100% Gratis Tanpa Pungutan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2D6A4F]" />
                <span>Jaringan Komunitas & Relawan</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Quick Highlight */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 rounded-2xl p-5 border border-[#E8DFD1] shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                    Klaim Terhangat Hari Ini
                  </span>
                </div>
                <span className="text-xs text-[#7D7166]">Diperbarui live</span>
              </div>

              {foodItems[0] && (
                <div
                  onClick={() => onSelectFood(foodItems[0])}
                  className="group block cursor-pointer transition"
                >
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3">
                    <img
                      src={foodItems[0].imageUrl}
                      alt={foodItems[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Sisa {foodItems[0].hoursRemaining} Jam</span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                      {foodItems[0].distanceKm} km dari Anda
                    </div>
                  </div>

                  <h3 className="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">
                    {foodItems[0].title}
                  </h3>
                  <p className="text-xs text-[#6C6259] line-clamp-2 mt-1">
                    {foodItems[0].description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <img
                        src={foodItems[0].donorAvatar}
                        alt={foodItems[0].donorName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-[#4A4036]">
                        {foodItems[0].donorName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2 py-1 rounded-lg">
                      {foodItems[0].portions} Porsi Tersisa
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C6259] mb-2">
            <span className="text-xs font-medium">Porsi Tersalurkan</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#2D6A4F]">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
            3.820+
          </div>
          <p className="text-[11px] text-[#2D6A4F] font-semibold mt-1">
            ↑ 142 porsi minggu ini
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C6259] mb-2">
            <span className="text-xs font-medium">Makanan Diselamatkan</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#2D6A4F]">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
            1.337 kg
          </div>
          <p className="text-[11px] text-[#2D6A4F] font-semibold mt-1">
            Setara 48 ton sampah TPA
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C6259] mb-2">
            <span className="text-xs font-medium">Emisi CO2 Dicegah</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#2D6A4F]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
            3.342 kg
          </div>
          <p className="text-[11px] text-[#2D6A4F] font-semibold mt-1">
            Emisi karbon rumah kaca
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8DFD1] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C6259] mb-2">
            <span className="text-xs font-medium">Titik Pojok Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#2D6A4F]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
            24 Titik
          </div>
          <p className="text-[11px] text-[#2D6A4F] font-semibold mt-1">
            Jabodetabek & Bandung
          </p>
        </div>
      </section>

      {/* Urgent Rescue Food (Segera Diambil) */}
      {urgentFoods.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h2 className="font-serif text-2xl font-bold text-[#24201D]">
                  Penyelamatan Mendesak
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#6C6259] mt-0.5">
                Surplus makanan siap konsumsi dengan batas waktu kurang dari 5
                jam. Ayo bantu ambil atau salurkan!
              </p>
            </div>
            <button
              onClick={() => onNavigate("jelajahi")}
              className="text-xs sm:text-sm font-semibold text-[#2D6A4F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {urgentFoods.slice(0, 3).map((item) => {
              const urgency = getExpiryStatus(item.hoursRemaining);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectFood(item)}
                  className="bg-white rounded-2xl border border-red-200/80 hover:border-red-400 p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-xl overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                          <Clock className="w-3 h-3" />
                          <span>{urgency.label}</span>
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                        {item.distanceKm} km
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold mb-1">
                        <span>{item.categoryLabel}</span>
                        {item.halalVerified && (
                          <span className="bg-[#E8F5E9] text-[#2D6A4F] px-1.5 py-0.2 rounded text-[10px]">
                            Halal
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6C6259] line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#594A38]">
                      <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      <span className="truncate max-w-[150px]">
                        {item.city}
                      </span>
                    </div>
                    <span className="font-bold text-[#2D6A4F] bg-[#FAF6F0] border border-[#E8DFD1] px-2.5 py-1 rounded-lg">
                      {item.portions} Porsi Tersisa
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#24201D]">
              Kategori Surplus Pangan
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6259]">
              Pilih jenis pangan yang ingin Anda selamatkan atau donasikan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onNavigate("jelajahi");
                }}
                className="bg-white hover:bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DFD1] hover:border-[#2D6A4F] transition text-left group flex flex-col justify-between shadow-2xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] group-hover:bg-[#E8F5E9] flex items-center justify-center text-[#2D6A4F] transition mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#24201D] group-hover:text-[#2D6A4F] transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#7D7166] mt-0.5">
                    {cat.count} donasi aktif
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Community Food Pantries (Pojok Berbagi Terdekat) */}
      <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-xs font-semibold text-[#2D6A4F] mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Titik Fisik Lemari & Kulkas Berbagi</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#24201D]">
              Pojok Berbagi Komunitas Terdekat
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6259]">
              Drop-off surplus makanan atau ambil langsung di lemari berbagi
              warga berikut
            </p>
          </div>
          <button
            onClick={() => onNavigate("jelajahi")}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2D6A4F] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>Buka Peta Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pantries.map((pantry) => (
            <div
              key={pantry.id}
              className="p-4 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-[#24201D]">
                    {pantry.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6C6259] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                    <span>{pantry.address}</span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    pantry.status === "Banyak Makanan"
                      ? "bg-emerald-100 text-emerald-800"
                      : pantry.status === "Stok Sedang"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {pantry.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#594A38] pt-2 border-t border-[#E8DFD1]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>{pantry.operationalHours}</span>
                </div>
                {pantry.hasRefrigerator && (
                  <div className="flex items-center gap-1 text-[#2D6A4F] font-medium">
                    <Refrigerator className="w-3.5 h-3.5" />
                    <span>Kulkas Dingin Tersedia</span>
                  </div>
                )}
                <div className="ml-auto font-bold text-[#2D6A4F]">
                  {pantry.itemsCount} Paket Tersedia
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="bg-gradient-to-b from-[#FAF6F0] to-[#F2ECE1] rounded-3xl p-6 sm:p-10 border border-[#E5DACB] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
            Alur Berbagi Sederhana
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
            Bagaimana Cara Kerja Pojok Makanan?
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6259]">
            Hanya butuh waktu kurang dari 2 menit untuk menghubungkan makanan
            berlebih dengan mereka yang membutuhkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD1] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center font-bold text-lg mx-auto shadow-2xs">
              1
            </div>
            <h3 className="font-bold text-base text-[#24201D]">
              Foto & Daftarkan Surplus
            </h3>
            <p className="text-xs text-[#6C6259] leading-relaxed">
              Foto makanan layak konsumsi Anda, cantumkan porsi, waktu masak,
              dan lokasi drop-off atau titik ambil.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD1] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center font-bold text-lg mx-auto shadow-2xs">
              2
            </div>
            <h3 className="font-bold text-base text-[#24201D]">
              Klaim & Koordinasi Instan
            </h3>
            <p className="text-xs text-[#6C6259] leading-relaxed">
              Penerima manfaat atau relawan kurir mengklaim kuota dan
              berkomunikasi langsung melalui fitur pesan interaktif.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DFD1] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center font-bold text-lg mx-auto shadow-2xs">
              3
            </div>
            <h3 className="font-bold text-base text-[#24201D]">
              Pangan Terselamatkan!
            </h3>
            <p className="text-xs text-[#6C6259] leading-relaxed">
              Makanan dinikmati selagi segar. Jejak karbon terpangkas, dan
              dampak kebaikan Anda tercatat di profil.
            </p>
          </div>
        </div>
      </section>

      {/* Education & Recipe Teaser */}
      <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] text-xs font-semibold text-[#2D6A4F] border border-[#E8DFD1]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pojok Pengetahuan Food Waste</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#24201D]">
            Bingung Nasi Sisa Semalam Mau Diolah Jadi Apa?
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6259] leading-relaxed">
            Temukan panduan membaca label Best Before, trik menjaga kesegaran
            sayur kulkas hingga 2 minggu, dan kalkulator masa simpan makanan di
            fitur Edukasi kami.
          </p>
        </div>

        <button
          onClick={() => onNavigate("edukasi")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer shrink-0"
        >
          <span>Buka Pojok Edukasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

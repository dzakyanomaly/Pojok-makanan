import React, { useState, useMemo } from "react";
import { FoodItem, CommunityPantry, FoodCategory } from "../types.ts";
import { filterFoods, getExpiryStatus } from "../utils/foodLogic.ts";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  Map as MapIcon,
  Grid,
  Check,
  ShieldCheck,
  Building2,
  AlertCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface ExploreViewProps {
  foodItems: FoodItem[];
  pantries: CommunityPantry[];
  selectedCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
  onSelectFood: (food: FoodItem) => void;
  onOpenDonate: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  foodItems,
  pantries,
  selectedCategory,
  onSelectCategory,
  onSelectFood,
  onOpenDonate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [halalOnly, setHalalOnly] = useState<boolean>(false);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [selectedPantryMap, setSelectedPantryMap] =
    useState<CommunityPantry | null>(null);

  const categories: { id: FoodCategory; label: string }[] = [
    { id: "semua", label: "Semua Kategori" },
    { id: "makanan_berat", label: "Siap Santap" },
    { id: "roti_kue", label: "Roti & Pastry" },
    { id: "sayur_buah", label: "Sayur & Buah" },
    { id: "sembako", label: "Sembako" },
    { id: "minuman", label: "Minuman" },
    { id: "katering", label: "Katering & Hotel" },
  ];

  // Filter food items
  const filteredItems = useMemo(() => {
    let result = filterFoods(foodItems, {
      query: searchQuery,
      category: selectedCategory,
      maxDistanceKm: maxDistance,
      halalOnly: halalOnly,
      status: "available",
    });

    if (urgentOnly) {
      result = result.filter((item) => item.hoursRemaining <= 5);
    }

    return result;
  }, [
    foodItems,
    searchQuery,
    selectedCategory,
    maxDistance,
    halalOnly,
    urgentOnly,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    onSelectCategory("semua");
    setMaxDistance(10);
    setHalalOnly(false);
    setUrgentOnly(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Tagline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
            Katalog Surplus Pangan
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#24201D] mt-0.5">
            Jelajahi Makanan Tersedia
          </h1>
          <p className="text-sm text-[#6C6259] mt-1">
            Temukan donasi makanan segar layak konsumsi dan titik lemari berbagi
            di sekitarmu.
          </p>
        </div>

        {/* View Switcher: Grid vs Interactive Map */}
        <div className="inline-flex items-center p-1 bg-[#EFE8DC]/70 rounded-xl border border-[#D9CDBF]/70 self-start md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-[#2D6A4F] shadow-xs"
                : "text-[#6C6259] hover:text-[#24201D]"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Kartu ({filteredItems.length})</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "map"
                ? "bg-white text-[#2D6A4F] shadow-xs"
                : "text-[#6C6259] hover:text-[#24201D]"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta Titik Pantau</span>
          </button>
        </div>
      </div>

      {/* Search and Main Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFD1] shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7166]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari makanan (misal: ayam bakar, roti, sayur bayam, katering)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent text-[#24201D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D7166] hover:text-[#24201D]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? "bg-[#2D6A4F] text-white shadow-2xs"
                    : "bg-[#FAF6F0] text-[#594A38] border border-[#E8DFD1] hover:border-[#2D6A4F]/50 hover:bg-[#F2ECE1]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EAE1] text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Halal Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={halalOnly}
                onChange={(e) => setHalalOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] border-[#D9CDBF]"
              />
              <span className="font-medium text-[#4A4036]">
                Halal Terverifikasi
              </span>
            </label>

            {/* Urgent only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-[#D9CDBF]"
              />
              <span className="font-medium text-red-700">
                Mendesak (&lt; 5 Jam)
              </span>
            </label>
          </div>

          {/* Distance Filter */}
          <div className="flex items-center gap-2 text-[#594A38]">
            <span className="text-xs">Radius Maks:</span>
            <div className="inline-flex rounded-lg border border-[#D9CDBF] bg-[#FAF6F0] p-0.5">
              {[2, 5, 10].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setMaxDistance(dist)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                    maxDistance === dist
                      ? "bg-[#2D6A4F] text-white"
                      : "text-[#6C6259] hover:text-[#24201D]"
                  }`}
                >
                  {dist} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === "grid" ? (
        <>
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DFD1] p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#7D7166] flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 text-[#2D6A4F]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#24201D]">
                  Tidak ada makanan yang cocok
                </h3>
                <p className="text-xs sm:text-sm text-[#6C6259]">
                  Coba perluas radius pencarian Anda, hapus filter, atau jadilah
                  pahlawan pertama yang mendonasikan makanan di area ini!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] cursor-pointer"
                >
                  Reset Semua Filter
                </button>
                <button
                  onClick={onOpenDonate}
                  className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] cursor-pointer shadow-xs"
                >
                  Beri Donasi Sekarang
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => {
                const urgency = getExpiryStatus(item.hoursRemaining);
                const percentLeft = Math.round(
                  (item.portions / item.initialPortions) * 100,
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectFood(item)}
                    className="bg-white rounded-2xl border border-[#E8DFD1] hover:border-[#2D6A4F]/60 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group overflow-hidden"
                  >
                    <div>
                      {/* Image & floating tags */}
                      <div className="relative h-48 w-full overflow-hidden bg-[#F0EAE1]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {/* Urgency Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${urgency.badgeBg}`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{urgency.label}</span>
                          </span>
                        </div>

                        {/* Distance pill */}
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{item.distanceKm} km</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#2D6A4F]">
                            {item.categoryLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF6F0] text-[#6C6259] border border-[#E8DFD1]">
                            {item.distributionMethod}
                          </span>
                        </div>

                        <h3 className="font-bold text-[#24201D] text-base group-hover:text-[#2D6A4F] transition line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#6C6259] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Portions Progress */}
                        <div className="pt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6C6259]">Tersisa:</span>
                            <span className="font-bold text-[#2D6A4F]">
                              {item.portions} / {item.initialPortions} Porsi (
                              {item.weightKg} kg)
                            </span>
                          </div>
                          <div className="w-full bg-[#FAF6F0] rounded-full h-1.5 overflow-hidden border border-[#E8DFD1]">
                            <div
                              className="bg-[#2D6A4F] h-full rounded-full transition-all duration-300"
                              style={{ width: `${percentLeft}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer info & CTA */}
                    <div className="p-4 pt-3 border-t border-[#F0EAE1] bg-[#FCFAF6] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.donorAvatar}
                          alt={item.donorName}
                          className="w-7 h-7 rounded-full object-cover border border-[#D9CDBF]"
                        />
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-[#3D332A] truncate max-w-[120px]">
                              {item.donorName}
                            </span>
                            {item.isVerified && (
                              <ShieldCheck className="w-3 h-3 text-[#2D6A4F]" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#7D7166]">
                            {item.donorType}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFood(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] active:scale-95 transition cursor-pointer shadow-2xs"
                      >
                        Detail & Klaim
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Interactive Simulated Map of Points */
        <div className="bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs">
          {/* Map Top Indicator */}
          <div className="p-4 bg-[#FAF6F0] border-b border-[#E8DFD1] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#24201D]">Area Pantau:</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#D9CDBF] text-[#2D6A4F] font-semibold">
                📍 Jakarta Selatan & Sekitarnya
              </span>
            </div>
            <div className="flex items-center gap-4 text-[#6C6259]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2D6A4F]" /> Titik
                Surplus Makanan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-600" /> Lemari
                Berbagi RW
              </span>
            </div>
          </div>

          {/* Map Surface Simulation */}
          <div className="relative h-[480px] bg-[#EBE5DA] overflow-hidden p-6">
            {/* Visual Grid roads representation */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #B8A896 1px, transparent 1px), linear-gradient(to bottom, #B8A896 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Simulated River / Green Area */}
            <div className="absolute top-1/4 -left-20 w-[120%] h-12 bg-[#A3C9A8]/40 rotate-12 blur-xs pointer-events-none" />

            {/* Pins for Food Items */}
            {filteredItems.map((item, index) => {
              // Deterministic layout offsets based on index
              const topPos = 20 + ((index * 23) % 65);
              const leftPos = 15 + ((index * 31) % 70);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFood(item)}
                  style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  aria-label={`Pin makanan: ${item.title}`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Tooltip on hover/focus */}
                    <div className="hidden group-hover:flex flex-col bg-white px-2.5 py-1.5 rounded-xl shadow-lg border border-[#D9CDBF] text-left text-xs whitespace-nowrap mb-1 z-20">
                      <span className="font-bold text-[#24201D]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#2D6A4F] font-semibold">
                        {item.portions} porsi • {item.distanceKm} km
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="w-2 h-2 rounded-full bg-black/30 mt-0.5" />
                  </div>
                </button>
              );
            })}

            {/* Pins for Community Pantries */}
            {pantries.map((pantry, idx) => {
              const topPos = 25 + ((idx * 29) % 60);
              const leftPos = 20 + ((idx * 37) % 75);

              return (
                <button
                  key={pantry.id}
                  onClick={() => setSelectedPantryMap(pantry)}
                  style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  aria-label={`Titik pantry: ${pantry.name}`}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="w-2 h-2 rounded-full bg-black/30 mt-0.5" />
                  </div>
                </button>
              );
            })}

            {/* Bottom floating details card if a pantry pin is clicked */}
            {selectedPantryMap && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white p-4 rounded-2xl border border-[#E8DFD1] shadow-xl z-30 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      Titik Lemari Berbagi
                    </span>
                    <h4 className="font-bold text-sm text-[#24201D]">
                      {selectedPantryMap.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedPantryMap(null)}
                    className="text-[#7D7166] hover:text-[#24201D]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#6C6259]">
                  {selectedPantryMap.address}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE1] text-xs">
                  <span className="text-[#2D6A4F] font-bold">
                    {selectedPantryMap.itemsCount} Paket Makanan Siap Ambil
                  </span>
                  <span className="text-[11px] text-[#6C6259]">
                    Buka: {selectedPantryMap.operationalHours}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

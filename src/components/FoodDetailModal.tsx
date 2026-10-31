import React from "react";
import { FoodItem } from "../types.ts";
import { getExpiryStatus } from "../utils/foodLogic.ts";
import {
  X,
  Clock,
  MapPin,
  ShieldCheck,
  Heart,
  Phone,
  MessageCircle,
  AlertTriangle,
  Sparkles,
  Utensils,
  Share2,
} from "lucide-react";

interface FoodDetailModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onOpenClaim: (item: FoodItem) => void;
  onOpenChatWithDonor: (item: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  onClose,
  onOpenClaim,
  onOpenChatWithDonor,
}) => {
  if (!item) return null;

  const urgency = getExpiryStatus(item.hoursRemaining);
  const percentLeft = Math.round((item.portions / item.initialPortions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E8DFD1] shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header & Image */}
        <div className="relative h-64 w-full bg-[#FAF6F0]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center backdrop-blur-xs cursor-pointer transition"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs shadow-sm ${urgency.badgeBg}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{urgency.label}</span>
            </span>
          </div>

          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{item.distanceKm} km dari lokasi Anda</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                {item.categoryLabel}
              </span>
              {item.halalVerified && (
                <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Halal Terverifikasi</span>
                </span>
              )}
              <span className="text-[#6C6259] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#E8DFD1]">
                Metode: {item.distributionMethod}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#24201D] leading-tight">
              {item.title}
            </h2>

            <p className="text-sm text-[#594A38] leading-relaxed pt-1">
              {item.description}
            </p>
          </div>

          {/* Portions & Condition Stats */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#594A38]">
                Kondisi Makanan:
              </span>
              <span className="font-bold text-[#24201D]">{item.condition}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#594A38]">
                Waktu Masak / Dibuat:
              </span>
              <span className="text-[#6C6259]">{item.cookedTime}</span>
            </div>

            <div className="pt-2 border-t border-[#E8DFD1] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#594A38]">
                  Porsi Tersedia:
                </span>
                <span className="font-bold text-[#2D6A4F]">
                  {item.portions} / {item.initialPortions} Porsi (
                  {item.weightKg} kg)
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#D9CDBF]">
                <div
                  className="bg-[#2D6A4F] h-full rounded-full transition-all"
                  style={{ width: `${percentLeft}%` }}
                />
              </div>
            </div>
          </div>

          {/* Allergen Warning if applicable */}
          {item.allergenNotes && item.allergenNotes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Informasi Alergen:</span> Mengandung{" "}
                {item.allergenNotes.join(", ")}.
              </div>
            </div>
          )}

          {/* Donor Card */}
          <div className="p-4 rounded-2xl border border-[#E8DFD1] bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={item.donorAvatar}
                alt={item.donorName}
                className="w-11 h-11 rounded-full object-cover border border-[#D9CDBF]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#24201D]">
                    {item.donorName}
                  </h4>
                  {item.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  )}
                </div>
                <div className="text-[11px] text-[#7D7166]">
                  {item.donorType} • Penderma Terdaftar
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenChatWithDonor(item);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#2D6A4F] hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>

          {/* Pickup Location details */}
          <div className="space-y-1 text-xs text-[#594A38]">
            <span className="font-bold text-[#24201D] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Titik Lokasi Pengambilan:</span>
            </span>
            <p className="pl-5 text-[#6C6259]">
              {item.pickupLocation}, {item.city}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#F0EAE1] flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: item.title,
                    text: `Ada donasi makanan surplus "${item.title}" di Pojok Makanan!`,
                    url: window.location.href,
                  });
                } else {
                  window.alert("Tautan donasi disalin ke clipboard!");
                }
              }}
              className="p-3 rounded-xl border border-[#D9CDBF] text-[#594A38] hover:bg-[#FAF6F0] transition cursor-pointer"
              title="Bagikan Donasi"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenClaim(item);
              }}
              disabled={item.portions <= 0}
              className="flex-1 py-3 px-6 rounded-xl bg-[#2D6A4F] disabled:bg-[#D9CDBF] text-white font-bold text-sm hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer text-center"
            >
              {item.portions > 0
                ? `Klaim Makanan (${item.portions} Tersedia)`
                : "Habis Terklaim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

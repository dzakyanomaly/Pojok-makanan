import React, { useState } from "react";
import { FoodItem } from "../types.ts";
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface ClaimModalProps {
  item: FoodItem | null;
  onClose: () => void;
  onSuccessClaim: (claimedItem: FoodItem, portionsClaimed: number) => void;
  onOpenChatWithDonor: (item: FoodItem) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  onClose,
  onSuccessClaim,
  onOpenChatWithDonor,
}) => {
  if (!item) return null;

  const maxClaim = Math.min(item.portions, 10);
  const [quantity, setQuantity] = useState<number>(Math.min(2, maxClaim));
  const [intention, setIntention] = useState<
    "Keluarga / Pribadi" | "Warga Dhuafa" | "Panti Asuhan"
  >("Keluarga / Pribadi");
  const [pickupTime, setPickupTime] = useState<string>(
    "Segera (dalam 1-2 jam)",
  );
  const [bringOwnContainer, setBringOwnContainer] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [ticketCode, setTicketCode] = useState<string>("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketCode(generatedCode);
    onSuccessClaim(item, quantity);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#E8DFD1] shadow-2xl animate-in fade-in zoom-in-95">
        {!isCompleted ? (
          <form onSubmit={handleClaim} className="space-y-5">
            <div className="flex items-start justify-between border-b border-[#F0EAE1] pb-3">
              <div>
                <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
                  Konfirmasi Pengambilan
                </span>
                <h3 className="font-serif text-xl font-bold text-[#24201D] mt-0.5">
                  Klaim Porsi Makanan
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7D7166] hover:text-[#24201D] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="text-xs min-w-0">
                <h4 className="font-bold text-[#24201D] truncate">
                  {item.title}
                </h4>
                <p className="text-[#6C6259]">{item.donorName}</p>
                <p className="text-[#2D6A4F] font-semibold">
                  Tersedia {item.portions} porsi
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-2">
                Jumlah Porsi yang Diambil:
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[#D9CDBF] rounded-xl overflow-hidden bg-[#FAF6F0]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 font-bold text-base hover:bg-[#EFE8DC] disabled:opacity-40 transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm text-[#24201D] bg-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(maxClaim, q + 1))
                    }
                    disabled={quantity >= maxClaim}
                    className="px-3.5 py-2 font-bold text-base hover:bg-[#EFE8DC] disabled:opacity-40 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#6C6259]">
                  Maks. {maxClaim} porsi per orang agar merata
                </span>
              </div>
            </div>

            {/* Intention */}
            <div>
              <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                Tujuan Penyaluran / Konsumsi:
              </label>
              <select
                value={intention}
                onChange={(e) =>
                  setIntention(
                    e.target.value as
                      | "Keluarga / Pribadi"
                      | "Warga Dhuafa"
                      | "Panti Asuhan",
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-xs sm:text-sm text-[#24201D] focus:ring-2 focus:ring-[#2D6A4F]"
              >
                <option value="Keluarga / Pribadi">
                  Konsumsi Pribadi / Keluarga di Rumah
                </option>
                <option value="Warga Dhuafa">
                  Dibagikan ke Warga Dhuafa / Pemulung Sekitar
                </option>
                <option value="Panti Asuhan">
                  Disalurkan ke Panti Asuhan / Pesantren
                </option>
              </select>
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1.5">
                Perkiraan Waktu Pengambilan:
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-xs sm:text-sm text-[#24201D] focus:ring-2 focus:ring-[#2D6A4F]"
              >
                <option value="Segera (dalam 1-2 jam)">
                  Segera (dalam 1-2 jam ke depan)
                </option>
                <option value="Siang ini jam 13:00 - 15:00">
                  Siang ini (13:00 - 15:00 WIB)
                </option>
                <option value="Sore ini jam 16:00 - 18:00">
                  Sore ini (16:00 - 18:00 WIB)
                </option>
              </select>
            </div>

            {/* Eco container pledge */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF6F0] border border-[#E8DFD1] text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={bringOwnContainer}
                onChange={(e) => setBringOwnContainer(e.target.checked)}
                className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] mt-0.5"
              />
              <span className="text-[#594A38]">
                <strong>Bawa Wadah Sendiri (Zero Waste):</strong> Saya bersedia
                membawa tas kain atau rantang makan sendiri saat mengambil
                donasi.
              </span>
            </label>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] active:scale-95 transition shadow-xs cursor-pointer"
              >
                Konfirmasi Klaim Sekarang
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Ticket Card */
          <div className="text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Klaim Berhasil Dicatat
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#24201D]">
                Tiket Pengambilan Pangan
              </h3>
              <p className="text-xs text-[#6C6259]">
                Simpan atau tunjukkan kode tiket ini ke penderma saat tiba di
                lokasi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-3">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-[#D9CDBF] flex items-center justify-center">
                <QrCode className="w-28 h-28 text-[#2D6A4F]" />
              </div>

              <div className="font-mono text-lg font-bold text-[#24201D] bg-white py-1 rounded-lg border border-[#E8DFD1]">
                #{ticketCode}
              </div>

              <div className="text-xs text-left text-[#594A38] space-y-1 pt-1 border-t border-[#E8DFD1]">
                <p>
                  <strong>Item:</strong> {item.title} ({quantity} Porsi)
                </p>
                <p>
                  <strong>Lokasi:</strong> {item.pickupLocation}
                </p>
                <p>
                  <strong>Kontak:</strong> {item.donorName} ({item.donorPhone})
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithDonor(item);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat dengan Penderma</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

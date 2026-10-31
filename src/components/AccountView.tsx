import React, { useState } from "react";
import { UserProfile, DonationHistoryItem } from "../types.ts";
import {
  User,
  Heart,
  Award,
  Sparkles,
  Leaf,
  Utensils,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Settings,
  History,
  QrCode,
  CheckCircle2,
  Edit3,
  Sliders,
  Bell,
} from "lucide-react";

interface AccountViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<
    "history" | "claims" | "badges" | "settings"
  >("history");

  // Edit Profile Modal
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [city, setCity] = useState(userProfile.city);

  // Settings State
  const [notifRadius, setNotifRadius] = useState<number>(5);
  const [halalDefault, setHalalDefault] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // QR Modal for claimed ticket
  const [activeTicket, setActiveTicket] = useState<{
    code: string;
    foodTitle: string;
    pickupLocation: string;
    portions: number;
  } | null>(null);

  // Mock donation history items
  const donationHistory: DonationHistoryItem[] = [
    {
      id: "DH-01",
      title: "15 Box Nasi Bento Sayur & Tahu Tempe",
      date: "14 Okt 2026",
      portions: 15,
      recipient: "Pojok Berbagi Tebet Ramah Warga",
      status: "Selesai",
      type: "makanan",
      amountOrKg: "5.2 kg",
    },
    {
      id: "DH-02",
      title: "Paket Sarapan Berkah Dhuafa (Dana)",
      date: "11 Okt 2026",
      portions: 2,
      recipient: "Dapur Komunitas Solidaritas Cikini",
      status: "Selesai",
      type: "dana",
      amountOrKg: "Rp 25.000",
    },
    {
      id: "DH-03",
      title: "20 Roti Baguette & Croissant Kemasan",
      date: "08 Okt 2026",
      portions: 20,
      recipient: "Lemari Pangan Berkah Kemang",
      status: "Selesai",
      type: "makanan",
      amountOrKg: "4.0 kg",
    },
    {
      id: "DH-04",
      title: "Paket Sayur Segar Hidroponik RW 04",
      date: "03 Okt 2026",
      portions: 12,
      recipient: "Panti Asuhan Kasih Mandiri",
      status: "Selesai",
      type: "makanan",
      amountOrKg: "6.5 kg",
    },
  ];

  // Mock claimed meals
  const claimedMeals = [
    {
      id: "CLM-8921",
      foodTitle: "Paket Nasi Kotak Ayam Bakar & Lalapan",
      date: "Hari ini, 12:45 WIB",
      portions: 5,
      pickupLocation: "Jl. Tebet Barat Dalam Raya No. 42 (Lobi Katering)",
      donorName: "Katering Sedap Nusantara",
      status: "Siap Diambil",
    },
    {
      id: "CLM-7740",
      foodTitle: "Roti Sourdough & Croissant Segar",
      date: "Kemarin, 16:30 WIB",
      portions: 3,
      pickupLocation: "Pojok Berbagi Tebet",
      donorName: "Mekar Artisan Bakery",
      status: "Selesai",
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, address, city });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* User Header Profile Card */}
      <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F5E9]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#FAF6F0] shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
                    {userProfile.name}
                  </h1>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] text-xs font-bold text-[#2D6A4F] mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{userProfile.role}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0] active:scale-95 transition cursor-pointer self-center sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Profil</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6C6259] pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#2D6A4F]" />
                {userProfile.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                {userProfile.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                {userProfile.city}
              </span>
            </div>
          </div>
        </div>

        {/* Impact Bar on Profile */}
        <div className="mt-8 pt-6 border-t border-[#F0EAE1] grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1]">
            <span className="text-[11px] font-semibold text-[#6C6259]">
              Total Pangan Selamat
            </span>
            <div className="font-serif text-2xl font-bold text-[#24201D] mt-1">
              {userProfile.impactKg} kg
            </div>
            <p className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
              Surplus terselamatkan
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1]">
            <span className="text-[11px] font-semibold text-[#6C6259]">
              Porsi Dibagikan
            </span>
            <div className="font-serif text-2xl font-bold text-[#24201D] mt-1">
              {userProfile.portionsShared} Porsi
            </div>
            <p className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
              Dinikmati sesama
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1]">
            <span className="text-[11px] font-semibold text-[#6C6259]">
              Jejak CO2 Dicegah
            </span>
            <div className="font-serif text-2xl font-bold text-[#24201D] mt-1">
              {userProfile.co2SavedKg} kg
            </div>
            <p className="text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
              Gas emisi metana
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1]">
            <span className="text-[11px] font-semibold text-[#6C6259]">
              Poin Kebaikan
            </span>
            <div className="font-serif text-2xl font-bold text-[#2D6A4F] mt-1">
              {userProfile.points} Poin
            </div>
            <p className="text-[10px] text-[#6C6259] font-medium mt-0.5">
              Tingkat kontributor aktif
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8DFD1] scrollbar-none">
        {[
          { id: "history", label: "Riwayat Donasi Saya", icon: Heart },
          { id: "claims", label: "Tiket Klaim Makanan", icon: QrCode },
          { id: "badges", label: "Lencana Prestasi", icon: Award },
          { id: "settings", label: "Pengaturan & Preferensi", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "history" | "claims" | "badges" | "settings",
                )
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "bg-[#2D6A4F] text-white shadow-2xs"
                  : "bg-white text-[#594A38] border border-[#E8DFD1] hover:bg-[#FAF6F0]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Donation History */}
      {activeTab === "history" && (
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#24201D]">
                Aktivitas Donasi Pangan
              </h3>
              <p className="text-xs text-[#6C6259]">
                Daftar makanan dan paket sembako yang telah Anda donasikan.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2D6A4F]">
              Total {donationHistory.length} Donasi Selesai
            </span>
          </div>

          <div className="divide-y divide-[#F0EAE1]">
            {donationHistory.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#24201D]">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D6A4F]">
                      {item.type === "makanan"
                        ? "Surplus Makanan"
                        : "Paket Sembako"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6C6259]">
                    <span>Penyaluran: {item.recipient}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-[#2D6A4F] bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#E8DFD1]">
                    {item.amountOrKg} ({item.portions} Porsi)
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Claimed Meals & Tickets */}
      {activeTab === "claims" && (
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#24201D]">
                Tiket & Pengambilan Makanan
              </h3>
              <p className="text-xs text-[#6C6259]">
                Tunjukkan kode atau QR tiket ini saat mengambil makanan di
                lokasi penderma atau lemari berbagi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {claimedMeals.map((claim) => (
              <div
                key={claim.id}
                className="p-5 rounded-2xl border border-[#E8DFD1] bg-[#FAF6F0]/60 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2 py-0.5 rounded">
                      Kode: #{claim.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#24201D] mt-1.5">
                      {claim.foodTitle}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      claim.status === "Siap Diambil"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="text-xs text-[#594A38] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Waktu Klaim: {claim.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span className="truncate">{claim.pickupLocation}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8DFD1] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#24201D]">
                    Jumlah: {claim.portions} Porsi
                  </span>
                  <button
                    onClick={() =>
                      setActiveTicket({
                        code: claim.id,
                        foodTitle: claim.foodTitle,
                        pickupLocation: claim.pickupLocation,
                        portions: claim.portions,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Buka QR Tiket</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: Badges */}
      {activeTab === "badges" && (
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-3 border-b border-[#F0EAE1]">
            <h3 className="font-serif text-xl font-bold text-[#24201D]">
              Lencana Pencapaian & Dampak Sosial
            </h3>
            <p className="text-xs text-[#6C6259]">
              Dapatkan lencana spesial saat Anda menyelamatkan makanan, mencegah
              emisi karbon, dan aktif dalam komunitas Pojok Makanan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProfile.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition ${
                  badge.unlocked
                    ? "bg-[#FAF6F0] border-[#E8DFD1]"
                    : "bg-[#F7F5F2]/50 border-dashed border-[#D9CDBF] opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0 p-2 rounded-xl bg-white border border-[#E8DFD1] shadow-2xs">
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#24201D]">
                        {badge.title}
                      </h4>
                      {badge.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#6C6259] leading-relaxed">
                      {badge.description}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold mt-1 ${
                        badge.unlocked ? "text-[#2D6A4F]" : "text-[#7D7166]"
                      }`}
                    >
                      {badge.unlocked ? "✓ Terbuka" : "🔒 Belum Terbuka"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 4: Settings & Preferences */}
      {activeTab === "settings" && (
        <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
          <div className="pb-3 border-b border-[#F0EAE1]">
            <h3 className="font-serif text-xl font-bold text-[#24201D]">
              Preferensi Akun & Notifikasi
            </h3>
            <p className="text-xs text-[#6C6259]">
              Atur jangkauan radius pemberitahuan dan preferensi pangan Anda.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider">
                Radius Notifikasi Makanan Baru ({notifRadius} km)
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={notifRadius}
                onChange={(e) => setNotifRadius(parseInt(e.target.value))}
                className="w-full accent-[#2D6A4F] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7D7166]">
                <span>1 km (Dekat Rumah)</span>
                <span>10 km</span>
                <span>20 km (Satu Kota)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-xs text-[#24201D]">
                    Prioritaskan Pangan Halal
                  </div>
                  <div className="text-[11px] text-[#6C6259]">
                    Hanya tampilkan makanan bersertifikat atau berjaminan halal
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={halalDefault}
                  onChange={(e) => setHalalDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#E8DFD1]">
                <div>
                  <div className="font-bold text-xs text-[#24201D]">
                    Suara & Notifikasi Chat
                  </div>
                  <div className="text-[11px] text-[#6C6259]">
                    Bunyikan nada saat ada pesan dari penderma atau relawan
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F]"
                />
              </label>
            </div>

            <button
              onClick={() => window.alert("Preferensi berhasil disimpan!")}
              className="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </section>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E8DFD1] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-2xl font-bold text-[#24201D]">
              Ubah Data Profil
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1">
                  Alamat Domisili
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D332A] uppercase tracking-wider mb-1">
                  Kota / Wilayah
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-[#24201D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#594A38] hover:bg-[#FAF6F0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332]"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Ticket Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E8DFD1] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Tiket Sah Pengambilan Pangan
            </span>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#24201D]">
                {activeTicket.foodTitle}
              </h3>
              <p className="text-xs text-[#6C6259]">
                {activeTicket.portions} Porsi
              </p>
            </div>

            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-dashed border-[#2D6A4F] flex items-center justify-center">
              <QrCode className="w-36 h-36 text-[#2D6A4F]" />
            </div>

            <div className="font-mono text-base font-bold text-[#24201D] bg-[#FAF6F0] py-1.5 rounded-xl border border-[#E8DFD1]">
              #{activeTicket.code}
            </div>

            <p className="text-[11px] text-[#6C6259]">
              📍 Lokasi Ambil: {activeTicket.pickupLocation}
            </p>

            <button
              onClick={() => setActiveTicket(null)}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332]"
            >
              Tutup Tiket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

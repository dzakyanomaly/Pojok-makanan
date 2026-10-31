import React from "react";
import { PageType } from "../types.ts";
import {
  Home,
  Compass,
  HeartHandshake,
  BookOpen,
  MessageCircle,
  User,
  PlusCircle,
  MapPin,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  unreadCount?: number;
  onOpenDonateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  unreadCount = 1,
}) => {
  const navItems: {
    id: PageType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "jelajahi", label: "Jelajahi", icon: Compass },
    { id: "donasi", label: "Donasi", icon: HeartHandshake },
    { id: "edukasi", label: "Edukasi", icon: BookOpen },
    { id: "pesan", label: "Pesan", icon: MessageCircle },
    { id: "akun", label: "Akun", icon: User },
  ];

  return (
    <>
      {/* Top Desktop & Tablet Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFD1] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 text-left group transition cursor-pointer"
              aria-label="Pojok Makanan Beranda"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-md shadow-[#2D6A4F]/20 group-hover:bg-[#1B4332] transition">
                <UtensilsCrossed className="w-6 h-6 text-[#E8F5E9]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#24201D]">
                    Pojok<span className="text-[#2D6A4F]">Makanan</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2D6A4F]/10 text-[#2D6A4F]">
                    Peduli Pangan
                  </span>
                </div>
                <p className="text-xs text-[#6C6259] hidden sm:block">
                  Berbagi Rasa, Selamatkan Surplus Pangan
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-[#2D6A4F] text-white shadow-sm"
                        : "text-[#594A38] hover:text-[#2D6A4F] hover:bg-[#EFE8DC]/60"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-[#6C6259]"}`}
                    />
                    <span>{item.label}</span>
                    {item.id === "pesan" && unreadCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#FAF6F0] text-[#2D6A4F]"
                            : "bg-[#2D6A4F] text-white"
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action on Desktop */}
            <div className="flex items-center gap-3">
              {/* City location badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EAE1] rounded-full text-xs font-medium text-[#594A38]">
                <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Jakarta Selatan</span>
              </div>

              {/* Fast Donation CTA */}
              <button
                onClick={() => onNavigate("donasi")}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#1B4332] active:scale-95 transition shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Beri Donasi</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Floating / Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Bawah Seluler"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-lg border-t border-[#E8DFD1] px-2 py-1.5 safe-area-pb shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isDonasi = item.id === "donasi";

            if (isDonasi) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate("donasi")}
                  className="flex flex-col items-center -mt-6 group cursor-pointer"
                  aria-label="Donasi Makanan"
                >
                  <div
                    className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 ${
                      isActive
                        ? "bg-[#1B4332] ring-4 ring-[#E8F5E9]"
                        : "bg-[#2D6A4F]"
                    }`}
                  >
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1 ${isActive ? "text-[#2D6A4F]" : "text-[#6C6259]"}`}
                  >
                    Donasi
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
                  isActive
                    ? "text-[#2D6A4F]"
                    : "text-[#7D7166] hover:text-[#2D6A4F]"
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
                  />
                  {item.id === "pesan" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#2D6A4F] text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

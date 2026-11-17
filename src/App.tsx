import React, { useState } from 'react';
import { PageType, FoodItem, FoodCategory, UserProfile, ChatThread } from './types.ts';
import {
  INITIAL_FOOD_ITEMS,
  COMMUNITY_PANTRIES,
  EDUCATION_ARTICLES,
  INITIAL_CHAT_THREADS,
  INITIAL_USER_PROFILE,
} from './data/mockData.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { ExploreView } from './components/ExploreView.tsx';
import { DonationView } from './components/DonationView.tsx';
import { EducationView } from './components/EducationView.tsx';
import { MessagesView } from './components/MessagesView.tsx';
import { AccountView } from './components/AccountView.tsx';
import { FoodDetailModal } from './components/FoodDetailModal.tsx';
import { ClaimModal } from './components/ClaimModal.tsx';
import { Heart, Sparkles, UtensilsCrossed, ShieldCheck, Leaf } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [pantries] = useState(COMMUNITY_PANTRIES);
  const [articles] = useState(EDUCATION_ARTICLES);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_CHAT_THREADS[0].id);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Selected Category filter for ExploreView
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('semua');

  // Modals state
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodItem | null>(null);
  const [selectedFoodForClaim, setSelectedFoodForClaim] = useState<FoodItem | null>(null);

  // Unread messages calculation
  const unreadMessagesCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  // Handle adding a new food donation
  const handleAddFoodDonation = (newFood: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const createdItem: FoodItem = {
      ...newFood,
      id: `food-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setFoodItems((prev) => [createdItem, ...prev]);

    // Update user profile impact
    setUserProfile((prev) => {
      const addedKg = newFood.weightKg;
      const addedPortions = newFood.portions;
      const addedCo2 = parseFloat((addedKg * 2.5).toFixed(1));

      return {
        ...prev,
        impactKg: parseFloat((prev.impactKg + addedKg).toFixed(1)),
        portionsShared: prev.portionsShared + addedPortions,
        co2SavedKg: parseFloat((prev.co2SavedKg + addedCo2).toFixed(1)),
        totalDonations: prev.totalDonations + 1,
        points: prev.points + 50,
      };
    });
  };

  // Handle monetary/package donation
  const handleAddPackageDonation = (amount: number, packageName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + Math.floor(amount / 1000),
      totalDonations: prev.totalDonations + 1,
    }));
  };

  // Handle food claim
  const handleSuccessClaim = (claimedItem: FoodItem, portionsClaimed: number) => {
    setFoodItems((prev) =>
      prev.map((item) => {
        if (item.id === claimedItem.id) {
          const newPortions = Math.max(0, item.portions - portionsClaimed);
          return {
            ...item,
            portions: newPortions,
            status: newPortions === 0 ? 'completed' : 'available',
          };
        }
        return item;
      })
    );

    setUserProfile((prev) => ({
      ...prev,
      totalClaimed: prev.totalClaimed + portionsClaimed,
      points: prev.points + 10,
    }));
  };

  // Handle sending chat message with simulated auto-reply
  const handleSendMessage = (threadId: string, text: string) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      senderName: userProfile.name,
      text,
      timestamp: 'Baru saja',
      isUser: true,
      status: 'sent' as const,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastTimestamp: 'Baru saja',
            unreadCount: 0,
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    // Simulate friendly Indonesian reply from donor/volunteer after 1.2s
    setTimeout(() => {
      const autoResponses = [
        'Terima kasih sudah konfirmasi! Titik ambil sudah siap, kami tunggu ya Kak.',
        'Baik Kak, paket sudah kami sediakan di meja depan dengan kode tiket Anda.',
        'Sip, hati-hati di jalan ya Kak. Semoga berkah dan bermanfaat makanannya!',
        'Siap Kak, relawan kami juga sudah standby di lokasi.',
      ];
      const randomResponse =
        autoResponses[Math.floor(Math.random() * autoResponses.length)];

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            return {
              ...t,
              lastMessage: randomResponse,
              lastTimestamp: 'Baru saja',
              messages: [
                ...t.messages,
                {
                  id: `reply-${Date.now()}`,
                  senderName: t.participantName,
                  text: randomResponse,
                  timestamp: 'Baru saja',
                  isUser: false,
                },
              ],
            };
          }
          return t;
        })
      );
    }, 1200);
  };

  // Open chat with specific donor from food item
  const handleOpenChatWithDonor = (food: FoodItem) => {
    // Check if thread with donor exists
    const existingThread = threads.find(
      (t) => t.participantName.toLowerCase() === food.donorName.toLowerCase()
    );

    if (existingThread) {
      setActiveThreadId(existingThread.id);
    } else {
      // Create new thread
      const newThread: ChatThread = {
        id: `thread-${Date.now()}`,
        participantName: food.donorName,
        participantRole: 'Pemberi Makanan',
        participantAvatar: food.donorAvatar,
        isOnline: true,
        lastMessage: `Halo Kak! Saya tertarik dengan donasi "${food.title}".`,
        lastTimestamp: 'Baru saja',
        unreadCount: 0,
        relatedFoodTitle: food.title,
        relatedFoodLocation: food.pickupLocation,
        messages: [
          {
            id: `init-${Date.now()}`,
            senderName: userProfile.name,
            text: `Halo ${food.donorName}! Saya ingin berkoordinasi mengenai donasi "${food.title}". Apakah masih bisa diambil?`,
            timestamp: 'Baru saja',
            isUser: true,
          },
        ],
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
    }

    setCurrentPage('pesan');
  };

  // Update user profile handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#24201D]">
      {/* Top Header & Bottom Mobile Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        unreadCount={unreadMessagesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentPage === 'home' && (
          <HomeView
            foodItems={foodItems}
            pantries={pantries}
            onNavigate={setCurrentPage}
            onSelectFood={(item) => setSelectedFoodForDetail(item)}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        )}

        {currentPage === 'jelajahi' && (
          <ExploreView
            foodItems={foodItems}
            pantries={pantries}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectFood={(item) => setSelectedFoodForDetail(item)}
            onOpenDonate={() => setCurrentPage('donasi')}
          />
        )}

        {currentPage === 'donasi' && (
          <DonationView
            pantries={pantries}
            onAddFoodDonation={handleAddFoodDonation}
            onAddPackageDonation={handleAddPackageDonation}
            onNavigateToExplore={() => setCurrentPage('jelajahi')}
          />
        )}

        {currentPage === 'edukasi' && <EducationView articles={articles} />}

        {currentPage === 'pesan' && (
          <MessagesView
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={(id) => {
              setActiveThreadId(id);
              // Clear unread count for this thread
              setThreads((prev) =>
                prev.map((t) => (t.id === id ? { ...t, unreadCount: 0 } : t))
              );
            }}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentPage === 'akun' && (
          <AccountView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Food Detail Modal */}
      {selectedFoodForDetail && (
        <FoodDetailModal
          item={selectedFoodForDetail}
          onClose={() => setSelectedFoodForDetail(null)}
          onOpenClaim={(item) => {
            setSelectedFoodForDetail(null);
            setSelectedFoodForClaim(item);
          }}
          onOpenChatWithDonor={handleOpenChatWithDonor}
        />
      )}

      {/* Food Claim Modal */}
      {selectedFoodForClaim && (
        <ClaimModal
          item={selectedFoodForClaim}
          onClose={() => setSelectedFoodForClaim(null)}
          onSuccessClaim={handleSuccessClaim}
          onOpenChatWithDonor={handleOpenChatWithDonor}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8DFD1] mt-12 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white">
                  <UtensilsCrossed className="w-5 h-5 text-[#E8F5E9]" />
                </div>
                <span className="font-serif text-xl font-bold text-[#24201D]">
                  Pojok<span className="text-[#2D6A4F]">Makanan</span>
                </span>
              </div>
              <p className="text-xs text-[#6C6259] leading-relaxed">
                Inisiatif komunitas untuk menghubungkan surplus makanan layak konsumsi dengan saudara
                yang membutuhkan. Bersama cegah food waste demi bumi yang lebih hijau.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#24201D] uppercase tracking-wider">Halaman Utama</h4>
              <ul className="space-y-1.5 text-[#6C6259]">
                <li>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="hover:text-[#2D6A4F] cursor-pointer"
                  >
                    Beranda
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('jelajahi')}
                    className="hover:text-[#2D6A4F] cursor-pointer"
                  >
                    Jelajahi Makanan Tersedia
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('donasi')}
                    className="hover:text-[#2D6A4F] cursor-pointer"
                  >
                    Beri Donasi Surplus
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('edukasi')}
                    className="hover:text-[#2D6A4F] cursor-pointer"
                  >
                    Pojok Edukasi & Resep
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#24201D] uppercase tracking-wider">Komitmen & Keamanan</h4>
              <ul className="space-y-1.5 text-[#6C6259]">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>SOP Higienitas Pangan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Misi Net-Zero Waste 2030</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Jaminan 100% Halal Terverifikasi</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#24201D] uppercase tracking-wider">Wilayah Titik Pojok</h4>
              <p className="text-[#6C6259] leading-relaxed">
                Tebet, Kemang, Cikini, Rawamangun, Depok, Bandung, Surabaya, dan terus bertambah di
                seluruh Indonesia.
              </p>
              <div className="pt-2 text-[11px] text-[#7D7166]">
                © {new Date().getFullYear()} Pojok Makanan Indonesia. Hak Cipta Dilindungi.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

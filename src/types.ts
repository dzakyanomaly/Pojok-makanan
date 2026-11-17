export type PageType = 'home' | 'jelajahi' | 'donasi' | 'edukasi' | 'pesan' | 'akun';

export type FoodCategory = 'semua' | 'makanan_berat' | 'sayur_buah' | 'roti_kue' | 'sembako' | 'minuman' | 'katering';

export interface FoodItem {
  id: string;
  title: string;
  category: 'makanan_berat' | 'sayur_buah' | 'roti_kue' | 'sembako' | 'minuman' | 'katering';
  categoryLabel: string;
  portions: number;
  initialPortions: number;
  weightKg: number;
  donorName: string;
  donorType: 'Restoran' | 'Katering' | 'Individu' | 'Supermarket' | 'Hotel';
  donorAvatar: string;
  isVerified: boolean;
  donorPhone: string;
  pickupLocation: string;
  city: string;
  distanceKm: number;
  hoursRemaining: number;
  cookedTime: string;
  condition: 'Baru Masak (Hangat)' | 'Segar Belum Diolah' | 'Kue / Roti Hari Ini' | 'Kemasan Masih Utuh';
  halalVerified: boolean;
  imageUrl: string;
  description: string;
  allergenNotes: string[];
  status: 'available' | 'reserved' | 'completed';
  distributionMethod: 'Ambil di Tempat' | 'Pojok Drop-off' | 'Diantar Relawan';
  createdAt: string;
}

export interface CommunityPantry {
  id: string;
  name: string;
  address: string;
  city: string;
  operationalHours: string;
  status: 'Banyak Makanan' | 'Stok Sedang' | 'Perlu Pasokan Segera';
  itemsCount: number;
  hasRefrigerator: boolean;
  distanceKm: number;
  contactPerson: string;
  coordinates: { lat: number; lng: number };
}

export interface EducationArticle {
  id: string;
  title: string;
  category: 'Tips Dapur' | 'Edukasi Lingkungan' | 'Resep Olahan Sisa' | 'Panduan Higienis';
  readTime: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string[];
  tips: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantRole: 'Pemberi Makanan' | 'Relawan Kurir' | 'Pengelola Pojok' | 'Penerima';
  participantAvatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  relatedFoodTitle?: string;
  relatedFoodLocation?: string;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  city: string;
  address: string;
  points: number;
  impactKg: number;
  portionsShared: number;
  co2SavedKg: number;
  totalDonations: number;
  totalClaimed: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}

export interface DonationHistoryItem {
  id: string;
  title: string;
  date: string;
  portions: number;
  recipient: string;
  status: 'Selesai' | 'Dalam Proses' | 'Dibatalkan';
  type: 'makanan' | 'dana';
  amountOrKg: string;
}

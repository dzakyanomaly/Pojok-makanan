import React, { useState } from "react";
import { EducationArticle } from "../types.ts";
import { STORAGE_GUIDES, StorageGuide } from "../utils/foodLogic.ts";
import {
  BookOpen,
  Sparkles,
  Clock,
  ChevronRight,
  Calculator,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Refrigerator,
  Flame,
  Snowflake,
  X,
  Share2,
} from "lucide-react";

interface EducationViewProps {
  articles: EducationArticle[];
}

export const EducationView: React.FC<EducationViewProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(
    null,
  );

  // Shelf Life Tool State
  const [selectedFoodKey, setSelectedFoodKey] = useState<string>("nasi");
  const activeGuide: StorageGuide =
    STORAGE_GUIDES[selectedFoodKey] || STORAGE_GUIDES["nasi"];

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: "Seberapa sering Anda membuat rencana makan (Meal Planning) sebelum belanja mingguan?",
      options: [
        { text: "Hampir selalu saya rencanakan dengan rapi", score: 3 },
        { text: "Kadang-kadang saja jika sempat", score: 2 },
        { text: "Tidak pernah, belanja spontan", score: 1 },
      ],
    },
    {
      q: "Apa yang biasa Anda lakukan dengan nasi atau lauk pauk yang tersisa di rumah?",
      options: [
        {
          text: "Disimpan di kulkas & diolah kembali (dibuat nasi goreng/cireng/hangatkan)",
          score: 3,
        },
        {
          text: "Diberikan ke tetangga, hewan peliharaan, atau donasi",
          score: 3,
        },
        {
          text: "Sering dibiarkan basi di meja makan lalu dibuang ke tong sampah",
          score: 1,
        },
      ],
    },
    {
      q: 'Bagaimana pemahaman Anda mengenai label tanggal "Best Before"?',
      options: [
        {
          text: "Paham bahwa itu mutu rasa, jika aroma & wujud masih bagus tetap aman",
          score: 3,
        },
        { text: "Ragu-ragu, tapi kadang saya cicip sedikit dulu", score: 2 },
        {
          text: "Langsung saya buang tepat saat tanggal tertera terlewati",
          score: 1,
        },
      ],
    },
    {
      q: "Bagaimana cara Anda menata kulkas?",
      options: [
        {
          text: "Terapkan prinsip First In First Out (makanan lama di depan)",
          score: 3,
        },
        {
          text: "Terkadang berantakan sehingga ada sayur yang lupa dimasak",
          score: 2,
        },
        {
          text: "Sangat sering menemukan bahan busuk di pojok kulkas",
          score: 1,
        },
      ],
    },
  ];

  const handleSelectAnswer = (qIndex: number, optionScore: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optionScore }));
  };

  const calculateQuizResult = () => {
    const scores = Object.values(quizAnswers);
    if (scores.length < quizQuestions.length) return null;
    const total = scores.reduce((a, b) => a + b, 0);

    if (total >= 11) {
      return {
        level: "Pahlawan Pangan Super (Zero Waste Master)",
        badge: "🏆",
        desc: "Hebat sekali! Kebiasaan Anda sangat ramah lingkungan dan menginspirasi. Anda telah membantu bumi menghemat banyak emisi karbon.",
        tips: "Pertahankan dan tularkan tips Anda kepada tetangga di Pojok Makanan!",
      };
    } else if (total >= 8) {
      return {
        level: "Pejuang Pangan Sadar",
        badge: "🌱",
        desc: "Bagus! Anda sudah memiliki kepedulian yang kuat terhadap pencegahan sampah makanan, hanya perlu sedikit konsistensi dalam penataan kulkas.",
        tips: "Gunakan tips pembungkus tisu kering untuk sayuran agar tahan hingga 2 minggu!",
      };
    } else {
      return {
        level: "Perlu Perhatian Bersama",
        badge: "⚠️",
        desc: "Masih cukup banyak makanan layak yang terbuang sia-sia dari dapur Anda. Jangan berkecil hati, mari mulai langkah kecil hari ini!",
        tips: "Mulailah dengan mencatat apa saja yang ada di kulkas sebelum pergi berbelanja.",
      };
    }
  };

  const filteredArticles =
    selectedCategory === "semua"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
          Pojok Literasi & Pengetahuan
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24201D]">
          Edukasi & Tips Cegah Sampah Pangan
        </h1>
        <p className="text-sm text-[#6C6259]">
          Ketahui panduan cerdas menyimpan bahan makanan, resep olahan pangan
          sisa, serta kalkulator ketahanan makanan agar belanja dapur lebih
          hemat dan bumi tetap lestari.
        </p>
      </div>

      {/* Interactive Tool 1: Kalkulator Ketahanan Pangan (Shelf-Life Guide) */}
      <section className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE1] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-xs font-semibold text-[#2D6A4F]">
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator & Panduan Masa Simpan Pangan</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#24201D]">
              Cek Berapa Lama Makanan Bisa Bertahan?
            </h2>
          </div>
          <p className="text-xs text-[#7D7166] max-w-xs">
            Pilih jenis makanan untuk melihat suhu dan metode penyimpanan
            terbaik.
          </p>
        </div>

        {/* Food Type Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.entries(STORAGE_GUIDES).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => setSelectedFoodKey(key)}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                selectedFoodKey === key
                  ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-xs"
                  : "bg-[#FAF6F0] text-[#594A38] border-[#E8DFD1] hover:bg-[#F2ECE1]"
              }`}
            >
              <div className="font-bold text-xs truncate">
                {guide.name.split("(")[0]}
              </div>
              <div
                className={`text-[10px] mt-0.5 ${
                  selectedFoodKey === key ? "text-[#E8F5E9]" : "text-[#7D7166]"
                }`}
              >
                {guide.category}
              </div>
            </button>
          ))}
        </div>

        {/* Display Card for Active Food Guide */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-[#24201D]">
                {activeGuide.name}
              </h3>
              <p className="text-xs text-[#6C6259]">
                Kategori: {activeGuide.category}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9CDBF] text-xs font-bold text-[#2D6A4F]">
              <span>Rekomendasi Utama:</span>
              <span className="text-[#24201D] underline">
                {activeGuide.recommendedStorage}
              </span>
            </div>
          </div>

          {/* Three Temperature Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Suhu Ruang (25° - 30°C)</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#24201D]">
                {activeGuide.roomTempDays}
              </div>
              <p className="text-[11px] text-[#6C6259]">
                Tempat sejuk kering terhindar matahari
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
                <Refrigerator className="w-4 h-4 text-[#2D6A4F]" />
                <span>Kulkas Bawah (2° - 4°C)</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#24201D]">
                {activeGuide.fridgeDays}
              </div>
              <p className="text-[11px] text-[#6C6259]">
                Wadah kedap udara (airtight container)
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD1] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                <Snowflake className="w-4 h-4 text-sky-500" />
                <span>Freezer Beku (-18°C)</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#24201D]">
                {activeGuide.freezerDays}
              </div>
              <p className="text-[11px] text-[#6C6259]">
                Bungkus rapat kedap oksigen
              </p>
            </div>
          </div>

          {/* Tips and spoilage info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-[#E8DFD1] space-y-1">
              <span className="font-bold text-[#2D6A4F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Trik Penyimpanan Awet:
              </span>
              <p className="text-[#594A38] leading-relaxed">
                {activeGuide.tips}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-red-200 space-y-1">
              <span className="font-bold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Ciri
                Makanan Mulai Basi:
              </span>
              <p className="text-[#594A38] leading-relaxed">
                {activeGuide.indicatorsOfSpoilage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles & Guides Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#24201D]">
              Artikel & Resep Anti-Waste Pilihan
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6259]">
              Panduan praktis yang mudah dipraktikkan langsung di dapur Anda
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "semua", label: "Semua Artikel" },
              { id: "Tips Dapur", label: "Tips Dapur" },
              { id: "Resep Olahan Sisa", label: "Resep Olahan" },
              { id: "Edukasi Lingkungan", label: "Edukasi Lingkungan" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#2D6A4F] text-white shadow-2xs"
                    : "bg-white text-[#594A38] border border-[#E8DFD1] hover:bg-[#FAF6F0]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-3xl border border-[#E8DFD1] hover:border-[#2D6A4F]/60 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#2D6A4F] backdrop-blur-xs shadow-xs">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#24201D] group-hover:text-[#2D6A4F] transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6C6259] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#7D7166]">
                <span>{article.author}</span>
                <span className="font-semibold text-[#2D6A4F] flex items-center gap-1 group-hover:underline">
                  Baca Selengkapnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Tool 2: Kuis Food Waste Rumah Tangga */}
      <section className="bg-gradient-to-br from-[#FAF6F0] to-[#EFE8DC] rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#2D6A4F] border border-[#D9CDBF]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Kuis Cepat Interaktif</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#24201D]">
              Cek Tingkat Jejak Sampah Pangan Rumah Tangga Anda
            </h2>
            <p className="text-xs text-[#6C6259]">
              Jawab 4 pertanyaan sederhana berikut untuk mengetahui seberapa
              hemat dan ramah lingkungan kebiasaan dapur Anda.
            </p>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-5">
          {quizQuestions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-white p-5 rounded-2xl border border-[#E8DFD1] space-y-3"
            >
              <h3 className="font-bold text-sm text-[#24201D]">
                {qIdx + 1}. {q.q}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = quizAnswers[qIdx] === opt.score;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(qIdx, opt.score)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-[#E8F5E9] border-[#2D6A4F] text-[#2D6A4F] font-bold ring-1 ring-[#2D6A4F]"
                          : "bg-[#FAF6F0] border-[#E8DFD1] text-[#594A38] hover:bg-[#F2ECE1]"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Submit & Result Display */}
        <div className="pt-2">
          {Object.keys(quizAnswers).length === quizQuestions.length ? (
            <div className="bg-white p-6 rounded-2xl border border-[#2D6A4F]/30 shadow-md space-y-4">
              {(() => {
                const result = calculateQuizResult();
                if (!result) return null;
                return (
                  <div className="text-center max-w-lg mx-auto space-y-2">
                    <div className="text-4xl">{result.badge}</div>
                    <div className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
                      Hasil Evaluasi Kebiasaan Pangan
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24201D]">
                      {result.level}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#594A38] leading-relaxed">
                      {result.desc}
                    </p>
                    <div className="p-3 bg-[#FAF6F0] rounded-xl text-xs font-semibold text-[#2D6A4F] border border-[#E8DFD1]">
                      💡 Saran Aksi: {result.tips}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center text-xs text-[#7D7166]">
              Jawab semua ({Object.keys(quizAnswers).length}/
              {quizQuestions.length}) pertanyaan untuk melihat skor kebiasaan
              pangan Anda.
            </div>
          )}
        </div>
      </section>

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E8DFD1] shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2D6A4F]">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7D7166] hover:text-[#24201D] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-[#7D7166]">
                <span>Penulis: {activeArticle.author}</span>
                <span>•</span>
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            <img
              src={activeArticle.imageUrl}
              alt={activeArticle.title}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div className="space-y-3 text-sm text-[#4A4036] leading-relaxed">
              {activeArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Practical tips block */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFD1] space-y-2">
              <div className="font-bold text-xs text-[#2D6A4F] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tips Praktis yang Bisa Dicoba Hari Ini:</span>
              </div>
              <ul className="text-xs text-[#594A38] space-y-1.5 pl-4 list-disc">
                {activeArticle.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] cursor-pointer"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

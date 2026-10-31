import React, { useState } from "react";
import { ChatThread, ChatMessage } from "../types.ts";
import {
  Send,
  Phone,
  MapPin,
  Check,
  CheckCheck,
  Sparkles,
  ArrowLeft,
  Search,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface MessagesViewProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const quickReplies = [
    "Halo Kak, saya sedang dalam perjalanan ke titik ambil.",
    "Apakah makanannya masih tersedia?",
    "Bisa tolong titipkan di pos satpam / lemari berbagi?",
    "Terima kasih banyak atas donasinya, berkah selalu!",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeThread) return;
    onSendMessage(activeThread.id, text);
    if (!textToSend) setInputText("");
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.participantName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
            Pusat Koordinasi Pangan
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#24201D]">
            Pesan & Chat
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6259]">
            Komunikasi langsung dengan pemberi donasi, pengelola lemari berbagi,
            dan relawan kurir.
          </p>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[72vh]">
        {/* Left Side: Threads List */}
        <div
          className={`md:col-span-5 lg:col-span-4 border-r border-[#E8DFD1] flex flex-col bg-[#FAF6F0]/40 ${
            mobileShowThread ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search Contacts */}
          <div className="p-3.5 border-b border-[#E8DFD1] bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7D7166]" />
              <input
                type="text"
                placeholder="Cari obrolan..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/50 text-[#24201D] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
              />
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0EAE1]">
            {filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    onSelectThread(thread.id);
                    setMobileShowThread(true);
                  }}
                  className={`w-full p-4 flex items-start gap-3 text-left transition cursor-pointer ${
                    isSelected ? "bg-[#EFE8DC]/70" : "hover:bg-[#FAF6F0]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={thread.participantAvatar}
                      alt={thread.participantName}
                      className="w-11 h-11 rounded-full object-cover border border-[#D9CDBF]"
                    />
                    {thread.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-[#24201D] truncate">
                        {thread.participantName}
                      </span>
                      <span className="text-[10px] text-[#7D7166]">
                        {thread.lastTimestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-[#FAF6F0] text-[#2D6A4F] border border-[#E8DFD1]">
                        {thread.participantRole}
                      </span>
                    </div>

                    <p className="text-xs text-[#6C6259] truncate">
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {thread.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Conversation View */}
        <div
          className={`md:col-span-7 lg:col-span-8 flex flex-col bg-white ${
            !mobileShowThread ? "hidden md:flex" : "flex"
          }`}
        >
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-[#E8DFD1] bg-[#FAF6F0]/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowThread(false)}
                    className="md:hidden p-1.5 rounded-lg text-[#594A38] hover:bg-[#EFE8DC]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative">
                    <img
                      src={activeThread.participantAvatar}
                      alt={activeThread.participantName}
                      className="w-10 h-10 rounded-full object-cover border border-[#D9CDBF]"
                    />
                    {activeThread.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-[#24201D]">
                        {activeThread.participantName}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6C6259]">
                      <span className="text-[#2D6A4F] font-semibold">
                        {activeThread.participantRole}
                      </span>
                      <span>•</span>
                      <span>
                        {activeThread.isOnline
                          ? "Online aktif"
                          : "Terakhir dilihat tadi"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      window.alert(
                        `Menghubungi telepon ${activeThread.participantName}...`,
                      )
                    }
                    className="p-2 rounded-xl bg-white border border-[#D9CDBF] text-[#2D6A4F] hover:bg-[#E8F5E9] transition cursor-pointer"
                    title="Panggil Kontak"
                    aria-label="Panggil Kontak"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Related Food Context Banner */}
              {activeThread.relatedFoodTitle && (
                <div className="px-4 py-2 bg-[#E8F5E9]/60 border-b border-[#2D6A4F]/20 flex items-center justify-between text-xs text-[#2D6A4F]">
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold truncate">
                      Terkait: {activeThread.relatedFoodTitle}
                    </span>
                  </div>
                  {activeThread.relatedFoodLocation && (
                    <div className="flex items-center gap-1 text-[11px] text-[#594A38] shrink-0 ml-2">
                      <MapPin className="w-3 h-3 text-[#2D6A4F]" />
                      <span className="truncate max-w-[150px]">
                        {activeThread.relatedFoodLocation}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FCFAF6]">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        msg.isUser
                          ? "bg-[#2D6A4F] text-white rounded-br-xs"
                          : "bg-white text-[#24201D] border border-[#E8DFD1] rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-[#7D7166] px-1">
                      <span>{msg.timestamp}</span>
                      {msg.isUser && (
                        <CheckCheck className="w-3 h-3 text-[#2D6A4F]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 bg-[#FAF6F0] border-t border-[#E8DFD1] flex items-center gap-2 overflow-x-auto scrollbar-none">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(reply)}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#D9CDBF] text-[11px] text-[#594A38] hover:border-[#2D6A4F] hover:text-[#2D6A4F] whitespace-nowrap transition cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#E8DFD1] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik pesan konfirmasi pengambilan atau pertanyaan..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#D9CDBF] bg-[#FAF6F0]/60 text-xs sm:text-sm text-[#24201D] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-[#2D6A4F] disabled:bg-[#D9CDBF] text-white hover:bg-[#1B4332] active:scale-95 transition cursor-pointer shadow-xs"
                  aria-label="Kirim Pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7D7166]">
              <MessageCircle className="w-12 h-12 text-[#D9CDBF] mb-2" />
              <p className="text-sm">
                Pilih obrolan dari daftar untuk memulai koordinasi donasi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

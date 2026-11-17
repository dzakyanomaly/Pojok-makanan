/**
 * Controller untuk Halaman Pesan & Chat Koordinasi
 */

import { state, saveState } from '../../js/state.js';
import { updateUnreadBadge } from '../../components/navbar.js';

export function initPesan() {
  const threadListContainer = document.getElementById('chat-thread-list');
  const chatHeader = document.getElementById('chat-header');
  const messagesContainer = document.getElementById('chat-messages-container');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-send-chat');

  const activeThread =
    state.chats.find((c) => c.id === state.activeChatId) || state.chats[0];

  // Render Thread List
  if (threadListContainer) {
    threadListContainer.innerHTML = state.chats
      .map((c) => {
        const isActive = c.id === activeThread?.id;
        return `
          <div data-id="${c.id}" class="chat-thread-item p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer ${
            isActive ? 'bg-[#E8DFD1]/60 border-l-4 border-[#2D6A4F]' : 'hover:bg-[#EFE8DC]/40'
          }">
            <div class="relative shrink-0">
              <img src="${c.participantAvatar}" class="w-10 h-10 rounded-full object-cover border border-[#D9CDBF]" />
              ${c.isOnline ? '<span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>' : ''}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-xs sm:text-sm text-[#24201D] truncate">${c.participantName}</h4>
                <span class="text-[10px] text-[#7D7166] shrink-0">${c.lastTimestamp}</span>
              </div>
              <p class="text-xs text-[#6C6259] truncate mt-0.5">${c.lastMessage}</p>
              ${c.relatedFoodTitle ? `<span class="inline-block text-[10px] text-[#2D6A4F] bg-[#E8F5E9] px-2 py-0.2 rounded mt-1 truncate max-w-full font-medium">📦 ${c.relatedFoodTitle}</span>` : ''}
            </div>
            ${c.unreadCount > 0 ? `<span class="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">${c.unreadCount}</span>` : ''}
          </div>
        `;
      })
      .join('');

    threadListContainer.querySelectorAll('.chat-thread-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if (id) {
          state.activeChatId = id;
          const th = state.chats.find((c) => c.id === id);
          if (th) th.unreadCount = 0;
          saveState();
          updateUnreadBadge(state.chats.reduce((acc, t) => acc + t.unreadCount, 0));
          initPesan();
        }
      });
    });
  }

  // Render Header
  if (chatHeader && activeThread) {
    chatHeader.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <img src="${activeThread.participantAvatar}" class="w-10 h-10 rounded-full object-cover border border-[#D9CDBF] shrink-0" />
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-sm text-[#24201D] truncate">${activeThread.participantName}</h3>
            ${activeThread.isOnline ? '<span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>' : ''}
          </div>
          <p class="text-xs text-[#6C6259] truncate">${activeThread.participantRole} • ${activeThread.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button class="px-3 py-1.5 rounded-xl border border-[#D9CDBF] text-xs font-semibold text-[#2D6A4F] hover:bg-[#FAF6F0] cursor-pointer flex items-center gap-1.5">
          <i data-lucide="phone" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Hubungi</span>
        </button>
      </div>
    `;
  }

  // Render Messages
  if (messagesContainer && activeThread) {
    messagesContainer.innerHTML = activeThread.messages
      .map((msg) => {
        if (msg.isUser) {
          return `
            <div class="flex flex-col items-end space-y-1">
              <div class="chat-bubble-user p-3 sm:p-3.5 rounded-2xl max-w-sm sm:max-w-md text-xs sm:text-sm leading-relaxed shadow-2xs">
                ${msg.text}
              </div>
              <span class="text-[10px] text-[#7D7166]">${msg.timestamp} ✓✓</span>
            </div>
          `;
        }
        return `
          <div class="flex flex-col items-start space-y-1">
            <span class="text-[10px] text-[#6C6259] font-semibold pl-1">${msg.senderName}</span>
            <div class="chat-bubble-donor p-3 sm:p-3.5 rounded-2xl max-w-sm sm:max-w-md text-xs sm:text-sm leading-relaxed shadow-2xs">
              ${msg.text}
            </div>
            <span class="text-[10px] text-[#7D7166] pl-1">${msg.timestamp}</span>
          </div>
        `;
      })
      .join('');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send Message Logic
  function sendMessage(textToSend) {
    const text = textToSend || chatInput?.value?.trim();
    if (!text || !activeThread) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderName: state.user.name,
      text,
      timestamp: 'Baru saja',
      isUser: true,
    };

    activeThread.messages.push(newMsg);
    activeThread.lastMessage = text;
    activeThread.lastTimestamp = 'Baru saja';
    if (chatInput) chatInput.value = '';

    saveState();
    initPesan();

    // Friendly Indonesian auto-reply after 1.2s
    setTimeout(() => {
      const autoReplies = [
        'Terima kasih sudah konfirmasi Kak! Titik ambil sudah siap, kami tunggu ya.',
        'Baik Kak, paket sudah kami sediakan di meja depan dengan kode tiket Anda.',
        'Sip, hati-hati di jalan ya Kak. Semoga berkah dan bermanfaat makanannya!',
        'Siap Kak, relawan kami juga sudah standby di lokasi titik berbagi.',
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

      activeThread.messages.push({
        id: `m-reply-${Date.now()}`,
        senderName: activeThread.participantName,
        text: reply,
        timestamp: 'Baru saja',
        isUser: false,
      });
      activeThread.lastMessage = reply;
      activeThread.lastTimestamp = 'Baru saja';
      saveState();
      initPesan();
    }, 1200);
  }

  // Send button click
  sendBtn?.addEventListener('click', () => sendMessage());

  // Input enter key
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Quick reply chips
  document.querySelectorAll('.quick-reply-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sendMessage(btn.textContent.trim());
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

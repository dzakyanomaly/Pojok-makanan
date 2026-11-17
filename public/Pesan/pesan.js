/**
 * Pesan Interactive Logic
 */

let activeId = 'chat-1';

document.addEventListener('DOMContentLoaded', () => {
  activeId = window.PM_DATA.getActiveChatId();
  renderChat();
  initSend();
  if (window.lucide) window.lucide.createIcons();
});

function renderChat() {
  const chats = window.PM_DATA ? window.PM_DATA.getChats() : [];
  const threadListContainer = document.getElementById('chat-thread-list');
  const chatHeader = document.getElementById('chat-header');
  const messagesContainer = document.getElementById('chat-messages-container');

  const activeThread = chats.find((c) => c.id === activeId) || chats[0];
  if (activeThread) {
    activeId = activeThread.id;
    window.PM_DATA.setActiveChatId(activeId);
  }

  // Render Thread List
  if (threadListContainer) {
    threadListContainer.innerHTML = chats
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
          activeId = id;
          const th = chats.find((c) => c.id === id);
          if (th) th.unreadCount = 0;
          renderChat();
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

  if (window.lucide) window.lucide.createIcons();
}

function initSend() {
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('btn-send-chat');

  function doSend(textToSend) {
    const text = textToSend || input?.value?.trim();
    if (!text) return;

    window.PM_DATA.addChatMessage(activeId, text, true);
    if (input) input.value = '';
    renderChat();

    // Auto reply
    setTimeout(() => {
      const autoReplies = [
        'Terima kasih sudah konfirmasi Kak! Titik ambil sudah siap, kami tunggu ya.',
        'Baik Kak, paket sudah kami sediakan di meja depan dengan kode tiket Anda.',
        'Sip, hati-hati di jalan ya Kak. Semoga berkah dan bermanfaat makanannya!',
        'Siap Kak, relawan kami juga sudah standby di lokasi titik berbagi.',
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      window.PM_DATA.addChatMessage(activeId, reply, false);
      renderChat();
    }, 1200);
  }

  btn?.addEventListener('click', () => doSend());

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSend();
  });

  document.querySelectorAll('.quick-reply-btn').forEach((chip) => {
    chip.addEventListener('click', () => {
      doSend(chip.textContent.trim());
    });
  });
}

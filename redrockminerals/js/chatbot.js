/* ========================================
   Red Rock Minerals — AI Chatbot
   ======================================== */
(function() {
  'use strict';

  var chatToggle = document.getElementById('chat-toggle');
  var chatWindow = document.getElementById('chat-window');
  var chatClose = document.getElementById('chat-close');
  var chatInput = document.getElementById('chat-input');
  var chatSend = document.getElementById('chat-send');
  var chatMessages = document.getElementById('chat-messages');
  var chatSuggestions = document.getElementById('chat-suggestions');
  var toggleIcon = document.getElementById('chat-toggle-icon');

  if (!chatToggle) return;

  var isOpen = false;
  var conversationHistory = [];
  var isWaiting = false;
  var lastSendTime = 0;
  var RATE_LIMIT_MS = 2000;

  // Check if API key is configured
  var apiKeyConfigured = typeof CHATBOT_API_KEY !== 'undefined' &&
    CHATBOT_API_KEY !== 'YOUR_ANTHROPIC_API_KEY_HERE' &&
    CHATBOT_API_KEY.length > 10;

  // Toggle chat
  chatToggle.addEventListener('click', function() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    chatToggle.classList.toggle('active', isOpen);
    toggleIcon.className = isOpen ? 'fas fa-times' : 'fas fa-robot';
    if (isOpen) chatInput.focus();
  });

  chatClose.addEventListener('click', function() {
    isOpen = false;
    chatWindow.classList.remove('open');
    chatToggle.classList.remove('active');
    toggleIcon.className = 'fas fa-robot';
  });

  // Show config message if API key not set
  if (!apiKeyConfigured) {
    chatMessages.innerHTML = '<div class="chat-config-msg">' +
      '<i class="fas fa-cog"></i>' +
      'Chat is being configured.<br>Please use our <a href="contact.html" style="color:#E63946;text-decoration:underline;">Contact page</a> for inquiries.' +
      '</div>';
    chatInput.disabled = true;
    chatInput.placeholder = 'Chat not yet configured...';
    chatSend.disabled = true;
    if (chatSuggestions) chatSuggestions.style.display = 'none';
    return;
  }

  // Suggestion buttons
  if (chatSuggestions) {
    chatSuggestions.querySelectorAll('.chat-suggestion').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var q = btn.getAttribute('data-q');
        sendUserMessage(q);
      });
    });
  }

  // Send handlers
  chatSend.addEventListener('click', function() { sendFromInput(); });
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendFromInput();
  });

  function sendFromInput() {
    var q = chatInput.value.trim();
    if (!q) return;
    chatInput.value = '';
    sendUserMessage(q);
  }

  function sendUserMessage(text) {
    // Rate limiting
    var now = Date.now();
    if (now - lastSendTime < RATE_LIMIT_MS) return;
    lastSendTime = now;

    if (isWaiting) return;

    addMessage('user', escapeHtml(text));
    // Hide suggestions after first interaction
    if (chatSuggestions) chatSuggestions.style.display = 'none';

    conversationHistory.push({ role: 'user', content: text });
    isWaiting = true;

    // Show typing indicator
    var typingEl = showTyping();

    callClaudeAPI()
      .then(function(response) {
        removeTyping(typingEl);
        isWaiting = false;
        if (response && response.content && response.content[0]) {
          var botText = response.content[0].text;
          conversationHistory.push({ role: 'assistant', content: botText });
          addMessage('bot', formatMarkdown(botText));
        } else {
          addMessage('bot', 'Sorry, I couldn\'t process that. Please try again or visit our <a href="contact.html">Contact page</a>.');
        }
      })
      .catch(function(err) {
        removeTyping(typingEl);
        isWaiting = false;
        console.error('Chatbot error:', err);
        addMessage('bot', 'I\'m having trouble connecting. Please try again or visit our <a href="contact.html">Contact page</a>.');
      });
  }

  function callClaudeAPI() {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CHATBOT_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CHATBOT_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    }).then(function(res) {
      if (!res.ok) throw new Error('API error: ' + res.status);
      return res.json();
    });
  }

  function addMessage(type, html) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    div.innerHTML = '<div class="chat-bubble">' + html + '</div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = '<div class="chat-bubble typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatMarkdown(text) {
    // Basic markdown: bold, lists, links, line breaks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^[-•]\s+(.+)$/gm, '&bull; $1')
      .replace(/\n/g, '<br>');
  }
})();

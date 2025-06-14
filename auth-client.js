// Функция для проверки сессии
async function checkSession() {
    try {
        const response = await fetch('/auth/session');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при проверке сессии:', error);
        return { authenticated: false };
    }
}

// Инициализация кнопки входа через Discord
function initDiscordLogin() {
    const loginBtn = document.querySelector('.discord-login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/auth/discord';
        });
    }
}

function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/auth/logout', { method: 'POST' });
                updateUIForUnauthenticated();
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        });
    }
}

function updateUIForAuthenticated(user) {
    const authContainer = document.getElementById('auth-container');
    const userInfo = document.getElementById('user-info');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    if (authContainer) authContainer.style.display = 'none';
    if (userInfo) {
        userInfo.style.display = 'flex';
        document.getElementById('user-avatar').src = user.avatar;
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-discriminator').textContent = `#${user.discriminator}`;
    }
    if (chatInput) chatInput.disabled = false;
    if (sendButton) sendButton.disabled = false;
}

function updateUIForUnauthenticated() {
    const authContainer = document.getElementById('auth-container');
    const userInfo = document.getElementById('user-info');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    if (authContainer) authContainer.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
    if (chatInput) {
        chatInput.disabled = true;
        chatInput.value = '';
    }
    if (sendButton) sendButton.disabled = true;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    initDiscordLogin();
    initLogout();
    
    const user = await checkSession();
    if (user) {
        updateUIForAuthenticated(user);
    } else {
        updateUIForUnauthenticated();
    }
});

// Модификация функции отправки сообщений
const originalSendMessage = window.sendMessage;
window.sendMessage = async function() {
    const user = await checkSession();
    if (!user) {
        alert('Пожалуйста, войдите через Discord, чтобы отправлять сообщения');
        return;
    }
    
    if (originalSendMessage) {
        originalSendMessage.apply(this, arguments);
    }
};

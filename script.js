// Configuration
const DEFAULT_EXAM_DATE = "2026-03-15T10:00:00";
const START_DATE = "2025-04-01T00:00:00"; // For progress bar calculation
const QUOTES = [
    "Believe you can and you're halfway there.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "Your time is limited, don't waste it living someone else's life.",
    "The only way to do great work is to love what you do.",
    "Education is the most powerful weapon which you can use to change the world.",
    "Strive for progress, not perfection."
];

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownSection = document.getElementById('countdownSection');
const celebrationMessage = document.getElementById('celebrationMessage');
const progressBar = document.getElementById('progressBar');
const quoteText = document.getElementById('quoteText');
const realTimeClock = document.getElementById('realTimeClock');
const examDateInput = document.getElementById('examDateInput');
const changeDateBtn = document.getElementById('changeDateBtn');
const shareBtn = document.getElementById('shareBtn');
const themeBtns = document.querySelectorAll('.theme-btn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.querySelector('.close-modal');
const fontSelect = document.getElementById('fontSelect');
const shareModal = document.getElementById('shareModal');
const closeShare = document.querySelector('.close-share');
const shareNativeBtn = document.getElementById('shareNativeBtn');
const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
const shareFacebookBtn = document.getElementById('shareFacebookBtn');
const shareTwitterBtn = document.getElementById('shareTwitterBtn');
const shareCopyBtn = document.getElementById('shareCopyBtn');

// State
let targetDate = new Date(localStorage.getItem('shaheen_target_date') || DEFAULT_EXAM_DATE);
let countdownInterval;

// Initialize
function init() {
    // Set initial theme
    const savedTheme = localStorage.getItem('shaheen_theme') || 'theme-shaheen';
    document.body.className = savedTheme;
    updateThemeButtons(savedTheme);

    // Set initial font
    const savedFont = localStorage.getItem('shaheen_font') || 'Poppins';
    document.documentElement.style.setProperty('--main-font', savedFont);
    fontSelect.value = savedFont;

    // Set input value
    // Format for datetime-local: YYYY-MM-DDTHH:mm
    const isoString = targetDate.toISOString().slice(0, 16);
    examDateInput.value = isoString;

    // Start timers
    startCountdown();
    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);

    // Random Quote
    changeQuote();
    setInterval(changeQuote, 30000); // Change quote every 30s

    // Event Listeners
    changeDateBtn.addEventListener('click', handleDateChange);

    // Share Button - Open Modal
    shareBtn.addEventListener('click', () => {
        shareModal.classList.remove('hidden');
    });

    // Share Modal Listeners
    closeShare.addEventListener('click', () => {
        shareModal.classList.add('hidden');
    });

    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.add('hidden');
        }
    });

    // Share Options
    shareNativeBtn.addEventListener('click', shareNative);
    shareWhatsappBtn.addEventListener('click', () => shareSocial('whatsapp'));
    shareFacebookBtn.addEventListener('click', () => shareSocial('facebook'));
    shareTwitterBtn.addEventListener('click', () => shareSocial('twitter'));
    shareCopyBtn.addEventListener('click', copyToClipboard);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
    });

    // Modal Listeners
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
}

// Countdown Logic
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            showCelebration();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        updateProgressBar(now);
    }

    update();
    countdownInterval = setInterval(update, 1000);
}

function updateProgressBar(now) {
    const start = new Date(START_DATE).getTime();
    const end = targetDate.getTime();
    const current = now.getTime();

    if (current < start) {
        progressBar.style.width = '0%';
        return;
    }

    const totalDuration = end - start;
    const elapsed = current - start;
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    progressBar.style.width = `${percentage}%`;
}

function showCelebration() {
    countdownSection.classList.add('hidden');
    celebrationMessage.classList.remove('hidden');
    launchConfetti();
}

// Real-time Clock
function updateRealTimeClock() {
    const now = new Date();
    realTimeClock.textContent = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Date Change Feature
function handleDateChange() {
    // Handle Date
    const newDateVal = examDateInput.value;
    if (newDateVal) {
        const newDate = new Date(newDateVal);
        const oldDate = targetDate;

        // Animation
        const animationClass = newDate < oldDate ? 'anim-rewind' : 'anim-fastforward';
        document.body.classList.add(animationClass);

        setTimeout(() => {
            document.body.classList.remove(animationClass);
        }, 1000);

        targetDate = newDate;
        localStorage.setItem('shaheen_target_date', targetDate.toISOString());
    }

    // Handle Font
    const selectedFont = fontSelect.value;
    document.documentElement.style.setProperty('--main-font', selectedFont);
    localStorage.setItem('shaheen_font', selectedFont);

    // Reset view if we were celebrating
    countdownSection.classList.remove('hidden');
    celebrationMessage.classList.add('hidden');
    settingsModal.classList.add('hidden'); // Close modal

    startCountdown();
}

// Theme Switcher
function switchTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('shaheen_theme', themeName);
    updateThemeButtons(themeName);
}

function updateThemeButtons(activeTheme) {
    themeBtns.forEach(btn => {
        if (btn.dataset.theme === activeTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Quotes
function changeQuote() {
    quoteText.style.opacity = 0;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        quoteText.textContent = `"${QUOTES[randomIndex]}"`;
        quoteText.style.opacity = 1;
    }, 300);
}

// Share Feature
function getShareData() {
    const daysLeft = daysEl.textContent;
    return {
        title: 'Shaheen 10th Board Countdown',
        text: `Only ${daysLeft} days left for the 10th Boards! 🧠 #ShaheenValueSchool`,
        url: window.location.href
    };
}

async function shareNative() {
    const data = getShareData();
    try {
        if (navigator.share) {
            await navigator.share(data);
        } else {
            alert('Native sharing not supported on this device.');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
    shareModal.classList.add('hidden');
}

function shareSocial(platform) {
    const data = getShareData();
    const text = encodeURIComponent(data.text);
    const url = encodeURIComponent(data.url);
    let shareUrl = '';

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
    shareModal.classList.add('hidden');
}

async function copyToClipboard() {
    const data = getShareData();
    try {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        const originalText = shareCopyBtn.innerHTML;
        shareCopyBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        setTimeout(() => {
            shareCopyBtn.innerHTML = originalText;
            shareModal.classList.add('hidden');
        }, 1500);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

// Simple Confetti (CSS/JS hybrid)
function launchConfetti() {
    // In a real production app, we might use a library like canvas-confetti
    // For this single-file requirement, we'll keep it simple or assume it's handled by CSS
    // But let's add a simple visual effect
    const colors = ['#4CAF50', '#D50000', '#FFD700', '#2196F3'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '9999';
        confetti.style.transition = 'top 3s ease-in, transform 3s ease-in';
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.top = '110vh';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 100);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Run
init();

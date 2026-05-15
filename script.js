/* ================================================
   BIRTHDAY WEBSITE — SCRIPT.JS
   ================================================ */

/* ============================================================
   AOS INIT
   ============================================================ */
AOS.init({
  once: true,
  duration: 900,
  easing: 'ease-out-cubic',
  offset: 60,
});

/* ============================================================
   START OVERLAY
   ============================================================ */
function startExperience() {
  const overlay = document.getElementById('start-overlay');
  overlay.classList.add('hidden');

  // Play ambient audio
  const audio = document.getElementById('ambient-audio');
  audio.volume = 0.4;
  audio.play().catch(() => {});

  // Start animations after overlay hides
  setTimeout(() => {
    initPetals();
    initTyping();
    initStars();
    initSparkles();
    initFloatingHearts();
    launchConfetti(80);
  }, 500);
}

/* ============================================================
   AMBIENT AUDIO TOGGLE
   ============================================================ */
let ambientPlaying = true;

function toggleAmbient() {
  const audio = document.getElementById('ambient-audio');
  const disc  = document.getElementById('amb-disc');
  const btn   = document.getElementById('amb-btn');

  if (ambientPlaying) {
    audio.pause();
    disc.classList.remove('spinning');
    disc.classList.add('paused');
    btn.textContent = '▶';
  } else {
    audio.play();
    disc.classList.add('spinning');
    disc.classList.remove('paused');
    btn.textContent = '⏸';
  }
  ambientPlaying = !ambientPlaying;
}

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const typingLines = [
  "Selamat ulang tahun,",
  "semoga hari ini menjadi",
  "hari yang paling indah",
  "dalam hidupmu. 🌸",
];

function initTyping() {
  const el = document.getElementById('typing-text');
  let lineIdx = 0;
  let charIdx = 0;
  let currentText = '';
  let isDeleting = false;
  let pauseCount = 0;

  function type() {
    const fullText = typingLines.join('\n');
    // Assemble full target up to current line
    const target = typingLines.slice(0, lineIdx + 1).join('\n');

    if (!isDeleting) {
      charIdx++;
      currentText = target.substring(0, charIdx);
      el.innerHTML = currentText.replace(/\n/g, '<br/>');

      if (charIdx >= target.length) {
        if (lineIdx < typingLines.length - 1) {
          // Move to next line
          setTimeout(() => {
            lineIdx++;
            type();
          }, 400);
          return;
        } else {
          // Done — stop
          return;
        }
      }
    }

    const speed = isDeleting ? 40 : 65;
    setTimeout(type, speed);
  }

  setTimeout(type, 600);
}

/* ============================================================
   FALLING PETALS
   ============================================================ */
function initPetals() {
  const container = document.getElementById('petals');
  const count = 18;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 18 + 8;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 7;
    const delay = Math.random() * 10;

    petal.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: -30px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.5 + 0.3};
      transform: rotate(${Math.random() * 360}deg);
    `;

    container.appendChild(petal);
  }
}

/* ============================================================
   CONFETTI
   ============================================================ */
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let confettiParticles = [];
let confettiAnim = null;

function resizeCanvas() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti(count) {
  const colors = ['#e8899a', '#f9d4df', '#d4a96a', '#c9506a', '#fdf8f3', '#ffffff'];

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 4 + 2,
      alpha: 1,
    });
  }

  if (!confettiAnim) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter(p => p.alpha > 0.01);

  confettiParticles.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.angle += p.spin;
    if (p.y > confettiCanvas.height * 0.7) p.alpha -= 0.012;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (confettiParticles.length > 0) {
    confettiAnim = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnim = null;
  }
}

/* ============================================================
   SURPRISE BUTTON (landing)
   ============================================================ */
function openSurprise() {
  launchConfetti(120);
  // Scroll to gallery smoothly
  document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeSurpriseModal();
  }
});

/* ============================================================
   MUSIC PLAYER
   ============================================================ */
const birthdayAudio = document.getElementById('birthday-audio');
const musicDisc     = document.getElementById('music-disc');
const playIcon      = document.getElementById('play-icon');
const progressFill  = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl   = document.getElementById('total-time');
const progressBar   = document.getElementById('music-progress-bar');

let musicPlaying = false;

function toggleMusic() {
  if (musicPlaying) {
    birthdayAudio.pause();
    musicDisc.classList.remove('playing');
    playIcon.textContent = '▶';
  } else {
    birthdayAudio.play().catch(() => {});
    musicDisc.classList.add('playing');
    playIcon.textContent = '⏸';
  }
  musicPlaying = !musicPlaying;
}

function restartTrack() {
  birthdayAudio.currentTime = 0;
  if (!musicPlaying) {
    birthdayAudio.play().catch(() => {});
    musicDisc.classList.add('playing');
    playIcon.textContent = '⏸';
    musicPlaying = true;
  }
}

function setVolume(val) {
  birthdayAudio.volume = parseFloat(val);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

birthdayAudio.addEventListener('timeupdate', () => {
  if (!birthdayAudio.duration) return;
  const pct = (birthdayAudio.currentTime / birthdayAudio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(birthdayAudio.currentTime);
});

birthdayAudio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(birthdayAudio.duration);
});

birthdayAudio.addEventListener('ended', () => {
  musicDisc.classList.remove('playing');
  playIcon.textContent = '▶';
  musicPlaying = false;
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
});

// Click on progress bar to seek
progressBar.addEventListener('click', e => {
  if (!birthdayAudio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  birthdayAudio.currentTime = ratio * birthdayAudio.duration;
});

/* ============================================================
   ENVELOPE / LETTER
   ============================================================ */
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const flap    = document.getElementById('envelope-flap');
  const hint    = document.getElementById('envelope-hint');
  const letter  = document.getElementById('letter-content');
  const envelope = document.getElementById('envelope');

  flap.classList.add('open');
  hint.style.opacity = '0';

  setTimeout(() => {
    letter.classList.add('visible');
    envelope.style.cursor = 'default';
  }, 800);
}

/* ============================================================
   STARS BACKGROUND (final section)
   ============================================================ */
function initStars() {
  const container = document.getElementById('stars-bg');
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.classList.add('star-dot');

    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: -${Math.random() * 5}s;
    `;
    container.appendChild(star);
  }
}

/* ============================================================
   SPARKLES (final section)
   ============================================================ */
function initSparkles() {
  const container = document.getElementById('sparkles');
  const symbols = ['✦', '✧', '★', '✨', '✩', '✫'];

  for (let i = 0; i < 20; i++) {
    const sp = document.createElement('div');
    sp.classList.add('sparkle');
    sp.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    sp.style.cssText = `
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 14 + 8}px;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: -${Math.random() * 4}s;
    `;
    container.appendChild(sp);
  }
}

/* ============================================================
   FLOATING HEARTS (final section)
   ============================================================ */
function initFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const hearts = ['♡', '♥', '💕', '💗', '🤍', '💓'];

  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const size = Math.random() * 20 + 12;
    heart.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}px;
      animation-duration: ${Math.random() * 8 + 8}s;
      animation-delay: -${Math.random() * 10}s;
      color: ${Math.random() > 0.5 ? '#f9d4df' : '#e8899a'};
    `;
    container.appendChild(heart);
  }
}

/* ============================================================
   SURPRISE MODAL (final section)
   ============================================================ */
const surpriseMessages = [
  "Senyummu itu hal paling indah yang pernah aku lihat. Jangan pernah berhenti senyum ya. 🌸",
  "Aku tahu kamu bahagia sekarang — dan itu yang paling aku mau. Selamat ulang tahun, semoga selalu begini. 🤍",
  "Terima kasih sudah ada. Kamu lebih berharga dari yang kamu tahu. 💕",
];

function showSurpriseModal() {
  const modal    = document.getElementById('surprise-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const text     = document.getElementById('modal-text');
  const photo    = document.getElementById('modal-photo');

  const msg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
  text.textContent = msg;

  // Try to show a photo from the gallery; fallback to a pretty placeholder
  photo.src = '1.jpg';
  photo.onerror = () => {
    photo.src = 'https://picsum.photos/seed/birthday/420/260';
  };

  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  launchConfetti(100);
}

function closeSurpriseModal() {
  document.getElementById('surprise-modal').classList.remove('open');
  document.getElementById('modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   INTERSECTION OBSERVER — trigger confetti on final section
   ============================================================ */
const finalSection = document.getElementById('final');
let finalTriggered = false;

const finalObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !finalTriggered) {
      finalTriggered = true;
      launchConfetti(60);
    }
  });
}, { threshold: 0.3 });

if (finalSection) finalObserver.observe(finalSection);

/* ============================================================
   SMOOTH SCROLL POLYFILL for older Safari
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================================
   SLIDESHOW — tambahkan ke script.js
   ============================================================ */

(function () {
  const slides      = document.querySelectorAll('.slide');
  const dotsWrap    = document.getElementById('slide-dots');
  const captionEl   = document.getElementById('slide-caption');
  const currentEl   = document.getElementById('slide-current');
  const totalEl     = document.getElementById('slide-total');
  const stage       = document.querySelector('.slideshow-stage');

  if (!slides.length || !stage) return;

  let current   = 0;
  let autoTimer = null;
  let isAnimating = false;

  // Build dots
  totalEl.textContent = slides.length;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slide-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getDots() { return dotsWrap.querySelectorAll('.slide-dot'); }

  function goTo(index, dir) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    const direction = dir !== undefined ? dir : (index > current ? 1 : -1);
    const prev = current;
    current = (index + slides.length) % slides.length;

    // Exit previous
    slides[prev].classList.remove('active');
    slides[prev].classList.add(direction > 0 ? 'exit-left' : 'exit-right');

    // Enter current
    slides[current].classList.add('active');

    // Update caption with fade
    if (captionEl) {
      captionEl.style.opacity = '0';
      setTimeout(() => {
        captionEl.textContent = slides[current].dataset.caption || '';
        captionEl.style.opacity = '1';
      }, 300);
    }

    // Update dots & counter
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
    if (currentEl) currentEl.textContent = current + 1;

    // Clean exit class after transition
    setTimeout(() => {
      slides[prev].classList.remove('exit-left', 'exit-right');
      isAnimating = false;
    }, 800);

    resetAuto();
  }

  function changeSlide(dir) {
    goTo(current + dir, dir);
  }

  // Expose globally so onclick in HTML works
  window.changeSlide = changeSlide;

  // Auto-advance every 4s
  function startAuto() {
    autoTimer = setInterval(() => changeSlide(1), 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Touch / swipe support
  let touchStartX = 0;
  stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) changeSlide(diff > 0 ? 1 : -1);
  });

  // Mouse drag swipe
  let dragStartX = 0;
  let dragging = false;
  stage.addEventListener('mousedown', e => { dragStartX = e.clientX; dragging = true; });
  stage.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
  });
  stage.addEventListener('mouseleave', () => { dragging = false; });

  // Keyboard arrow keys (when section in view)
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
})();
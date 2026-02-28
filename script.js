/* ══════════════════════════════════════════════
   MY CRUSH BIRTHDAY — script.js
   Features: Preloader, Particles, Cursor,
   Countdown, Gallery, Music, Surprise, Sparkles
══════════════════════════════════════════════ */

'use strict';

// ── GSAP PLUGINS ──────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ── UTILS ─────────────────────────────────────
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── BIRTHDAY DATE ─────────────────────────────
const BIRTHDAY = new Date('2026-12-23T00:00:00');

// ─────────────────────────────────────────────
// 1. CUSTOM CURSOR
// ─────────────────────────────────────────────
(function initCursor() {
    let cx = -200, cy = -200;
    document.addEventListener('mousemove', (e) => {
        cx = e.clientX;
        cy = e.clientY;
        document.documentElement.style.setProperty('--cx', cx + 'px');
        document.documentElement.style.setProperty('--cy', cy + 'px');
    });
})();

// ─────────────────────────────────────────────
// 2. CANVAS PARTICLES
// ─────────────────────────────────────────────
(function initParticles() {
    const canvas = $('#particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x = rand(0, W);
            this.y = init ? rand(0, H) : rand(H + 10, H + 50);
            this.size = rand(0.5, 2.5);
            this.speed = rand(0.2, 0.7);
            this.opacity = rand(0.1, 0.5);
            this.twinkle = rand(0.005, 0.02);
            this.dir = Math.random() > 0.5 ? 1 : -1;
            this.drift = rand(0.1, 0.4) * this.dir;
        }
        update() {
            this.y -= this.speed;
            this.x += this.drift * 0.1;
            this.opacity += this.twinkle;
            if (this.opacity > 0.6 || this.opacity < 0.05) this.twinkle *= -1;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function setup() {
        resize();
        particles = Array.from({ length: 120 }, () => new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    setup();
    animate();
})();

// ─────────────────────────────────────────────
// 3. FLOATING HEARTS
// ─────────────────────────────────────────────
(function initFloatingHearts() {
    const container = $('#floatingHearts');
    const emojis = ['🖤', '♥', '✦', '★', '✧'];
    const count = 12;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'fheart';
        const size = rand(0.8, 2);
        el.style.cssText = `
      --size: ${size}rem;
      --left: ${rand(0, 100)}%;
      --dur: ${rand(6, 14)}s;
      --delay: ${rand(0, 8)}s;
      --rot: ${rand(-20, 20)}deg;
    `;
        el.textContent = emojis[randInt(0, emojis.length - 1)];
        container.appendChild(el);
    }
})();

// ─────────────────────────────────────────────
// 4. PRELOADER
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        const pre = $('#preloader');
        pre.classList.add('hidden');
        initHeroAnimation();
    }, 2200);
});

// ─────────────────────────────────────────────
// 5. HERO ANIMATION
// ─────────────────────────────────────────────
function initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    gsap.to('#heroPreText', {
        duration: 3,
        text: { value: '✦  Untuk Wawa Yang Istimewa  ✦' },
        ease: 'none',
        delay: 0.3,
        onStart: () => gsap.to('#heroPreText', { opacity: 1, duration: 0.3 }),
    });

    tl.to('.hero-line-1', { opacity: 1, y: 0, duration: 1.2 }, 0.3)
        .to('.hero-line-2', { opacity: 1, y: 0, duration: 1.2 }, 0.55)
        .to('.hero-date', { opacity: 1, duration: 1 }, 0.9)
        .to('.hero-scroll-hint', { opacity: 1, duration: 1 }, 1.2);
}

// ─────────────────────────────────────────────
// 6. NAV SCROLL
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = $('#mainNav');
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
}, { passive: true });

// ─────────────────────────────────────────────
// 7. SCROLL REVEAL (Intersection Observer)
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

$$('.reveal').forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────────
// 8. COUNTDOWN TIMER
// ─────────────────────────────────────────────
(function initCountdown() {
    // Reference date: site created (approx now)
    const START = new Date('2026-02-27T00:00:00');
    const TOTAL_MS = BIRTHDAY - START;

    function pad(n, len = 2) {
        return String(Math.floor(n)).padStart(len, '0');
    }

    function updateCountdown() {
        const now = new Date();
        const diff = BIRTHDAY - now;

        if (diff <= 0) {
            // It's the birthday!
            $$('.count-box').forEach(b => b.style.display = 'none');
            $$('.count-sep').forEach(s => s.style.display = 'none');
            $('#birthdayBanner').classList.remove('hidden');
            launchConfetti();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        function setVal(id, val, padLen = 2) {
            const el = $(id);
            const newVal = pad(val, padLen);
            if (el.textContent !== newVal) {
                el.textContent = newVal;
                el.classList.remove('bump');
                void el.offsetWidth; // reflow
                el.classList.add('bump');
                setTimeout(() => el.classList.remove('bump'), 200);
            }
        }

        setVal('#days', days, 3);
        setVal('#hours', hours);
        setVal('#minutes', minutes);
        setVal('#seconds', seconds);

        // Progress bar
        const elapsed = TOTAL_MS - diff;
        const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
        $('#progressBar').style.setProperty('--p', pct.toFixed(2) + '%');
        $('#progressLabel').textContent = pct.toFixed(1) + '% of the journey complete';
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // GSAP scroll entrance
    gsap.from('#countdownGrid', {
        scrollTrigger: { trigger: '#countdown', start: 'top 70%' },
        opacity: 0, y: 60, duration: 1, ease: 'power3.out',
    });
})();

// ─────────────────────────────────────────────
// 9. GALLERY — Pre-filled with placeholder images
//    (Just change the URL in PHOTOS array to use your own photos)
// ─────────────────────────────────────────────
(function initGallery() {
    const grid = $('#galleryGrid');

    // ── CHANGE THESE URLs TO YOUR OWN PHOTOS ──
    const PHOTOS = [
        { url: 'https://picsum.photos/seed/wawa01/600/900', caption: 'Kenangan Indah' },
        { url: 'https://picsum.photos/seed/wawa02/500/700', caption: 'Saat Bahagia' },
        { url: 'https://picsum.photos/seed/wawa03/600/800', caption: 'Momen Manis' },
        { url: 'https://picsum.photos/seed/wawa04/700/900', caption: 'Detik Istimewa' },
        { url: 'https://picsum.photos/seed/wawa05/500/650', caption: 'Penuh Cinta' },
        { url: 'https://picsum.photos/seed/wawa06/600/750', caption: 'Selalu Diingati' },
        { url: 'https://picsum.photos/seed/wawa07/550/800', caption: 'Senyuman Manis' },
        { url: 'https://picsum.photos/seed/wawa08/600/900', caption: 'Hari Indah' },
        { url: 'https://picsum.photos/seed/wawa09/500/700', caption: 'Untukmu, Wawa' },
    ];

    PHOTOS.forEach(({ url, caption }) => {
        const slot = document.createElement('div');
        slot.className = 'photo-slot';
        slot.style.opacity = '1';
        slot.style.transform = 'none';

        const img = document.createElement('img');
        img.src = url;
        img.alt = caption;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'slot-overlay';
        overlay.textContent = `✦ ${caption}`;

        slot.appendChild(img);
        slot.appendChild(overlay);

        slot.addEventListener('click', () => openLightbox(url));
        grid.appendChild(slot);
    });

    // GSAP stagger entrance
    gsap.from('.photo-slot', {
        scrollTrigger: { trigger: '#gallery', start: 'top 70%' },
        opacity: 0, y: 40, scale: 0.95,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
    });
})();

// ─────────────────────────────────────────────
// 10. LIGHTBOX
// ─────────────────────────────────────────────
function openLightbox(src) {
    const lb = $('#lightbox');
    const img = $('#lightboxImg');
    img.src = src;
    lb.classList.remove('hidden');
    gsap.from('.lightbox-content', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(1.5)' });
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    gsap.to('.lightbox-content', {
        opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
            $('#lightbox').classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

$('#lightboxClose').addEventListener('click', closeLightbox);
$('#lightboxOverlay').addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ─────────────────────────────────────────────
// 11. MESSAGE SECTION — LINE REVEAL
// ─────────────────────────────────────────────
(function initMessage() {
    const lines = $$('.message-line');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lines.forEach((line, i) => {
                    const delay = parseFloat(line.dataset.delay || 0) * 1000;
                    setTimeout(() => line.classList.add('visible'), delay + 200);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const msgSection = $('#message');
    if (msgSection) observer.observe(msgSection);

    // GSAP for the card
    gsap.from('.message-card', {
        scrollTrigger: { trigger: '#message', start: 'top 70%' },
        opacity: 0, y: 60, duration: 1, ease: 'power3.out',
    });
})();

// ─────────────────────────────────────────────
// 12. SURPRISE BUTTON
// ─────────────────────────────────────────────
(function initSurprise() {
    const btn = $('#surpriseBtn');
    const reveal = $('#giftReveal');

    btn.addEventListener('click', () => {
        // Confetti burst
        launchConfetti();

        // Show gift card
        reveal.classList.remove('hidden');
        btn.style.display = 'none';

        // Stars
        spawnStars($('#giftStars'));

        // Scroll to it
        setTimeout(() => {
            reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
})();

function launchConfetti() {
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fff', '#aaa', '#555', '#ddd'],
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#fff', '#aaa', '#555', '#ddd'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function spawnStars(container) {
    const symbols = ['✦', '★', '✧', '✶', '✸', '❋'];
    for (let i = 0; i < 18; i++) {
        const star = document.createElement('span');
        star.textContent = symbols[randInt(0, symbols.length - 1)];
        star.style.cssText = `
      position: absolute;
      font-size: ${rand(0.6, 1.4)}rem;
      color: rgba(255,255,255,${rand(0.3, 0.8)});
      left: ${rand(5, 95)}%;
      top: ${rand(5, 95)}%;
      animation: sparkleAnim ${rand(0.6, 1.2)}s ease ${rand(0, 0.5)}s forwards;
      --sz: 1rem;
      --dx: ${rand(-30, 30)}px;
      --dy: ${rand(-40, -10)}px;
      pointer-events: none;
    `;
        container.appendChild(star);
    }
}

// ─────────────────────────────────────────────
// 13. CLICK SPARKLE EFFECT
// ─────────────────────────────────────────────
(function initClickSparkle() {
    const container = $('#sparkleContainer');
    const EMOJIS = ['✦', '✧', '★', '♥', '🖤', '✶'];

    document.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const count = randInt(4, 7);

        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'sparkle';
            el.textContent = EMOJIS[randInt(0, EMOJIS.length - 1)];
            const sz = rand(0.7, 1.3);
            const dx = rand(-60, 60);
            const dy = rand(-80, -20);
            el.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        --sz: ${sz}rem;
        --dx: ${dx}px;
        --dy: ${dy}px;
        font-size: ${sz}rem;
      `;
            container.appendChild(el);
            setTimeout(() => el.remove(), 850);
        }
    });
})();

// ─────────────────────────────────────────────
// 14. BACKGROUND MUSIC PLAYER
// ─────────────────────────────────────────────
(function initMusic() {
    const audio = $('#bgAudio');
    const btn = $('#musicBtn');
    const player = $('#musicPlayer');
    let playing = false;

    // Volume
    audio.volume = 0.4;

    function togglePlay() {
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
            player.classList.remove('playing');
        } else {
            const promise = audio.play();
            if (promise !== undefined) {
                promise.then(() => {
                    btn.classList.add('playing');
                    player.classList.add('playing');
                }).catch(() => {
                    // Autoplay blocked — wait for next click
                });
            }
        }
        playing = !playing;
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Try autoplay on first user interaction
    document.addEventListener('click', () => {
        if (!playing && audio.src && audio.readyState > 0) {
            togglePlay();
        }
    }, { once: true });
})();

// ─────────────────────────────────────────────
// 15. FOOTER HEART EASTER EGG
// ─────────────────────────────────────────────
(function initFooterHeart() {
    const heart = $('#footerHeart');
    let count = 0;

    heart.addEventListener('click', (e) => {
        e.stopPropagation();
        count++;
        if (count === 5) {
            launchConfetti();
            count = 0;
        }
        gsap.from(heart, {
            scale: 0.5, duration: 0.4,
            ease: 'back.out(2)',
        });
    });
})();

// ─────────────────────────────────────────────
// 16. SECTION GSAP REVEALS
// ─────────────────────────────────────────────
(function initSectionAnimations() {
    // Section labels + titles
    gsap.utils.toArray('.section-label, .section-title, .section-sub').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        });
    });

    // Surprise section
    gsap.from('.surprise-btn-wrap', {
        scrollTrigger: { trigger: '#surprise', start: 'top 70%' },
        opacity: 0, scale: 0.8, duration: 0.9, ease: 'back.out(1.7)',
    });
})();

// ─────────────────────────────────────────────
// 17. PARALLAX HERO BG TEXT
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const bgText = $('.hero-bg-text');
    if (bgText) bgText.style.transform = `translateY(${y * 0.4}px)`;
}, { passive: true });

// ─────────────────────────────────────────────
// 18. BIRTHDAY AUTO-CHECK
// ─────────────────────────────────────────────
(function checkBirthday() {
    const now = new Date();
    const isBirthday =
        now.getDate() === 23 &&
        now.getMonth() === 11 && // December = 11
        now.getFullYear() === 2026;

    if (isBirthday) {
        document.title = '🎉 Selamat Hari Lahir Wawa! 🎉';
        launchConfetti();
    }
})();

console.log('%c🖤 Happy Birthday Wawa 🖤', 'font-size:2rem; font-style:italic;');
console.log('%cDaripada Muhammad Syafizam · 23.12.2026', 'font-size:1.2rem; color:#aaa;');

// ══════════════════════════════════════════════
// PREMIUM FEATURES — Wawa Birthday 🖤
// ══════════════════════════════════════════════

// ── P1: CURSOR RING + HEART TRAIL ────────────
(function initCursorPremium() {
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let lastTX = 0, lastTY = 0;
    const TRAIL = ['🖤', '♥', '✦', '★', '✧'];

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX; dotY = e.clientY;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        document.documentElement.style.setProperty('--cx', dotX + 'px');
        document.documentElement.style.setProperty('--cy', dotY + 'px');

        const dx = dotX - lastTX, dy = dotY - lastTY;
        if (Math.sqrt(dx * dx + dy * dy) > 45) {
            const el = document.createElement('span');
            el.className = 'cursor-heart-trail';
            el.textContent = TRAIL[randInt(0, TRAIL.length - 1)];
            el.style.cssText = `left:${dotX}px;top:${dotY}px;font-size:${rand(.6, 1.1)}rem;--tdx:${rand(-25, 25)}px;--tdy:${rand(-55, -15)}px;`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1050);
            lastTX = dotX; lastTY = dotY;
        }
    });

    (function animRing() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animRing);
    })();
})();

// ── P2: FALLING PETALS ───────────────────────
(function initPetals() {
    const wrap = $('#petalsWrap');
    function spawnPetal() {
        const el = document.createElement('div');
        el.className = 'petal';
        el.style.cssText = `--w:${rand(6, 18)}px;--dur:${rand(10, 19)}s;--delay:-${rand(0, 12)}s;left:${rand(0, 100)}%;`;
        wrap.appendChild(el);
        setTimeout(() => el.remove(), 22000);
    }
    for (let i = 0; i < 22; i++) setTimeout(spawnPetal, i * 400);
    setInterval(spawnPetal, 1800);
})();

// ── P3: OUR STORY TIMELINE ───────────────────
(function initTimeline() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.25 });
    $$('.timeline-item').forEach(el => obs.observe(el));

    gsap.from('.timeline-section .section-title', {
        scrollTrigger: { trigger: '#story', start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    });
})();

// ── P4: MAKE A WISH ──────────────────────────
(function initWish() {
    const sky = $('#wishSky');
    const result = $('#wishResult');
    const hint = $('#wishHint');
    if (!sky) return;

    const GLYPHS = ['⭐', '✦', '★', '✧', '✶', '❋'];
    let wished = false;

    for (let i = 0; i < 30; i++) {
        const s = document.createElement('div');
        s.className = 'wish-star';
        const sz = rand(0.8, 1.8);
        s.textContent = GLYPHS[randInt(0, GLYPHS.length - 1)];
        s.style.cssText = `left:${rand(4, 96)}%;top:${rand(5, 90)}%;--op:${rand(.3, .9)};--dur:${rand(1.5, 5)}s;font-size:${sz}rem;`;
        sky.appendChild(s);

        s.addEventListener('click', () => {
            if (wished) return;
            wished = true;
            s.classList.add('shot');

            // GSAP shooting trail
            const trail = document.createElement('div');
            trail.style.cssText = `position:fixed;width:5px;height:5px;background:#fff;border-radius:50%;pointer-events:none;z-index:9999;left:${s.getBoundingClientRect().left}px;top:${s.getBoundingClientRect().top}px;box-shadow:0 0 12px #fff;`;
            document.body.appendChild(trail);
            gsap.to(trail, { x: rand(150, 300), y: rand(100, 250), opacity: 0, scale: 0, duration: 1, ease: 'power2.out', onComplete: () => trail.remove() });

            setTimeout(() => {
                hint.classList.add('hidden');
                result.classList.remove('hidden');
                launchConfetti();
                result.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 900);
        });
    }

    gsap.from('#wish .section-title', {
        scrollTrigger: { trigger: '#wish', start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    });
})();

// ── P5: VANILLA TILT 3D ON GALLERY ───────────
setTimeout(() => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init($$('.photo-slot'), {
            max: 10, speed: 450,
            glare: true, 'max-glare': 0.18,
            scale: 1.04,
        });
    }
}, 500);


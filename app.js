/* ===========================
   VIBE Music — app.js
   =========================== */

// ─── Song Data ───────────────────────────────────────────────
const songs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    genre: "Pop",
    img: "https://picsum.photos/seed/vibesong1/300/300"
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    duration: "3:23",
    genre: "Pop",
    img: "https://picsum.photos/seed/vibesong2/300/300"
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    duration: "3:59",
    genre: "Indie",
    img: "https://picsum.photos/seed/vibesong3/300/300"
  },
  {
    title: "Stay",
    artist: "The Kid LAROI",
    duration: "2:21",
    genre: "Hip-Hop",
    img: "https://picsum.photos/seed/vibesong4/300/300"
  },
  {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: "2:54",
    genre: "Pop Rock",
    img: "https://picsum.photos/seed/vibesong5/300/300"
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    duration: "2:58",
    genre: "Pop Punk",
    img: "https://picsum.photos/seed/vibesong6/300/300"
  }
];

// ─── State ────────────────────────────────────────────────────
let currentSongIndex = 0;
let isPlaying = false;
let progressInterval = null;
let progressValue = 0;

// ─── DOM References ───────────────────────────────────────────
const cursor          = document.getElementById("cursor");
const cursorTrail     = document.getElementById("cursorTrail");
const navbar          = document.getElementById("navbar");
const miniPlayer      = document.getElementById("miniPlayer");
const miniTitle       = document.getElementById("miniTitle");
const miniArtist      = document.getElementById("miniArtist");
const miniImg         = document.getElementById("miniImg");
const miniPlayBtn     = document.getElementById("miniPlayBtn");
const miniProgressFill = document.getElementById("miniProgressFill");
const miniTime        = document.getElementById("miniTime");
const heroVinyl       = document.getElementById("heroVinyl");
const heroPlayBtn     = document.getElementById("heroPlay");
const heroProgress    = document.getElementById("heroProgress");
const eqBars          = document.getElementById("eqBars");

// ─── Custom Cursor ────────────────────────────────────────────
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";

  // Delayed trail
  setTimeout(() => {
    cursorTrail.style.left = e.clientX + "px";
    cursorTrail.style.top  = e.clientY + "px";
  }, 80);
});

document.addEventListener("mousedown", () => {
  cursor.style.transform = "translate(-50%,-50%) scale(1.6)";
});
document.addEventListener("mouseup", () => {
  cursor.style.transform = "translate(-50%,-50%) scale(1)";
});

// Hover effects on interactive elements
document.querySelectorAll("a, button, .song-card, .genre-card, .artist-bubble").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%,-50%) scale(2)";
    cursorTrail.style.transform = "translate(-50%,-50%) scale(1.3)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%,-50%) scale(1)";
    cursorTrail.style.transform = "translate(-50%,-50%) scale(1)";
  });
});

// ─── Navbar Scroll Effect ─────────────────────────────────────
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ─── Smooth Scroll Helper ─────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Play Song ────────────────────────────────────────────────
function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  // Update mini player info
  miniTitle.textContent  = song.title;
  miniArtist.textContent = song.artist;
  miniImg.src            = song.img;

  // Show mini player
  miniPlayer.classList.add("visible");

  // Start playing
  isPlaying = true;
  updatePlayButtons();
  startProgress();
  heroVinyl.classList.add("spinning");
  eqBars.classList.add("active");

  // Highlight active card
  document.querySelectorAll(".song-card").forEach((card, i) => {
    card.style.borderColor = i === index
      ? "rgba(232,255,87,0.5)"
      : "var(--border)";
  });
}

// ─── Toggle Play/Pause ────────────────────────────────────────
function togglePlay() {
  isPlaying = !isPlaying;
  updatePlayButtons();

  if (isPlaying) {
    startProgress();
    heroVinyl.classList.add("spinning");
    eqBars.classList.add("active");
  } else {
    stopProgress();
    heroVinyl.classList.remove("spinning");
    eqBars.classList.remove("active");
  }
}

function toggleHeroPlay() {
  if (!miniPlayer.classList.contains("visible")) {
    playSong(0);
    return;
  }
  togglePlay();
}

function updatePlayButtons() {
  miniPlayBtn.textContent = isPlaying ? "⏸" : "▶";
  heroPlayBtn.textContent = isPlaying ? "⏸" : "▶";
}

// ─── Progress Bar ─────────────────────────────────────────────
function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    progressValue += 0.3;
    if (progressValue > 100) {
      progressValue = 0;
      nextSong();
      return;
    }
    updateProgressUI();
  }, 200);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function updateProgressUI() {
  miniProgressFill.style.width = progressValue + "%";
  heroProgress.style.width     = progressValue + "%";

  // Fake time display
  const totalSeconds = 200;
  const elapsed = Math.floor((progressValue / 100) * totalSeconds);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  miniTime.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Next / Prev ──────────────────────────────────────────────
function nextSong() {
  progressValue = 0;
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

function prevSong() {
  progressValue = 0;
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

// ─── Heart / Like Toggle ──────────────────────────────────────
function toggleHeart(btn) {
  btn.classList.toggle("liked");
  btn.textContent = btn.classList.contains("liked") ? "♥" : "♡";

  // Pulse animation
  btn.style.transform = "scale(1.4)";
  setTimeout(() => { btn.style.transform = ""; }, 200);
}

// ─── Scroll Reveal (IntersectionObserver) ────────────────────
const revealElements = document.querySelectorAll(
  ".genre-card, .artist-bubble, .section-header"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.transform  = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => {
  el.style.opacity   = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)";
  revealObserver.observe(el);
});

// ─── Artist Bubble stagger reveal ────────────────────────────
const artistBubbles = document.querySelectorAll(".artist-bubble");
const artistObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = [...artistBubbles].indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.08}s`;
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
        artistObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

artistBubbles.forEach((bubble) => {
  bubble.style.opacity   = "0";
  bubble.style.transform = "translateY(24px)";
  bubble.style.transition = "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)";
  artistObserver.observe(bubble);
});

// ─── Genre card hover sound-wave ripple ──────────────────────
document.querySelectorAll(".genre-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1)";
  });
});

// ─── Floating Note Particles ──────────────────────────────────
const notes = ["♩", "♪", "♫", "♬", "🎵", "🎶"];

function spawnNote() {
  const note   = document.createElement("div");
  note.textContent = notes[Math.floor(Math.random() * notes.length)];
  note.style.cssText = `
    position: fixed;
    left: ${Math.random() * 100}vw;
    bottom: -40px;
    font-size: ${0.8 + Math.random() * 1.2}rem;
    color: rgba(232,255,87,${0.1 + Math.random() * 0.25});
    pointer-events: none;
    z-index: 0;
    animation: noteFloat ${4 + Math.random() * 4}s ease-in forwards;
    user-select: none;
  `;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 8000);
}

// Inject keyframes for note float
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes noteFloat {
    0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-100vh) rotate(${Math.random() > 0.5 ? "" : "-"}20deg); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

setInterval(spawnNote, 2200);

// ─── Init ─────────────────────────────────────────────────────
// Pre-set hero card with first song
document.addEventListener("DOMContentLoaded", () => {
  // Nothing auto-plays — user must click
  console.log("🎵 VIBE Music loaded. Click play to start.");
});

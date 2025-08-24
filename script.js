/* =========================
   Personal settings
   ========================= */
const HER_NAME = "Soumaya"; // change if needed
const YOUR_NAME = "Taha";   // change if needed
// If you want exact streak start date, set it (YYYY-MM-DD). Else it assumes "today is day 100".
const STREAK_START = ""; // e.g., "2025-05-16"

/* =========================
   DOM refs
   ========================= */
const herNameDisplay = document.getElementById("herNameDisplay");
const herNameFooter  = document.getElementById("herNameFooter");
const herNameLetter  = document.getElementById("herNameLetter");
const herNameBadge   = document.getElementById("herNameBadge");
const myNameEls      = [document.getElementById("myName"), document.getElementById("myNameFooter")];
const streakNumber   = document.getElementById("streakNumber");
const streakDaysEl   = document.getElementById("streakDays");
const startDateLabel = document.getElementById("startDateLabel");
const revealLetterBtn = document.getElementById("revealLetterBtn");
const loveLetter     = document.getElementById("loveLetter");
const confettiBtn    = document.getElementById("confettiBtn");
const confettiCanvas = document.getElementById("confetti-canvas");

/* =========================
   Personalize text
   ========================= */
[herNameDisplay, herNameFooter, herNameLetter, herNameBadge].forEach(el => {
  if (el) el.textContent = HER_NAME;
});
myNameEls.forEach(el => { if (el) el.textContent = YOUR_NAME; });

/* =========================
   Streak date logic
   ========================= */
function formatDate(d){
  return d.toLocaleDateString(undefined, {year:"numeric", month:"long", day:"numeric"});
}
function computeStartDate(){
  if (STREAK_START) return new Date(STREAK_START + "T00:00:00");
  const d = new Date(); d.setDate(d.getDate() - 99); return d; // Day 100 today
}
const startDate = computeStartDate();
if (startDateLabel) startDateLabel.textContent = formatDate(startDate);

const today = new Date();
const diffDays = Math.max(1, Math.floor((today - startDate) / (24*3600*1000)) + 1);
if (streakDaysEl) streakDaysEl.textContent = diffDays;
if (streakNumber) streakNumber.textContent = `Day ${diffDays} ❤️`;

/* =========================
   Letter toggle
   ========================= */
if (revealLetterBtn && loveLetter){
  revealLetterBtn.addEventListener("click", () => {
    const hidden = loveLetter.hasAttribute("hidden");
    if (hidden) {
      loveLetter.removeAttribute("hidden");
      revealLetterBtn.textContent = "Hide my letter 💌";
      fireConfetti(240);
    } else {
      loveLetter.setAttribute("hidden", "");
      revealLetterBtn.textContent = "Open my letter 💌";
    }
  });
}

/* =========================
   Lightbox for gallery (robust)
   ========================= */
const lightbox     = document.getElementById("lightbox");
const lightboxImg  = document.getElementById("lightboxImg");
const lightboxClose= document.getElementById("lightboxClose");

function closeLightbox(){
  if (!lightbox) return;
  lightbox.setAttribute("hidden", "");
  if (lightboxImg) {
    // clear src to avoid lingering failed loads
    lightboxImg.removeAttribute("src");
    lightboxImg.onload = null;
    lightboxImg.onerror = null;
  }
}

if (lightbox && lightboxImg){
  document.querySelectorAll(".gallery-img").forEach(img=>{
    img.addEventListener("click", ()=>{
      // Show only after a successful load
      lightboxImg.onload = () => lightbox.removeAttribute("hidden");
      lightboxImg.onerror = () => {
        closeLightbox();
        alert("Image not found. Check the filename/extension in /assets.");
      };
      lightboxImg.src = img.src;
    });
  });

  // Click on overlay closes
  lightbox.addEventListener("click", (e)=> { if (e.target === lightbox) closeLightbox(); });

  // ❌ button closes
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  // ESC key closes
  window.addEventListener("keydown", (e)=> { if (e.key === "Escape") closeLightbox(); });
}

/* =========================
   Confetti
   ========================= */
const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
const colors = ["#ff3e7f","#ffb3cd","#6f7cff","#b3b8ff","#f9d66b","#7ce3a1"];

function random(min, max){ return Math.random()*(max-min)+min }
function createConfetti(count){
  const { width, height } = confettiCanvas;
  for (let i = 0; i < count; i++){
    confettiPieces.push({
      x: random(0, width), y: random(-20, -height*0.2), r: random(3, 6),
      c: colors[Math.floor(random(0, colors.length))], vy: random(2, 4.5),
      vx: random(-1.5, 1.5), rot: random(0, Math.PI*2), vr: random(-0.05, 0.05)
    });
  }
}
function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawConfetti(){
  const { width, height } = confettiCanvas;
  ctx.clearRect(0,0,width,height);
  confettiPieces.forEach(p=>{
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y > height + 10) { p.y = -10; p.x = random(0,width); }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
    ctx.restore();
  });
  requestAnimationFrame(drawConfetti);
}
drawConfetti();

function fireConfetti(n=200){ createConfetti(n); }
if (confettiBtn) confettiBtn.addEventListener("click", ()=> fireConfetti(240));

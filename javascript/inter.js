document.querySelectorAll(".distributor").forEach(distributor => {
  const circle = distributor.querySelector(".progress-ring__circle");
  const textElement = distributor.querySelector("p");

  // Track if animation already ran
  distributor.dataset.animated = "false";

  distributor.addEventListener("mouseenter", () => {
    if (distributor.dataset.animated === "true") return;
    distributor.dataset.animated = "true";

    // ✅ Animate circle only
    circle.style.strokeDashoffset = "0";

    // ✅ Instantly show full text (no word-by-word animation)
    textElement.style.opacity = 1;
  });
});
/* ===== FLAG STRIP INFINITE LOOP ===== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("flagTrack");
  if (!track) return;

  // Duplicate all flags once for seamless loop
  const clone = track.innerHTML;
  track.innerHTML += clone;
});

/* ===== Story Section Scroll Reveal ===== */
document.addEventListener("scroll", () => {
  const storySection = document.querySelector(".our-story");
  if (!storySection) return;
  const sectionTop = storySection.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.8;
  if (sectionTop < triggerPoint) storySection.classList.add("show");
});

/* ===== TEAM SLIDER ===== */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".team-container");
  const members = document.querySelectorAll(".team-member");
  const prevBtn = document.querySelector(".team-btn.prev");
  const nextBtn = document.querySelector(".team-btn.next");

  if (!container || !members.length) return;

  let index = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 992) return 3;
    return 5;
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const memberWidth = members[0].getBoundingClientRect().width;
    const maxIndex = Math.max(0, members.length - visibleCount);
    index = Math.max(0, Math.min(index, maxIndex));
    container.style.transform = `translateX(${-index * memberWidth}px)`;
  }

  nextBtn?.addEventListener("click", () => {
    index++;
    updateSlider();
  });

  prevBtn?.addEventListener("click", () => {
    index--;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
});

/* ===== FLAG STRIP INFINITE LOOP ===== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("flagTrack");
  if (!track) return;

  // Duplicate all flags once for seamless loop
  const clone = track.innerHTML;
  track.innerHTML += clone;
});

/* ===== MAP SECTION (STATIC AIRPLANES, LIKE BEFORE) ===== */
const origin = { name: 'India', lat: 16.5937, lon: 71.9629 };

const destinations = [
  { name: 'UAE', lat: 16.4539, lon: 51.3773 },
  { name: 'Ivory Coast', lat: -4.8276, lon: -8.2893 },
  { name: 'Tanzania', lat: -24.1630, lon: 32.7516 },
  { name: 'Togo', lat: -4.1725, lon: -1.2314 },
  { name: 'Congo', lat: -20.2634, lon: 20.2429 },
  { name: 'Benin', lat: -2.2969, lon: 0.2289 },
  { name: 'Burkina Faso', lat: 2.3714, lon: -3.5197 },
  { name: 'Central African Republic', lat: -5.3947, lon: 18.5582 },
  { name: 'Uganda', lat: -12.3476, lon: 30.5825 }
];

function latLonToXY(lat, lon, width, height){
  const x = (lon + 180) / 360 * width;
  const y = (90 - lat) / 180 * height;
  return { x, y };
}

function svgEl(name, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function createPlaneElement(name){
  const wrapper = document.createElement('div');
  wrapper.className = 'plane';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', `Destination: ${name}`);
  wrapper.innerHTML = `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M2 12 L22 12 L18 8 L16.5 10 L12 8 L13 12 L12 16 L13.5 14 L16.5 16 L18 14 Z" fill="white"/>
    </svg>`;
  return wrapper;
}

function computeCurveControls(x1,y1,x2,y2,width){
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const curvature = Math.max(0.05, Math.min(0.5, dist / width * 0.1));
  const cx1 = x1 + dx * 0.25 - dy * curvature;
  const cy1 = y1 + dy * 0.25 + dx * curvature;
  const cx2 = x1 + dx * 0.75 - dy * curvature;
  const cy2 = y1 + dy * 0.75 + dx * curvature;
  return { cx1, cy1, cx2, cy2 };
}

document.addEventListener('DOMContentLoaded', () => {
  const mapImg = document.getElementById('world-map');
  const overlay = document.getElementById('map-overlay');
  const originPin = document.getElementById('origin-pin');
  const tooltip = document.getElementById('tooltip');
  const wrapper = document.querySelector('.map-wrapper');

  function renderMap() {
    const width = mapImg.clientWidth;
    const height = mapImg.clientHeight;

    overlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
    overlay.style.width = `${width}px`;
    overlay.style.height = `${height}px`;

    const originXY = latLonToXY(origin.lat, origin.lon, width, height);
    originPin.style.left = `${(originXY.x / width) * 100}%`;
    originPin.style.top  = `${(originXY.y / height) * 100}%`;

    overlay.innerHTML = '';
    document.querySelectorAll('.map-wrapper .plane').forEach(el => el.remove());

    destinations.forEach((d, i) => {
      const destXY = latLonToXY(d.lat, d.lon, width, height);
      const { cx1, cy1, cx2, cy2 } = computeCurveControls(originXY.x, originXY.y, destXY.x, destXY.y, width);
      const pathD = `M ${originXY.x} ${originXY.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${destXY.x} ${destXY.y}`;

      const path = svgEl('path', { d: pathD, 'class': 'route route-'+i });
      overlay.appendChild(path);

      const destCircle = svgEl('circle', { cx: destXY.x, cy: destXY.y, r: 4 });
      destCircle.classList.add('dest-dot');
      overlay.appendChild(destCircle);

      const plane = createPlaneElement(d.name);
      plane.style.left = (destXY.x / width) * 100 + '%';
      plane.style.top  = (destXY.y / height) * 100 + '%';
      wrapper.appendChild(plane);

      [path, plane].forEach(el => {
        el.addEventListener('mouseenter', (ev) => {
          tooltip.style.display = 'block';
          tooltip.textContent = d.name;
          tooltip.setAttribute('aria-hidden', 'false');
        });
        el.addEventListener('mousemove', (ev) => {
          const rect = mapImg.getBoundingClientRect();
          tooltip.style.left = (ev.clientX - rect.left) + 'px';
          tooltip.style.top = (ev.clientY - rect.top) + 'px';
        });
        el.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
          tooltip.setAttribute('aria-hidden', 'true');
        });
      });
    });
  }

  if (mapImg.complete) renderMap();
  else mapImg.addEventListener('load', renderMap);

  window.addEventListener('resize', () => {
    clearTimeout(window._mapResizeTimer);
    window._mapResizeTimer = setTimeout(renderMap, 150);
  });
});
/*----------------memories -------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const sources = [
    "images/mem1.jpg",
    "images/mem2.png",
    "images/mem3.jpg",
    "images/mem4.jpg",
    "images/mem5.jpg",
    "images/mem6.jpg",
    "images/mem7.jpg",
    "images/mem8.jpg",
    "images/mem9.jpeg",
    "images/mem10.jpeg",
    "images/mem11.jpeg",
    "images/mem12.jpeg"
  ];

  const track = document.getElementById("hexTrack");
  let centerIdx = 1;
  let sliding = false;

  const mod = (n, m) => ((n % m) + m) % m;
  const sizes = ["small", "medium", "large", "medium"];
  const rel = [-2, -1, 0, +1];

  function createOct(src, sizeClass) {
    const li = document.createElement("li");
    li.className = `oct ${sizeClass}`;
    li.innerHTML = `
      <div class="background-oct"></div>
      <div class="media-oct">
        <img src="${src}" alt="">
      </div>
    `;
    return li;
  }

  function renderTrack() {
    if (!track) return;
    track.innerHTML = "";
    for (let i = 0; i < sizes.length; i++) {
      const idx = mod(centerIdx + rel[i], sources.length);
      track.appendChild(createOct(sources[idx], sizes[i]));
    }
  }
  renderTrack();

  function slideNext() {
    if (!track || sliding) return;
    sliding = true;

    const first = track.firstElementChild;
    if (!first) {
      sliding = false;
      return;
    }

    const firstWidth = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = firstWidth + gap;

    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${offset}px)`;

    track.addEventListener(
      "transitionend",
      () => {
        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        centerIdx = mod(centerIdx + 1, sources.length);
        renderTrack();

        void track.offsetWidth;
        sliding = false;
      },
      { once: true }
    );
  }

  const AUTO_DELAY = 5000;
  let timer = setInterval(slideNext, AUTO_DELAY);

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(slideNext, AUTO_DELAY);
  }

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    slideNext();
    resetTimer();
  });

  track?.addEventListener("mouseenter", () => clearInterval(timer));
  track?.addEventListener("mouseleave", resetTimer);
});

/* ===== NAVBAR TOGGLE ===== */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!menuToggle || !navLinks) return;

  const toggleNav = (show) => {
    if (typeof show === "boolean") navLinks.classList.toggle("active", show);
    else navLinks.classList.toggle("active");
  };

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNav();
  });
  menuToggle.addEventListener("mouseenter", () => toggleNav(true));
  navLinks.addEventListener("mouseleave", () => toggleNav(false));
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navLinks.classList.remove("active"))
  );
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove("active");
    }
  });
});

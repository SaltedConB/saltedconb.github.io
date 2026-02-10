// 1. DOM 요소 선택
const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

// 2. 상태 변수
let isPaused = false;

// 3. 이벤트 리스너
window.addEventListener("scroll", () => {
  requestAnimationFrame(scrollCheck);
});

function scrollCheck() {
  const browserScrollY = window.scrollY || window.pageYOffset;
  headerEl.classList.toggle("active", browserScrollY > 0);
}

// 3.2 리사이즈 이벤트
window.addEventListener("resize", () => {
  if (!navButtonEl) return;
  const windowWidth = window.innerWidth;
  const fontSize = windowWidth / 20;
  const buttonSize = windowWidth / 10;

  navButtonEl.style.fontSize = `${fontSize}px`;
  navButtonEl.style.width = `${buttonSize}px`;
  navButtonEl.style.height = `${buttonSize}px`;
});

// 3.3 이미지 관련 이벤트
if (mainImg) {
  mainImg.addEventListener("click", () => {
    isPaused = !isPaused;
    mainImg.classList.toggle("paused", isPaused);
  });
}

// 4. 애니메이션 효과
// 4.1 이미지 페이드 효과
if (mainImg) {
  setInterval(() => {
    if (!isPaused) {
      mainImg.classList.toggle("fade");
    }
  }, 100);
}

// 4.2 페이드 효과 유틸리티 함수
function fadeElement(element, start, end, speed, callback) {
  let opacity = start;
  const fade = setInterval(() => {
    if ((end === 1 && opacity >= end) || (end === 0 && opacity <= end)) {
      clearInterval(fade);
      if (callback) callback();
    } else {
      opacity += end === 1 ? 0.1 : -0.1;
      element.style.opacity = opacity;
    }
  }, speed);
}

// 5. 모달 관련 함수
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "flex";
  // 다음 프레임에서 hidden 제거 → CSS transition 트리거
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.remove("hidden");
    });
  });
  document.body.style.overflow = "hidden";

  // 모달 바깥 클릭으로 닫기
  modal.addEventListener("click", function handler(event) {
    if (event.target === modal) {
      closeModal(modalId);
      modal.removeEventListener("click", handler);
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
  // transition 끝나면 display:none
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
}

// 6. 포트폴리오 필터링 및 애니메이션
function filterPortfolio(category) {
  const grid = document.querySelector(".portfolio-grid");
  const items = document.getElementsByClassName("portfolio-item");
  if (!grid || items.length === 0) return;
  grid.classList.add("animate-grid");

  Array.from(items).forEach((item, index) => {
    const shouldShow = category === "all" || item.classList.contains(category);
    if (shouldShow) {
      showItem(item, index);
    } else {
      hideItem(item);
    }
  });

  updateAccessibility(category);
}

// 7. 아이템 애니메이션 함수
function showItem(item, index) {
  item.style.display = "block";
  item.classList.add("fade-hidden");
  setTimeout(() => {
    item.classList.remove("fade-hidden");
  }, index * 100);
}

function hideItem(item) {
  item.classList.add("fade-hidden");
  setTimeout(() => {
    item.style.display = "none";
  }, 300);
}

// 8. 접근성 관련
function updateAccessibility(category) {
  const buttons = document.querySelectorAll(".portfolio-categories button");
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const isSelected =
      button.textContent.toLowerCase().includes(category) ||
      (category === "all" && button.textContent === "전체");
    button.setAttribute("aria-pressed", isSelected);
    button.setAttribute(
      "aria-label",
      `${button.textContent} 카테고리 ${isSelected ? "선택됨" : ""}`,
    );
  });
}

// 10. 모달 외부 클릭 처리
window.onclick = function (event) {
  const modals = document.getElementsByClassName("modal");
  for (let i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].style.display = "none";
    }
  }
};

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

function toggleMediaPlayback(section) {
  const media = section.querySelector("video, audio");
  if (media) {
    if (media.paused) {
      media.play();
    } else {
      media.pause();
    }
  }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initScrollAnimations();
  injectTransitionOverlay();
  initPageTransitions();
  playEnterTransition();
});

// bfcache (뒤로가기) 지원
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    playEnterTransition();
  }
});

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".fade-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// ===== Double Wipe Transition System =====

function injectTransitionOverlay() {
  if (document.querySelector(".transition-wrapper")) return;
  const wrapper = document.createElement("div");
  wrapper.className = "transition-wrapper";
  wrapper.innerHTML =
    '<div class="transition-layer transition-layer-1"></div>' +
    '<div class="transition-layer transition-layer-2"></div>';
  document.body.appendChild(wrapper);
}

function initPageTransitions() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    // 외부 링크, 앵커, javascript: 등은 무시
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("http") ||
      href.startsWith("mailto:")
    ) {
      return;
    }

    e.preventDefault();
    playExitTransition(() => {
      window.location.href = href;
    });
  });
}

function playExitTransition(callback) {
  const wrapper = document.querySelector(".transition-wrapper");
  if (!wrapper) {
    callback();
    return;
  }
  // 깨끗한 상태에서 시작
  wrapper.classList.remove("phase-cover", "phase-reveal", "no-transition");
  wrapper.offsetWidth; // force reflow
  // 레이어 확장 (L→R 커버)
  wrapper.classList.add("phase-cover");
  // transition 완료 후 네비게이션
  setTimeout(callback, 500);
}

function playEnterTransition() {
  const wrapper = document.querySelector(".transition-wrapper");
  if (!wrapper) return;

  // 1) 즉시 커버 상태로 세팅 (transition 없이)
  wrapper.classList.remove("phase-reveal");
  wrapper.classList.add("no-transition", "phase-cover");
  wrapper.offsetWidth; // force reflow

  // 2) transition 활성화 후 reveal
  wrapper.classList.remove("no-transition");
  wrapper.offsetWidth; // force reflow
  wrapper.classList.remove("phase-cover");
  wrapper.classList.add("phase-reveal");

  // 3) 완료 후 정리
  setTimeout(() => {
    wrapper.classList.remove("phase-reveal");
  }, 600);
}

// 1. DOM 요소 선택
const headerEl = document.querySelector("header");

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



function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}



// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initScrollAnimations();
  initPageTransitions();
  initKeyboardAccessibility();
  initGauge();
});

// bfcache (뒤로가기) 지원
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    document.body.classList.remove("page-leaving");
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

// ===== Seamless Fade Transition =====

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
    document.body.classList.add("page-leaving");
    setTimeout(() => {
      window.location.href = href;
    }, 250);
  });
}

// ===== 키보드 접근성 =====

function initKeyboardAccessibility() {
  // portfolio-item, skill-row에 Enter/Space 키보드 이벤트 추가
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const item = e.target.closest(".portfolio-item, .skill-row");
      if (item && item.hasAttribute("onclick")) {
        e.preventDefault();
        item.click();
      }
    }

    // Escape 키로 모달 닫기
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal:not(.hidden)");
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });
}

// ===== 5-level 게이지 초기화 =====
function initGauge() {
  document.querySelectorAll(".skill-row[data-level]").forEach((row) => {
    const level = parseInt(row.getAttribute("data-level"), 10) || 0;
    const dots = row.querySelectorAll(".gauge i");
    dots.forEach((dot, idx) => {
      if (idx < level) dot.classList.add("active");
    });
  });
}

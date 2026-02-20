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

// ===== Light / Dark Theme Toggle =====
function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  let currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

  // Set initial theme before render
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  // Use sun for dark mode (to switch to light), moon for light mode (to switch to dark)
  toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  toggleBtn.setAttribute('aria-label', 'Toggle Theme');

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', currentTheme);
    toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  });

  // Append to the end of the nav menu
  const navUl = document.querySelector('nav ul');
  if (navUl) {
    const li = document.createElement('li');
    li.appendChild(toggleBtn);
    navUl.appendChild(li);
  }
}




// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initScrollAnimations();
  initPageTransitions();
  initKeyboardAccessibility();
  initGauge();

  // Static CMS Content Rendering
  renderSiteData();
});

// ===== Static CMS Data Rendering =====
function renderSiteData() {
  if (typeof SITE_DATA === 'undefined') return;

  // 1. Landing Page Strings
  const mainTitle = document.querySelector('.main-title');
  const landingSub = document.querySelector('.landing-subtitle');
  const footerContact = document.querySelector('.footer-text p');

  if (mainTitle && SITE_DATA.landing.title) mainTitle.innerHTML = SITE_DATA.landing.title;
  if (landingSub && SITE_DATA.landing.subtitle) landingSub.innerHTML = SITE_DATA.landing.subtitle;
  if (footerContact && SITE_DATA.landing.contactEmail) footerContact.innerHTML = SITE_DATA.landing.contactEmail;

  // 2. Portfolio Works Render
  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (portfolioGrid && SITE_DATA.works.length > 0) {
    // Clear existing static items and modals
    portfolioGrid.innerHTML = '';
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(m => m.remove());

    const modalContainer = document.createElement('div');

    SITE_DATA.works.forEach((work, index) => {
      // A. Create Grid Item
      const itemHTML = `
                <div class="portfolio-item ${work.category} fade-on-scroll" role="button" tabindex="0"
                    aria-label="${work.title}" onclick="openModal('${work.id}')">
                    <img src="${work.thumb}" alt="${work.thumbAlt}" />
                    <div class="portfolio-caption">
                        <h3>${work.title}</h3>
                        <p>${work.subtitle}</p>
                    </div>
                </div>
            `;
      portfolioGrid.insertAdjacentHTML('beforeend', itemHTML);

      // B. Create Modal
      let galleryHTML = '';
      if (work.images && work.images.length > 0) {
        galleryHTML = '<div class="image-gallery">';
        work.images.forEach((img, i) => {
          galleryHTML += `<img src="${img}" alt="Work ${i + 1}" />`;
        });
        galleryHTML += '</div>';
      }

      let iframeHTML = '';
      if (work.youtube) {
        iframeHTML += `<iframe width="640" height="480" src="${work.youtube}" frameborder="0" allowfullscreen></iframe>`;
      }
      if (work.behance) {
        iframeHTML += `<h3>Behance</h3><iframe src="${work.behance}" height="316" width="404" allowfullscreen></iframe>`;
      }
      if (work.pdf) {
        iframeHTML += `<h2>More contents?</h2><iframe src="${work.pdf}" class="pdf-embed"></iframe>`;
      }

      const modalHTML = `
                <div id="${work.id}" class="modal hidden">
                    <div class="modal-content">
                        <span class="close" onclick="closeModal('${work.id}')">&times;</span>
                        <h1>${work.descTitle}</h1>
                        <p>${work.desc}</p>
                        ${galleryHTML}
                        ${iframeHTML}
                    </div>
                </div>
            `;
      modalContainer.insertAdjacentHTML('beforeend', modalHTML);
    });

    // Append modals out of grid container (to outer section)
    portfolioGrid.parentNode.appendChild(modalContainer);

    // Re-initialize scroll animations for new async elements
    initScrollAnimations();
  }

  // 3. Skills Render
  const skillChart = document.querySelector('.skill-chart');
  if (skillChart && SITE_DATA.skills && SITE_DATA.skills.length > 0) {
    skillChart.innerHTML = '';
    const existingSkillModals = document.querySelectorAll('.skill .modal');
    existingSkillModals.forEach(m => m.remove());

    const skillModalContainer = document.createElement('div');

    SITE_DATA.skills.forEach((skill) => {
      // A. Create Skill Row
      const rowHTML = `
        <div class="skill-row fade-on-scroll" onclick="openModal('${skill.id}')" data-level="${skill.level}">
          <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
          <div class="skill-info">
            <span>${skill.name}</span>
            <div class="gauge"><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </div>
      `;
      skillChart.insertAdjacentHTML('beforeend', rowHTML);

      // B. Create Skill Modal
      const modalHTML = `
        <div id="${skill.id}" class="modal hidden">
          <div class="modal-content">
            <span class="close" onclick="closeModal('${skill.id}')">&times;</span>
            <h2>${skill.descTitle}</h2>
            <p>${skill.desc}</p>
          </div>
        </div>
      `;
      skillModalContainer.insertAdjacentHTML('beforeend', modalHTML);
    });

    skillChart.parentNode.appendChild(skillModalContainer);

    // Re-init gauges for newly added elements
    initGauge();
    initScrollAnimations();
  }
}

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

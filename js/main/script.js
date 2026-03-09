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

// ===== 라이트 / 다크 테마 전환 =====
function initThemeToggle() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.warn("localStorage 접근 차단 감지:", e);
  }

  let systemPrefersLight = false;
  try {
    if (window.matchMedia) {
      systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    }
  } catch (e) {
    console.warn("matchMedia 오류:", e);
  }

  let currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

  // 렌더링 전 초기 테마 설정
  const logoImg = document.querySelector('.logo img');
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (logoImg) logoImg.src = './img/monoton_black.svg';
  } else {
    if (logoImg) logoImg.src = './img/monoton_light.svg';
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  // 다크 모드일 때 ☀️(라이트 전환), 라이트 모드일 때 🌙(다크 전환)
  toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  toggleBtn.setAttribute('aria-label', '테마 전환');

  toggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (logoImg) logoImg.src = './img/monoton_black.svg';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (logoImg) logoImg.src = './img/monoton_light.svg';
    }

    try {
      localStorage.setItem('theme', currentTheme);
    } catch (e) {
      // 차단된 환경에서는 무시
    }

    toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  });

  // 네비게이션 메뉴 끝에 추가
  const navUl = document.querySelector('nav ul');
  if (navUl) {
    const li = document.createElement('li');
    li.appendChild(toggleBtn);
    navUl.appendChild(li);
  }
}
// ===== 언어 드롭다운 (Idle→Language, Hover→현재 언어, Click→드롭다운) =====
function initLangDropdown() {
  const dropdown = document.querySelector('.lang-dropdown');
  const btn = document.querySelector('.lang-dropbtn');
  if (!dropdown || !btn) return;

  const currentLang = btn.getAttribute('data-current-lang') || 'Language';
  const isMobileQuery = window.matchMedia('(max-width: 768px)');

  // Desktop: hover → 현재 언어 표시
  btn.addEventListener('mouseenter', () => {
    if (!isMobileQuery.matches) {
      btn.textContent = currentLang;
    }
  });

  btn.addEventListener('mouseleave', () => {
    if (!isMobileQuery.matches && !dropdown.classList.contains('open')) {
      btn.textContent = 'Language';
    }
  });

  // Click → 드롭다운 토글
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    btn.textContent = isOpen ? currentLang : (isMobileQuery.matches ? 'Language' : currentLang);
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      btn.textContent = 'Language';
    }
  });

  // 드롭다운 내 링크 클릭 시에는 페이지 전환이므로 별도 처리 불필요
}



// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initLangDropdown();
  initScrollAnimations();
  initPageTransitions();
  initKeyboardAccessibility();
  initGauge();

  // 데이터 기반 콘텐츠 렌더링
  renderSiteData();
});

// ===== 데이터 기반 콘텐츠 렌더링 =====
function renderSiteData() {
  if (typeof SITE_DATA === 'undefined') return;

  // 1. 랜딩 페이지 텍스트
  const mainTitle = document.querySelector('.main-title');
  const landingSub = document.querySelector('.landing-subtitle');
  const footerContact = document.querySelector('.footer-text p');

  if (mainTitle && SITE_DATA.landing.title) mainTitle.innerHTML = SITE_DATA.landing.title;
  if (landingSub && SITE_DATA.landing.subtitle) landingSub.innerHTML = SITE_DATA.landing.subtitle;
  if (footerContact && SITE_DATA.landing.contactEmail) footerContact.innerHTML = SITE_DATA.landing.contactEmail;

  // 2. 포트폴리오 작업물 렌더링
  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (portfolioGrid && SITE_DATA.works.length > 0) {
    // 기존 아이템 및 모달 초기화
    portfolioGrid.innerHTML = '';
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(m => m.remove());

    const modalContainer = document.createElement('div');

    SITE_DATA.works.forEach((work, index) => {
      // A. 그리드 아이템 생성
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

      // B. 모달 생성
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

    // 모달을 그리드 밖 상위 요소에 추가
    portfolioGrid.parentNode.appendChild(modalContainer);

    // 새로 추가된 요소에 스크롤 애니메이션 재초기화
    initScrollAnimations();
  }

  // 3. 스킬 카드 렌더링
  const skillChart = document.querySelector('.skill-chart');
  if (skillChart && SITE_DATA.skills && SITE_DATA.skills.length > 0) {
    skillChart.innerHTML = '';
    const existingSkillModals = document.querySelectorAll('.skill .modal');
    existingSkillModals.forEach(m => m.remove());

    const skillModalContainer = document.createElement('div');

    SITE_DATA.skills.forEach((skill) => {
      // A. 스킬 행 생성
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

      // B. 스킬 모달 생성
      let galleryHTML = '';
      if (skill.images && skill.images.length > 0) {
        galleryHTML = '<div class="image-gallery">';
        skill.images.forEach((img, i) => {
          galleryHTML += `<img src="${img}" alt="${skill.name} 작업물 ${i + 1}" />`;
        });
        galleryHTML += '</div>';
      }

      const modalHTML = `
        <div id="${skill.id}" class="modal hidden">
          <div class="modal-content">
            <span class="close" onclick="closeModal('${skill.id}')">&times;</span>
            <h2>${skill.descTitle}</h2>
            <p>${skill.desc}</p>
            ${galleryHTML}
          </div>
        </div>
      `;
      skillModalContainer.insertAdjacentHTML('beforeend', modalHTML);
    });

    skillChart.parentNode.appendChild(skillModalContainer);

    // 새로 추가된 요소에 게이지 재초기화
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

// ===== 부드러운 페이드 전환 =====

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

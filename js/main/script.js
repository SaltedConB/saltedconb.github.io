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

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // 메뉴 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// ===== 라이트 / 다크 테마 전환 (시스템 시간 자동 감지 + 수동 전환) =====
function initThemeToggle() {
  const logoImg = document.querySelector('.logo img');

  // 시스템 prefers-color-scheme 감지
  let systemQuery = null;
  try {
    systemQuery = window.matchMedia('(prefers-color-scheme: light)');
  } catch (e) {}

  // 저장된 수동 설정 확인
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {}

  // 초기 테마 결정: 수동 저장값 > 시스템 자동 감지
  let currentTheme = savedTheme || (systemQuery && systemQuery.matches ? 'light' : 'dark');

  function applyTheme(theme, withTransition) {
    if (withTransition) {
      document.documentElement.classList.add('theme-transitioning');
    }

    const newLogoSrc = theme === 'light' ? './img/monoton_black.svg' : './img/monoton_light.svg';

    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // 로고 이미지 디졸브 전환
    if (logoImg && withTransition) {
      logoImg.classList.add('logo-fading');
      setTimeout(() => {
        logoImg.src = newLogoSrc;
        logoImg.classList.remove('logo-fading');
      }, 300);
    } else if (logoImg) {
      logoImg.src = newLogoSrc;
    }

    currentTheme = theme;
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
    if (withTransition) {
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  }

  // 초기 테마 적용 (트랜지션 없이)
  applyTheme(currentTheme, false);

  // 시스템 테마 변경 실시간 감지 (수동 설정이 없을 때만 자동 전환)
  if (systemQuery) {
    systemQuery.addEventListener('change', (e) => {
      let manual = null;
      try { manual = localStorage.getItem('theme'); } catch (ex) {}
      if (!manual) {
        applyTheme(e.matches ? 'light' : 'dark', true);
      }
    });
  }

  // 수동 전환 버튼
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle';
  toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  toggleBtn.setAttribute('aria-label', '테마 전환');

  toggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
  });

  // 네비게이션 메뉴 끝에 추가
  const navUl = document.querySelector('nav ul');
  if (navUl) {
    const li = document.createElement('li');
    li.appendChild(toggleBtn);
    navUl.appendChild(li);
  }
}
// ===== 랜덤 명언 렌더링 =====
function renderRandomQuote() {
  if (typeof QUOTES === 'undefined' || QUOTES.length === 0) return;
  const banner = document.querySelector('.quote-banner');
  if (!banner) return;
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  banner.innerHTML = `"${q.text}" — <em>${q.author}</em>`;
}



// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initThemeToggle();
  initScrollAnimations();
  initPageTransitions();
  initKeyboardAccessibility();
  initGauge();

  // 데이터 기반 콘텐츠 렌더링
  renderSiteData();
  renderRandomQuote();
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

  // 2. 포트폴리오 카테고리 버튼 자동 생성
  const catContainer = document.querySelector('.portfolio-categories');
  if (catContainer && SITE_DATA.workCategories && SITE_DATA.workCategories.length > 0) {
    catContainer.innerHTML = '';
    SITE_DATA.workCategories.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.textContent = cat.label;
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => filterPortfolio(cat.id));
      catContainer.appendChild(btn);
    });
  }

  // 3. 포트폴리오 작업물 렌더링
  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (portfolioGrid && SITE_DATA.works.length > 0) {
    portfolioGrid.innerHTML = '';
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(m => m.remove());

    const modalContainer = document.createElement('div');

    SITE_DATA.works.forEach((work, index) => {
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

    portfolioGrid.parentNode.appendChild(modalContainer);
    initScrollAnimations();
  }

  // 4. 스킬 카드 렌더링 (카테고리별 그룹핑)
  const skillChart = document.querySelector('.skill-chart');
  if (skillChart && SITE_DATA.skills && SITE_DATA.skills.length > 0) {
    skillChart.innerHTML = '';
    const existingSkillModals = document.querySelectorAll('.skill .modal');
    existingSkillModals.forEach(m => m.remove());

    const skillModalContainer = document.createElement('div');
    const categories = SITE_DATA.skillCategories || [];

    // 카테고리별로 그룹핑
    if (categories.length > 0) {
      categories.forEach(cat => {
        const catSkills = SITE_DATA.skills.filter(s => s.category === cat.id);
        if (catSkills.length === 0) return;

        // 그룹 헤더
        const headerHTML = `<div class="skill-group-header">${cat.label}</div>`;
        skillChart.insertAdjacentHTML('beforeend', headerHTML);

        // 해당 카테고리의 스킬 행들
        catSkills.forEach(skill => {
          renderSkillRow(skillChart, skill, skillModalContainer);
        });
      });

      // 카테고리가 없는 스킬 (미분류)
      const uncategorized = SITE_DATA.skills.filter(s => !categories.some(c => c.id === s.category));
      if (uncategorized.length > 0) {
        const headerHTML = `<div class="skill-group-header">기타</div>`;
        skillChart.insertAdjacentHTML('beforeend', headerHTML);
        uncategorized.forEach(skill => {
          renderSkillRow(skillChart, skill, skillModalContainer);
        });
      }
    } else {
      // 카테고리 없으면 기존처럼 전체 출력
      SITE_DATA.skills.forEach(skill => {
        renderSkillRow(skillChart, skill, skillModalContainer);
      });
    }

    skillChart.parentNode.appendChild(skillModalContainer);
    initGauge();
    initScrollAnimations();
  }
}

// ===== 스킬 행 렌더링 헬퍼 =====
function renderSkillRow(container, skill, modalContainer) {
  const rowHTML = `
    <div class="skill-row fade-on-scroll" onclick="openModal('${skill.id}')" data-level="${skill.level}">
      <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
      <div class="skill-info">
        <span>${skill.name}</span>
        <div class="gauge"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', rowHTML);

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
  modalContainer.insertAdjacentHTML('beforeend', modalHTML);
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

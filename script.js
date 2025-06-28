// 1. DOM 요소 선택
const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

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
window.addEventListener('resize', () => {
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
  mainImg.addEventListener('click', () => {
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
  if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // 모달 바깥 클릭 이벤트 추가
      modal.addEventListener('click', function(event) {
          if (event.target === modal) {
              closeModal(modalId);
          }
      });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.classList.add('hidden');
      setTimeout(() => {
          modal.style.display = 'none';
      }, 250);
      document.body.style.overflow = 'auto';
  }
}

// 6. 포트폴리오 필터링 및 애니메이션
function filterPortfolio(category) {
  const grid = document.querySelector('.portfolio-grid');
  const items = document.getElementsByClassName('portfolio-item');
  if (!grid || items.length === 0) return;
  grid.classList.add('animate-grid');
  
  Array.from(items).forEach((item, index) => {
    const shouldShow = category === 'all' || item.classList.contains(category);
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
  item.style.display = 'block';
  item.classList.add('fade-hidden');
  setTimeout(() => {
    item.classList.remove('fade-hidden');
  }, index * 100);
}

function hideItem(item) {
  item.classList.add('fade-hidden');
  setTimeout(() => {
    item.style.display = 'none';
  }, 300);
}

// 8. 접근성 관련
function updateAccessibility(category) {
  const buttons = document.querySelectorAll('.portfolio-categories button');
  if (buttons.length === 0) return;
  buttons.forEach(button => {
    const isSelected = button.textContent.toLowerCase().includes(category) || 
                      (category === 'all' && button.textContent === '전체');
    button.setAttribute('aria-pressed', isSelected);
    button.setAttribute('aria-label', 
      `${button.textContent} 카테고리 ${isSelected ? '선택됨' : ''}`);
  });
}

// 10. 모달 외부 클릭 처리
window.onclick = function(event) {
  const modals = document.getElementsByClassName('modal');
  for (let i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].style.display = 'none';
    }
  }
}

function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

function toggleMediaPlayback(section) {
  const media = section.querySelector('video, audio');
  if (media) {
    if (media.paused) {
      media.play();
    } else {
      media.pause();
    }
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initScrollAnimations();
  initWipeLinks();
});

function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

function initWipeLinks() {
  const links = document.querySelectorAll('.wipe-link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.href;
      startWipe(() => {
        window.location.href = href;
      });
    });
  });
}

function startWipe(callback) {
  const overlay = document.querySelector('.wipe-overlay');
  if (!overlay) {
    callback();
    return;
  }
  overlay.classList.add('active');
  setTimeout(callback, 600);
}

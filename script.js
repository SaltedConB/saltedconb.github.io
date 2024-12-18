// 1. DOM 요소 선택
const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// 2. 상태 변수
let isPaused = false;

// 3. 이벤트 리스너
// 3.1 스크롤 이벤트
window.addEventListener('scroll', () => {
  requestAnimationFrame(scrollCheck);
  document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
});
});
function scrollCheck() {
  const browserScrollY = window.scrollY || window.pageYOffset;
  headerEl.classList.toggle("active", browserScrollY > 0);
}

// 3.2 리사이즈 이벤트
window.addEventListener('resize', () => {
  const windowWidth = window.innerWidth;
  const fontSize = windowWidth / 20;
  const buttonSize = windowWidth / 10;

  navButtonEl.style.fontSize = `${fontSize}px`;
  navButtonEl.style.width = `${buttonSize}px`;
  navButtonEl.style.height = `${buttonSize}px`;
});

// 3.3 이미지 관련 이벤트
mainImg.addEventListener('click', () => {
  isPaused = !isPaused;
  mainImg.classList.toggle("paused", isPaused);
});

// 4. 애니메이션 효과
// 4.1 이미지 페이드 효과
setInterval(() => {
  if (!isPaused) {
    mainImg.classList.toggle("fade");
  }
}, 100);

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
  const items = document.getElementsByClassName('portfolio-item');
  const grid = document.querySelector('.portfolio-grid');
  grid.classList.add('animate-grid');
  
  Array.from(items).forEach((item, index) => {
    setTimeout(() => {
      const shouldShow = category === 'all' || item.classList.contains(category);
      item.style.display = shouldShow ? 'block' : 'none';
      
      if (shouldShow) {
        animateItem(item, index);
      } else {
        fadeOutItem(item);
      }
    }, 50);
  });
  
  updateAccessibility(category);
}

// 7. 아이템 애니메이션 함수
function animateItem(item, index) {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  }, index * 100);
}

function fadeOutItem(item) {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    item.style.display = 'none';
  }, 300);
}

// 8. 접근성 관련
function updateAccessibility(category) {
  const buttons = document.querySelectorAll('.portfolio-categories button');
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initHamburgerMenu);


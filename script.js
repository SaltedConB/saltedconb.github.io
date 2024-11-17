// DOM 요소 선택
const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

// 상태 변수
let isPaused = false;

// 스크롤 이벤트 처리
window.addEventListener('scroll', () => {
  requestAnimationFrame(scrollCheck);
});

function scrollCheck() {
  const browserScrollY = window.scrollY || window.pageYOffset;
  headerEl.classList.toggle("active", browserScrollY > 0);
}

// 리사이즈 이벤트 처리
window.addEventListener('resize', () => {
  const windowWidth = window.innerWidth;
  const fontSize = windowWidth / 20;
  const buttonSize = windowWidth / 10;

  navButtonEl.style.fontSize = `${fontSize}px`;
  navButtonEl.style.width = `${buttonSize}px`;
  navButtonEl.style.height = `${buttonSize}px`;
});

// 이미지 클릭 이벤트 처리
mainImg.addEventListener('click', () => {
  isPaused = !isPaused;
  mainImg.classList.toggle("paused", isPaused);
});

// 이미지 페이드 효과
setInterval(() => {
  if (!isPaused) {
    mainImg.classList.toggle("fade");
  }
}, 100);

// 모달 관련 함수들
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  fadeElement(modal, 0, 1, 25);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  fadeElement(modal, 1, 0, 5, () => {
    modal.style.display = "none";
  });
}

// 페이드 효과 유틸리티 함수
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

// 포트폴리오 필터링
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

// 아이템 애니메이션 함수들
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

// 접근성 업데이트
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

// 햄버거 메뉴 처리
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // 메뉴 항목 클릭시 메뉴 닫기
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});

          // 모달 외부 클릭 시 닫기 이벤트 추가
          window.onclick = function(event) {
          const modals = document.getElementsByClassName('modal');
          for (let i = 0; i < modals.length; i++) {
              if (event.target == modals[i]) {
              modals[i].style.display = 'none';
              }
          }
          }
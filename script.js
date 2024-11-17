// DOM 요소 선택
const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
let isPaused = false;

// 스크롤 이벤트 처리
window.addEventListener('scroll', function() {
  requestAnimationFrame(scrollCheck);
});

// 스크롤 위치에 따른 헤더 스타일 변경
function scrollCheck() {
  let browserScrollY = window.scrollY || window.pageYOffset;
  headerEl.classList.toggle("active", browserScrollY > 0);
}

// 반응형 디자인을 위한 윈도우 크기 변경 이벤트 처리
window.addEventListener('resize', function() {
  const windowWidth = window.innerWidth;
  const fontSize = windowWidth / 20;    // 화면 너비에 따른 폰트 크기 조절
  const buttonSize = windowWidth / 10;   // 화면 너비에 따른 버튼 크기 조절

  navButtonEl.style.fontSize = `${fontSize}px`;
  navButtonEl.style.width = `${buttonSize}px`;
  navButtonEl.style.height = `${buttonSize}px`;
});

// 메인 이미지 클릭 이벤트 처리 (페이드 효과 일시정지)
mainImg.addEventListener('click', function() {
  isPaused = !isPaused;
  mainImg.classList.toggle("paused", isPaused);
});

// 메인 이미지 자동 페이드 효과
setInterval(function() {
  if (!isPaused) {
    mainImg.classList.toggle("fade");
  }
}, 100);

// 모달 열기 함수 - 페이드인 효과 포함
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  modal.style.opacity = 0;
  
  let opacity = 0;
  const fadeIn = setInterval(function() {
    if (opacity >= 1) {
      clearInterval(fadeIn);
    } else {
      opacity += 0.1;
      modal.style.opacity = opacity;
    }
  }, 25);  // 페이드인 속도: 25ms
}

// 모달 닫기 함수 - 페이드아웃 효과 포함
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  let opacity = 1;
  
  const fadeOut = setInterval(function() {
    if (opacity <= 0) {
      clearInterval(fadeOut);
      modal.style.display = "none";
    } else {
      opacity -= 0.1;
      modal.style.opacity = opacity;
    }
  }, 5);  // 페이드아웃 속도: 5ms
}

// 모달 외부 클릭 시 닫기 처리
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      closeModal(modal.id);
    }
  });
}

// 포트폴리오 필터�� 함수
function filterPortfolio(category) {
  const grid = document.querySelector('.portfolio-grid');
  const items = document.getElementsByClassName('portfolio-item');
  const itemsArray = Array.from(items);
  
  // 초기 상태 설정
  itemsArray.forEach(item => {
    item.style.transition = 'all 0.5s ease-out';
    item.style.position = 'relative';
    item.style.display = 'block';
  });

  // 아이템 분류
  const selectedItems = itemsArray.filter(item => 
    category === 'all' || item.classList.contains(category)
  );
  const unselectedItems = itemsArray.filter(item => 
    category !== 'all' && !item.classList.contains(category)
  );

  // 선택되지 않은 아이템 페이드아웃
  unselectedItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8) translateY(20px)';
    
    setTimeout(() => {
      item.style.display = 'none';
    }, 500);
  });

  // 선택된 아이템 페이드인
  setTimeout(() => {
    selectedItems.forEach((item, index) => {
      item.style.display = 'block';
      
      // 각 아이템마다 시차를 두어 순차적으로 나타나게 함
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
      }, index * 100);
    });
  }, 300);
}


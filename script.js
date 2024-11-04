const headerEl = document.querySelector("header");
const navButtonEl = document.querySelector(".nav-button");
const mainImg = document.querySelector(".main-img");
let isPaused = false;

window.addEventListener('scroll', function() {
  requestAnimationFrame(scrollCheck);
});

function scrollCheck() {
  let browserScrollY = window.scrollY || window.pageYOffset;
  headerEl.classList.toggle("active", browserScrollY > 0);
}

window.addEventListener('resize', function() {
  const windowWidth = window.innerWidth;
  const fontSize = windowWidth / 20; // Adjust the value as needed
  const buttonSize = windowWidth / 10; // Adjust the value as needed

  navButtonEl.style.fontSize = `${fontSize}px`;
  navButtonEl.style.width = `${buttonSize}px`;
  navButtonEl.style.height = `${buttonSize}px`;
});

mainImg.addEventListener('click', function() {
  isPaused = !isPaused;
  mainImg.classList.toggle("paused", isPaused);
});

setInterval(function() {
  if (!isPaused) {
    mainImg.classList.toggle("fade");
  }
}, 100);

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
  }, 25); // 이걸로 페이드인 속도 조절하면 됨
}

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
  }, 5); // 이걸로 페이드아웃 속도 조절하면 됨
}

window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      closeModal(modal.id);
    }
  });
}

function filterPortfolio(category) {
  var items = document.getElementsByClassName('portfolio-item');
  for (var i = 0; i < items.length; i++) {
      if (category === 'all' || items[i].classList.contains(category)) {
          items[i].style.transition = 'opacity 0.5s ease-out';
          items[i].style.opacity = 1;
          setTimeout(() => {
              items[i].style.display = 'block';
          }, 500); // Match the transition duration
      } else {
          items[i].style.transition = 'opacity 0.5s ease-out';
          items[i].style.opacity = 0;
          setTimeout(() => {
              items[i].style.display = 'none';
          }, 500); // Match the transition duration
      }
  }
}


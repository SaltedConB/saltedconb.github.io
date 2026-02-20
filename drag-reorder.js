/**
 * DragReorder — Works 포트폴리오 그리드 드래그 재배치 시스템
 * - 2초 롱프레스 후 드래그 모드 활성화
 * - 터치/마우스 모두 지원
 * - localStorage에 순서 저장
 * - HapticEngine 연동
 */
const DragReorder = (() => {
    const LONG_PRESS_DURATION = 2000; // 2초
    const PROGRESS_INTERVAL = 50;    // 프로그레스 업데이트 간격
    const STORAGE_KEY = 'portfolio-order';

    let grid = null;
    let items = [];
    let dragItem = null;
    let dragClone = null;
    let longPressTimer = null;
    let progressTimer = null;
    let progressRing = null;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    function init() {
        grid = document.querySelector('.portfolio-grid');
        if (!grid) return;

        restoreOrder();
        items = Array.from(grid.querySelectorAll('.portfolio-item'));

        // 터치 이벤트
        grid.addEventListener('pointerdown', onPointerDown, { passive: false });
        document.addEventListener('pointermove', onPointerMove, { passive: false });
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);

        // 프로그레스 링 요소 생성
        progressRing = document.createElement('div');
        progressRing.className = 'drag-progress-ring';
        progressRing.innerHTML = `
      <svg viewBox="0 0 52 52">
        <circle class="ring-bg" cx="26" cy="26" r="23" />
        <circle class="ring-fill" cx="26" cy="26" r="23" />
      </svg>
    `;
        document.body.appendChild(progressRing);

        injectStyles();
    }

    function injectStyles() {
        if (document.getElementById('drag-reorder-styles')) return;
        const style = document.createElement('style');
        style.id = 'drag-reorder-styles';
        style.textContent = `
      .drag-progress-ring {
        position: fixed;
        width: 52px;
        height: 52px;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .drag-progress-ring.visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      .drag-progress-ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        background: transparent !important;
      }
      .drag-progress-ring circle {
        fill: none;
        stroke-width: 3;
        background: transparent !important;
      }
      .ring-bg {
        stroke: rgba(233, 233, 233, 0.15);
      }
      .ring-fill {
        stroke: #80CA4E;
        stroke-dasharray: 144.51;
        stroke-dashoffset: 144.51;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.05s linear;
      }

      .portfolio-item.drag-source {
        opacity: 0.3;
        transform: scale(0.95);
        transition: opacity 0.2s, transform 0.2s;
      }

      .portfolio-item.drag-over {
        transform: scale(1.03);
        box-shadow: 0 0 0 2px #80CA4E, 0 8px 25px rgba(128, 202, 78, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .drag-clone {
        position: fixed;
        z-index: 10001;
        pointer-events: none;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(128, 202, 78, 0.3);
        transform: scale(1.08);
        opacity: 0.92;
        transition: transform 0.2s ease;
        will-change: left, top;
      }

      .drag-clone img {
        pointer-events: none;
      }

      .portfolio-item {
        transition: transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease;
      }

      .portfolio-grid.drag-active {
        user-select: none;
        -webkit-user-select: none;
      }

      /* 리오더 모드 인디케이터 */
      .drag-mode-indicator {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(128, 202, 78, 0.15);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(128, 202, 78, 0.3);
        border-radius: 50px;
        padding: 10px 24px;
        color: #80CA4E;
        font-size: 11pt;
        z-index: 10002;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .drag-mode-indicator.visible {
        opacity: 1;
      }
    `;
        document.head.appendChild(style);
    }

    // ---- 이벤트 핸들러 ----

    function onPointerDown(e) {
        const item = e.target.closest('.portfolio-item');
        if (!item || isDragging) return;

        // 링크/버튼 클릭이면 무시
        if (e.target.closest('a, button')) return;

        const rect = item.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        dragItem = item;

        // 프로그레스 링 위치 표시
        progressRing.style.left = e.clientX + 'px';
        progressRing.style.top = e.clientY + 'px';

        // 롱프레스 타이머 시작
        let elapsed = 0;
        const ringFill = progressRing.querySelector('.ring-fill');
        const circumference = 144.51; // 2 * PI * 23

        progressTimer = setInterval(() => {
            elapsed += PROGRESS_INTERVAL;
            const progress = Math.min(elapsed / LONG_PRESS_DURATION, 1);

            // 프로그레스 링 업데이트
            const dashOffset = circumference * (1 - progress);
            ringFill.style.strokeDashoffset = dashOffset;


        }, PROGRESS_INTERVAL);

        // 프로그레스 링 표시
        setTimeout(() => {
            if (dragItem === item) {
                progressRing.classList.add('visible');
            }
        }, 200);

        longPressTimer = setTimeout(() => {
            activateDrag(item, e);
        }, LONG_PRESS_DURATION);

        // 포인터 캡처
        if (e.target.setPointerCapture) {
            // Don't capture yet — let move check threshold
        }
    }

    function onPointerMove(e) {
        if (!dragItem) return;

        // 롱프레스 중 이동하면 취소
        if (!isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 15) {
                cancelLongPress();
                return;
            }
            // 프로그레스 링 위치 업데이트
            progressRing.style.left = e.clientX + 'px';
            progressRing.style.top = e.clientY + 'px';
            return;
        }

        // 드래그 중
        e.preventDefault();
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        dragClone.style.left = x + 'px';
        dragClone.style.top = y + 'px';

        // 드래그 대상 찾기
        updateDropTarget(e.clientX, e.clientY);
    }

    function onPointerUp(e) {
        if (isDragging) {
            finishDrag(e);
        }
        cancelLongPress();
    }

    // ---- 드래그 활성화 ----

    function activateDrag(item, e) {
        cancelLongPress();
        isDragging = true;



        // 드래그 클론 생성
        const rect = item.getBoundingClientRect();
        dragClone = item.cloneNode(true);
        dragClone.className = 'drag-clone';
        dragClone.style.width = rect.width + 'px';
        dragClone.style.height = rect.height + 'px';
        dragClone.style.left = (e.clientX - offsetX) + 'px';
        dragClone.style.top = (e.clientY - offsetY) + 'px';
        document.body.appendChild(dragClone);

        // 원본 반투명 처리
        item.classList.add('drag-source');
        grid.classList.add('drag-active');

        // 하단 인디케이터 표시
        showIndicator('드래그하여 순서를 변경하세요');


    }

    function updateDropTarget(x, y) {
        // 현재 드래그 대상 클래스 초기화
        items.forEach(i => i.classList.remove('drag-over'));

        // 드래그 위치의 포트폴리오 아이템 찾기
        const elements = document.elementsFromPoint(x, y);
        const target = elements.find(el =>
            el.classList.contains('portfolio-item') && el !== dragItem
        );

        if (target) {
            target.classList.add('drag-over');
        }
    }

    function finishDrag(e) {
        isDragging = false;



        // 드롭 위치 아이템 찾기
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const target = elements.find(el =>
            el.classList.contains('portfolio-item') && el !== dragItem
        );

        if (target && dragItem) {
            // DOM 순서 교환
            swapItems(dragItem, target);


        }

        // 정리
        items.forEach(i => i.classList.remove('drag-over'));
        if (dragItem) dragItem.classList.remove('drag-source');
        if (dragClone) dragClone.remove();
        grid.classList.remove('drag-active');
        dragClone = null;
        dragItem = null;

        hideIndicator();

        // 순서 저장
        saveOrder();

        // 아이템 목록 갱신
        items = Array.from(grid.querySelectorAll('.portfolio-item'));
    }

    function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        progressRing.classList.remove('visible');
        // 프로그레스 링 리셋
        const ringFill = progressRing.querySelector('.ring-fill');
        if (ringFill) ringFill.style.strokeDashoffset = '144.51';

        if (!isDragging) {
            dragItem = null;
        }
    }

    // ---- DOM 교환 ----

    function swapItems(a, b) {
        const parent = a.parentNode;
        const aNext = a.nextSibling;
        const bNext = b.nextSibling;

        if (aNext === b) {
            parent.insertBefore(b, a);
        } else if (bNext === a) {
            parent.insertBefore(a, b);
        } else {
            parent.insertBefore(a, bNext);
            parent.insertBefore(b, aNext);
        }
    }

    // ---- 순서 저장/복원 ----

    function saveOrder() {
        const order = Array.from(grid.querySelectorAll('.portfolio-item'))
            .map(item => {
                // 이미지 src 또는 data-id 기반 식별
                const img = item.querySelector('img');
                const video = item.querySelector('video source');
                return img ? img.getAttribute('src') : (video ? video.getAttribute('src') : '');
            });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
        } catch (e) {
            // localStorage 비활성 시 무시
        }
    }

    function restoreOrder() {
        if (!grid) return;
        let order;
        try {
            order = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            return;
        }
        if (!order || !Array.isArray(order)) return;

        const currentItems = Array.from(grid.querySelectorAll('.portfolio-item'));
        const mapped = order
            .map(src => currentItems.find(item => {
                const img = item.querySelector('img');
                const video = item.querySelector('video source');
                const itemSrc = img ? img.getAttribute('src') : (video ? video.getAttribute('src') : '');
                return itemSrc === src;
            }))
            .filter(Boolean);

        // 복원: 저장 순서대로 appendchild
        if (mapped.length === currentItems.length) {
            mapped.forEach(item => grid.appendChild(item));
        }
    }

    // ---- UI 인디케이터 ----

    let indicator = null;

    function showIndicator(text) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'drag-mode-indicator';
            document.body.appendChild(indicator);
        }
        indicator.textContent = text;
        requestAnimationFrame(() => indicator.classList.add('visible'));
    }

    function hideIndicator() {
        if (indicator) {
            indicator.classList.remove('visible');
        }
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    DragReorder.init();
});

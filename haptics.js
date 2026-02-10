/**
 * HapticEngine — 터치 햅틱 피드백 시스템
 * - navigator.vibrate() 지원 시 진동 사용 (Android Chrome 등)
 * - iOS 등 미지원 시 시각적 피드백 폴백
 * - 레퍼런스 기기: iPhone 11
 */
const HapticEngine = (() => {
    const supportsVibrate = 'vibrate' in navigator;

    // ---- 시각적 폴백 (iOS 등) ----
    function visualPulse(el, intensity = 'medium') {
        if (!el) return;
        const scale = intensity === 'light' ? 0.97
            : intensity === 'heavy' ? 0.92
                : 0.95;
        el.style.transition = 'transform 80ms ease-out';
        el.style.transform = `scale(${scale})`;
        setTimeout(() => {
            el.style.transform = 'scale(1)';
        }, 80);
    }

    // ---- 진동 패턴 ----

    /**
     * 터치 시작 — 서서히 진동 증가
     * @param {HTMLElement} [el] 폴백용 요소
     */
    function touchStart(el) {
        if (supportsVibrate) {
            navigator.vibrate([5, 40, 10, 30, 18, 20, 28]);
        } else {
            visualPulse(el, 'light');
        }
    }

    /**
     * 선택/확인 — 짧고 강한 단발 진동 (붕!)
     * @param {HTMLElement} [el] 폴백용 요소
     */
    function select(el) {
        if (supportsVibrate) {
            navigator.vibrate(50);
        } else {
            visualPulse(el, 'heavy');
        }
    }

    /**
     * 드래그 중 — 스크롤 느낌의 반복 짧은 진동 (드르르륵)
     * requestAnimationFrame 기반, stop 함수 리턴
     * @param {HTMLElement} [el] 폴백용 요소
     * @returns {{ stop: Function }}
     */
    function dragStart(el) {
        let running = true;
        let interval;

        if (supportsVibrate) {
            interval = setInterval(() => {
                if (!running) return;
                navigator.vibrate(12);
            }, 90);
        } else if (el) {
            // iOS 폴백: 미세한 좌우 흔들림
            let tick = 0;
            interval = setInterval(() => {
                if (!running) return;
                const offset = (tick % 2 === 0) ? 1 : -1;
                el.style.transform = `translateX(${offset}px)`;
                tick++;
            }, 70);
        }

        return {
            stop() {
                running = false;
                if (interval) clearInterval(interval);
                if (el) el.style.transform = '';
            }
        };
    }

    /**
     * 롱프레스 진행 중 — 점진적 세기 증가
     * @param {number} progress 0..1
     * @param {HTMLElement} [el]
     */
    function longPressProgress(progress, el) {
        if (supportsVibrate) {
            const duration = Math.round(5 + progress * 30);
            navigator.vibrate(duration);
        } else if (el) {
            const scale = 1 - progress * 0.04;
            el.style.transform = `scale(${scale})`;
        }
    }

    /**
     * 롱프레스 확정 — 강한 단일 진동
     * @param {HTMLElement} [el]
     */
    function longPressConfirm(el) {
        if (supportsVibrate) {
            navigator.vibrate([60, 30, 40]);
        } else {
            visualPulse(el, 'heavy');
        }
    }

    /**
     * 모든 인터랙티브 요소에 기본 터치 햅틱 연결
     */
    function attachGlobal() {
        // 버튼, 링크, 클릭 가능 요소
        document.addEventListener('pointerdown', (e) => {
            const interactive = e.target.closest(
                'button, a, .skill-row, .portfolio-item, .skills-list-detail, .nav-button, [onclick]'
            );
            if (interactive) {
                touchStart(interactive);
            }
        }, { passive: true });

        // 클릭/탭 확정 시
        document.addEventListener('pointerup', (e) => {
            const interactive = e.target.closest(
                'button, a, .skill-row, .portfolio-item, .skills-list-detail, .nav-button, [onclick]'
            );
            if (interactive) {
                select(interactive);
            }
        }, { passive: true });
    }

    return {
        touchStart,
        select,
        dragStart,
        longPressProgress,
        longPressConfirm,
        attachGlobal,
        supportsVibrate,
    };
})();

// 페이지 로드 시 글로벌 햅틱 연결
document.addEventListener('DOMContentLoaded', () => {
    HapticEngine.attachGlobal();
});

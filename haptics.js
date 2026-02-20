/**
 * HapticEngine — 터치 햅틱 피드백 시스템
 * - 강약조절: 햄버거메뉴(강) > 카테고리(중) > 페이지 내 버튼/모달(약)
 * - 불필요한 기능(드래그, 롱프레스 등) 제거 및 터치 직관성 강화
 */
const HapticEngine = (() => {
    const supportsVibrate = 'vibrate' in navigator;

    // ---- 시각적 폴백 (iOS 등) ----
    function visualPulse(el, intensity) {
        if (!el) return;
        const scale = intensity === 'light' ? 0.97
            : intensity === 'medium' ? 0.94
                : 0.90; // heavy
        el.style.transition = 'transform 80ms ease-out';
        el.style.transform = `scale(${scale})`;
        setTimeout(() => {
            el.style.transform = 'scale(1)';
        }, 80);
    }

    // ---- 단일 햅틱 트리거 ----
    /**
     * @param {HTMLElement} el 
     * @param {'light'|'medium'|'heavy'} intensity 
     */
    function trigger(el, intensity = 'light') {
        if (supportsVibrate) {
            // Android 진동 강도 조절 (동작 길이로 세기 체감)
            if (intensity === 'heavy') navigator.vibrate(30);
            else if (intensity === 'medium') navigator.vibrate(15);
            else navigator.vibrate(5);
        } else {
            visualPulse(el, intensity);
        }
    }

    /**
     * 모든 인터랙티브 요소에 터치 햅틱 연결
     */
    function attachGlobal() {
        document.addEventListener('pointerdown', (e) => {
            // 1. 햄버거 메뉴 (강)
            const hamburger = e.target.closest('.hamburger');
            if (hamburger) {
                return trigger(hamburger, 'heavy');
            }

            // 2. 카테고리 (중)
            const categoryBtn = e.target.closest('.portfolio-categories button');
            if (categoryBtn) {
                return trigger(categoryBtn, 'medium');
            }

            // 3. 페이지 내 각종 버튼, 모달 닫기, 포트폴리오 아이템, 링크 등 (약)
            const interactive = e.target.closest(
                'button, a, .skill-row, .portfolio-item, .skills-list-detail, .close, [onclick]'
            );
            if (interactive) {
                return trigger(interactive, 'light');
            }
        }, { passive: true });
    }

    return {
        trigger,
        attachGlobal,
        supportsVibrate,
    };
})();

// 페이지 로드 시 글로벌 햅틱 연결
document.addEventListener('DOMContentLoaded', () => {
    HapticEngine.attachGlobal();
});

/**
 * GamepadNavigator — 게임패드를 이용한 웹 탐색 시스템
 *
 * 기능:
 * - 왼쪽 스틱/D-pad: 페이지 스크롤 + 포커스 이동
 * - A 버튼(0): 포커스된 요소 클릭
 * - B 버튼(1): 모달 닫기 / 뒤로가기
 * - 오른쪽 스틱: 랜딩 페이지 큐브 회전
 * - 햅틱: 버튼 입력/포커스 변경 시 진동 피드백
 * - 시각적 피드백: 게임패드 포커스 링 표시
 */
const GamepadNavigator = (() => {
    let animFrameId = null;
    let connected = false;
    let focusableElements = [];
    let currentFocusIndex = -1;
    let prevButtons = [];
    let scrollSpeed = 0;

    // 입력 쿨다운 (포커스 이동 반복 방지)
    let lastNavTime = 0;
    const NAV_COOLDOWN = 200; // ms

    // ---- 포커서블 요소 수집 ----
    function collectFocusables() {
        focusableElements = Array.from(document.querySelectorAll(
            'a[href], button:not(.hamburger), .portfolio-item, .skill-row, [tabindex="0"]'
        )).filter(el => {
            // 숨겨진 요소 제외
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });
    }

    // ---- 포커스 링 ----
    function setFocus(index) {
        // 이전 포커스 제거
        if (currentFocusIndex >= 0 && focusableElements[currentFocusIndex]) {
            focusableElements[currentFocusIndex].classList.remove('gamepad-focus');
        }

        currentFocusIndex = index;

        if (index >= 0 && focusableElements[index]) {
            const el = focusableElements[index];
            el.classList.add('gamepad-focus');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            triggerHaptic('light');
        }
    }

    // ---- 포커스 이동 ----
    function moveFocus(direction) {
        const now = performance.now();
        if (now - lastNavTime < NAV_COOLDOWN) return;
        lastNavTime = now;

        collectFocusables();
        if (focusableElements.length === 0) return;

        let newIndex = currentFocusIndex + direction;
        if (newIndex < 0) newIndex = focusableElements.length - 1;
        if (newIndex >= focusableElements.length) newIndex = 0;

        setFocus(newIndex);
    }

    // ---- 포커스된 요소 클릭 ----
    function activateFocus() {
        if (currentFocusIndex >= 0 && focusableElements[currentFocusIndex]) {
            const el = focusableElements[currentFocusIndex];
            triggerHaptic('medium');
            el.click();
        }
    }

    // ---- 뒤로가기 / 모달 닫기 ----
    function goBack() {
        triggerHaptic('medium');
        // 열린 모달이 있으면 닫기
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal && typeof closeModal === 'function') {
            closeModal(openModal.id);
            return;
        }
        // 모달이 없으면 뒤로가기
        window.history.back();
    }

    // ---- 햅틱 피드백 ----
    function triggerHaptic(intensity = 'light') {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gp of gamepads) {
            if (!gp) continue;

            // Dual-Rumble 지원 (Chrome)
            if (gp.vibrationActuator) {
                const duration = intensity === 'heavy' ? 100 : intensity === 'medium' ? 50 : 20;
                const strong = intensity === 'heavy' ? 0.8 : intensity === 'medium' ? 0.4 : 0.1;
                const weak = intensity === 'heavy' ? 1.0 : intensity === 'medium' ? 0.6 : 0.2;

                try {
                    gp.vibrationActuator.playEffect('dual-rumble', {
                        startDelay: 0,
                        duration: duration,
                        weakMagnitude: weak,
                        strongMagnitude: strong
                    });
                } catch (e) {
                    // 일부 브라우저에서 미지원
                }
            }

            // hapticActuators 지원 (Firefox 등)
            if (gp.hapticActuators && gp.hapticActuators.length > 0) {
                const value = intensity === 'heavy' ? 1.0 : intensity === 'medium' ? 0.5 : 0.2;
                try {
                    gp.hapticActuators[0].pulse(value, intensity === 'heavy' ? 100 : 40);
                } catch (e) {
                    // 미지원 시 무시
                }
            }
        }
    }

    // ---- 데드존 적용 ----
    function applyDeadzone(value, threshold = 0.25) {
        if (Math.abs(value) < threshold) return 0;
        return value;
    }

    // ---- 버튼 눌림 감지 (엣지 트리거) ----
    function isButtonPressed(gamepad, index) {
        const current = gamepad.buttons[index] && gamepad.buttons[index].pressed;
        const prev = prevButtons[index] || false;
        return current && !prev;
    }

    // ---- 메인 폴링 루프 ----
    function pollGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let activeGamepad = null;

        for (const gp of gamepads) {
            if (gp) { activeGamepad = gp; break; }
        }

        if (!activeGamepad) {
            animFrameId = requestAnimationFrame(pollGamepad);
            return;
        }

        // 왼쪽 스틱 (axes 0, 1) 또는 D-pad (buttons 12-15)
        const lx = applyDeadzone(activeGamepad.axes[0] || 0);
        const ly = applyDeadzone(activeGamepad.axes[1] || 0);

        // D-pad
        const dpadUp = activeGamepad.buttons[12] && activeGamepad.buttons[12].pressed;
        const dpadDown = activeGamepad.buttons[13] && activeGamepad.buttons[13].pressed;
        const dpadLeft = activeGamepad.buttons[14] && activeGamepad.buttons[14].pressed;
        const dpadRight = activeGamepad.buttons[15] && activeGamepad.buttons[15].pressed;

        // 스크롤 (왼쪽 스틱 Y축 또는 D-pad 상/하)
        let scrollY = ly;
        if (dpadUp) scrollY = -1;
        if (dpadDown) scrollY = 1;

        if (scrollY !== 0) {
            window.scrollBy({ top: scrollY * 12, behavior: 'auto' });
        }

        // 포커스 이동 (D-pad 좌/우 또는 상/하 — 엣지 트리거)
        if (isButtonPressed(activeGamepad, 13) || (ly > 0.7 && !prevButtons._lyDown)) {
            moveFocus(1);
        }
        if (isButtonPressed(activeGamepad, 12) || (ly < -0.7 && !prevButtons._lyUp)) {
            moveFocus(-1);
        }

        // A 버튼 (0) — 클릭
        if (isButtonPressed(activeGamepad, 0)) {
            activateFocus();
        }

        // B 버튼 (1) — 뒤로가기/모달 닫기
        if (isButtonPressed(activeGamepad, 1)) {
            goBack();
        }

        // 오른쪽 스틱 (axes 2, 3) — 큐브 회전
        const rx = applyDeadzone(activeGamepad.axes[2] || 0, 0.15);
        const ry = applyDeadzone(activeGamepad.axes[3] || 0, 0.15);

        if ((rx !== 0 || ry !== 0) && window._cubeTargetRotation) {
            window._cubeTargetRotation.y += rx * 0.03;
            window._cubeTargetRotation.x += ry * 0.03;
            window._cubeTargetRotation._dirty = true;
        }

        // 이전 버튼 상태 저장
        prevButtons = activeGamepad.buttons.map(b => b.pressed);
        prevButtons._lyDown = ly > 0.7;
        prevButtons._lyUp = ly < -0.7;

        animFrameId = requestAnimationFrame(pollGamepad);
    }

    // ---- 연결/해제 이벤트 ----
    function init() {
        window.addEventListener('gamepadconnected', (e) => {
            connected = true;
            console.log(`🎮 게임패드 연결: ${e.gamepad.id}`);
            collectFocusables();
            if (!animFrameId) pollGamepad();
            triggerHaptic('medium');
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log(`🎮 게임패드 해제: ${e.gamepad.id}`);
            // 포커스 링 제거
            if (currentFocusIndex >= 0 && focusableElements[currentFocusIndex]) {
                focusableElements[currentFocusIndex].classList.remove('gamepad-focus');
            }
            currentFocusIndex = -1;

            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            connected = gamepads.some(gp => gp !== null);

            if (!connected && animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        });

        // 페이지 로드 시 이미 연결된 게임패드 확인
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gp of gamepads) {
            if (gp) {
                connected = true;
                collectFocusables();
                pollGamepad();
                break;
            }
        }
    }

    return {
        init,
        triggerHaptic,
    };
})();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    GamepadNavigator.init();
});

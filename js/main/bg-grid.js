/**
 * bg-grid.js
 * 배경 캔버스에 미세한 점 그리드를 그립니다.
 * 마우스 커서가 가까워지면 점이 줄어들고 사라지는
 * "중심시야(foveated)" 효과를 구현합니다.
 */

class FoveatedGrid {
    constructor() {
        this.canvas = document.getElementById('bg-grid-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.dots = [];

        // 설정값
        this.spacing = 10;
        this.baseRadius = 1.0;
        this.foveaRadius = 60; // 페더 범위 확장 (blindSpot 15px 유지)

        // 상태 변수
        this.mouse = { x: -1000, y: -1000 };
        this.width = 0;
        this.height = 0;
        this.themeColor = 'rgba(0,0,0,0.15)'; // 기본값

        // 초기화
        this.resize();
        this.bindEvents();
        this.updateThemeColor();

        // 렌더 루프 시작
        requestAnimationFrame(() => this.render());
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // 마우스가 창 밖으로 나가면 멀리 이동
        document.addEventListener('mouseleave', () => {
            this.mouse = { x: -1000, y: -1000 };
        });

        // html 요소의 테마 변경 감지
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateThemeColor();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateThemeColor() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        // 다크 테마: 밝은 점, 라이트 테마: 어두운 점
        this.themeColor = isLight ? 'rgba(0, 0, 0, 0.13)' : 'rgba(255, 255, 255, 0.1)';
    }

    resize() {
        // 고해상도(HiDPI) 지원
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.initGrid();
    }

    initGrid() {
        this.dots = [];
        const cols = Math.ceil(this.width / this.spacing) + 1;
        const rows = Math.ceil(this.height / this.spacing) + 1;

        // 그리드 중앙 정렬 오프셋
        const offsetX = (this.width % this.spacing) / 2;
        const offsetY = (this.height % this.spacing) / 2;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.dots.push({
                    x: offsetX + x * this.spacing,
                    y: offsetY + y * this.spacing
                });
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.themeColor;

        // 3D 캔버스 영역 가져오기 (유리 큐브 뒤 점 페더링)
        const heroCanvas = document.getElementById('hero-canvas');
        let rect = null;
        if (heroCanvas) {
            rect = heroCanvas.getBoundingClientRect();
        }

        for (const dot of this.dots) {
            // 마우스까지 거리 계산
            const dx = dot.x - this.mouse.x;
            const dy = dot.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 거리 기반 크기 결정
            let sizeScale = 1;

            const blindSpot = 15; // 점이 완전히 사라지는 반경 (10 → 15로 변경됨)
            if (distance < blindSpot) {
                sizeScale = 0;
            } else if (distance < this.foveaRadius) {
                sizeScale = (distance - blindSpot) / (this.foveaRadius - blindSpot);
                sizeScale = sizeScale * sizeScale;
            }

            // 3D 캔버스 근처 페더링 (회피 영역)
            if (rect) {
                // 점에서 영역 중심까지 거리 계산
                const rectCenterX = rect.left + rect.width / 2;
                const rectCenterY = rect.top + rect.height / 2;

                // 캔버스 크기 기반 제외 반경 계산
                const exclusionRadius = Math.max(rect.width, rect.height) * 0.35;
                const featherZone = 150; // 전환(페더) 영역 너비

                const distToRect = Math.sqrt(Math.pow(dot.x - rectCenterX, 2) + Math.pow(dot.y - rectCenterY, 2));

                if (distToRect < exclusionRadius) {
                    // 3D 오브젝트 안쪽은 완전 숨김
                    sizeScale = 0;
                } else if (distToRect < exclusionRadius + featherZone) {
                    // 가장자리 부드러운 페더링
                    const featherFactor = (distToRect - exclusionRadius) / featherZone;
                    sizeScale = Math.min(sizeScale, featherFactor * featherFactor);
                }
            }

            const currentRadius = this.baseRadius * sizeScale;

            if (currentRadius > 0.1) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        requestAnimationFrame(() => this.render());
    }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    new FoveatedGrid();
});

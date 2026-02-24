/**
 * bg-grid.js
 * Draws a subtle dotted grid on a background canvas.
 * Implements a "foveated" effect where dots shrink and disappear 
 * when the mouse cursor gets close to them.
 */

class FoveatedGrid {
    constructor() {
        this.canvas = document.getElementById('bg-grid-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.dots = [];

        // Configuration
        this.spacing = 14;
        this.baseRadius = 1.0;
        this.foveaRadius = 30; // 롤백, 살짝 여유를 줌

        // State
        this.mouse = { x: -1000, y: -1000 };
        this.width = 0;
        this.height = 0;
        this.themeColor = 'rgba(0,0,0,0.15)'; // Default

        // Init
        this.resize();
        this.bindEvents();
        this.updateThemeColor();

        // Start Loop
        requestAnimationFrame(() => this.render());
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // When mouse leaves window, move it far away
        document.addEventListener('mouseleave', () => {
            this.mouse = { x: -1000, y: -1000 };
        });

        // Listen for theme changes on `html`
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
        // Dark theme: subtle light dots. Light theme: subtle dark dots.
        this.themeColor = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.15)';
    }

    resize() {
        // High DPI Support
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

        // Center the grid offset
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

        // Get 3D Canvas Rect to feather out dots behind the transparent glass cube
        const heroCanvas = document.getElementById('hero-canvas');
        let rect = null;
        if (heroCanvas) {
            rect = heroCanvas.getBoundingClientRect();
        }

        for (const dot of this.dots) {
            // Calculate distance to mouse
            const dx = dot.x - this.mouse.x;
            const dy = dot.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Determine size based on distance
            let sizeScale = 1;

            const blindSpot = 15; // Inner circle where dots completely vanish (Changed from 10 to 15)
            if (distance < blindSpot) {
                sizeScale = 0;
            } else if (distance < this.foveaRadius) {
                sizeScale = (distance - blindSpot) / (this.foveaRadius - blindSpot);
                sizeScale = sizeScale * sizeScale;
            }

            // Feathering near the 3D canvas (avoidance zone)
            if (rect) {
                // Find distance from dot to the bounding rect center
                const rectCenterX = rect.left + rect.width / 2;
                const rectCenterY = rect.top + rect.height / 2;

                // approximate an exclusion radius (covering the canvas height/width)
                const exclusionRadius = Math.max(rect.width, rect.height) * 0.35;
                const featherZone = 150; // Transition zone width

                const distToRect = Math.sqrt(Math.pow(dot.x - rectCenterX, 2) + Math.pow(dot.y - rectCenterY, 2));

                if (distToRect < exclusionRadius) {
                    // Completely hidden inside the core of the 3D object
                    sizeScale = 0;
                } else if (distToRect < exclusionRadius + featherZone) {
                    // Smooth feathering on the edges
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

// Initalize on load
document.addEventListener("DOMContentLoaded", () => {
    new FoveatedGrid();
});

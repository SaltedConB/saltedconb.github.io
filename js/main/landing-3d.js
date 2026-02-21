import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#hero-canvas');

if (canvas) {
    // Scene & Camera & Renderer setup
    const scene = new THREE.Scene();
    scene.background = null; // Will be set dynamically by theme observer

    const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 10;

    // Check if device is mobile using matchMedia or userAgent (basic check)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
        camera.position.z = 12; // move camera slightly back on mobile
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false, // Turn off alpha to rely on scene.background for accurate refraction
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Initial size
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    function resize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    window.addEventListener('resize', resize);

    // Setup environment for glass material reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // Additional Lighting to fix dark/murky appearance, especially for light mode
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Brighten ambient
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Reference to black material for texture swapping
    let blackMaterialRef = null;
    let whiteTextureRef = null;
    let blackTextureRef = null;

    // Watch for theme changes to adjust lighting, background, and textures
    const updateThemeSettings = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const rootStyle = getComputedStyle(document.documentElement);
        // Get CSS var --bg-main safely, fallback if not found yet
        let bgColor = rootStyle.getPropertyValue('--bg-main').trim();
        if (!bgColor || bgColor === '') {
            bgColor = theme === 'light' ? '#f2f2f5' : '#141414';
        }

        scene.background = new THREE.Color(bgColor);

        if (theme === 'light') {
            // Light mode: brighter lights, use original black texture
            ambientLight.intensity = 2.5;
            mainLight.intensity = 3.5;
            fillLight.intensity = 2.0;

            if (blackMaterialRef && blackTextureRef) {
                blackMaterialRef.map = blackTextureRef;
                blackMaterialRef.needsUpdate = true;
            }
        } else {
            // Dark mode: standard lights, use white texture for visibility
            ambientLight.intensity = 1.0;
            mainLight.intensity = 2.0;
            fillLight.intensity = 1.0;

            if (blackMaterialRef && whiteTextureRef) {
                blackMaterialRef.map = whiteTextureRef;
                blackMaterialRef.needsUpdate = true;
            }
        }
    };

    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateThemeSettings();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Load Textures
    const tl = new THREE.TextureLoader();
    const loadTex = (path, isColor = false) => {
        const tex = tl.load(path);
        tex.flipY = false;
        if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    };

    const cubeTex = {
        map: loadTex('./gltf/cubeColor.png', true),
        aoMap: loadTex('./gltf/cubeAmbient_Occlusion.png'),
        roughnessMap: loadTex('./gltf/cubeReflection.png'),
        transmissionMap: loadTex('./gltf/cubeTransparency.png')
    };

    const monotonTex = {
        map: loadTex('./gltf/monotonColor.png', true),
        aoMap: loadTex('./gltf/monotonAmbient_Occlusion.png')
    };

    const monotonWhiteTex = loadTex('./gltf/monotonColor_white.png', true);
    whiteTextureRef = monotonWhiteTex;
    blackTextureRef = monotonTex.map;

    const monotonDotTex = {
        map: loadTex('./gltf/monoton_dotColor.png', true),
        aoMap: loadTex('./gltf/monoton_dotAmbient_Occlusion.png')
    };

    // Load Model
    const loader = new GLTFLoader();
    let model;

    let targetRotationX = 0;
    let targetRotationY = 0;

    // For smooth lerping
    let currentRotationX = 0;
    let currentRotationY = 0;

    loader.load('./gltf/title.gltf', (gltf) => {
        model = gltf.scene;

        // Traverse and apply materials
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                if (child.material.name === 'glass') {
                    // Create realistic physical glass
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        // map: cubeTex.map removed to prevent opaque black issues
                        aoMap: cubeTex.aoMap,
                        roughnessMap: cubeTex.roughnessMap,
                        // transmissionMap: cubeTex.transmissionMap, // Causing opaque white when map is black
                        transmission: 1.0, // Base transmission
                        opacity: 1.0,
                        transparent: true,
                        roughness: 0.15, // Slightly softer glass
                        ior: 1.18, // Slightly higher IOR for more noticeable but natural refraction
                        depthWrite: true, // Let's enable depth write but we rely on order or lower IOR
                        thickness: 1.5, // Volume depth for refraction
                        attenuationDistance: 3.0, // Depth tinting behavior
                        attenuationColor: new THREE.Color(0xffffff),
                        dispersion: 3.0, // Increased chromatic aberration (prism effect) for realism without being overwhelming
                        envMapIntensity: 1.0,
                        side: THREE.DoubleSide
                    });
                } else if (child.material.name === 'black') {
                    // Store reference for theme swapping
                    blackMaterialRef = child.material;
                    child.material.color.setHex(0xffffff);

                    // The initial material setting will depend on the current theme 
                    // which is checked right after model loads or via updateThemeSettings()
                    child.material.map = monotonTex.map; // Default map
                    child.material.aoMap = monotonTex.aoMap;
                    child.material.roughness = 0.2; // Polished look
                    child.material.metalness = 0.8;
                    child.material.needsUpdate = true;
                } else if (child.material.name === 'green') {
                    child.material.color.setHex(0xffffff);
                    child.material.map = monotonDotTex.map;
                    child.material.aoMap = monotonDotTex.aoMap;
                    child.material.roughness = 0.2; // Polished look
                    child.material.metalness = 0.8;
                    child.material.needsUpdate = true;
                }
            }
        });

        // Auto center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        // 모바일 환경에서는 큐브 크기를 많이(약 1.8배) 키움
        const baseScale = isMobile ? 10.0 : 5.5;
        const scale = baseScale / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Let's wrap the model in a group so we can rotate the group around its center
        const group = new THREE.Group();
        group.add(model);
        scene.add(group);
        model = group; // Assign the parent group to be our reference model for rotations
        // Initialize theme settings now that model/materials are loaded
        updateThemeSettings();

        // Check for entrance animation
        if (!sessionStorage.getItem('heroAnimated')) {
            // First visit in this session
            canvas.classList.add('hero-animate-in');

            // Allow a small delay for the browser to paint the initial state before animating
            setTimeout(() => {
                canvas.classList.add('hero-animate-active');
            }, 50);

            sessionStorage.setItem('heroAnimated', 'true');
        } else {
            // Already visited, no animation needed
            canvas.classList.remove('hero-animate-in');
            canvas.classList.remove('hero-animate-active');
            canvas.style.opacity = '1';
            canvas.style.transform = 'translateX(0)';
        }

        resize(); // check resize once model is loaded
    }, undefined, (error) => {
        console.error('Error loading title.gltf:', error);
    });

    // Interaction State
    let isDragging = false;
    let previousTouch = null;

    // Mouse Interaction (PC)
    window.addEventListener('mousemove', (e) => {
        if (isDragging) return; // prioritize touch

        // normalize to -1 to 1 based on window
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        targetRotationY = x * 0.4;
        targetRotationX = y * 0.4;
    });

    // Touch Interaction (Mobile)
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousTouch = e.touches[0];
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentTouch = e.touches[0];

        const deltaX = currentTouch.clientX - previousTouch.clientX;
        const deltaY = currentTouch.clientY - previousTouch.clientY;

        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.01;

        previousTouch = currentTouch;
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
        previousTouch = null;
        // Upon touchend, maybe smoothly revert back slightly to identity, or just leave it.
        // We will just leave it where the user swiped.
    }, { passive: true });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        resize();

        if (model) {
            // Smoothly move the model to the target rotation
            currentRotationX = THREE.MathUtils.lerp(currentRotationX, targetRotationX, 0.05);
            currentRotationY = THREE.MathUtils.lerp(currentRotationY, targetRotationY, 0.05);

            model.rotation.x = currentRotationX;
            model.rotation.y = currentRotationY;
        }

        renderer.render(scene, camera);
    }

    animate();
}

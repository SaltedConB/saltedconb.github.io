/**
 * ============================================================================
 * 🔒 JS/CSS 난독화 빌드 스크립트
 * ============================================================================
 * 사용법: npm run build
 *
 * - js/main/*.js → js/main/*.min.js (난독화됨)
 * - js/data/*.js → js/data/*.min.js (난독화됨)
 * - css/*.css    → css/*.min.css   (minify됨)
 *
 * 원본 파일은 보존되며, HTML은 .min 파일을 참조해야 합니다.
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');

const ROOT = path.resolve(__dirname, '..');

// 난독화 옵션 (중간 수준 — 성능과 보호의 균형)
const OBFUSCATOR_OPTIONS = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.2,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,           // 전역 함수명 유지 (HTML onclick 호환)
    selfDefending: false,
    stringArray: true,
    stringArrayThreshold: 0.5,
    stringArrayEncoding: ['base64'],
    splitStrings: true,
    splitStringsChunkLength: 10,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// CSS minify 옵션
const CLEAN_CSS_OPTIONS = {
    level: {
        1: { all: true },
        2: { all: true }
    }
};

/**
 * 지정된 디렉토리의 특정 확장자 파일들을 처리
 */
function processFiles(dir, ext, processor) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) {
        console.log(`⚠️  디렉토리 없음: ${dir}`);
        return;
    }

    const files = fs.readdirSync(fullDir)
        .filter(f => f.endsWith(ext) && !f.endsWith(`.min${ext}`));

    files.forEach(file => {
        const inputPath = path.join(fullDir, file);
        const outputFile = file.replace(ext, `.min${ext}`);
        const outputPath = path.join(fullDir, outputFile);

        try {
            const source = fs.readFileSync(inputPath, 'utf8');
            const result = processor(source, file);
            fs.writeFileSync(outputPath, result, 'utf8');

            const originalSize = (Buffer.byteLength(source) / 1024).toFixed(1);
            const newSize = (Buffer.byteLength(result) / 1024).toFixed(1);
            console.log(`  ✅ ${dir}/${file} → ${outputFile} (${originalSize}KB → ${newSize}KB)`);
        } catch (err) {
            console.error(`  ❌ ${dir}/${file}: ${err.message}`);
        }
    });
}

// ===== 실행 =====
console.log('🔒 난독화 빌드 시작...\n');

// 1. JS 난독화
console.log('📦 JavaScript 난독화:');
['js/main', 'js/data'].forEach(dir => {
    processFiles(dir, '.js', (source, filename) => {
        const result = JavaScriptObfuscator.obfuscate(source, {
            ...OBFUSCATOR_OPTIONS,
            sourceFileName: filename
        });
        return result.getObfuscatedCode();
    });
});

// 2. CSS minify
console.log('\n📦 CSS 압축:');
processFiles('css', '.css', (source) => {
    const result = new CleanCSS(CLEAN_CSS_OPTIONS).minify(source);
    if (result.errors.length > 0) {
        throw new Error(result.errors.join(', '));
    }
    return result.styles;
});

console.log('\n✨ 빌드 완료! .min.js / .min.css 파일이 생성되었습니다.');
console.log('💡 HTML 파일에서 .min 파일을 참조하도록 설정하세요.\n');

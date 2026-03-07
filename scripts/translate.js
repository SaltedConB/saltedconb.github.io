/**
 * ============================================================================
 * 🌐 Gemini API 자동 번역 스크립트
 * ============================================================================
 * data.js (한국어) → data_en.js (영어) 자동 번역
 *
 * 사용법:
 *   GEMINI_API_KEY=여기에키입력 node scripts/translate.js
 *   또는
 *   npm run translate  (package.json에 GEMINI_API_KEY 환경변수 설정 후)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ── Gemini API 설정 ──
// 여기에 직접 따옴표('')를 사용해 키를 넣으셔도 되지만, 
// 보안을 위해 터미널에서 GEMINI_API_KEY=... 로 입력하는 것을 권장합니다.
const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
    console.error('   사용법 1 (추천): 터미널에 아래와 같이 입력 후 엔터');
    console.error('      GEMINI_API_KEY=내키값여기에 npm run translate');
    console.error('   사용법 2: translate.js 21번 줄의 \'\' 사이에 키를 직접 입력하고 저장');
    process.exit(1);
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// ── 파일 경로 설정 ──
const DATA_KO_PATH = path.join(__dirname, '..', 'js', 'data', 'data.js');
const DATA_EN_PATH = path.join(__dirname, '..', 'js', 'data', 'data_en.js');
const DATA_JA_PATH = path.join(__dirname, '..', 'js', 'data', 'data_ja.js');

// ── data.js에서 SITE_DATA 추출 ──
function getSiteData() {
    try {
        // data.js에서 module.exports = SITE_DATA 설정을 했으므로 require로 바로 읽어옵니다.
        return require(DATA_KO_PATH);
    } catch (e) {
        throw new Error('data.js를 읽어오는 중 오류가 발생했습니다: ' + e.message);
    }
}

// ── 번역할 텍스트 필드만 추출 ──
function extractTranslatableTexts(data) {
    const texts = {};

    // 랜딩 페이지
    texts.landing_title = data.landing.title;
    texts.landing_subtitle = data.landing.subtitle;
    texts.landing_contactEmail = data.landing.contactEmail;

    // 작업물
    data.works.forEach((work, i) => {
        texts[`work_${i}_title`] = work.title;
        texts[`work_${i}_subtitle`] = work.subtitle;
        texts[`work_${i}_thumbAlt`] = work.thumbAlt;
        texts[`work_${i}_descTitle`] = work.descTitle;
        texts[`work_${i}_desc`] = work.desc;
    });

    // 스킬
    data.skills.forEach((skill, i) => {
        texts[`skill_${i}_desc`] = skill.desc;
    });

    return texts;
}

// ── Gemini API 호출 ──
async function translateWithGemini(textsObj) {
    const prompt = `You are a professional translator for a designer's portfolio website.
Translate the following JSON object values from Korean into both English and Japanese.
Keep all JSON keys exactly as they are.
Keep HTML tags like <br>, <br />, etc. intact.
Keep proper nouns (brand names, tool names, contest names) as-is or use their official names.
Keep email addresses and URLs unchanged.
Return ONLY a JSON object containing TWO keys: "en" and "ja", where each key contains the translated JSON object. No explanation.

Example output format:
{
  "en": { "key1": "english text..." },
  "ja": { "key1": "japanese text..." }
}

JSON to translate:
${JSON.stringify(textsObj, null, 2)}`;

    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                topP: 0.8,
            }
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API 오류 (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
        throw new Error('Gemini API로부터 유효한 응답을 받지 못했습니다.');
    }

    // JSON 블록 추출 (```json ... ``` 혹은 순수 JSON)
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        textContent.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
        throw new Error('Gemini 응답에서 JSON을 찾을 수 없습니다:\n' + textContent);
    }

    return JSON.parse(jsonMatch[1]);
}

// ── 번역 결과를 원본 데이터에 적용 ──
function applyTranslations(data, translations) {
    const translated = JSON.parse(JSON.stringify(data)); // 깊은 복사

    // 랜딩 페이지
    translated.landing.title = translations.landing_title || data.landing.title;
    translated.landing.subtitle = translations.landing_subtitle || data.landing.subtitle;
    translated.landing.contactEmail = translations.landing_contactEmail || data.landing.contactEmail;

    // 작업물
    translated.works.forEach((work, i) => {
        work.title = translations[`work_${i}_title`] || work.title;
        work.subtitle = translations[`work_${i}_subtitle`] || work.subtitle;
        work.thumbAlt = translations[`work_${i}_thumbAlt`] || work.thumbAlt;
        work.descTitle = translations[`work_${i}_descTitle`] || work.descTitle;
        work.desc = translations[`work_${i}_desc`] || work.desc;

        // 이미지 경로 수정: ./ → ../
        work.thumb = work.thumb.replace(/^\.\//, '../');
        if (work.images) {
            work.images = work.images.map(img => img.replace(/^\.\//, '../'));
        }
        if (work.pdf) {
            work.pdf = work.pdf.replace(/^\.\//, '../');
        }
    });

    // 스킬
    translated.skills.forEach((skill, i) => {
        skill.desc = translations[`skill_${i}_desc`] || skill.desc;
        // 이미지/아이콘 경로 수정: ./ → ../
        skill.icon = skill.icon.replace(/^\.\//, '../');
        if (skill.images) {
            skill.images = skill.images.map(img => img.replace(/^\.\//, '../'));
        }
    });

    return translated;
}

// ── 데이터 파일 생성 ──
function writeDataFile(filePath, translatedData, langName) {
    const header = `/**
 * ============================================================================
 * 🌐 ${langName} 데이터 파일 (자동 생성됨 - 직접 수정하지 마세요!)
 * ============================================================================
 * 이 파일은 scripts/translate.js 에 의해 자동 생성됩니다.
 * 한국어 data.js를 수정한 뒤 \`npm run translate\` 를 실행하면 갱신됩니다.
 * 마지막 생성: ${new Date().toISOString()}
 * ============================================================================
 */`;

    const content = `${header}\nconst SITE_DATA = ${JSON.stringify(translatedData, null, 4)};\n`;
    fs.writeFileSync(filePath, content, 'utf-8');
}

// ── 메인 실행 ──
async function main() {
    console.log('📖 data.js 읽는 중...');
    const siteData = getSiteData();

    console.log('📝 번역할 텍스트 추출 중...');
    const textsToTranslate = extractTranslatableTexts(siteData);
    const textCount = Object.keys(textsToTranslate).length;
    console.log(`   → ${textCount}개 텍스트 발견`);

    console.log('🌐 Gemini API로 번역 중 (영어 & 일본어)...');
    const translations = await translateWithGemini(textsToTranslate);

    if (!translations.en || !translations.ja) {
        throw new Error('Gemini 응답에 en 또는 ja 키가 없습니다.');
    }

    console.log('📦 영어 번역 결과 적용 중...');
    const translatedDataEn = applyTranslations(siteData, translations.en);

    console.log('📦 일본어 번역 결과 적용 중...');
    const translatedDataJa = applyTranslations(siteData, translations.ja);

    console.log('💾 data_en.js 저장 중...');
    writeDataFile(DATA_EN_PATH, translatedDataEn, '영문');

    console.log('💾 data_ja.js 저장 중...');
    writeDataFile(DATA_JA_PATH, translatedDataJa, '일문');

    console.log(`✅ 완료! ${DATA_EN_PATH}, ${DATA_JA_PATH} 생성됨`);
}

main().catch(err => {
    console.error('❌ 오류 발생:', err.message);
    process.exit(1);
});

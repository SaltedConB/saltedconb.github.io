document.addEventListener('DOMContentLoaded', () => {
    if (typeof SITE_DATA === 'undefined') {
        alert("data.js could not be loaded. Please ensure data.js is in the same directory.");
        return;
    }

    // Populate Landing Data
    document.getElementById('landingTitle').value = SITE_DATA.landing.title;
    document.getElementById('landingSubtitle').value = SITE_DATA.landing.subtitle;
    document.getElementById('landingContact').value = SITE_DATA.landing.contactEmail;

    // Render Portfolio Forms
    renderPortfolioForms();
    renderSkillForms();
});

function renderPortfolioForms() {
    const container = document.getElementById('worksContainer');
    container.innerHTML = '';

    SITE_DATA.works.forEach((work, index) => {
        const itemBoxDiv = document.createElement('div');
        itemBoxDiv.className = 'portfolio-edit-box';

        // Simple Toggle Header
        const header = document.createElement('div');
        header.className = 'portfolio-header';
        header.innerHTML = `<h3>[${work.category}] : ${work.title}</h3> <span class="btn-toggle">▼ Edit</span>`;
        header.addEventListener('click', () => {
            const body = itemBoxDiv.querySelector('.portfolio-body');
            body.classList.toggle('open');
        });

        // Body Form
        const body = document.createElement('div');
        body.className = 'portfolio-body';

        body.innerHTML = `
            <div class="form-group">
                <label>Category (e.g. graphic-design, motion-graphics, branding)</label>
                <input type="text" id="work-category-${index}" class="form-control" value="${work.category}">
            </div>
            <div class="form-group">
                <label>Main Title</label>
                <input type="text" id="work-title-${index}" class="form-control" value="${work.title}">
            </div>
            <div class="form-group">
                <label>Card Subtitle (Hover Text)</label>
                <input type="text" id="work-subtitle-${index}" class="form-control" value="${work.subtitle}">
            </div>
            <div class="form-group">
                <label>Thumbnail Image Path</label>
                <input type="text" id="work-thumb-${index}" class="form-control" value="${work.thumb}">
            </div>
            <div class="form-group">
                <label>Thumbnail Alt Text</label>
                <input type="text" id="work-thumbAlt-${index}" class="form-control" value="${work.thumbAlt}">
            </div>
            <div class="form-group">
                <label>Modal Description Title</label>
                <input type="text" id="work-descTitle-${index}" class="form-control" value="${work.descTitle}">
            </div>
            <div class="form-group">
                <label>Modal Description HTML</label>
                <textarea id="work-desc-${index}" class="form-control">${work.desc}</textarea>
            </div>
            <div class="form-group">
                <label>Images Array (Comma Separated Paths)</label>
                <textarea id="work-images-${index}" class="form-control">${work.images.join(', ')}</textarea>
            </div>
            <div class="form-group">
                <label>YouTube Embed URL</label>
                <input type="text" id="work-youtube-${index}" class="form-control" value="${work.youtube || ''}">
            </div>
            <div class="form-group">
                <label>Behance Embed URL</label>
                <input type="text" id="work-behance-${index}" class="form-control" value="${work.behance || ''}">
            </div>
            <div class="form-group">
                <label>PDF File Path</label>
                <input type="text" id="work-pdf-${index}" class="form-control" value="${work.pdf || ''}">
            </div>
        `;

        itemBoxDiv.appendChild(header);
        itemBoxDiv.appendChild(body);
        container.appendChild(itemBoxDiv);
    });
}

function renderSkillForms() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!SITE_DATA.skills) return;

    SITE_DATA.skills.forEach((skill, index) => {
        const itemBoxDiv = document.createElement('div');
        itemBoxDiv.className = 'portfolio-edit-box';

        // Simple Toggle Header
        const header = document.createElement('div');
        header.className = 'portfolio-header';
        header.innerHTML = `<h3>💻 ${skill.name} (Level: ${skill.level})</h3> <span class="btn-toggle">▼ Edit</span>`;
        header.addEventListener('click', () => {
            const body = itemBoxDiv.querySelector('.portfolio-body');
            body.classList.toggle('open');
        });

        // Body Form
        const body = document.createElement('div');
        body.className = 'portfolio-body';

        body.innerHTML = `
            <div class="form-group">
                <label>Skill Name</label>
                <input type="text" id="skill-name-${index}" class="form-control" value="${skill.name}">
            </div>
            <div class="form-group">
                <label>Level (1-5)</label>
                <input type="number" id="skill-level-${index}" class="form-control" value="${skill.level}" min="1" max="5">
            </div>
            <div class="form-group">
                <label>Icon SVG URL</label>
                <input type="text" id="skill-icon-${index}" class="form-control" value="${skill.icon}">
            </div>
            <div class="form-group">
                <label>Modal Description Title</label>
                <input type="text" id="skill-descTitle-${index}" class="form-control" value="${skill.descTitle}">
            </div>
            <div class="form-group">
                <label>Modal Description HTML</label>
                <textarea id="skill-desc-${index}" class="form-control">${skill.desc}</textarea>
            </div>
        `;

        itemBoxDiv.appendChild(header);
        itemBoxDiv.appendChild(body);
        container.appendChild(itemBoxDiv);
    });
}

function exportData() {
    // 1. Gather Landing Data
    const newLanding = {
        title: document.getElementById('landingTitle').value,
        subtitle: document.getElementById('landingSubtitle').value,
        contactEmail: document.getElementById('landingContact').value
    };

    // 2. Gather Portfolio Works
    const newWorks = [];
    SITE_DATA.works.forEach((oldWork, index) => {
        // Parse array from comma separated string
        const imagesStr = document.getElementById(`work-images-${index}`).value;
        const imagesArr = imagesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

        newWorks.push({
            id: oldWork.id, // Retain original ID for modal matching
            category: document.getElementById(`work-category-${index}`).value,
            title: document.getElementById(`work-title-${index}`).value,
            subtitle: document.getElementById(`work-subtitle-${index}`).value,
            thumb: document.getElementById(`work-thumb-${index}`).value,
            thumbAlt: document.getElementById(`work-thumbAlt-${index}`).value,
            descTitle: document.getElementById(`work-descTitle-${index}`).value,
            desc: document.getElementById(`work-desc-${index}`).value,
            images: imagesArr,
            youtube: document.getElementById(`work-youtube-${index}`).value,
            behance: document.getElementById(`work-behance-${index}`).value,
            pdf: document.getElementById(`work-pdf-${index}`).value,
        });
    });

    // 3. Gather Skills Data
    const newSkills = [];
    if (SITE_DATA.skills) {
        SITE_DATA.skills.forEach((oldSkill, index) => {
            newSkills.push({
                id: oldSkill.id,
                name: document.getElementById(`skill-name-${index}`).value,
                level: parseInt(document.getElementById(`skill-level-${index}`).value, 10),
                icon: document.getElementById(`skill-icon-${index}`).value,
                descTitle: document.getElementById(`skill-descTitle-${index}`).value,
                desc: document.getElementById(`skill-desc-${index}`).value,
            });
        });
    }

    const newDataObject = {
        landing: newLanding,
        works: newWorks,
        skills: newSkills
    };

    // 4. Generate JS File String
    const jsContent = `const SITE_DATA = ${JSON.stringify(newDataObject, null, 4)};`;

    // 4. Create Blob and Trigger Download
    const blob = new Blob([jsContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);

    // Show Toast
    const toast = document.getElementById('toastMsg');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

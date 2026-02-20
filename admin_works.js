let quillEditors = {}; // Store all quill instances mapped by index
let worksData = []; // Clone the works data to manipulate easily

document.addEventListener('DOMContentLoaded', () => {
    if (typeof SITE_DATA === 'undefined') {
        alert("data.js could not be loaded. Please ensure data.js is in the same directory.");
        return;
    }

    // deep clone works
    worksData = JSON.parse(JSON.stringify(SITE_DATA.works));
    renderWorksForms();
});

function renderWorksForms() {
    const container = document.getElementById('worksContainer');
    container.innerHTML = '';
    quillEditors = {}; // Reset

    worksData.forEach((work, index) => {
        const itemBoxDiv = document.createElement('div');
        itemBoxDiv.className = 'portfolio-edit-box';

        // Header
        const header = document.createElement('div');
        header.className = 'portfolio-header';
        header.innerHTML = `<h3>${index + 1}. [${work.category}] : ${work.title || 'New Work'}</h3> <span class="btn-toggle">▼ Edit</span>`;
        header.addEventListener('click', () => {
            const body = itemBoxDiv.querySelector('.portfolio-body');
            body.classList.toggle('open');
        });

        // Body Form
        const body = document.createElement('div');
        body.className = 'portfolio-body';

        // Images array to dynamic list HTML
        let imagesHtml = '';
        (work.images || []).forEach((img, imgIdx) => {
            imagesHtml += `
                <div class="image-input-row" id="img-row-${index}-${imgIdx}">
                    <input type="text" class="form-control work-image-field-${index}" value="${img}" placeholder="./img/work/something.jpg">
                    <button class="btn-icon" onclick="removeImageField(${index}, ${imgIdx})">❌</button>
                </div>
            `;
        });

        body.innerHTML = `
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div class="form-group" style="flex:1;">
                    <label>Category (e.g. graphic-design, motion-graphics)</label>
                    <input type="text" id="work-category-${index}" class="form-control" value="${work.category || ''}" onchange="updateData(${index}, 'category')">
                </div>
                <div class="form-group" style="flex:2;">
                    <label>Main Title</label>
                    <input type="text" id="work-title-${index}" class="form-control" value="${work.title || ''}" onchange="updateData(${index}, 'title')">
                </div>
            </div>

            <div class="form-group">
                <label>Card Subtitle (Hover Text on Grid)</label>
                <input type="text" id="work-subtitle-${index}" class="form-control" value="${work.subtitle || ''}" onchange="updateData(${index}, 'subtitle')">
            </div>

            <div style="display: flex; gap: 15px;">
                <div class="form-group" style="flex:1;">
                    <label>Thumbnail Image Path</label>
                    <input type="text" id="work-thumb-${index}" class="form-control" value="${work.thumb || ''}" onchange="updateData(${index}, 'thumb')">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Thumbnail Alt Text</label>
                    <input type="text" id="work-thumbAlt-${index}" class="form-control" value="${work.thumbAlt || ''}" onchange="updateData(${index}, 'thumbAlt')">
                </div>
            </div>

            <hr style="border-color: #333; margin: 30px 0;">
            <h4 style="color: #80CA4E; margin-bottom: 15px;">Modal Settings</h4>

            <div class="form-group">
                <label>Modal Description Title</label>
                <input type="text" id="work-descTitle-${index}" class="form-control" value="${work.descTitle || ''}" onchange="updateData(${index}, 'descTitle')">
            </div>

            <div class="form-group">
                <label>Modal Description (WYSIWYG)</label>
                <!-- Quill Editor Container -->
                <div id="quill-editor-${index}">${work.desc || ''}</div>
            </div>

            <div class="form-group">
                <label>Images Array (Dynamically Add/Remove)</label>
                <div class="image-list-container" id="image-list-${index}">
                    ${imagesHtml}
                </div>
                <button class="btn btn-icon" style="margin-top: 10px; width: 100%; padding: 10px;" onclick="addImageField(${index})">➕ Add Image Path</button>
            </div>

            <div style="display: flex; gap: 15px; margin-top:20px;">
                <div class="form-group" style="flex:1;">
                    <label>YouTube Embed URL</label>
                    <input type="text" id="work-youtube-${index}" class="form-control" value="${work.youtube || ''}" onchange="updateData(${index}, 'youtube')">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Behance Web URL</label>
                    <input type="text" id="work-behance-${index}" class="form-control" value="${work.behance || ''}" onchange="updateData(${index}, 'behance')">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>PDF File Path</label>
                    <input type="text" id="work-pdf-${index}" class="form-control" value="${work.pdf || ''}" onchange="updateData(${index}, 'pdf')">
                </div>
            </div>

            <div style="margin-top: 20px; text-align: right;">
                <button class="btn btn-danger" onclick="deleteWork(${index})">🗑️ Delete This Work</button>
            </div>
        `;

        itemBoxDiv.appendChild(header);
        itemBoxDiv.appendChild(body);
        container.appendChild(itemBoxDiv);

        // Initialize Quill specifically for this container
        const quill = new Quill(`#quill-editor-${index}`, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean']
                ]
            }
        });

        // Listen to quill changes and update data
        quill.on('text-change', () => {
            worksData[index].desc = quill.root.innerHTML;
        });

        quillEditors[index] = quill;
    });
}

// Basic Fields update
function updateData(index, field) {
    const val = document.getElementById(`work-${field}-${index}`).value;
    worksData[index][field] = val;

    // Update headers instantly for titles/categories
    if (field === 'title' || field === 'category') {
        const headerH3 = document.querySelectorAll('.portfolio-header h3')[index];
        headerH3.innerHTML = `${index + 1}. [${worksData[index].category}] : ${worksData[index].title || 'New Work'}`;
    }
}

// Dynamic Images functions
function addImageField(index) {
    if (!worksData[index].images) worksData[index].images = [];
    worksData[index].images.push("");
    renderWorksForms(); // Re-render to show new field (simplest approach for now)

    // Auto-open the body
    setTimeout(() => {
        document.querySelectorAll('.portfolio-body')[index].classList.add('open');
    }, 10);
}

function removeImageField(workIndex, imgIndex) {
    worksData[workIndex].images.splice(imgIndex, 1);
    renderWorksForms();

    setTimeout(() => {
        document.querySelectorAll('.portfolio-body')[workIndex].classList.add('open');
    }, 10);
}

// Add/Delete Works
function addNewWork() {
    const newId = 'modalw' + Date.now(); // Generate unique ID
    worksData.push({
        id: newId,
        category: "graphic-design",
        title: "New Portfolio Item",
        subtitle: "Description subtitle",
        thumb: "./img/work/placeholder.jpg",
        thumbAlt: "Thumbnail",
        descTitle: "Project Title",
        desc: "<p>Write your detailed project description here.</p>",
        images: ["./img/work/placeholder1.jpg"],
        youtube: "",
        behance: "",
        pdf: ""
    });

    renderWorksForms();

    // Scroll to bottom and open the new item
    window.scrollTo(0, document.body.scrollHeight);
    setTimeout(() => {
        const bodies = document.querySelectorAll('.portfolio-body');
        bodies[bodies.length - 1].classList.add('open');
    }, 50);
}

function deleteWork(index) {
    if (confirm(`Are you sure you want to delete "${worksData[index].title}"? This cannot be undone until you refresh.`)) {
        worksData.splice(index, 1);
        renderWorksForms();
    }
}

// EXPORT TO data.js
function exportWorksData() {
    // Before export, we must sync the image arrays from DOM inputs because we didn't use an onchange for them
    worksData.forEach((work, index) => {
        const imgInputs = document.querySelectorAll(`.work-image-field-${index}`);
        work.images = Array.from(imgInputs).map(inp => inp.value).filter(val => val.trim() !== "");
    });

    // Merge our edited worksData with the pristine Landing and Skills data from SITE_DATA
    const newDataObject = {
        landing: SITE_DATA.landing,
        works: worksData,
        skills: SITE_DATA.skills
    };

    // Generate JS content
    const jsContent = `const SITE_DATA = ${JSON.stringify(newDataObject, null, 4)};`;

    // Download Logic
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

    // Show Toast Notification
    const toast = document.getElementById('toastMsg');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

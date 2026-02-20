const https = require('https');

const queries = [
    "Adobe Firefly Logo.svg",
    "Adobe Substance 3D Painter icon.svg",
    "Adobe Substance 3D Painter logo.svg"
];

async function checkNames() {
    for (const q of queries) {
        const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(q)}&prop=imageinfo&iiprop=url&format=json`;
        await new Promise((resolve) => {
            https.get(searchUrl, { headers: { "User-Agent": "MyBot/2.4" } }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        const pages = json.query.pages;
                        const pageId = Object.keys(pages)[0];
                        if (pageId === "-1" || !pages[pageId].imageinfo) {
                            console.log(`[NOT FOUND] ${q}`);
                        } else {
                            console.log(`[FOUND] ${q} -> ${pages[pageId].imageinfo[0].url}`);
                        }
                    } catch (e) { console.error(e); }
                    resolve();
                });
            });
        });
    }
}
checkNames();

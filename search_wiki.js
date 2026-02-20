const https = require('https');

const queries = [
    "Adobe Substance 3D Painter",
    "Adobe Substance 3D Stager",
    "Adobe Firefly"
];

async function checkNames() {
    for (const q of queries) {
        const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q + ' svg')}&utf8=&format=json`;
        await new Promise((resolve) => {
            https.get(searchUrl, { headers: { "User-Agent": "MyBot/1.4" } }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        console.log(`Results for ${q}:`);
                        json.query.search.slice(0, 3).forEach(x => console.log(' - ' + x.title));
                    } catch (e) { console.error(e); }
                    resolve();
                });
            });
        });
    }
}
checkNames();

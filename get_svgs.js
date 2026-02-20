const https = require("https");

const queries = [
  "Adobe Photoshop CC icon.svg",
  "Adobe Illustrator CC icon.svg",
  "Adobe After Effects CC icon.svg",
  "Adobe Premiere Pro CC icon.svg",
  "Cinema 4D Logo.svg",
  "Blender 3D Icon.svg",
  "Blender logo no text.svg",
  "DaVinci Resolve 17 logo.svg",
  "Adobe Substance 3D Painter Icon.svg",
  "Adobe Substance 3D Stager Icon.svg",
  "Adobe Firefly logo.svg",
  "Adobe Substance 3D icon.svg"
];

async function checkNames() {
  for (const q of queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(q)}&prop=imageinfo&iiprop=url&format=json`;
    await new Promise((resolve) => {
      https.get(url, { headers: { "User-Agent": "MyBot/1.0" } }, (res) => {
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
          } catch (e) {
            console.log(`[ERROR parsing] ${q}`, e);
          }
          resolve();
        });
      });
    });
  }
}
checkNames();

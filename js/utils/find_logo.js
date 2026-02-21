const https = require('https');

const queries = [
  "Adobe Substance 3D Painter Icon.svg",
  "Adobe Substance 3D Painter logo.svg",
  "Adobe_Substance_3D_Painter_Icon.svg",
  "Adobe Substance 3D Stager Icon.svg",
  "Adobe Substance 3D Stager logo.svg",
  "Adobe_Substance_3D_Stager_Icon.svg",
  "Adobe Firefly logo.svg",
  "Adobe Firefly Icon.svg"
];

async function checkNames() {
  for (const q of queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(q)}&prop=imageinfo&iiprop=url&format=json`;
    await new Promise((resolve) => {
      https.get(url, { headers: {"User-Agent": "MyBot/1.3"} }, (res) => {
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
          } catch(e) {}
          resolve();
        });
      });
    });
  }
}
checkNames();

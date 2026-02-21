const https = require("https");
const fs = require("fs");
const path = require("path");

const urls = {
  "illustrator.svg": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
  "aftereffects.svg": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg",
  "premierepro.svg": "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  "cinema4d.svg": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Cinema_4D_Logo.svg",
  "blender.svg": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
  "davinci.svg": "https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg",
  "substance.svg": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Adobe_Substance_3D_icon.svg",
  "adobe.svg": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_Corporate_Logo.svg"
};

const dir = path.join(__dirname, "img", "skills");

async function download() {
  for (const [name, url] of Object.entries(urls)) {
    const dest = path.join(dir, name);
    await new Promise((resolve, reject) => {
      https.get(url, { headers: { "User-Agent": "MyBot/1.0" } }, (res) => {
        if (res.statusCode !== 200) {
          console.error(`Failed ${name}: ${res.statusCode}`);
          res.resume();
          return resolve();
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Saved ${name}`);
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(dest, () => {});
        console.error(`Error ${name}:`, err.message);
        resolve();
      });
    });
  }
}

download();

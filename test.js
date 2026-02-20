const { JSDOM } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync("works.html", "utf8");
const dataJs = fs.readFileSync("data.js", "utf8");
const scriptJs = fs.readFileSync("script.js", "utf8");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://saltedconb.github.io/works.html",
  beforeParse(window) {
    window.matchMedia = () => ({ matches: false });
  }
});

try {
  dom.window.eval(dataJs);
  dom.window.eval(scriptJs);
  dom.window.renderSiteData();
  console.log("Success! Items:", dom.window.document.querySelectorAll(".portfolio-item").length);
} catch (e) {
  console.log("Caught Error:", e);
}

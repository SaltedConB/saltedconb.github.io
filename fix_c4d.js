const fs = require('fs');
let content = fs.readFileSync('img/skills/cinema4d.svg', 'utf8');

// remove all paths inside _2679059374624 which are the text
content = content.replace(/<g id="_2679059374624">[\s\S]*?<\/g>/, '');
// fix width and viewBox to make it square
content = content.replace('width="142.24mm"', 'width="35.56mm"');
content = content.replace('viewBox="0 0 14224 3556"', 'viewBox="0 0 3556 3556"');

fs.writeFileSync('img/skills/cinema4d.svg', content);
console.log('Fixed Cinema 4D SVG');

const fs = require('fs');
function injectColorAndGradient(filename, gradient, fill) {
    let svg = fs.readFileSync(filename, 'utf8');
    if (gradient) {
        svg = svg.replace('<svg ', `<svg >\n  <defs>\n    ${gradient}\n  </defs>\n  <svg `).replace('</svg>', '</svg></svg>');
        svg = svg.replace(/<path d="/g, `<path fill="${fill}" d="`);
    } else {
        svg = svg.replace(/<path d="/g, `<path fill="${fill}" d="`);
    }
    fs.writeFileSync(filename, svg);
}

injectColorAndGradient('img/skills/adobe.svg',
    `<linearGradient id="fireflyGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fa573e"/><stop offset="50%" stop-color="#db00cc"/><stop offset="100%" stop-color="#a416ff"/></linearGradient>`,
    `url(#fireflyGrad)`);
injectColorAndGradient('img/skills/painter.svg', '', '#8DD43D');
injectColorAndGradient('img/skills/stager.svg', '', '#3EBB5C');
console.log("Colors injected");

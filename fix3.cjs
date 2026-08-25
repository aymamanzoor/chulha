const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/biryani masala ,/g, 'biryani masala",')
     .replace(/dY\?/g, '')
     .replace(/dY\?\?/g, '')
     .replace(/dY~/g, '');
fs.writeFileSync('src/lib/mock-data.js', c);

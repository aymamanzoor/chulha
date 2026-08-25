const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/slug: "homemade-margherita pizza,/g, 'slug: "homemade-margherita-pizza",')
     .replace(/slug: "homemade-margherita-pizza",/g, 'slug: "homemade-margherita-pizza",')
     .replace(/margherita pizza,/g, 'margherita pizza",');
fs.writeFileSync('src/lib/mock-data.js', c);

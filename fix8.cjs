const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/slug: "creamy-garlic-pasta,/g, 'slug: "creamy-garlic-pasta",');
fs.writeFileSync('src/lib/mock-data.js', c);

const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/passata ,/g, 'passata",')
     .replace(/tomato sauce ,/g, 'tomato sauce",')
     .replace(/chicken ,/g, 'chicken",');
fs.writeFileSync('src/lib/mock-data.js', c);

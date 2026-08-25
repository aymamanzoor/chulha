const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/image: pizza\s+creator:/g, 'image: pizza,\n    creator:');
c = c.replace(/image: pasta\s+creator:/g, 'image: pasta,\n    creator:');
fs.writeFileSync('src/lib/mock-data.js', c);

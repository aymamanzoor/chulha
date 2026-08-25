const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/title: "Creamy Garlic Pasta ,/g, 'title: "Creamy Garlic Pasta",')
     .replace(/pasta\r?\n\s+creator/g, 'pasta,\n    creator')
     .replace(/2 cloves garlic ,/g, '2 cloves garlic",')
     .replace(/dY\?/g, '')
     .replace(/1\/2 cup heavy cream ,/g, '1/2 cup heavy cream",');
fs.writeFileSync('src/lib/mock-data.js', c);

const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/title: "Homemade Margherita Pizza ,/g, 'title: "Homemade Margherita Pizza",');
fs.writeFileSync('src/lib/mock-data.js', c);

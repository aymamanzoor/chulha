const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');

c = c.replace(/pizzafrom/g, 'pizza from')
     .replace(/pizzajpg/g, 'pizza.jpg')
     .replace(/pastafrom/g, 'pasta from')
     .replace(/pastajpg/g, 'pasta.jpg')
     .replace(/Ahmed Raza,/g, 'Ahmed Raza\",')
     .replace(/pizza\r?\n\s+pasta\r?\n/g, 'pizza,\n  pasta,\n');

fs.writeFileSync('src/lib/mock-data.js', c);

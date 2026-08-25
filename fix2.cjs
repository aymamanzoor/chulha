const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');

c = c.replace(/username: "lucapasta,/g, 'username: "lucapasta",')
     .replace(/pastaonly\./g, 'pasta only.')
     .replace(/Ahmed Raza",/g, 'Ahmed Raza",')
     .replace(/dY\?3/g, '') // strip broken emoji
     .replace(/dY`c\?\?/g, '')
     .replace(/dY`"\?\?/g, '')
     .replace(/dY\?/g, '')
     .replace(/dY\?\?/g, '')
     .replace(/dY~/g, '')
     .replace(/dYdY /g, '');

fs.writeFileSync('src/lib/mock-data.js', c);

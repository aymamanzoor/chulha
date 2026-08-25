const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.js', 'utf8');
c = c.replace(/slug: "creamy-garlic-pasta \},/g, 'slug: "creamy-garlic-pasta" },')
     .replace(/slug: "creamy-garlic-pasta\},/g, 'slug: "creamy-garlic-pasta" },')
     .replace(/\"creamy-garlic-pasta \},/g, '"creamy-garlic-pasta" },');
     
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('creamy-garlic-pasta')) {
     if (!line.includes('"creamy-garlic-pasta"')) {
         lines[i] = line.replace(/creamy-garlic-pasta/g, 'creamy-garlic-pasta"');
     }
  }
}
fs.writeFileSync('src/lib/mock-data.js', lines.join('\n'));

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/aanbod/_components/MaintenancePlanner.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the line that has 'title: "Smart Home & Infrastructuur Inspectie"' and prefix it with the correct properties
const target = 'title: "Smart Home & Infrastructuur Inspectie"';
const replacement = 'id: "electro",\n    name: "Elektra onderhoud",\n    title: "Smart Home & Infrastructuur Inspectie"';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated MaintenancePlanner.tsx');
} else {
  console.log('Target not found in MaintenancePlanner.tsx');
}

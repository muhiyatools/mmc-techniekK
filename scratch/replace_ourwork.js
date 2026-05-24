const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/our-work/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = '<div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 lg:py-32">';
const replacement = '<section className="relative pt-[104px] lg:pt-[114px]">\n        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 lg:py-32">';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated app/our-work/page.tsx');
} else {
  console.log('Target not found in app/our-work/page.tsx');
}

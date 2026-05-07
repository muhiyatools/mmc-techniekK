const fs = require('fs');
let content = fs.readFileSync('lib/data.ts', 'utf8');

// Remove PriceTier type and related exports
content = content.replace(/export type PriceTier = [^;]+;\n/, '');
content = content.replace(/export const priceTierLabels: Record<PriceTier, string> = \{[\s\S]*?\};\n/, '');
content = content.replace(/export const priceTierColors: Record<PriceTier, string> = \{[\s\S]*?\};\n/, '');

// Remove fields from Product interface
content = content.replace(/  priceMin: number \| null;\n/, '');
content = content.replace(/  priceMax: number \| null;\n/, '');
content = content.replace(/  tier: PriceTier;\n/, '');

// Remove tier, priceMin, priceMax from all product objects
content = content.replace(/\n\s+tier: "[a-z]+",/g, '');
content = content.replace(/\n\s+priceMin: (?:\d+|null),/g, '');
content = content.replace(/\n\s+priceMax: (?:\d+|null),/g, '');

fs.writeFileSync('lib/data.ts', content);
console.log('Done cleaning data.ts');

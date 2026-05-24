const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/contact/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add getMaintenanceOptions helper after WA_PHONE declaration
const waPhoneDecl = 'const WA_PHONE = "31634311225";';
const helper = `\n\nconst getMaintenanceOptions = (lang) => {
  if (lang === "nl") {
    return [
      "Airconditioning onderhoud",
      "Zonnepanelen onderhoud",
      "Thuisbatterij onderhoud",
      "Meterkast onderhoud",
      "Elektra onderhoud"
    ];
  } else {
    return [
      "Air Conditioning maintenance",
      "Solar Panels maintenance",
      "Battery Storage maintenance",
      "Meterkast maintenance",
      "Electrical maintenance"
    ];
  }
};`;

if (!content.includes('getMaintenanceOptions')) {
  content = content.replace(waPhoneDecl, waPhoneDecl + helper);
}

// 2. Adjust mobile layout container padding top and bottom
content = content.replace(
  'pb-[calc(var(--bottom-nav-height)+var(--safe-bottom)+60px)]',
  'pb-12'
);
content = content.replace(
  '<div className="pt-[60px] px-5 pb-6">',
  '<div className="pt-[104px] px-5 pb-6">'
);

// 3. Remove bottom sticky bar that referenced bottom nav space since mobile bottom nav is gone
content = content.replace(
  `<div className="fixed left-0 right-0 md:hidden z-[49] flex gap-3 bg-surface border-t border-hairline px-4 py-3" style={{ bottom: "calc(var(--bottom-nav-height) + var(--safe-bottom))" }}>`,
  `<div className="fixed left-0 right-0 md:hidden z-[49] flex gap-3 bg-surface border-t border-hairline px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]" style={{ bottom: "0" }}>`
);

// 4. Update dropdown lists inside ContactForm component
const searchFormState = '  const [form, setForm] = useState({';
const formOptionsInsertion = `  const maintenanceOptions = getMaintenanceOptions(language);
  const isOnderhoud = form.service === "onderhoud";
  const availableProducts = isOnderhoud
    ? maintenanceOptions.map(name => ({ name }))
    : selectedService?.products ?? [];
  const isProductDropdownDisabled = !selectedService || (availableProducts.length === 0);
  
`;

if (!content.includes('isProductDropdownDisabled')) {
  content = content.replace(searchFormState, formOptionsInsertion + searchFormState);
}

// 5. Replace disabled attributes and option maps in mobile dropdown select
// We want to replace the mobile select input:
const mobileSelectOld = `disabled={!selectedService || selectedService.products.length === 0} className="w-full px-4 py-3.5 pr-10 border border-hairline bg-concrete/30 text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all appearance-none cursor-pointer disabled:opacity-40">
                      <option value="">
                        {!selectedService ? (language === "nl" ? "Kies eerst een dienst" : "Choose a service first")
                          : selectedService.products.length === 0 ? (language === "nl" ? "Geen producten beschikbaar" : "No products available")
                          : (language === "nl" ? "Selecteer een product" : "Select a product")}
                      </option>
                      {selectedService?.products.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}`;

const mobileSelectNew = `disabled={isProductDropdownDisabled} className="w-full px-4 py-3.5 pr-10 border border-ink/20 bg-concrete/20 text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all appearance-none cursor-pointer disabled:opacity-40">
                      <option value="">
                        {!selectedService ? (language === "nl" ? "Kies eerst een dienst" : "Choose a service first")
                          : availableProducts.length === 0 ? (language === "nl" ? "Geen producten beschikbaar" : "No products available")
                          : (language === "nl" ? "Selecteer een optie" : "Select an option")}
                      </option>
                      {availableProducts.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}`;

content = content.replace(mobileSelectOld, mobileSelectNew);

// 6. Replace desktop dropdown select
const desktopSelectOld = `disabled={!selectedService || selectedService.products.length === 0} className="w-full px-5 py-4 pr-12 border border-hairline bg-concrete/30 text-ink text-sm rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all appearance-none cursor-pointer">
                                <option value="">
                                  {!selectedService ? (language === "nl" ? "Kies eerst een dienst" : "Choose a service first")
                                    : selectedService.products.length === 0 ? (language === "nl" ? "Geen producten beschikbaar" : "No products available")
                                    : (language === "nl" ? "Selecteer een product" : "Select a product")}
                                </option>
                                {selectedService?.products.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}`;

const desktopSelectNew = `disabled={isProductDropdownDisabled} className="w-full px-5 py-4 pr-12 border border-ink/20 bg-concrete/20 text-ink text-sm rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all appearance-none cursor-pointer">
                                <option value="">
                                  {!selectedService ? (language === "nl" ? "Kies eerst een dienst" : "Choose a service first")
                                    : availableProducts.length === 0 ? (language === "nl" ? "Geen producten beschikbaar" : "No products available")
                                    : (language === "nl" ? "Selecteer een optie" : "Select an option")}
                                </option>
                                {availableProducts.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}`;

content = content.replace(desktopSelectOld, desktopSelectNew);

// 7. Make all form input borders higher contrast
// Replace: border-hairline bg-concrete/30 -> border-ink/20 bg-concrete/20
content = content.replace(/border-hairline bg-concrete\/30/g, 'border-ink/20 bg-concrete/20');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app/contact/page.tsx');

"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityNode {
  name: string;
  projects: number;
  lat: number;
  lng: number;
  desc: string;
}

const cityNodes: CityNode[] = [
  { name: "Oudewater (HQ)", projects: 25, lat: 52.0233, lng: 4.8686, desc: "Onze thuisbasis en hoofdkantoor." },
  { name: "Woerden", projects: 14, lat: 52.0862, lng: 4.8837, desc: "Talloze woningen voorzien van zonnepanelen." },
  { name: "Utrecht", projects: 18, lat: 52.0907, lng: 5.1214, desc: "Grootschalige warmtepomp- en solar-installaties." },
  { name: "Rotterdam", projects: 12, lat: 51.9244, lng: 4.4777, desc: "Moderne daken met geoptimaliseerde oost-west systemen." },
  { name: "Amsterdam", projects: 15, lat: 52.3676, lng: 4.9041, desc: "Duurzame systemen op historische en moderne panden." },
  { name: "Den Haag", projects: 11, lat: 52.0705, lng: 4.3007, desc: "Maximale opbrengsten aan de kustlijn." },
  { name: "Gouda", projects: 9, lat: 52.0116, lng: 4.7105, desc: "Zonnestroomsystemen in en rondom de binnenstad." },
  { name: "Breda", projects: 8, lat: 51.5895, lng: 4.7734, desc: "Particuliere verduurzaming en energieopslag." },
  { name: "Almere", projects: 8, lat: 52.3718, lng: 5.2224, desc: "Nieuwbouwwoningen met geïntegreerd solar-design." },
  { name: "Groningen", projects: 6, lat: 53.2194, lng: 6.5665, desc: "Duurzame zonne-energie in het noorden." },
  { name: "Eindhoven", projects: 9, lat: 51.4416, lng: 5.4697, desc: "Slimme thuisbatterijen en zonnepaneel-combinaties." },
  { name: "Tilburg", projects: 7, lat: 51.5555, lng: 5.0913, desc: "Woningen voorzien van milieuvriendelijke energie." },
  { name: "Nijmegen", projects: 7, lat: 51.8126, lng: 5.8372, desc: "Verduurzaming in de oudste stad van Nederland." },
  { name: "Enschede", projects: 6, lat: 52.2215, lng: 6.8937, desc: "Hoogrendements zonnestroomsystemen in Twente." },
  { name: "Haarlem", projects: 8, lat: 52.3874, lng: 4.6462, desc: "Kwalitatieve installaties in Kennemerland." },
  { name: "Arnhem", projects: 7, lat: 51.9851, lng: 5.8987, desc: "Warmtepomp- en solar-integraties op de Veluwe zoom." },
  { name: "Amersfoort", projects: 8, lat: 52.1561, lng: 5.3878, desc: "Centraal gelegen installaties met topopbrengst." },
  { name: "Apeldoorn", projects: 7, lat: 52.2112, lng: 5.9699, desc: "Groene stroomopwekking voor Gelderse huishoudens." },
  { name: "Zwolle", projects: 6, lat: 52.5168, lng: 6.0830, desc: "Professionele installaties in Overijssel." },
  { name: "Leeuwarden", projects: 4, lat: 53.2014, lng: 5.7999, desc: "Duurzame energieoplossingen in Friesland." },
  { name: "Lelystad", projects: 4, lat: 52.5185, lng: 5.4714, desc: "Optimale zon-oriëntatie in Flevoland." },
  { name: "Middelburg", projects: 3, lat: 51.5000, lng: 3.6138, desc: "Zonnepanelen met veel zonuren in Zeeland." },
  { name: "Assen", projects: 3, lat: 52.9928, lng: 6.5642, desc: "Vakkundige montage in Drenthe." },
  { name: "Maastricht", projects: 4, lat: 50.8514, lng: 5.6910, desc: "Prachtige daken verduurzaamd in het heuvelland." },
  { name: "Venlo", projects: 4, lat: 51.3700, lng: 6.1680, desc: "Zonnestroom in Noord-Limburg." },
  { name: "Deventer", projects: 3, lat: 52.2535, lng: 6.1600, desc: "Historische panden vakkundig voorzien van solar." },
  { name: "Hilversum", projects: 5, lat: 52.2239, lng: 5.1763, desc: "Zonnepanelen in het Gooi." },
  { name: "Alkmaar", projects: 5, lat: 52.6324, lng: 4.7534, desc: "Schone energieoplossingen in Noord-Holland." },
  { name: "Delft", projects: 4, lat: 52.0116, lng: 4.3571, desc: "Technische perfectie op Delftse daken." },
  { name: "Leiden", projects: 5, lat: 52.1601, lng: 4.4970, desc: "Optimaal rendement voor Leidse woningen." },
  { name: "Dordrecht", projects: 4, lat: 51.8133, lng: 4.6901, desc: "Groene stroom in de oudste stad van Holland." },
  // Extra points
  { name: "Zoetermeer", projects: 5, lat: 52.0628, lng: 4.4931, desc: "Zonnepanelen voor particulieren." },
  { name: "Alphen aan den Rijn", projects: 4, lat: 52.1287, lng: 4.6559, desc: "Zonne-energie opbrengst geoptimaliseerd." },
  { name: "Hoorn", projects: 3, lat: 52.6424, lng: 5.0602, desc: "Installaties in historisch centrum." },
  { name: "Den Helder", projects: 2, lat: 52.9563, lng: 4.7601, desc: "Groene stroom aan zee." },
  { name: "Zaandam", projects: 4, lat: 52.4420, lng: 4.8292, desc: "Zonnepanelen en batterijopslag." },
  { name: "Roermond", projects: 3, lat: 51.1913, lng: 5.9877, desc: "Residentiële solar installaties." },
  { name: "Heerlen", projects: 2, lat: 51.1963, lng: 5.9877, desc: "Duurzame zonne-energie in Limburg." },
  { name: "Sittard", projects: 2, lat: 50.9984, lng: 5.8587, desc: "Optimaal rendement voor Limburgse woningen." },
  { name: "Geleen", projects: 2, lat: 50.9702, lng: 5.8277, desc: "Zonnepanelen installatie." },
  { name: "Heerenveen", projects: 3, lat: 52.9600, lng: 5.9221, desc: "Duurzame Friese woningen." },
  { name: "Sneek", projects: 2, lat: 53.0326, lng: 5.6593, desc: "Zonnestroom op Friese daken." },
  { name: "Emmen", projects: 3, lat: 52.7858, lng: 6.8976, desc: "Zonne-energie in Drenthe." },
  { name: "Hengelo", projects: 3, lat: 52.2658, lng: 6.7930, desc: "Installaties in Twente." },
  { name: "Almelo", projects: 2, lat: 52.3570, lng: 6.6631, desc: "Twentse zonnepanelen." },
  { name: "Doetinchem", projects: 4, lat: 52.2118, lng: 6.2941, desc: "Groene stroom voor Gelderse woningen." },
  { name: "Zutphen", projects: 3, lat: 52.1396, lng: 6.1950, desc: "Residentiële solar installaties." },
  { name: "Veenendaal", projects: 4, lat: 52.0287, lng: 5.5539, desc: "Duurzame energieoplossingen." },
  { name: "Zeist", projects: 3, lat: 52.0833, lng: 5.5167, desc: "Zonnepanelen op de Utrechtse Heuvelrug." },
  { name: "Gorinchem", projects: 4, lat: 51.8312, lng: 4.9754, desc: "Zonne-energie in Zuid-Holland." },
  { name: "Vlaardingen", projects: 3, lat: 51.9125, lng: 4.3411, desc: "Duurzame woningen aan het water." },
  { name: "Schiedam", projects: 3, lat: 51.9167, lng: 4.3833, desc: "Zonnepanelen en opslag." },
  { name: "Spijkenisse", projects: 3, lat: 51.8500, lng: 4.3333, desc: "Residentiële verduurzaming." },
  { name: "Capelle aan den IJssel", projects: 2, lat: 51.9333, lng: 4.5833, desc: "Groene stroom." },
  { name: "Nieuwegein", projects: 3, lat: 52.0333, lng: 5.0833, desc: "Duurzame energie." },
  { name: "Houten", projects: 2, lat: 52.0333, lng: 5.1667, desc: "Zonnepanelen installatie." },
];

// Simplified coordinates outlining the Netherlands border
const netherlandsBorder: [number, number][] = [
  [51.35, 3.35], [51.5, 3.4], [51.75, 3.8], [51.85, 4.1],
  [52.0, 4.1], [52.3, 4.5], [52.5, 4.6], [52.7, 4.6],
  [52.95, 4.7], [53.05, 4.75], [53.15, 5.0], [53.3, 5.1],
  [53.45, 5.6], [53.45, 6.0], [53.5, 6.2], [53.6, 6.6],
  [53.55, 7.2], [53.25, 7.2], [53.15, 7.2], [53.0, 7.0],
  [52.8, 7.0], [52.4, 7.1], [52.2, 7.0], [51.9, 6.2],
  [51.8, 6.0], [51.5, 6.1], [51.2, 6.2], [50.75, 6.0],
  [50.75, 5.7], [51.15, 5.7], [51.25, 5.5], [51.4, 5.0],
  [51.35, 4.8], [51.45, 4.4], [51.3, 4.2], [51.35, 3.8],
  [51.35, 3.35] // Close the loop
];

export default function LeafletMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize Leaflet Map centered to show the full Netherlands
    const map = L.map(mapContainerRef.current, {
      center: [52.13, 5.29],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    // Add CartoDB Positron Tile Layer (clean, minimal light map tiles)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);

    // Draw border highlight polygon for the Netherlands
    L.polygon(netherlandsBorder, {
      color: "#42a8f2",
      weight: 2.5,
      fillColor: "#42a8f2",
      fillOpacity: 0.08,
      interactive: false
    }).addTo(map);

    // Custom pulsing cyan marker icon using Tailwind classes
    const customMarkerIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative w-7 h-7 flex items-center justify-center">
          <div class="absolute w-6 h-6 bg-[#42a8f2]/35 rounded-full animate-ping"></div>
          <div class="relative w-4 h-4 bg-[#42a8f2] border-2 border-white rounded-full shadow-[0_0_12px_rgba(66,168,242,0.8)]"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12]
    });

    // Add project markers
    cityNodes.forEach((city) => {
      const popupContent = `
        <div class="p-2.5 min-w-[170px] font-sans">
          <div class="font-bold text-ink text-sm mb-1">${city.name}</div>
          <div class="text-xs text-brand font-black uppercase tracking-wider mb-1.5">${city.projects} Projecten</div>
          <p class="text-[11px] text-muted leading-snug m-0">${city.desc}</p>
        </div>
      `;

      L.marker([city.lat, city.lng], { icon: customMarkerIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-hairline/80 shadow-inner bg-concrete">
      <style jsx global>{`
        /* Style the map container to map logo colors */
        .leaflet-container {
          font-family: inherit;
          background: #f1f5f9;
          filter: hue-rotate(200deg) saturate(95%) contrast(95%) brightness(96%);
        }
        /* Custom Leaflet popup overrides */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 1px solid var(--color-hairline);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          padding: 4px;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

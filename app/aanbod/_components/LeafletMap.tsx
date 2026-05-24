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
  { name: "Oudewater (HQ)", projects: 480, lat: 52.0233, lng: 4.8686, desc: "Onze thuisbasis met de hoogste dichtheid aan systemen." },
  { name: "Woerden", projects: 290, lat: 52.0862, lng: 4.8837, desc: "Talloze woningen voorzien van slimme zonne-energie." },
  { name: "Utrecht", projects: 380, lat: 52.0907, lng: 5.1214, desc: "Grootschalige warmtepomp- en zonnepaneelcombinaties." },
  { name: "Rotterdam", projects: 220, lat: 51.9244, lng: 4.4777, desc: "Moderne daken met geavanceerde oost-west opstellingen." },
  { name: "Amsterdam", projects: 290, lat: 52.3676, lng: 4.9041, desc: "Zowel monumentale panden als nieuwbouw met maatwerk solar." },
  { name: "Den Haag", projects: 210, lat: 52.0705, lng: 4.3007, desc: "Maximale opbrengsten aan de kustlijn." },
  { name: "Gouda", projects: 170, lat: 52.0116, lng: 4.7105, desc: "Duurzame zonnestroomsystemen in de historische binnenstad." },
  { name: "Breda", projects: 130, lat: 51.5895, lng: 4.7734, desc: "Particuliere verduurzaming en thuisbatterijen." }
];

export default function LeafletMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize Leaflet Map centered in the Netherlands
    const map = L.map(mapContainerRef.current, {
      center: [52.09, 4.8],
      zoom: 8.5,
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

    // Custom pulsing marker icon using Tailwind
    const customMarkerIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative w-6 h-6 flex items-center justify-center">
          <div class="absolute w-5 h-5 bg-[#42a8f2]/35 rounded-full animate-ping"></div>
          <div class="relative w-3.5 h-3.5 bg-[#42a8f2] border-2 border-white rounded-full shadow-md"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -10]
    });

    // Add project markers
    cityNodes.forEach((city) => {
      const popupContent = `
        <div class="p-2 min-w-[150px] font-sans">
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
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-hairline/80 shadow-inner bg-concrete">
      <style jsx global>{`
        /* Style the map container to map logo colors */
        .leaflet-container {
          font-family: inherit;
          background: #f1f5f9;
          filter: hue-rotate(200deg) saturate(90%) contrast(95%) brightness(96%);
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

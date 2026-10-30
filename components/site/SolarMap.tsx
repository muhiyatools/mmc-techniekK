"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { Icon } from "@/components/ui/Icon";
import { COVERAGE_LOCATIONS, NL_BOUNDS } from "@/lib/coverage";
import { type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

type View = "region" | "country";

/**
 * OpenStreetMap view of the towns where we have fitted panels.
 *
 * Leaflet is pulled in on mount, so the library never ships with the page shell
 * and the map still renders its towns as text if the tiles cannot load. Tiles are
 * tinted toward the site's paper/blue palette in globals.css; the pins stay exact
 * so the geography is not distorted.
 */
export function SolarMap({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const fit = useRef<{ region: () => void; country: () => void } | null>(null);
  const [view, setView] = useState<View>("region");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let instance: LeafletMap | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current) return;

      const centre = COVERAGE_LOCATIONS[0];
      instance = L.map(holder.current, {
        center: [centre.lat, centre.lng],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
        minZoom: 7,
        maxZoom: 16,
      });
      map.current = instance;

      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      });
      tiles.on("tileerror", () => setFailed(true));
      tiles.addTo(instance);

      const pin = L.divIcon({ className: "mmc-pin-wrap", html: '<span class="mmc-pin"><span class="mmc-pin-core"></span></span>', iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -14] });

      const points = COVERAGE_LOCATIONS.map((loc) => {
        const route = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
        return L.marker([loc.lat, loc.lng], { icon: pin, title: loc.place, alt: loc.place, keyboard: true }).addTo(instance!).bindPopup(
          `<div class="mmc-popup"><strong>${loc.place}</strong><a href="${route}" target="_blank" rel="noopener noreferrer">${d.cta.route}</a></div>`,
          { closeButton: false, offset: [0, -2] },
        );
      });

      const regionBounds = L.latLngBounds(points.map((m) => m.getLatLng()));
      const countryBounds = L.latLngBounds([NL_BOUNDS.southWest.lat, NL_BOUNDS.southWest.lng], [NL_BOUNDS.northEast.lat, NL_BOUNDS.northEast.lng]);

      fit.current = {
        region: () => instance?.fitBounds(regionBounds, { padding: [48, 48], maxZoom: 11 }),
        country: () => instance?.fitBounds(countryBounds, { padding: [8, 8] }),
      };
      fit.current.region();
    })();

    return () => {
      cancelled = true;
      instance?.remove();
      map.current = null;
      fit.current = null;
    };
    // Rebuild only when the language changes (popup copy).
  }, [d]);

  useEffect(() => {
    // Leaflet needs the container size recalculated after a view switch or a resize.
    map.current?.invalidateSize();
    if (view === "country") fit.current?.country();
    else fit.current?.region();
  }, [view]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-[var(--radius-tile)] border border-line bg-white sm:rounded-[var(--radius-card)]">
        <div ref={holder} role="application" aria-label={d.map.mapLabel} className="map-canvas h-[380px] w-full sm:h-[460px] lg:h-[520px]" />

        {/* View switch: the local workspace, or the whole country for context. */}
        <div className="absolute right-3 top-3 z-[500] flex items-center gap-1 rounded-full border border-line bg-white/95 p-1 shadow-[0_8px_24px_-12px_rgb(15_27_38/0.35)] backdrop-blur-sm">
          {(["region", "country"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className="h-8 rounded-full px-3 text-[13px] font-semibold text-ink transition-colors hover:bg-paper aria-pressed:bg-ink aria-pressed:text-white"
            >
              {v === "region" ? d.map.region : d.map.country}
            </button>
          ))}
        </div>

        {failed && (
          <p className="absolute inset-x-3 bottom-3 z-[500] flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-[13px] text-slate shadow-[0_8px_24px_-12px_rgb(15_27_38/0.35)]">
            <Icon name="alert" size={16} className="text-graphite" />
            {d.map.unavailable}{" "}
            <a href="https://www.openstreetmap.org/#map=9/52.05/4.95" target="_blank" rel="noopener noreferrer" className="link">
              {d.map.openMap}
            </a>
          </p>
        )}
      </div>

      {/* The same information as text: readable without the map, and indexable. */}
      <ul className="flex flex-wrap gap-x-2 gap-y-2">
        {COVERAGE_LOCATIONS.map((loc) => (
          <li key={loc.place} className="t-mono rounded-md bg-white px-2.5 py-1.5 text-slate shadow-[inset_0_0_0_1px_var(--color-line)]">
            {loc.place}
          </li>
        ))}
      </ul>
    </div>
  );
}

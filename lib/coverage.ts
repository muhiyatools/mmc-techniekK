/**
 * Towns where we have completed installations, used by the coverage map on the
 * solar-panel page.
 *
 * Hand-maintained on purpose: the project records carry no address, so this list
 * is the single place to add a town after a job there (or remove one). Keep it
 * inside the area we actually serve, Oudewater and the Utrecht/Gouda/Woerden
 * triangle, so the map never claims work we did not do.
 */
export type CoverageLocation = {
  /** Town name, shown in the marker popup. Same in both locales. */
  place: string;
  lat: number;
  lng: number;
};

/** Centre of our own workshop, used to anchor the "home" marker. */
export const HOME_BASE = { place: "Oudewater", lat: 52.0247, lng: 4.8667 };

export const COVERAGE_LOCATIONS: readonly CoverageLocation[] = [
  { place: "Oudewater", lat: 52.0247, lng: 4.8667 },
  { place: "Montfoort", lat: 52.0447, lng: 4.9514 },
  { place: "Linschoten", lat: 52.0892, lng: 4.9272 },
  { place: "Woerden", lat: 52.0853, lng: 4.8833 },
  { place: "Harmelen", lat: 52.0886, lng: 4.9664 },
  { place: "Bodegraven", lat: 52.0842, lng: 4.7481 },
  { place: "Gouda", lat: 52.0115, lng: 4.7106 },
  { place: "Nieuwegein", lat: 52.0297, lng: 5.0817 },
  { place: "IJsselstein", lat: 52.0197, lng: 5.0432 },
  { place: "De Meern", lat: 52.0817, lng: 5.0333 },
  { place: "Utrecht", lat: 52.0907, lng: 5.1214 },
  { place: "Houten", lat: 52.0289, lng: 5.1681 },
];

/** Rough bounding box of the Netherlands, used by the "all of the Netherlands" view. */
export const NL_BOUNDS = {
  southWest: { lat: 50.72, lng: 3.32 },
  northEast: { lat: 53.58, lng: 7.24 },
} as const;

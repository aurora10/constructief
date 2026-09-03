import { citiesData } from '@/data/cities';

// Per-city programmatic-SEO enrichment.
//
// `nearbyCities` maps a base city slug to the slugs of real, nearby cities that
// also have their own landing page under /diensten/onderaannemer-{slug}. This:
//   - adds genuine local relevance (real surrounding municipalities),
//   - distributes internal crawl/link equity across the city cluster,
//   - lets Google see a coherent, interlinked set of local pages instead of
//     isolated near-duplicates.
//
// Every slug here MUST exist in src/data/cities.ts (targetCities). Keep it that
// way so the links always resolve to a real page.

export const nearbyCities: Record<string, string[]> = {
  // Belgium
  antwerpen: ['mechelen', 'sint-niklaas', 'leuven'],
  gent: ['aalst', 'sint-niklaas', 'kortrijk'],
  brussel: ['leuven', 'mechelen', 'aalst'],
  brugge: ['oostende', 'kortrijk', 'roeselare'],
  leuven: ['brussel', 'mechelen', 'antwerpen'],
  mechelen: ['antwerpen', 'leuven', 'brussel'],
  hasselt: ['genk', 'maastricht', 'luik'],
  luik: ['hasselt', 'genk', 'maastricht'],
  aalst: ['gent', 'sint-niklaas', 'brussel'],
  kortrijk: ['roeselare', 'brugge', 'gent'],
  'sint-niklaas': ['antwerpen', 'gent', 'aalst'],
  oostende: ['brugge', 'roeselare', 'kortrijk'],
  genk: ['hasselt', 'maastricht', 'luik'],
  roeselare: ['kortrijk', 'brugge', 'oostende'],
  // Netherlands
  amsterdam: ['zaandam', 'haarlem', 'utrecht'],
  rotterdam: ['den-haag', 'dordrecht', 'zoetermeer'],
  'den-haag': ['rotterdam', 'zoetermeer', 'leiden'],
  utrecht: ['amersfoort', 'amsterdam', 'nijmegen'],
  eindhoven: ['tilburg', 'breda', 's-hertogenbosch'],
  tilburg: ['eindhoven', 'breda', 's-hertogenbosch'],
  almere: ['amsterdam', 'utrecht', 'zwolle'],
  groningen: ['zwolle', 'enschede', 'amersfoort'],
  breda: ['tilburg', 'eindhoven', 'rotterdam'],
  nijmegen: ['arnhem', 's-hertogenbosch', 'utrecht'],
  apeldoorn: ['amersfoort', 'zwolle', 'arnhem'],
  haarlem: ['amsterdam', 'zaandam', 'leiden'],
  enschede: ['apeldoorn', 'zwolle', 'arnhem'],
  arnhem: ['nijmegen', 'apeldoorn', 'utrecht'],
  amersfoort: ['utrecht', 'apeldoorn', 'amsterdam'],
  zaandam: ['amsterdam', 'haarlem', 'amersfoort'],
  's-hertogenbosch': ['tilburg', 'eindhoven', 'utrecht'],
  zwolle: ['amersfoort', 'apeldoorn', 'enschede'],
  zoetermeer: ['den-haag', 'rotterdam', 'leiden'],
  leiden: ['den-haag', 'zoetermeer', 'amsterdam'],
  maastricht: ['luik', 'hasselt', 'genk'],
  dordrecht: ['rotterdam', 'zoetermeer', 'breda'],
};

export function getNearbyCities(slug: string): string[] {
  return nearbyCities[slug] ?? [];
}

// Only these trades get dedicated trade+city pages, and only where we genuinely
// deliver ready teams (per the strategy: don't mass-generate thin pages).
export const flagshipTrades = ['gevel', 'renovatie', 'beton', 'dak', 'ruwbouw', 'interieur'];

export function parseDienstenSlug(slug: string): { trade?: string; city: string | null } {
  const rest = slug.replace(/^onderaannemer-/, '');
  const parts = rest.split('-');
  // Trade+city slugs look like "gevel-antwerpen". Only treat the first segment
  // as a trade when it is a known flagship trade AND the remainder is a real city
  // (so a real city slug such as "s-hertogenbosch" is never mis-parsed).
  if (parts.length > 1 && flagshipTrades.includes(parts[0])) {
    const city = parts.slice(1).join('-');
    if (citiesData.some((c) => c.slug === city)) {
      return { trade: parts[0], city };
    }
  }
  // Base trade page ("renovatie"): a single segment that is a flagship trade.
  // Renders as a city-agnostic trade landing (nation-wide for that trade).
  if (parts.length === 1 && flagshipTrades.includes(parts[0])) {
    return { trade: parts[0], city: null };
  }
  return { city: rest };
}

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

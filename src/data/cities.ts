export type CityData = {
  slug: string;
  name: string;
  province: string;
  country: string;
  variation: 1 | 2 | 3;
  popularTrades: string[];
};

export const citiesData: CityData[] = [
  // Belgium - Major Cities
  { slug: "antwerpen", name: "Antwerpen", province: "Antwerpen", country: "BE", variation: 1, popularTrades: ["trade_metser", "trade_bekister", "trade_kraanmachinist", "trade_ploegbaas"] },
  { slug: "gent", name: "Gent", province: "Oost-Vlaanderen", country: "BE", variation: 2, popularTrades: ["trade_bekister", "trade_ijzervlechter", "trade_elektricien_ind", "trade_hvac"] },
  { slug: "brussel", name: "Brussel", province: "Brussel Hoofdstedelijk Gewest", country: "BE", variation: 3, popularTrades: ["trade_schilder", "trade_stukadoor", "trade_loodgieter", "trade_handlanger"] },
  { slug: "brugge", name: "Brugge", province: "West-Vlaanderen", country: "BE", variation: 1, popularTrades: ["trade_dakwerker_plat", "trade_dakwerker_hellend", "trade_schrijnwerker_binnen", "trade_schrijnwerker_buiten"] },
  { slug: "leuven", name: "Leuven", province: "Vlaams-Brabant", country: "BE", variation: 2, popularTrades: ["trade_metser", "trade_werfleider", "trade_ploegbaas", "trade_elektricien_resi"] },
  { slug: "mechelen", name: "Mechelen", province: "Antwerpen", country: "BE", variation: 3, popularTrades: ["trade_gyproc", "trade_tegelzetter", "trade_monteur_ramen", "trade_handlanger"] },
  { slug: "hasselt", name: "Hasselt", province: "Limburg", country: "BE", variation: 1, popularTrades: ["trade_grondwerker", "trade_wegenwerker", "trade_graafkraanmachinist", "trade_kraanmachinist"] },
  { slug: "luik", name: "Luik", province: "Luik", country: "BE", variation: 2, popularTrades: ["trade_lasser", "trade_elektricien_ind", "trade_hvac", "trade_stellingbouwer"] },
  { slug: "aalst", name: "Aalst", province: "Oost-Vlaanderen", country: "BE", variation: 3, popularTrades: ["trade_metser", "trade_bekister", "trade_ijzervlechter", "trade_stukadoor"] },
  { slug: "kortrijk", name: "Kortrijk", province: "West-Vlaanderen", country: "BE", variation: 1, popularTrades: ["trade_schrijnwerker_buiten", "trade_monteur_ramen", "trade_dakwerker_plat", "trade_lasser"] },
  { slug: "sint-niklaas", name: "Sint-Niklaas", province: "Oost-Vlaanderen", country: "BE", variation: 2, popularTrades: ["trade_elektricien_resi", "trade_loodgieter", "trade_hvac", "trade_tegelzetter"] },
  { slug: "oostende", name: "Oostende", province: "West-Vlaanderen", country: "BE", variation: 3, popularTrades: ["trade_schilder", "trade_stukadoor", "trade_gyproc", "trade_handlanger"] },
  { slug: "genk", name: "Genk", province: "Limburg", country: "BE", variation: 1, popularTrades: ["trade_lasser", "trade_elektricien_ind", "trade_stellingbouwer", "trade_kraanmachinist"] },
  { slug: "roeselare", name: "Roeselare", province: "West-Vlaanderen", country: "BE", variation: 2, popularTrades: ["trade_metser", "trade_dakwerker_hellend", "trade_schrijnwerker_binnen", "trade_ploegbaas"] },

  // Netherlands - Major Cities
  { slug: "amsterdam", name: "Amsterdam", province: "Noord-Holland", country: "NL", variation: 3, popularTrades: ["trade_schilder", "trade_stukadoor", "trade_loodgieter", "trade_hvac"] },
  { slug: "rotterdam", name: "Rotterdam", province: "Zuid-Holland", country: "NL", variation: 1, popularTrades: ["trade_lasser", "trade_elektricien_ind", "trade_kraanmachinist", "trade_graafkraanmachinist"] },
  { slug: "den-haag", name: "Den Haag", province: "Zuid-Holland", country: "NL", variation: 2, popularTrades: ["trade_metser", "trade_tegelzetter", "trade_gyproc", "trade_elektricien_resi"] },
  { slug: "utrecht", name: "Utrecht", province: "Utrecht", country: "NL", variation: 3, popularTrades: ["trade_bekister", "trade_werfleider", "trade_ploegbaas", "trade_handlanger"] },
  { slug: "eindhoven", name: "Eindhoven", province: "Noord-Brabant", country: "NL", variation: 1, popularTrades: ["trade_elektricien_ind", "trade_lasser", "trade_hvac", "trade_monteur_ramen"] },
  { slug: "tilburg", name: "Tilburg", province: "Noord-Brabant", country: "NL", variation: 2, popularTrades: ["trade_grondwerker", "trade_wegenwerker", "trade_graafkraanmachinist", "trade_stellingbouwer"] },
  { slug: "almere", name: "Almere", province: "Flevoland", country: "NL", variation: 3, popularTrades: ["trade_metser", "trade_dakwerker_plat", "trade_dakwerker_hellend", "trade_schrijnwerker_binnen"] },
  { slug: "groningen", name: "Groningen", province: "Groningen", country: "NL", variation: 1, popularTrades: ["trade_schilder", "trade_stukadoor", "trade_gyproc", "trade_tegelzetter"] },
  { slug: "breda", name: "Breda", province: "Noord-Brabant", country: "NL", variation: 2, popularTrades: ["trade_bekister", "trade_ijzervlechter", "trade_kraanmachinist", "trade_ploegbaas"] },
  { slug: "nijmegen", name: "Nijmegen", province: "Gelderland", country: "NL", variation: 3, popularTrades: ["trade_schrijnwerker_buiten", "trade_monteur_ramen", "trade_loodgieter", "trade_hvac"] },
  { slug: "apeldoorn", name: "Apeldoorn", province: "Gelderland", country: "NL", variation: 1, popularTrades: ["trade_elektricien_resi", "trade_loodgieter", "trade_tegelzetter", "trade_handlanger"] },
  { slug: "haarlem", name: "Haarlem", province: "Noord-Holland", country: "NL", variation: 2, popularTrades: ["trade_metser", "trade_stukadoor", "trade_schilder", "trade_dakwerker_hellend"] },
  { slug: "enschede", name: "Enschede", province: "Overijssel", country: "NL", variation: 3, popularTrades: ["trade_grondwerker", "trade_wegenwerker", "trade_graafkraanmachinist", "trade_stellingbouwer"] },
  { slug: "arnhem", name: "Arnhem", province: "Gelderland", country: "NL", variation: 1, popularTrades: ["trade_lasser", "trade_elektricien_ind", "trade_hvac", "trade_kraanmachinist"] },
  { slug: "amersfoort", name: "Amersfoort", province: "Utrecht", country: "NL", variation: 2, popularTrades: ["trade_bekister", "trade_ijzervlechter", "trade_werfleider", "trade_ploegbaas"] },
  { slug: "zaandam", name: "Zaandam", province: "Noord-Holland", country: "NL", variation: 3, popularTrades: ["trade_schrijnwerker_binnen", "trade_schrijnwerker_buiten", "trade_monteur_ramen", "trade_gyproc"] },
  { slug: "s-hertogenbosch", name: "s-Hertogenbosch", province: "Noord-Brabant", country: "NL", variation: 1, popularTrades: ["trade_metser", "trade_tegelzetter", "trade_elektricien_resi", "trade_loodgieter"] },
  { slug: "zwolle", name: "Zwolle", province: "Overijssel", country: "NL", variation: 2, popularTrades: ["trade_dakwerker_plat", "trade_dakwerker_hellend", "trade_schilder", "trade_stukadoor"] },
  { slug: "zoetermeer", name: "Zoetermeer", province: "Zuid-Holland", country: "NL", variation: 3, popularTrades: ["trade_grondwerker", "trade_wegenwerker", "trade_graafkraanmachinist", "trade_handlanger"] },
  { slug: "leiden", name: "Leiden", province: "Zuid-Holland", country: "NL", variation: 1, popularTrades: ["trade_bekister", "trade_ijzervlechter", "trade_ploegbaas", "trade_werfleider"] },
  { slug: "maastricht", name: "Maastricht", province: "Limburg (NL)", country: "NL", variation: 2, popularTrades: ["trade_lasser", "trade_elektricien_ind", "trade_kraanmachinist", "trade_stellingbouwer"] },
  { slug: "dordrecht", name: "Dordrecht", province: "Zuid-Holland", country: "NL", variation: 3, popularTrades: ["trade_metser", "trade_schrijnwerker_binnen", "trade_schrijnwerker_buiten", "trade_monteur_ramen"] }
];

export const targetCities = citiesData.map(c => c.slug);

// Strategy: stop mass-generating thin city pages. Only high-value cities get
// promoted via the sitemap / internal linking; the remaining city URLs are
// de-emphasised (not advertised in the sitemap).
//
// - flagshipCitySlugs: the Belgian cities worth full landing pages.
// - nlMarketCitySlugs: Dutch-market cities that already show search demand in
//   GSC (e.g. Amsterdam, Rotterdam). Served as Dutch-language (/nl/) pages — the
//   /nl/ prefix is the LANGUAGE locale, not "Netherlands"; hreflang handles the
//   country pairing.
export const flagshipCitySlugs = ['antwerpen', 'gent', 'leuven', 'brussel'];
export const nlMarketCitySlugs = ['amsterdam', 'rotterdam', 'den-haag', 'utrecht'];

export const indexedCitySlugs = [...flagshipCitySlugs, ...nlMarketCitySlugs];

// Helper to get formatted name for display
export const formatCityName = (citySlug: string) => {
  const city = citiesData.find(c => c.slug === citySlug);
  if (city) return city.name;
  return citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

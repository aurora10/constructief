import { citiesData, indexedCitySlugs, flagshipCitySlugs } from '@/data/cities';
import { flagshipTrades } from '@/data/cityContent';
import { getArticles } from '@/content/nieuws';
import nl from '@/messages/nl.json';

const BASE = 'https://constructief-bouw.be';

/**
 * /llms.txt — machine-readable index for AI assistants / retrieval agents.
 * Generated from the live data sources (cities, trades, articles, messages),
 * so it can never drift when cities, trades or posts are added.
 */

function truncate(text: string, max = 165): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function line(title: string, url: string, description: string): string {
    return `- [${title}](${url}): ${truncate(description)}`;
}

export function GET(): Response {
    const citiesSeo = (nl as any).CitiesSeo ?? {};
    const tradeMessages = (nl as any).Trades ?? {};

    const out: string[] = [];

    out.push('# Constructief Bouw');
    out.push('');
    out.push(
        '> Constructief levert gescreende, legale bouwploegen en vakmensen aan hoofdaannemers en grote bouwbedrijven in België en Nederland. A1-verklaringen, Limosa-meldingen en Checkinatwork worden vooraf geregeld, met een 14-dagen testweek en vergoeding op resultaat.',
    );
    out.push('');
    out.push(
        'Werkgebied: België (Vlaanderen, Brussel) en Nederland. Talen: Nederlands, Frans, Russisch. Uitsluitend B2B — geen particuliere opdrachten.',
    );
    out.push('');

    // Core pages
    out.push('## Kernpagina\'s');
    out.push(line('Constructief Bouw', `${BASE}/nl`, 'Onderaannemers en bouwpersoneel voor hoofdaannemers; B2B, heel België en Nederland.'));
    out.push(line('Voor werkgevers / aannemers', `${BASE}/nl/werkgevers`, 'Onderaannemer bouw inhuren: gescreende bouwploegen, legale tewerkstelling met A1 en Limosa, 14-dagen testweek, vergoeding op resultaat.'));
    out.push(line('Voor vakmensen', `${BASE}/nl/kandidaten`, 'Inschrijven als vakman of ploeg; geen account nodig, persoonlijke screening en begeleiding.'));
    out.push(line('Projecten en vacatures', `${BASE}/nl/vacatures`, 'Actuele bouwprojecten en functies bij aannemers en bouwbedrijven.'));
    out.push(line('Over Constructief', `${BASE}/nl/over-ons`, 'Persoonlijke aanpak: screening, referenties en kwaliteitsgarantie.'));
    out.push(line('Contact', `${BASE}/nl/contact`, 'Direct contact voor capaciteitsaanvragen en vragen van aannemers.'));
    out.push(line('Sous-traitance bâtiment (FR)', `${BASE}/fr/sous-traitance-batiment`, 'Sous-traitance de main-d\'œuvre pour entrepreneurs généraux: équipes légales, A1 et Limosa gérés.'));
    out.push('');

    // Regions
    out.push('## Regio\'s (city landing pages)');
    for (const slug of indexedCitySlugs) {
        const city = citiesData.find((c) => c.slug === slug);
        if (!city) continue;
        const desc = citiesSeo[slug]
            ? citiesSeo[slug]
            : `Gescreende bouwploegen en vakmensen in ${city.name} (${city.province}) — legaal, met A1 en Limosa geregeld.`;
        out.push(line(`Onderaannemer ${city.name}`, `${BASE}/nl/diensten/onderaannemer-${city.slug}`, desc));
    }
    out.push('');

    // Trade + city teams
    out.push('## Vakploegen per regio (trade + city)');
    for (const trade of flagshipTrades) {
        const label = tradeMessages[trade]?.label ?? trade;
        for (const citySlug of flagshipCitySlugs) {
            const city = citiesData.find((c) => c.slug === citySlug);
            if (!city) continue;
            const intro = tradeMessages[trade]?.intro
                ? String(tradeMessages[trade].intro).replace(/\{city\}/g, city.name)
                : `${label}-ploegen in ${city.name}: gescreend, legaal en direct inzetbaar.`;
            out.push(line(`${label} — ${city.name}`, `${BASE}/nl/diensten/onderaannemer-${trade}-${city.slug}`, intro));
        }
    }
    out.push('');

    // Insights
    out.push('## Insights voor aannemers');
    for (const article of getArticles('nl')) {
        out.push(line(article.title, `${BASE}/nl/nieuws/${article.slug}`, article.description));
    }
    out.push('');

    // Sub-contractor intake
    out.push('## Voor onderaannemers en ploegen (inschrijven)');
    out.push(line('Inschrijven als onderaannemer (NL)', `${BASE}/nl/onderaannemer-inschrijven`, 'Registratie van ploegen en zelfstandige vakmensen: specialisatie, documenten, beschikbaarheid en tarief; foto\'s van recent werk.'));
    out.push(line('Inscription sous-traitant (FR)', `${BASE}/fr/onderaannemer-inschrijven`, 'Inscription des équipes et artisans indépendants: spécialisation, documents, disponibilité et tarif.'));
    out.push(line('Регистрация субподрядчика (RU)', `${BASE}/ru/onderaannemer-inschrijven`, 'Регистрация бригад и мастеров: специализация, документы, доступность и ставка.'));
    out.push('');

    out.push('## Contact');
    out.push('- E-mail: info@constructief.be');
    out.push('- Telefoon / WhatsApp: +32 465 811 031');
    out.push('- Regio kantoor: Antwerpen, België');
    out.push('');
    out.push('## Technisch');
    out.push(`- Sitemap: ${BASE}/sitemap.xml`);
    out.push(`- Robots: ${BASE}/robots.txt`);
    out.push('');

    return new Response(out.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}

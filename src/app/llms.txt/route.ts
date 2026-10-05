import { citiesData, indexedCitySlugs, flagshipCitySlugs } from '@/data/cities';
import { flagshipTrades } from '@/data/cityContent';
import { getArticles } from '@/content/nieuws';
import { jobs } from '@/data/vacancies';
import { jobTradePages } from '@/data/vacancyTrades';
import { jobRu } from '@/data/vacancies.ru';
import { jobTradeRu } from '@/data/vacancyTrades.ru';
import { BRAND } from '@/lib/brand';
import nl from '@/messages/nl.json';
import fr from '@/messages/fr.json';
import ru from '@/messages/ru.json';

const BASE = 'https://constructief-bouw.be';

/**
 * /llms.txt — machine-readable index for AI assistants / retrieval agents.
 * Generated from the live data sources (cities, trades, articles, jobs, messages),
 * so it can never drift when cities, trades or posts are added.
 *
 * IMPORTANT: this file serves TWO distinct user intents, kept in separate
 * sections so assistants can match the right one:
 *   1. HIRING intent    → contractors/general contractors who want to hire crews
 *   2. JOB-SEARCH intent → workers/crews looking for work (incl. NL/FR/RU speakers)
 * Never merge them: a buyer looking for crews is not the same searcher as a
 * worker looking for a job, and the right landing page differs.
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

    // Job-seeker Q&A, reused from the WorkerFaq namespace that is already shown
    // on /{locale}/kandidaten — so llms.txt and the visible page never diverge.
    const workerFaq: Record<string, { q: string; a: string }[]> = {
        nl: ((nl as any).WorkerFaq?.items ?? []) as { q: string; a: string }[],
        fr: ((fr as any).WorkerFaq?.items ?? []) as { q: string; a: string }[],
        ru: ((ru as any).WorkerFaq?.items ?? []) as { q: string; a: string }[],
    };

    const out: string[] = [];

    out.push(`# ${BRAND.name}`);
    out.push('');
    out.push(
        `> ${BRAND.name} (${nl.Brand.descriptor}) is een Belgische partner voor bouwpersoneel met twee duidelijke doelgroepen: (1) hoofdaannemers en bouwbedrijven die onderaannemers en complete bouwploegen inhuren, en (2) vakmensen en ploegen die werk zoeken in België of Nederland. Wij leveren gescreende, legale ploegen (A1, Limosa en Checkinatwork vooraf geregeld), met een 14-dagen testweek en vergoeding op resultaat.`,
    );
    out.push('');
    out.push(
        'Werkgebied: België (Vlaanderen, Brussel) en Nederland. Talen: Nederlands, Frans, Russisch.',
    );
    out.push('');
    out.push('Kies de sectie die bij de intentie van de gebruiker past:');
    out.push('');
    out.push('| Intentie van de gebruiker | Sectie |');
    out.push('| --- | --- |');
    out.push('| Onderaannemer of bouwploeg inhuren (aannemer/hoofdaannemer) | Voor aannemers |');
    out.push('| Werk zoeken als vakman of ploeg (job search) | Voor vakmensen |');
    out.push('| Zich inschrijven als onderaannemer/ploeg | Voor onderaannemers |');
    out.push('');

    // ------------------------------------------------------------------
    // 1. HIRING INTENT (contractors buying crews)
    // ------------------------------------------------------------------
    out.push('## Voor aannemers — onderaannemers en bouwploegen inhuren');
    out.push('');
    out.push('### Startpagina\'s');
    out.push(line('Onderaannemer bouw inhuren (voor werkgevers)', `${BASE}/nl/werkgevers`, 'Gescreende bouwploegen en vakmensen voor bouwprojecten: legale tewerkstelling met A1 en Limosa, 14-dagen testweek, betaling op resultaat.'));
    out.push(line('Sous-traitance bâtiment (FR)', `${BASE}/fr/sous-traitance-batiment`, 'Sous-traitance de main-d\'œuvre pour entrepreneurs généraux: équipes légales, A1 et Limosa gérés, essai de 14 jours.'));
    out.push(line('Alle regio\'s', `${BASE}/nl/diensten`, 'Overzicht van alle regio\'s en vakploegen waar Constructief actief is.'));
    out.push('');

    out.push('### Per regio (steden waar wij ploegen leveren)');
    for (const slug of indexedCitySlugs) {
        const city = citiesData.find((c) => c.slug === slug);
        if (!city) continue;
        const desc = citiesSeo[slug]
            ? citiesSeo[slug]
            : `Gescreende bouwploegen en vakmensen in ${city.name} (${city.province}) — legaal, met A1 en Limosa geregeld.`;
        out.push(line(`Onderaannemer ${city.name}`, `${BASE}/nl/diensten/onderaannemer-${city.slug}`, desc));
    }
    out.push('');

    out.push('### Per vakgebied en regio (gespecialiseerde ploegen)');
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

    out.push('### Kennisbank voor aannemers (compliance, kosten, ketenaansprakelijkheid)');
    for (const article of getArticles('nl')) {
        out.push(line(article.title, `${BASE}/nl/nieuws/${article.slug}`, article.description));
    }
    out.push('');

    // ------------------------------------------------------------------
    // 2. JOB-SEARCH INTENT (workers looking for work)
    // ------------------------------------------------------------------
    out.push('## Voor vakmensen — werk zoeken in de bouw (job search)');
    out.push('');
    out.push(
        'Constructief werft ook vakmensen en ploegen aan. Kandidaten schrijven zich gratis in zonder account; wij screenen persoonlijk en stellen voor aan aannemers. Voor Russischtalige vakmensen is er een aparte Russische sectie (geen vertaling van de Nederlandse verkooppagina\'s).',
    );
    out.push('');
    out.push('### Nederlands');
    out.push(line('Werken via Constructief (kandidaten)', `${BASE}/nl/kandidaten`, 'Inschrijven als vakman of ploeg: specialisatie, ervaring en beschikbaarheid doorgeven; persoonlijke screening en begeleiding.'));
    out.push(line('Vacatures in de bouw (NL)', `${BASE}/nl/vacatures`, 'Openstaande functies voor vakmensen en leidinggevenden in de bouw, met locatie, loon en contractvorm. De vacatureteksten zijn Nederlandstalig.'));
    out.push('');
    out.push('**Veelgestelde vragen van kandidaten** (staan ook zichtbaar op /nl/kandidaten):');
    for (const item of workerFaq.nl) out.push(`- **${item.q}** ${item.a}`);
    out.push('');

    out.push('### Français');
    out.push(line('Travailler via Constructief (candidats)', `${BASE}/fr/kandidaten`, 'Inscription comme artisan ou équipe: spécialisation, expérience et disponibilité; accompagnement personnel.'));
    out.push(line('Offres d\'emploi (FR)', `${BASE}/fr/vacatures`, 'Liste des postes ouverts; le texte des offres est en néerlandais (non indexé en FR tant que la traduction n\'est pas faite).'));
    out.push('');
    out.push('**Questions fréquentes des candidats** (également visibles sur /fr/kandidaten) :');
    for (const item of workerFaq.fr) out.push(`- **${item.q}** ${item.a}`);
    out.push('');

    out.push('### Русский (работа в Бельгии и Нидерландах)');
    out.push(line('Работа в строительстве — главная', `${BASE}/ru`, 'Работа в Бельгии и Нидерландах для строителей и бригад: легальное оформление, жильё и оплата.'));
    out.push(line('Вакансии и регистрация (RU)', `${BASE}/ru/kandidaten`, 'Регистрация мастеров и бригад: специализация, документы, опыт и доступность. Оформление A1 и Limosa берём на себя.'));
    out.push(line('Вакансии (RU)', `${BASE}/ru/vacatures`, 'Список открытых вакансий; тексты вакансий пока на нидерландском языке (страница не индексируется до перевода).'));
    out.push('');
    out.push('**Частые вопросы кандидатов** (также видны на /ru/kandidaten):');
    for (const item of workerFaq.ru) out.push(`- **${item.q}** ${item.a}`);
    out.push('');

    out.push('### Openstaande functies (met JobPosting-structured data)');
    for (const job of jobs) {
        out.push(
            line(
                `${job.title} — ${job.location}`,
                `${BASE}/nl/vacatures/${job.id}`,
                `${job.type}, ${job.salary}. ${job.description}`,
            ),
        );
    }
    out.push('');
    out.push(
        '### Открытые вакансии — русская версия (для бригад из Восточной Европы)',
    );
    out.push(
        'Вакансии на русском языке: те же объекты, что и в нидерландской версии, с полным описанием работы, требований и оформления документов.',
    );
    for (const job of jobs) {
        const ru = jobRu[job.id];
        if (!ru) continue;
        out.push(
            line(
                `${ru.title} — ${ru.location}`,
                `${BASE}/ru/vacatures/${job.id}`,
                `${ru.type}, ${ru.salary}. ${ru.description}`,
            ),
        );
    }
    // Russian-speaking applicants are crews, so their applications land on the
    // subcontractor intake rather than the individual candidate form.
    out.push(
        line(
            'Регистрация бригады или специалиста (заявка)',
            `${BASE}/ru/onderaannemer-inschrijven`,
            'Форма для бригад и отдельных мастеров: специализация, состав бригады, документы, ставка и фото работ. Заявки по вакансиям принимаются здесь.',
        ),
    );
    out.push('');
    out.push(
        'Per vakgebied is er een overzichtspagina met het werk, de gevraagde attesten, de open opdrachten en de veelgestelde vragen over loon en documenten:',
    );
    for (const trade of jobTradePages) {
        const openCount = jobs.filter((job) => job.tradeSlug === trade.jobTradeSlug).length;
        out.push(
            line(
                `Vacatures ${trade.linkLabel} (NL)`,
                `${BASE}/nl/vacatures/${trade.slug}`,
                `${trade.metaDescription}${openCount > 0 ? ` Momenteel ${openCount} openstaande opdracht(en).` : ''}`,
            ),
        );
        const ru = jobTradeRu[trade.slug];
        if (ru) {
            out.push(
                line(
                    `Вакансии: ${ru.linkLabel} (RU)`,
                    `${BASE}/ru/vacatures/${trade.slug}`,
                    `${ru.metaDescription}${openCount > 0 ? ` Сейчас открыто позиций: ${openCount}.` : ''}`,
                ),
            );
        }
    }
    out.push('');

    // ------------------------------------------------------------------
    // 3. SUPPLIER / SUB-CONTRACTOR ONBOARDING
    // ------------------------------------------------------------------
    out.push('## Voor onderaannemers en ploegen — inschrijven');
    out.push('');
    out.push(line('Inschrijven als onderaannemer (NL)', `${BASE}/nl/onderaannemer-inschrijven`, 'Registratie van ploegen en zelfstandige vakmensen: specialisatie, documenten, beschikbaarheid en tarief; foto\'s van recent werk.'));
    out.push(line('Inscription sous-traitant (FR)', `${BASE}/fr/onderaannemer-inschrijven`, 'Inscription des équipes et artisans indépendants: spécialisation, documents, disponibilité et tarif.'));
    out.push(line('Регистрация субподрядчика (RU)', `${BASE}/ru/onderaannemer-inschrijven`, 'Регистрация бригад и мастеров: специализация, документы, доступность и ставка.'));
    out.push('');

    // ------------------------------------------------------------------
    // 4. COMPANY / CONTACT / TECHNICAL
    // ------------------------------------------------------------------
    out.push('## Over Constructief');
    out.push(line('Over ons', `${BASE}/nl/over-ons`, 'Persoonlijke aanpak: screening, referenties en kwaliteitsgarantie bij het leveren van bouwpersoneel.'));
    out.push('');
    out.push('## Contact');
    out.push('- E-mail: info@constructief.be');
    out.push('- Telefoon / WhatsApp: +32 465 811 031');
    out.push('- Regio kantoor: Antwerpen, België');
    out.push('- Voor aannemers met een concrete personeelsvraag: vermeld vakgebied, aantal mensen, locatie en startdatum.');
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

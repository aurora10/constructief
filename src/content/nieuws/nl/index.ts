import type { Article } from '../types';

import { article as duurzaamBouwen } from './toekomst-duurzaam-bouwen';
import { article as veiligheidWerf } from './veiligheid-op-de-werf';
import { article as regelgeving2026 } from './nieuwe-regelgeving-2026';
import { article as onderaannemerInhuren } from './onderaannemer-bouw-inhuren';
import { article as a1Limosa } from './a1-limosa-check-hoofdaannemer';
import { article as kostenPloeg } from './kosten-bouwploeg-per-uur';
import { article as zwartwerk } from './zwartwerk-vermijden-checklist';
import { article as a1Digitaal } from './a1-digitaal-2026-nieuwe-eu-afspraken';
import { article as ketenaansprakelijkheid } from './ketenaansprakelijkheid-2026-zorgvuldigheidsplicht';

// Newest first
export const articles: Article[] = [
    ketenaansprakelijkheid,
    a1Digitaal,
    zwartwerk,
    kostenPloeg,
    a1Limosa,
    onderaannemerInhuren,
    duurzaamBouwen,
    veiligheidWerf,
    regelgeving2026,
];

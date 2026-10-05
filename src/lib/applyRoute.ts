/**
 * Where an "apply" button sends someone.
 *
 * The two audiences use two different intakes, on purpose:
 *  - ru: the crews we recruit in Eastern Europe are teams looking for work as
 *    subcontractors, so they register on the subcontractor intake (specialisation,
 *    team size, documents, rate, photos of recent work).
 *  - nl/fr: individual candidates use the candidate form.
 *
 * Everything that links to an application goes through here, so the destination is
 * defined once instead of being hardcoded in every button.
 */
export interface ApplyContext {
    /** Job.tradeSlug — used by trade pages. */
    vak?: string;
    /** Job.id — used by a specific vacancy. */
    vacature?: number;
}

export function applyHref(locale: string, context: ApplyContext = {}): string {
    const base = locale === 'ru' ? '/onderaannemer-inschrijven' : '/kandidaten';

    const params = new URLSearchParams();
    if (context.vak) params.set('vak', context.vak);
    if (context.vacature !== undefined) params.set('vacature', String(context.vacature));

    const query = params.toString();
    return query ? `${base}?${query}` : base;
}

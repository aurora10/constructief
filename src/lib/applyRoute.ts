/**
 * Where an "apply" button sends someone.
 *
 * There is exactly ONE funnel: crews and self-employed specialists register on the
 * subcontractor intake (specialisation, team size, documents, rate, photos of recent
 * work). Constructief brokers between contractors and crews — it is not an employment
 * agency and does not employ anyone — so a separate "candidate" funnel no longer
 * exists (/kandidaten now redirects here permanently).
 */
export interface ApplyContext {
    /** Job.tradeSlug — used by trade pages. */
    vak?: string;
    /** Job.id — used by a specific vacancy. */
    vacature?: number;
}

export function applyHref(_locale: string, context: ApplyContext = {}): string {
    const params = new URLSearchParams();
    if (context.vak) params.set('vak', context.vak);
    if (context.vacature !== undefined) params.set('vacature', String(context.vacature));

    const query = params.toString();
    return query ? `/onderaannemer-inschrijven?${query}` : '/onderaannemer-inschrijven';
}

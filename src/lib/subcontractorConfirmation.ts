/**
 * Localised confirmation email sent to a sub-contractor right after a
 * successful registration through /[locale]/onderaannemer-inschrijven.
 *
 * Only the strings are per-locale; the text/HTML layout is built once so all
 * three languages stay structurally identical.
 */

export const CONFIRMATION_LOCALES = ['nl', 'fr', 'ru'] as const;
export type ConfirmationLocale = (typeof CONFIRMATION_LOCALES)[number];

export function resolveConfirmationLocale(value: unknown): ConfirmationLocale {
  return CONFIRMATION_LOCALES.includes(value as ConfirmationLocale)
    ? (value as ConfirmationLocale)
    : 'nl';
}

export interface ConfirmationData {
  recordId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  legal_status: string;
  car_and_tools: string;
  location: string;
  rate: string;
  languages: string;
  team_size: string;
  availability: string;
}

type FieldKey = keyof Omit<ConfirmationData, 'recordId' | 'name' | 'email'>;

interface Strings {
  subject: (name: string) => string;
  greeting: (name: string) => string;
  intro: string;
  summaryTitle: string;
  referenceLabel: string;
  labels: Record<FieldKey, string>;
  nextTitle: string;
  nextBody: string;
  helpTitle: string;
  helpBody: string;
  signOff: string;
  company: string;
  automatedNote: string;
}

const SUPPORT_PHONE = '+32 465 811031';
const SITE_URL = 'https://constructief-bouw.be';

const STRINGS: Record<ConfirmationLocale, Strings> = {
  nl: {
    subject: (name) => `Bevestiging van je inschrijving als onderaannemer – ${name}`,
    greeting: (name) => `Beste ${name},`,
    intro:
      'Bedankt voor je inschrijving bij Constructief. We hebben je gegevens goed ontvangen en toegevoegd aan ons netwerk van onderaannemers.',
    summaryTitle: 'Overzicht van je inschrijving',
    referenceLabel: 'Referentie',
    labels: {
      phone: 'Telefoon (WhatsApp)',
      specialization: 'Specialisatie',
      legal_status: 'Documenten / recht om te werken',
      car_and_tools: 'Auto en gereedschap',
      location: 'Locatie',
      rate: 'Gewenst tarief',
      languages: 'Talen op de werf',
      team_size: 'Alleen of ploeg',
      availability: 'Beschikbaarheid',
    },
    nextTitle: 'Wat gebeurt er nu?',
    nextBody:
      'Onze recruiter bekijkt je profiel en neemt contact met je op via WhatsApp of telefoon zodra er een passend project is.',
    helpTitle: 'Vragen of iets aanpassen?',
    helpBody:
      'Dit is een automatisch bericht — antwoorden worden niet gelezen. Stuur een WhatsApp-bericht voor vragen of wijzigingen.',
    signOff: 'Met vriendelijke groeten,',
    company: 'Het team van Constructief',
    automatedNote: 'Dit is een automatische bevestiging van je inschrijving via onze website.',
  },
  fr: {
    subject: (name) => `Confirmation de votre inscription en tant que sous-traitant – ${name}`,
    greeting: (name) => `Bonjour ${name},`,
    intro:
      "Merci pour votre inscription chez Constructief. Nous avons bien reçu vos données et les avons ajoutées à notre réseau de sous-traitants.",
    summaryTitle: 'Récapitulatif de votre inscription',
    referenceLabel: 'Référence',
    labels: {
      phone: 'Téléphone (WhatsApp)',
      specialization: 'Spécialisation',
      legal_status: 'Documents / droit de travailler',
      car_and_tools: 'Véhicule et outillage',
      location: 'Localisation',
      rate: 'Tarif souhaité',
      languages: 'Langues sur chantier',
      team_size: 'Seul ou équipe',
      availability: 'Disponibilité',
    },
    nextTitle: 'Et maintenant ?',
    nextBody:
      'Notre recruteur examine votre profil et vous contactera par WhatsApp ou par téléphone dès qu’un projet correspondant se présente.',
    helpTitle: 'Des questions ou une modification ?',
    helpBody:
      'Ce message est automatique — les réponses ne sont pas lues. Envoyez un message WhatsApp pour toute question ou modification.',
    signOff: 'Cordialement,',
    company: "L'équipe Constructief",
    automatedNote: "Ceci est une confirmation automatique de votre inscription via notre site web.",
  },
  ru: {
    subject: (name) => `Подтверждение регистрации субподрядчика – ${name}`,
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      'Спасибо за регистрацию в Constructief. Мы получили ваши данные и добавили их в нашу базу субподрядчиков.',
    summaryTitle: 'Ваша заявка',
    referenceLabel: 'Номер заявки',
    labels: {
      phone: 'Телефон (WhatsApp)',
      specialization: 'Специализация',
      legal_status: 'Документы / право на работу',
      car_and_tools: 'Транспорт и инструмент',
      location: 'Локация',
      rate: 'Желаемая ставка',
      languages: 'Языки на объекте',
      team_size: 'Один или бригада',
      availability: 'Доступность',
    },
    nextTitle: 'Что дальше?',
    nextBody:
      'Наш рекрутер изучит ваш профиль и свяжется с вами через WhatsApp или по телефону, как только появится подходящий объект.',
    helpTitle: 'Есть вопросы или нужно что-то изменить?',
    helpBody:
      'Это автоматическое сообщение — ответы не читаются. Напишите в WhatsApp, если есть вопросы или нужны изменения.',
    signOff: 'С уважением,',
    company: 'Команда Constructief',
    automatedNote: 'Это автоматическое подтверждение вашей регистрации на нашем сайте.',
  },
};

const FIELD_ORDER: FieldKey[] = [
  'phone',
  'specialization',
  'legal_status',
  'car_and_tools',
  'location',
  'rate',
  'languages',
  'team_size',
  'availability',
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: string | undefined | null): string {
  return (value ?? '').trim();
}

export interface BuiltConfirmationEmail {
  subject: string;
  text: string;
  html: string;
}

export function buildSubcontractorConfirmation(
  locale: ConfirmationLocale,
  data: ConfirmationData,
): BuiltConfirmationEmail {
  const s = STRINGS[locale];
  const rows = FIELD_ORDER.map((key) => [s.labels[key], clean(data[key])] as const).filter(
    ([, value]) => value !== '',
  );

  const text = [
    s.greeting(clean(data.name)),
    '',
    s.intro,
    '',
    `${s.summaryTitle}:`,
    `${s.referenceLabel}: ${data.recordId}`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `${s.nextTitle} ${s.nextBody}`,
    '',
    `${s.helpTitle} ${s.helpBody}`,
    SUPPORT_PHONE,
    '',
    s.signOff,
    s.company,
    SITE_URL,
    '',
    s.automatedNote,
  ].join('\n');

  const htmlRows = [
    [s.referenceLabel, data.recordId],
    ...rows.map(([label, value]) => [label, value] as [string, string]),
  ]
    .map(
      ([label, value]) => `
                        <tr>
                          <td style="padding:8px 12px;border-bottom:1px solid #eef2f7;color:#64748b;font-size:14px;vertical-align:top;">${escapeHtml(
                            label,
                          )}</td>
                          <td style="padding:8px 12px;border-bottom:1px solid #eef2f7;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(
                            value,
                          )}</td>
                        </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(s.subject(clean(data.name)))}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:24px 12px;">
      <div style="background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background-color:#1d4ed8;padding:22px 28px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">Constructief</span>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:600;">${escapeHtml(
            s.greeting(clean(data.name)),
          )}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(
            s.intro,
          )}</p>

          <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0f172a;">${escapeHtml(
            s.summaryTitle,
          )}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background-color:#f8fafc;border-radius:10px;overflow:hidden;">
            ${htmlRows}
          </table>

          <p style="margin:24px 0 8px;font-size:15px;font-weight:700;color:#0f172a;">${escapeHtml(
            s.nextTitle,
          )}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(
            s.nextBody,
          )}</p>

          <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0f172a;">${escapeHtml(
            s.helpTitle,
          )}</p>
          <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(
            s.helpBody,
          )}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
            <a href="tel:${SUPPORT_PHONE.replace(/\s/g, '')}" style="color:#1d4ed8;text-decoration:none;font-weight:600;">${escapeHtml(
              SUPPORT_PHONE,
            )}</a>
          </p>

          <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(
            s.signOff,
          )}<br /><span style="font-weight:600;color:#0f172a;">${escapeHtml(s.company)}</span></p>
        </div>
        <div style="padding:16px 28px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">${escapeHtml(s.automatedNote)}</p>
          <p style="margin:0;font-size:12px;">
            <a href="${SITE_URL}" style="color:#64748b;text-decoration:none;">constructief-bouw.be</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`;

  return { subject: s.subject(clean(data.name)), text, html };
}

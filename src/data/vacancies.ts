export interface Job {
    id: number;
    title: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
}

export const jobs: Job[] = [
    {
        id: 1,
        title: "Projectleider Bouw",
        location: "Antwerpen",
        type: "Fulltime",
        salary: "€4000 - €5500",
        description: "Wij zoeken een ervaren projectleider voor grote utiliteitsbouwprojecten. Als projectleider ben je verantwoordelijk for de algehele leiding over diverse bouwprojecten vanaf de voorbereidingsfase tot de oplevering.",
        requirements: [
            "Bachelor of Master in de Bouwkunde",
            "Minimaal 5 jaar ervaring in een soortgelijke functie",
            "Uitstekende organisatorische en communicatieve vaardigheden",
            "Vloeiend in het Nederlands"
        ]
    },
    {
        id: 2,
        title: "Werfleider",
        location: "Gent",
        type: "Fulltime",
        salary: "€3500 - €4500",
        description: "Leid de werf in goede banen en stuur het team aan.",
        requirements: [
            "Ervaring als werfleider in de bouw",
            "Leidinggevende capaciteiten",
            "Kennis van veiligheidsvoorschriften"
        ]
    },
    {
        id: 3,
        title: "Bekister",
        location: "Brussel",
        type: "Interim",
        salary: "€17 - €19 / uur",
        description: "Ervaren bekister gezocht voor diverse projecten.",
        requirements: [
            "Ervaring met traditionele en systeembekisting",
            "Planlezen",
            "Nauwkeurig werken"
        ]
    },
    {
        id: 4,
        title: "Kraanmachinist",
        location: "Limburg",
        type: "Fulltime",
        salary: "€18 - €20 / uur",
        description: "Torenkraanmachinist met attest gezocht.",
        requirements: [
            "Geldig attest torenkraan",
            "Ervaring is een pluspunt",
            "Veiligheidsbewust"
        ]
    },
    {
        id: 5,
        title: "Metser",
        location: "West-Vlaanderen",
        type: "Fulltime",
        salary: "€16 - €18 / uur",
        description: "Metselaar voor nieuwbouw en renovatie.",
        requirements: [
            "Ervaring met metselwerken",
            "Zelfstandig kunnen werken",
            "Fysiek in orde"
        ]
    },
    {
        id: 6,
        title: "Elektricien",
        location: "Antwerpen",
        type: "Fulltime",
        salary: "€17 - €19 / uur",
        description: "Industrieel elektricien voor onderhoudswerken.",
        requirements: [
            "Diploma elektriciteit",
            "Ervaring in industrie",
            "Kennis van PLC is een plus"
        ]
    },
];

import type { MetadataRoute } from 'next'

/**
 * AI crawler policy:
 *  - Retrieval / citation agents (they surface + link content) are explicitly allowed.
 *  - Training-only agents are opted out. Note: Google-Extended and Applebot-Extended
 *    only control AI training; they do NOT affect Google/Bing search inclusion.
 *  - Private areas stay disallowed for every agent.
 */
const RETRIEVAL_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'];

const TRAINING_ONLY_AGENTS = [
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'anthropic-ai',
    'Meta-ExternalAgent',
    'Bytespider',
    'cohere-ai',
];

const PRIVATE_PATHS = ['/private/', '/profiles/', '/api/'];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Traditional search engines (behaviour unchanged)
            {
                userAgent: '*',
                allow: '/',
                disallow: PRIVATE_PATHS,
            },
            // AI retrieval / citation agents — explicitly allowed
            ...RETRIEVAL_AGENTS.map((userAgent) => ({
                userAgent,
                allow: '/',
                disallow: PRIVATE_PATHS,
            })),
            // AI training-only agents — opted out
            ...TRAINING_ONLY_AGENTS.map((userAgent) => ({
                userAgent,
                disallow: '/',
            })),
        ],
        sitemap: 'https://constructief-bouw.be/sitemap.xml',
        host: 'https://constructief-bouw.be',
    }
}

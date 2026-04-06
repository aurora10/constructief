import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Create a new ratelimiter, that allows 5 requests per 60 seconds
// This is distributed across all your application instances
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: 'constructief_ratelimit',
});

/**
 * Checks the rate limit for a given identifier (e.g., IP address).
 * Note: Since this is async (external Redis call), we'll use it directly in API routes.
 */
export async function checkRateLimit(identifier: string): Promise<boolean> {
    // If Redis credentials are not set, allow requests to avoid breaking the site
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn('UPSTASH_REDIS credentials missing. Rate limiting is currently DISABLED.');
        return true; 
    }

    try {
        const { success } = await ratelimit.limit(identifier);
        return success;
    } catch (error) {
        console.error('Rate limit check failed:', error);
        return true; // Fallback to allow if error
    }
}

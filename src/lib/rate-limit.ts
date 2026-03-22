interface RateLimitInfo {
    count: number;
    startTime: number;
}

const rateLimitMap = new Map<string, RateLimitInfo>();

export function checkRateLimit(ip: string): boolean {
    // Allow a maximum of 5 Form Submissions per minute, per IP Address 
    const windowMs = 60 * 1000;
    const maxRequests = 5;

    const rateLimitInfo = rateLimitMap.get(ip);
    const now = Date.now();

    if (!rateLimitInfo) {
        rateLimitMap.set(ip, {
            count: 1,
            startTime: now,
        });
        return true; // OK
    }

    if (now - rateLimitInfo.startTime > windowMs) {
        // Reset window
        rateLimitInfo.startTime = now;
        rateLimitInfo.count = 1;
        return true; // OK
    }

    if (rateLimitInfo.count >= maxRequests) {
        return false; // RATE LIMITED
    }

    rateLimitInfo.count++;
    return true; // OK
}

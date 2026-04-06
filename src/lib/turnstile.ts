export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) return false;

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY is not defined. Skipping verification in development mode (if intended).');
    // If you strictly want to enforce it even if unset, return false.
    // Assuming for now if it's missing, maybe it's not configured locally, 
    // but in production it will fail if we return false. Let's strictly return false on missing to be secure.
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}

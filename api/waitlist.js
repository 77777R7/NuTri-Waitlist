const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';

function sendJson(status, body, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function getBeehiivErrorMessage(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  if (typeof payload.message === 'string') return payload.message;
  if (typeof payload.error === 'string') return payload.error;
  if (Array.isArray(payload.errors)) {
    return payload.errors
      .map((error) => error?.message || error?.detail || error)
      .filter(Boolean)
      .join(' ');
  }
  return JSON.stringify(payload);
}

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return sendJson(405, { ok: false, message: 'Method not allowed.' }, { Allow: 'POST' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return sendJson(400, { ok: false, message: 'Invalid request body.' });
  }

  const email = String(body.email || '').trim().toLowerCase();

  // Honeypot: real visitors never fill this hidden field, but many bots do.
  if (body.company) {
    return sendJson(200, { ok: true });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return sendJson(400, {
      ok: false,
      message: 'Please enter a valid email address.',
    });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('beehiiv waitlist is missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID');

    return sendJson(500, {
      ok: false,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Unable to join the waitlist right now. Please try again soon.'
          : 'Waitlist is not configured yet.',
    });
  }

  const subscribePayload = {
    email,
    reactivate_existing: false,
    send_welcome_email: process.env.BEEHIIV_SEND_WELCOME_EMAIL === 'true',
    utm_source: 'trynutri.app',
    utm_medium: 'waitlist_form',
    utm_campaign: 'waitlist_launch',
    referring_site: request.headers.get('referer') || 'https://trynutri.app',
  };

  const doubleOptOverride = process.env.BEEHIIV_DOUBLE_OPT_OVERRIDE;
  if (['on', 'off', 'not_set'].includes(doubleOptOverride)) {
    subscribePayload.double_opt_override = doubleOptOverride;
  }

  const beehiivResponse = await fetch(
    `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscribePayload),
    }
  );

  const beehiivPayload = await beehiivResponse.json().catch(() => null);

  if (beehiivResponse.ok) {
    return sendJson(200, {
      ok: true,
      message: 'You are on the NuTri waitlist.',
    });
  }

  const beehiivMessage = getBeehiivErrorMessage(beehiivPayload);
  if (/already|duplicate|exist/i.test(beehiivMessage)) {
    return sendJson(200, {
      ok: true,
      alreadySubscribed: true,
      message: 'You are already on the NuTri waitlist.',
    });
  }

  if (beehiivResponse.status === 429) {
    return sendJson(429, {
      ok: false,
      message: 'Too many signup attempts. Please try again in a minute.',
    });
  }

  console.error('beehiiv waitlist error', {
    status: beehiivResponse.status,
    body: beehiivPayload,
  });

  return sendJson(502, {
    ok: false,
    message: 'Unable to join the waitlist right now. Please try again soon.',
  });
}

export default {
  fetch: handleRequest,
};

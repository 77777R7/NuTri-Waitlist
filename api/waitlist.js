import { createHmac } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';
const ATTRIBUTION_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const REFERRAL_CAMPAIGN = 'trial_bonus_invite';
const REFERRAL_CODE_PATTERN = /^[a-f0-9]{12}$/;

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

function cleanAttributionValue(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 200) : '';
}

function cleanReferralCode(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().toLowerCase();
  return REFERRAL_CODE_PATTERN.test(trimmed) ? trimmed : '';
}

function getReferralSecret() {
  return process.env.REFERRAL_LINK_SECRET || process.env.BEEHIIV_API_KEY || 'nutri-waitlist-local-referrals';
}

function createReferralCode(email) {
  return createHmac('sha256', getReferralSecret()).update(email).digest('hex').slice(0, 12);
}

function getSiteUrl() {
  const configuredUrl =
    process.env.NUTRI_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://trynutri.app');

  return configuredUrl.replace(/\/+$/, '');
}

function buildReferralInvite(email) {
  const code = createReferralCode(email);
  const params = new URLSearchParams({
    ref: code,
    utm_source: 'referral',
    utm_medium: 'invite_link',
    utm_campaign: REFERRAL_CAMPAIGN,
    utm_content: code,
  });

  return {
    code,
    inviteUrl: `${getSiteUrl()}/?${params.toString()}`,
    tiers: [
      { friends: 1, bonusDays: 1, totalTrialDays: 4 },
      { friends: 2, bonusDays: 2, totalTrialDays: 5 },
      { friends: 3, bonusDays: 4, totalTrialDays: 7 },
    ],
  };
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
    utm_source: cleanAttributionValue(body.utm_source) || 'trynutri.app',
    utm_medium: cleanAttributionValue(body.utm_medium) || 'waitlist_form',
    utm_campaign: cleanAttributionValue(body.utm_campaign) || 'waitlist_launch',
    referring_site:
      cleanAttributionValue(body.referring_site) ||
      cleanAttributionValue(request.headers.get('referer')) ||
      'https://trynutri.app',
  };

  ATTRIBUTION_FIELDS.forEach((field) => {
    const value = cleanAttributionValue(body[field]);
    if (value) subscribePayload[field] = value;
  });

  const referralCode = cleanReferralCode(body.ref);
  const subscriberReferralCode = createReferralCode(email);
  if (referralCode && referralCode !== subscriberReferralCode) {
    subscribePayload.utm_source = 'referral';
    subscribePayload.utm_medium = 'invite_link';
    subscribePayload.utm_campaign = REFERRAL_CAMPAIGN;
    subscribePayload.utm_content = referralCode;
  }

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
      referral: buildReferralInvite(email),
    });
  }

  const beehiivMessage = getBeehiivErrorMessage(beehiivPayload);
  if (/already|duplicate|exist/i.test(beehiivMessage)) {
    return sendJson(200, {
      ok: true,
      alreadySubscribed: true,
      message: 'You are already on the NuTri waitlist.',
      referral: buildReferralInvite(email),
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

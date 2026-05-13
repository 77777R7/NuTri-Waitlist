import { createHmac } from 'node:crypto';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';
const ATTRIBUTION_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const REFERRAL_CAMPAIGN = 'trial_bonus_invite';
const REFERRAL_CODE_PATTERN = /^[a-f0-9]{12}$/;
const DEFAULT_SITE_URL = 'https://trynutri.app';
const SUPABASE_RPC_PATH = '/rest/v1/rpc';

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
  const configuredUrl = process.env.NUTRI_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;

  return configuredUrl.replace(/\/+$/, '');
}

function buildReferralInvite(email) {
  const code = createReferralCode(email);

  return {
    code,
    inviteUrl: `${getSiteUrl()}/?ref=${code}`,
    tiers: [
      { friends: 1, bonusDays: 1, totalTrialDays: 4 },
      { friends: 2, bonusDays: 2, totalTrialDays: 5 },
      { friends: 3, bonusDays: 4, totalTrialDays: 7 },
    ],
  };
}

function splitEnvList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSupabaseConfig() {
  const url = process.env.NUTRI_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.NUTRI_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return {
    url: url.replace(/\/+$/, ''),
    serviceRoleKey,
  };
}

function getBeehiivConfig() {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) return null;

  return { apiKey, publicationId };
}

function getDoubleOptOverride() {
  const doubleOptOverride = process.env.BEEHIIV_DOUBLE_OPT_OVERRIDE;
  return ['on', 'off', 'not_set'].includes(doubleOptOverride) ? doubleOptOverride : '';
}

function getBeehiivData(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return payload.data && typeof payload.data === 'object' ? payload.data : payload;
}

function getBeehiivSubscriptionId(payload) {
  const data = getBeehiivData(payload);
  return data?.id || data?.subscription_id || payload?.subscription?.id || null;
}

function getBeehiivSubscriptionStatus(payload, fallback = null) {
  const data = getBeehiivData(payload);
  return data?.status || payload?.status || fallback;
}

function buildUtmPayload(body, request, referredByCode) {
  const utm = {
    utm_source: cleanAttributionValue(body.utm_source) || 'trynutri.app',
    utm_medium: cleanAttributionValue(body.utm_medium) || 'waitlist_form',
    utm_campaign: cleanAttributionValue(body.utm_campaign) || 'waitlist_launch',
  };

  ATTRIBUTION_FIELDS.forEach((field) => {
    const value = cleanAttributionValue(body[field]);
    if (value) utm[field] = value;
  });

  if (referredByCode) {
    utm.utm_source = 'referral';
    utm.utm_medium = 'invite_link';
    utm.utm_campaign = REFERRAL_CAMPAIGN;
    utm.utm_content = referredByCode;
  }

  const referringSite =
    cleanAttributionValue(body.referring_site) ||
    cleanAttributionValue(request.headers.get('referer')) ||
    getSiteUrl();

  return { utm, referringSite };
}

function buildBeehiivCustomFields({ email, referralInvite, referredByCode, ledgerRow }) {
  return [
    { name: 'NuTri Referral Code', value: referralInvite.code },
    { name: 'NuTri Invite Link', value: referralInvite.inviteUrl },
    { name: 'NuTri Referred By Code', value: referredByCode || '' },
    { name: 'NuTri Waitlist Referred Count', value: String(ledgerRow?.referred_count ?? 0) },
    { name: 'NuTri Trial Days', value: String(ledgerRow?.total_trial_days ?? 3) },
    { name: 'NuTri Signup Email', value: email },
  ];
}

async function callSupabaseRpc(functionName, payload) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error('Supabase waitlist ledger is missing NUTRI_SUPABASE_URL or service role key');
  }

  const response = await fetch(`${config.url}${SUPABASE_RPC_PATH}/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getBeehiivErrorMessage(responsePayload) || response.statusText;
    throw new Error(`Supabase RPC ${functionName} failed (${response.status}): ${message}`);
  }

  return responsePayload;
}

async function callSupabaseRest(path, params = {}) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error('Supabase waitlist ledger is missing NUTRI_SUPABASE_URL or service role key');
  }

  const url = new URL(`${config.url}/rest/v1/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
  });
  const responsePayload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getBeehiivErrorMessage(responsePayload) || response.statusText;
    throw new Error(`Supabase REST ${path} failed (${response.status}): ${message}`);
  }

  return responsePayload;
}

async function registerWaitlistSignup({
  email,
  referralCode,
  referredByCode,
  utm,
  referringSite,
  beehiivSubscriptionId = null,
  beehiivStatus = null,
  signupStatus = 'active',
  metadata = {},
}) {
  const data = await callSupabaseRpc('register_waitlist_signup', {
    p_email: email,
    p_referral_code: referralCode,
    p_referred_by_code: referredByCode || null,
    p_utm: utm,
    p_beehiiv_subscription_id: beehiivSubscriptionId,
    p_beehiiv_status: beehiivStatus,
    p_signup_status: signupStatus,
    p_referring_site: referringSite,
    p_metadata: metadata,
  });

  return Array.isArray(data) ? data[0] : data;
}

async function markMilestoneEvent(eventId, eventStatus, beehiivResponse) {
  if (!eventId) return;

  await callSupabaseRpc('mark_waitlist_referral_milestone_sent', {
    p_event_id: eventId,
    p_event_status: eventStatus,
    p_beehiiv_response: beehiivResponse || {},
  });
}

async function claimPendingReferralMilestones(limit = 10) {
  const data = await callSupabaseRpc('claim_waitlist_referral_milestone_events', {
    p_limit: limit,
  });

  return Array.isArray(data) ? data : [];
}

async function findPendingReferralMilestonesByCode(referralCode) {
  const cleanCode = cleanReferralCode(referralCode);
  if (!cleanCode) return [];

  const inviterRows = await callSupabaseRest('waitlist_signups', {
    referral_code: `eq.${cleanCode}`,
    select: 'email',
    limit: '1',
  });
  const inviterEmail = inviterRows?.[0]?.email;
  if (!inviterEmail) return [];

  const events = await callSupabaseRest('waitlist_referral_milestone_events', {
    inviter_email: `eq.${inviterEmail}`,
    event_status: 'eq.pending',
    select:
      'event_id:id,inviter_email,milestone_friends,referred_count,bonus_days,total_trial_days',
    order: 'created_at.desc',
    limit: '3',
  });

  return Array.isArray(events) ? events : [];
}

async function beehiivFetch(path, options = {}) {
  const config = getBeehiivConfig();

  if (!config) {
    throw new Error('beehiiv is missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID');
  }

  const response = await fetch(`${BEEHIIV_API_BASE}/publications/${config.publicationId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null);

  return { response, payload };
}

async function syncBeehiivSubscription({ email, subscribePayload }) {
  if (!getBeehiivConfig()) {
    return {
      ok: false,
      signupStatus: 'email_sync_failed',
      beehiivStatus: 'not_configured',
      beehiivSubscriptionId: null,
      error: 'beehiiv is not configured',
    };
  }

  try {
    const { response, payload } = await beehiivFetch('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscribePayload),
    });

    if (response.ok) {
      return {
        ok: true,
        signupStatus: 'active',
        beehiivStatus: getBeehiivSubscriptionStatus(payload, 'active'),
        beehiivSubscriptionId: getBeehiivSubscriptionId(payload),
        payload,
      };
    }

    const beehiivMessage = getBeehiivErrorMessage(payload);
    if (/already|duplicate|exist/i.test(beehiivMessage)) {
      return {
        ok: true,
        alreadySubscribed: true,
        signupStatus: 'duplicate',
        beehiivStatus: 'duplicate',
        beehiivSubscriptionId: getBeehiivSubscriptionId(payload),
        payload,
      };
    }

    return {
      ok: false,
      rateLimited: response.status === 429,
      signupStatus: 'email_sync_failed',
      beehiivStatus: `error_${response.status}`,
      beehiivSubscriptionId: getBeehiivSubscriptionId(payload),
      error: beehiivMessage || response.statusText,
      payload,
    };
  } catch (error) {
    return {
      ok: false,
      signupStatus: 'email_sync_failed',
      beehiivStatus: 'network_error',
      beehiivSubscriptionId: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function getMilestoneEvents(ledgerRow) {
  const events = ledgerRow?.milestone_events;
  if (Array.isArray(events)) return events;
  if (typeof events === 'string') {
    try {
      const parsed = JSON.parse(events);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function buildReferralMilestoneCustomFields(event) {
  return [
    { name: 'NuTri Referral Milestone', value: String(event.milestone_friends) },
    { name: 'NuTri Waitlist Referred Count', value: String(event.referred_count) },
    { name: 'NuTri Bonus Days', value: String(event.bonus_days) },
    { name: 'NuTri Trial Days', value: String(event.total_trial_days) },
  ];
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function updateReferralMilestoneCustomFields(event) {
  let lastError;

  for (const delayMs of [0, 750, 2000]) {
    if (delayMs > 0) {
      await sleep(delayMs);
    }

    const fieldUpdate = await beehiivFetch(`/subscriptions/by_email/${encodeURIComponent(event.inviter_email)}`, {
      method: 'PUT',
      body: JSON.stringify({ custom_fields: buildReferralMilestoneCustomFields(event) }),
    });

    if (fieldUpdate.response.ok) {
      console.info('beehiiv referral milestone custom fields synced', {
        eventId: event.event_id,
        fieldCount: Array.isArray(fieldUpdate.payload?.data?.custom_fields)
          ? fieldUpdate.payload.data.custom_fields.length
          : null,
      });
      return fieldUpdate.payload;
    }

    lastError = new Error(
      getBeehiivErrorMessage(fieldUpdate.payload) ||
        `beehiiv subscription field update failed (${fieldUpdate.response.status})`
    );
  }

  throw lastError || new Error('beehiiv subscription field update failed');
}

async function notifyReferralMilestones(events) {
  if (!events.length) return { configured: true, processed: 0 };

  const automationIds = splitEnvList(
    process.env.BEEHIIV_REFERRAL_MILESTONE_AUTOMATION_IDS ||
      process.env.BEEHIIV_REFERRAL_MILESTONE_AUTOMATION_ID
  );
  const beehiivConfig = getBeehiivConfig();

  if (!beehiivConfig) {
    console.warn('beehiiv referral milestone notification is missing beehiiv config', {
      events: events.map((event) => event.event_id),
    });
    return { configured: false, processed: 0 };
  }

  const fieldUpdates = await Promise.all(events.map(async (event) => {
    try {
      await updateReferralMilestoneCustomFields(event);
      return { event, ok: true };
    } catch (error) {
      console.error('beehiiv referral milestone custom field update failed', {
        eventId: event.event_id,
        inviterEmail: event.inviter_email,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        event,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }));

  if (!automationIds.length) {
    console.warn('beehiiv referral milestone automation is not configured', {
      events: events.map((event) => event.event_id),
    });
    return {
      configured: false,
      processed: 0,
      fieldUpdates: fieldUpdates.filter((result) => result.ok).length,
    };
  }

  await Promise.all(fieldUpdates.map(async (fieldUpdate) => {
    const event = fieldUpdate.event;
    const eventId = event.event_id;
    const inviterEmail = event.inviter_email;

    try {
      if (!fieldUpdate.ok) {
        throw new Error(fieldUpdate.error || 'beehiiv referral milestone custom field update failed');
      }

      const journeyPayloads = [];
      for (const automationId of automationIds) {
        const body = { email: inviterEmail };
        const doubleOptOverride = getDoubleOptOverride();
        if (doubleOptOverride) body.double_opt_override = doubleOptOverride;

        const { response, payload } = await beehiivFetch(`/automations/${automationId}/journeys`, {
          method: 'POST',
          body: JSON.stringify(body),
        });

        journeyPayloads.push({
          automationId,
          ok: response.ok,
          status: response.status,
          payload,
        });

        if (!response.ok) {
          throw new Error(getBeehiivErrorMessage(payload) || `beehiiv automation ${automationId} failed`);
        }
      }

      await markMilestoneEvent(eventId, 'sent', {
        automations: journeyPayloads,
      });
    } catch (error) {
      console.error('beehiiv referral milestone notification failed', {
        eventId,
        inviterEmail,
        error: error instanceof Error ? error.message : String(error),
      });

      await markMilestoneEvent(eventId, 'failed', {
        error: error instanceof Error ? error.message : String(error),
      }).catch((markError) => {
        console.error('failed to mark referral milestone event as failed', markError);
      });
    }
  }));

  return { configured: true, processed: events.length };
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

  if (!getSupabaseConfig()) {
    console.error('Supabase waitlist ledger is missing NUTRI_SUPABASE_URL or service role key');

    return sendJson(500, {
      ok: false,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Unable to join the waitlist right now. Please try again soon.'
          : 'Supabase waitlist ledger is not configured yet.',
    });
  }

  const referralInvite = buildReferralInvite(email);
  const referralCode = cleanReferralCode(body.ref);
  const referredByCode = referralCode && referralCode !== referralInvite.code ? referralCode : '';
  const { utm, referringSite } = buildUtmPayload(body, request, referredByCode);

  let initialLedgerRow;
  try {
    initialLedgerRow = await registerWaitlistSignup({
      email,
      referralCode: referralInvite.code,
      referredByCode,
      utm,
      referringSite,
      signupStatus: 'pending_email_sync',
      metadata: {
        source: 'website_api',
        first_seen_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Supabase waitlist ledger write failed', error);
    return sendJson(502, {
      ok: false,
      message: 'Unable to join the waitlist right now. Please try again soon.',
    });
  }

  const subscribePayload = {
    email,
    reactivate_existing: false,
    send_welcome_email: process.env.BEEHIIV_SEND_WELCOME_EMAIL === 'true',
    referring_site: referringSite,
    ...utm,
    custom_fields: buildBeehiivCustomFields({
      email,
      referralInvite,
      referredByCode,
      ledgerRow: initialLedgerRow,
    }),
  };

  if (referredByCode) {
    subscribePayload.referral_code = referredByCode;
  }

  const welcomeAutomationIds = splitEnvList(
    process.env.BEEHIIV_WELCOME_AUTOMATION_IDS || process.env.BEEHIIV_WELCOME_AUTOMATION_ID
  );
  if (welcomeAutomationIds.length) {
    subscribePayload.automation_ids = welcomeAutomationIds;
  }

  const doubleOptOverride = getDoubleOptOverride();
  if (doubleOptOverride) {
    subscribePayload.double_opt_override = doubleOptOverride;
  }

  const beehiivResult = await syncBeehiivSubscription({ email, subscribePayload });

  let finalLedgerRow = initialLedgerRow;
  try {
    finalLedgerRow = await registerWaitlistSignup({
      email,
      referralCode: referralInvite.code,
      referredByCode,
      utm,
      referringSite,
      beehiivSubscriptionId: beehiivResult.beehiivSubscriptionId,
      beehiivStatus: beehiivResult.beehiivStatus,
      signupStatus: beehiivResult.signupStatus,
      metadata: {
        source: 'website_api',
        beehiiv_synced_at: beehiivResult.ok ? new Date().toISOString() : null,
        beehiiv_error: beehiivResult.ok ? null : beehiivResult.error || 'unknown',
      },
    });
  } catch (error) {
    console.error('Supabase waitlist beehiiv sync status update failed', error);
  }

  let createdMilestoneEvents = getMilestoneEvents(initialLedgerRow);
  if (!createdMilestoneEvents.length && referredByCode) {
    try {
      createdMilestoneEvents = await findPendingReferralMilestonesByCode(referredByCode);
    } catch (error) {
      console.error('failed to load pending referral milestone events by code', {
        referredByCode,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  const milestoneNotification = await notifyReferralMilestones(createdMilestoneEvents);

  if (milestoneNotification.configured) {
    try {
      const pendingMilestoneEvents = await claimPendingReferralMilestones(10);
      const createdEventIds = new Set(createdMilestoneEvents.map((event) => event.event_id));
      const retryEvents = pendingMilestoneEvents.filter((event) => !createdEventIds.has(event.event_id));
      await notifyReferralMilestones(retryEvents);
    } catch (error) {
      console.error('failed to process pending referral milestone events', error);
    }
  }

  if (!beehiivResult.ok) {
    console.error('beehiiv waitlist email sync failed after Supabase ledger write', {
      status: beehiivResult.beehiivStatus,
      error: beehiivResult.error,
    });
  }

  return sendJson(200, {
    ok: true,
    alreadySubscribed: Boolean(beehiivResult.alreadySubscribed),
    emailSync: beehiivResult.ok,
    message: beehiivResult.alreadySubscribed
      ? 'You are already on the NuTri waitlist.'
      : 'You are on the NuTri waitlist.',
    referral: {
      ...referralInvite,
      referredCount: finalLedgerRow?.referred_count ?? 0,
      totalTrialDays: finalLedgerRow?.total_trial_days ?? 3,
      bonusDays: finalLedgerRow?.bonus_days ?? 0,
    },
  });
}

export default {
  fetch: handleRequest,
};

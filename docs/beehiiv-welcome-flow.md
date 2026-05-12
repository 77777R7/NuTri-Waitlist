# NuTri Waitlist Welcome Flow

Status: draft content for beehiiv automation setup.
Audience: new NuTri waitlist subscribers.
Primary goal: help subscribers understand what NuTri does, build trust, and encourage sharing before launch.
Tone: clear, warm, product-focused, not medical advice.

## Automation Setup

Name: NuTri Waitlist Welcome Flow
Trigger: New subscriber joins the NuTri waitlist. In beehiiv, use the API/signup trigger that matches subscribers created through the website waitlist form.
State: Keep draft/inactive until final review.

Cadence:

1. Email 1: send immediately after signup.
2. Email 2: send 2 days after Email 1.
3. Email 3: send 4 days after Email 1, or 2 days after Email 2.

Exit conditions:

- Subscriber unsubscribes.
- Subscriber is manually removed from the waitlist audience.

Tracking links:

- Email 1 CTA: `https://trynutri.app/?utm_source=beehiiv&utm_medium=email&utm_campaign=welcome_flow&utm_content=email_1_cta`
- Email 2 CTA: `mailto:hello@trynutri.app?subject=Supplement%20I%20want%20NuTri%20to%20check`
- Email 3 share link: `https://trynutri.app/?utm_source=referral&utm_medium=email&utm_campaign=welcome_flow&utm_content=forward_to_friend`

Image assets:

- NuTri Score: `https://trynutri.app/email/nutri-score.png`
- Personalized Insights: `https://trynutri.app/email/personalized-insights.png`

Note: If beehiiv's Referral Program is enabled later, replace the Email 3 share button with beehiiv's built-in referral block or subscriber-specific referral link. For MVP, the generic share link above is safer and still tracks friend-invite traffic.

## Email 1

Send timing: Immediately after signup.
Job: Confirm they joined, explain what NuTri helps with, and set launch expectation.

Subject: Thanks for joining NuTri
Preview text: Here is how NuTri will help you understand supplements before you take them.
Primary CTA: Visit NuTri
CTA URL: `https://trynutri.app/?utm_source=beehiiv&utm_medium=email&utm_campaign=welcome_flow&utm_content=email_1_cta`

Body:

```text
Thanks for joining NuTri!

How we help you

NuTri is being built to make supplement decisions clearer before you buy or take something.

You will be able to scan the barcode on a supplement package with our intelligent scanner, or search our growing database when you already know the product you are looking for.

From there, NuTri turns the label into a clearer product view:

Personalized Insights show how a product may fit your goals, dose context, restrictions, allergies, and safety considerations where data is available.

NuTri Score gives you a fast product-quality snapshot across ingredient safety, formula transparency, label clarity, manufacturing standards, testing and verification, and product quality signals.

Deep Dive is the reasoning layer behind the result. It explains what looks strong, what is limited, and what deserves a closer look.

We are still building, but you are now on the list for early access, launch updates, and priority entry when we open.

See you soon,
NuTri
```

Suggested beehiiv blocks:

1. Text block with the body intro.
2. Image block: `https://trynutri.app/email/nutri-score.png`
3. Text block for Personalized Insights and Deep Dive.
4. Image block: `https://trynutri.app/email/personalized-insights.png`
5. Button block: Visit NuTri.

## Email 2

Send timing: 2 days after Email 1.
Job: Teach the product mental model: Score, Insights, Deep Dive.

Subject: What NuTri looks for on a label
Preview text: A quick look at Score, Personalized Insights, and Deep Dive.
Primary CTA: Reply with one supplement you want NuTri to check
CTA URL: `mailto:hello@trynutri.app?subject=Supplement%20I%20want%20NuTri%20to%20check`

Body:

```text
Most supplement labels give you a lot of words, but not always much clarity.

NuTri is designed to organize the product into three simple layers.

NuTri Score is the quick quality view. It is not your personalized fit score. It looks at product-level signals like ingredient safety, formula transparency, label clarity, manufacturing standards, testing and verification, and other quality signals.

Personalized Insights add your context. If you have goals, restrictions, allergy concerns, medication considerations, or dose preferences, NuTri can surface the parts worth checking first.

Deep Dive is for the "why." It breaks down the reasoning behind the result, including ingredient context, evidence strength, label transparency, dose context, testing signals, and caveats.

The goal is not to make the decision for you.

The goal is to make the decision less confusing.

If there is a supplement you want NuTri to support first, reply with the product name or brand.

NuTri
```

Suggested beehiiv blocks:

1. Text block with the body.
2. Image block: `https://trynutri.app/email/nutri-score.png`
3. Image block: `https://trynutri.app/email/personalized-insights.png`
4. Button block: Reply with a product.

## Email 3

Send timing: 4 days after Email 1, or 2 days after Email 2.
Job: Invite subscribers to share NuTri with friends.

Subject: Know someone confused by supplements?
Preview text: Send them the NuTri waitlist link.
Primary CTA: Invite a friend
CTA URL: `https://trynutri.app/?utm_source=referral&utm_medium=email&utm_campaign=welcome_flow&utm_content=forward_to_friend`

Body:

```text
If you know someone who compares supplements, checks labels, or keeps wondering whether a product is actually worth taking, feel free to send them NuTri.

The easiest way is to forward this email.

Or share this link:

https://trynutri.app/?utm_source=referral&utm_medium=email&utm_campaign=welcome_flow&utm_content=forward_to_friend

We are building NuTri for people who want clearer supplement decisions, not more supplement marketing noise.

Every early subscriber helps us understand what users actually need before launch.

Thanks for helping us build the right thing,
NuTri
```

Suggested beehiiv blocks:

1. Text block with the body.
2. Button block: Invite a friend.
3. Optional note below the button: "You can also just forward this email."

## Measurement Plan

Watch these inside beehiiv:

- Email 1 open rate and CTA clicks.
- Email 2 replies and clicks.
- Email 3 share-link clicks.
- Subscriber source breakdown after sharing starts.
- Friend-invite traffic in beehiiv acquisition source and Vercel analytics.

MVP success signal:

- New subscribers understand what NuTri does.
- Email 2 generates product requests or replies.
- Email 3 creates measurable referral traffic through the shared UTM link.


  # 一比一还原代码

  This is a code bundle for 一比一还原代码. The original project is available at https://www.figma.com/design/qNIvxWBhqzxRMGAvlJh5nH/%E4%B8%80%E6%AF%94%E4%B8%80%E8%BF%98%E5%8E%9F%E4%BB%A3%E7%A0%81.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Waitlist backend

  The custom waitlist form submits to `/api/waitlist`, a Vercel Function that
  writes the signup/referral ledger to Supabase and syncs the subscriber to
  beehiiv for email delivery. Supabase is the source of truth; beehiiv is only
  used for welcome, nurture, and referral milestone emails.
  Referral milestone emails are queued in Supabase first; once the beehiiv
  automation env var is configured, the API also retries a small batch of
  pending milestone notifications after each signup.

  Required Vercel environment variables:

  - `NUTRI_SUPABASE_URL`
  - `NUTRI_SUPABASE_SERVICE_ROLE_KEY`
  - `BEEHIIV_API_KEY`
  - `BEEHIIV_PUBLICATION_ID`

  Optional environment variables:

  - `BEEHIIV_SEND_WELCOME_EMAIL=false`
  - `BEEHIIV_DOUBLE_OPT_OVERRIDE=` (`on`, `off`, or `not_set`)
  - `BEEHIIV_WELCOME_AUTOMATION_ID=` for the draft/inactive welcome sequence once enabled
  - `BEEHIIV_REFERRAL_MILESTONE_AUTOMATION_ID=` for the referral milestone notification automation
  - `NUTRI_SITE_URL=https://trynutri.app`
  - `REFERRAL_LINK_SECRET=` stable HMAC secret for short referral codes

beehiiv milestone email requirements:

- The publication must have these custom fields:
  - `NuTri Referral Milestone`
  - `NuTri Waitlist Referred Count`
  - `NuTri Bonus Days`
  - `NuTri Trial Days`
- The milestone automation must be an active beehiiv automation with an
  `Add by API` trigger. A draft automation or an API key without automation
  journey access will leave Supabase milestone events in `pending`.
- Set `BEEHIIV_REFERRAL_MILESTONE_AUTOMATION_ID` (or comma-separated
  `BEEHIIV_REFERRAL_MILESTONE_AUTOMATION_IDS`) on Vercel after the automation is
  live. The API updates beehiiv custom fields first, then adds the inviter to
  the automation journey and marks the Supabase event `sent`.

  The waitlist form passes UTM attribution from the current URL to beehiiv. Use
  platform-specific links when sharing NuTri:

  - LinkedIn: `https://trynutri.app/?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_launch`
  - Instagram: `https://trynutri.app/?utm_source=instagram&utm_medium=social&utm_campaign=waitlist_launch`
  - Instagram bio: `https://trynutri.app/?utm_source=instagram&utm_medium=social&utm_campaign=waitlist_launch&utm_content=bio`

  Referral links shown after signup are intentionally short:
  `https://trynutri.app/?ref=xxxx`.

  Trial bonus rules are fixed:

  - Default waitlist trial: 3 days
  - 1 confirmed friend: 4 days total
  - 2 confirmed friends: 5 days total
  - 3 or more confirmed friends: 7 days total
  

import React from 'react';
import { Link } from 'react-router';

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

const lastUpdated = 'May 12, 2026';

const pageShellClass =
  "w-full max-w-4xl mx-auto rounded-[28px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.24)] border border-[rgba(255,255,255,0.58)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_20px_60px_rgba(0,0,0,0.05)]";

const termsSections: LegalSection[] = [
  {
    title: '1. About NuTri',
    body: [
      'NuTri is an early-stage supplement information product. This website is currently used to share information about NuTri and collect waitlist signups for future product access and launch updates.',
      'By using this website, you agree to these Terms. If you do not agree, please do not use the website.',
    ],
  },
  {
    title: '2. Informational use only',
    body: [
      'NuTri is not a medical provider and does not provide medical advice, diagnosis, treatment, or emergency support. Website content is provided for general informational purposes only.',
      'Supplement decisions can depend on your health conditions, medications, allergies, pregnancy status, and other personal factors. You should speak with a qualified healthcare professional before starting, stopping, or changing any supplement.',
    ],
  },
  {
    title: '3. Waitlist access',
    body: [
      'Joining the waitlist does not guarantee access to NuTri, beta features, founding member pricing, or any specific launch timeline. We may change, delay, limit, or discontinue waitlist access at any time as the product develops.',
      'You are responsible for providing an accurate email address if you want to receive updates from us.',
    ],
  },
  {
    title: '4. Email updates',
    body: [
      'If you join the waitlist, you agree that NuTri may send you emails related to launch updates, product news, beta access, and similar NuTri communications. You can unsubscribe from marketing emails at any time using the unsubscribe link in the email or by contacting us.',
    ],
  },
  {
    title: '5. No unlawful or harmful use',
    body: [
      'You may not use this website in a way that interferes with the website, attempts to access non-public systems, submits false or automated signups, or violates applicable laws.',
    ],
  },
  {
    title: '6. Intellectual property',
    body: [
      'The NuTri name, logo, website design, copy, graphics, and related materials are owned by NuTri or its licensors. You may not copy, modify, or use them for commercial purposes without permission.',
    ],
  },
  {
    title: '7. Third-party services and links',
    body: [
      'This website may use or link to third-party services, including hosting, email, analytics, and social platforms. We are not responsible for third-party websites, products, services, or policies.',
    ],
  },
  {
    title: '8. Disclaimers',
    body: [
      'This website is provided on an "as is" and "as available" basis. We do not promise that the website will be uninterrupted, error-free, or always available.',
      'To the fullest extent permitted by law, NuTri disclaims warranties of any kind, whether express, implied, or statutory.',
    ],
  },
  {
    title: '9. Limitation of liability',
    body: [
      'To the fullest extent permitted by law, NuTri will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or loss of goodwill arising from your use of the website.',
    ],
  },
  {
    title: '10. Changes to these Terms',
    body: [
      'We may update these Terms as NuTri evolves. If we make changes, we will update the "Last updated" date on this page. Your continued use of the website after changes means you accept the updated Terms.',
    ],
  },
  {
    title: '11. Contact',
    body: [
      'For questions about these Terms, contact us at hello@trynutri.app.',
    ],
  },
];

const privacySections: LegalSection[] = [
  {
    title: '1. What we collect',
    body: [
      'When you join the waitlist, we collect the email address you submit. We may also receive basic technical information such as your browser, device type, IP address, referring page, and the time of your visit or signup.',
      'If you contact us directly, we may collect the information you choose to include in your message.',
    ],
  },
  {
    title: '2. How we use information',
    body: [
      'We use your information to operate the waitlist, send NuTri launch updates, communicate about beta access or product news, prevent spam or abuse, understand website performance, and improve NuTri.',
      'We do not use waitlist email addresses to make medical decisions, and we do not sell your personal information.',
    ],
  },
  {
    title: '3. Email communications',
    body: [
      'If you join the waitlist, we may email you about NuTri. You can unsubscribe from marketing emails at any time using the unsubscribe link in the email or by contacting us.',
    ],
  },
  {
    title: '4. Service providers',
    body: [
      'We use service providers to operate the website and waitlist. These may include Vercel for hosting and beehiiv for email list management and newsletter-related services.',
      'These providers process information on our behalf or according to their own terms and privacy policies. We only share information needed for the services they provide.',
    ],
  },
  {
    title: '5. Legal and safety reasons',
    body: [
      'We may disclose information if required by law, to protect NuTri, our users, or others, or to investigate security, fraud, abuse, or technical issues.',
    ],
  },
  {
    title: '6. Retention',
    body: [
      'We keep waitlist information for as long as needed to operate the waitlist, send updates, maintain business records, comply with legal obligations, and manage unsubscribe or deletion requests.',
    ],
  },
  {
    title: '7. Your choices',
    body: [
      'You can unsubscribe from emails at any time. You can also ask us to delete or update your waitlist email by contacting us at hello@trynutri.app.',
      'If we need to keep limited information for legal, security, or unsubscribe-record purposes, we may retain only what is necessary.',
    ],
  },
  {
    title: '8. Children',
    body: [
      'NuTri is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has submitted information to us, please contact us.',
    ],
  },
  {
    title: '9. International users',
    body: [
      'NuTri may use service providers in different countries. By using the website or joining the waitlist, your information may be processed in countries other than where you live.',
    ],
  },
  {
    title: '10. Changes to this Policy',
    body: [
      'We may update this Privacy Policy as NuTri evolves. If we make changes, we will update the "Last updated" date on this page.',
    ],
  },
  {
    title: '11. Contact',
    body: [
      'For privacy questions or requests, contact us at hello@trynutri.app.',
    ],
  },
];

function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <main className="flex-1 w-full pt-24 pb-20 md:pt-28 md:pb-24 z-20">
      <article className={`${pageShellClass} animate-fade-up px-6 py-8 md:px-12 md:py-12 lg:px-14`}>
        <div className="mb-10 border-b border-slate-900/10 pb-8">
          <Link
            to="/"
            className="font-inter text-sm font-semibold text-slate-900/55 transition-colors hover:text-slate-900"
          >
            Back to NuTri
          </Link>
          <h1 className="mt-5 font-['DM_Serif_Display'] text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-slate-900 md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl font-inter text-base leading-[1.7] text-slate-900/68 md:text-lg">
            {intro}
          </p>
          <p className="mt-5 font-inter text-sm font-semibold text-slate-900/45">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-inter text-lg font-bold leading-tight text-slate-900 md:text-xl">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="font-inter text-[15px] leading-[1.75] text-slate-900/70 md:text-base">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <footer className="mt-12 flex flex-col gap-4 border-t border-slate-900/10 pt-6 font-inter text-sm font-semibold text-slate-900/55 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-5">
            <Link to="/terms" className="transition-colors hover:text-slate-900">
              Terms of Service
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-slate-900">
              Privacy Policy
            </Link>
          </div>
          <p>&copy; 2026 NuTri. All rights reserved.</p>
        </footer>
      </article>
    </main>
  );
}

export function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These Terms are a lightweight agreement for the current NuTri waitlist website. They are intended for this early product stage and may be updated as NuTri launches new features."
      sections={termsSections}
    />
  );
}

export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how NuTri handles information collected through the waitlist website while the product is still in its early launch stage."
      sections={privacySections}
    />
  );
}

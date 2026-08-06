export type GuideReason = {
  number: string;
  title: string;
  problem: string;
  why: string;
  fix: string;
};

export const metaAdsGuide = {
  eyebrow: 'Free clinic guide',
  title: "Top 10 reasons your clinic's ads are struggling on Meta",
  subtitle:
    'The rejection triggers, targeting mistakes, and landing-page gaps we see most — and what to fix first.',
  intro:
    'If your Meta ads for GLP-1, peptide, weight loss, hormone, or longevity programs keep getting rejected, stalling in review, or generating leads that never book — it is rarely a “boost the budget” problem. It is usually a system problem: policy, page, proof, and follow-up working against each other.',
  audienceNote:
    'Written for clinic owners and operators running medically guided, high-value programs — not generic local service ads.',
  reasons: [
    {
      number: '01',
      title: 'Your ads read like prescription advertising',
      problem:
        'Copy names medications, doses, “get semaglutide,” or implies a treatment outcome before any clinical process. Meta’s health and prescription-adjacent rules treat that as high-risk inventory.',
      why: 'Review systems flag regulated-health language fast. Resubmitting the same claim with a different image does not fix the underlying policy conflict.',
      fix: 'Lead with the clinic, the evaluation process, and who the program is for. Keep drug-specific and clinical claims on provider-approved pages — not in the first line of ad text.',
    },
    {
      number: '02',
      title: 'Before-and-after imagery is doing the selling',
      problem:
        'Creative leans on body transformations, scale screenshots, or “results in 30 days” visuals because that is what competitors run.',
      why: 'Those formats are among the fastest paths to rejection in weight-loss and med spa categories — and they attract tire-kickers even when they clear.',
      fix: 'Sell credibility: provider oversight, clear eligibility, transparent process, and education. Authority creative outperforms banned outcome theater over a full funnel.',
    },
    {
      number: '03',
      title: 'The landing page cannot survive the same review as the ad',
      problem:
        'The ad is cautious, but the page still promises outcomes, hides eligibility, or looks like a telehealth checkout for a drug.',
      why: 'Meta reviews the destination, not just the creative. A compliant ad into a non-compliant page still fails — or converts the wrong patient.',
      fix: 'Build eligibility-first pages: who it’s for, who it isn’t, what happens in consult, provider role, and next step. Write the page for review and for a skeptical $600/mo decision.',
    },
    {
      number: '04',
      title: 'Nobody owns medical-claim approval',
      problem:
        'Marketing ships language the clinical team never signed off on — or every edit waits weeks because there is no review path.',
      why: 'Unreviewed claims create policy and reputation risk. Over-blocked review creates empty calendars. Both look like “Meta is broken.”',
      fix: 'Install a simple approval loop: draft → clinical review → publish. Document what is approved so ad iterations do not restart from zero every week.',
    },
    {
      number: '05',
      title: 'You are optimizing for lead volume, not booked consults',
      problem:
        'Campaigns chase cheapest leads. Forms are frictionless. Reporting celebrates CPL while the front desk sees no-shows and tire-kickers.',
      why: 'Meta will give you exactly what you optimize for. Cheap leads are easy. Qualified consults require tighter messaging, better pages, and harder conversion events.',
      fix: 'Define success as consult requests and kept appointments. Tighten qualification on-page. Feed better events back into Meta so the algorithm stops hunting junk volume.',
    },
    {
      number: '06',
      title: 'Targeting is either too broad or weirdly narrow',
      problem:
        'One clinic blasts an entire metro. Another stacks obscure interests until delivery collapses. Neither matches how patients actually search for care.',
      why: 'High-ticket medical programs need intent and trust, not vanity reach. Bad targeting burns budget before creative or offers get a fair test.',
      fix: 'Start with geo + strong creative/page fit. Expand with lookalikes and proven engagements only after conversion tracking is clean. Kill segments that cannot book.',
    },
    {
      number: '07',
      title: 'Patients arrive skeptical — and your funnel ignores that',
      problem:
        'Traffic hits a thin offer page. No education on compounded vs brand, safety, expectations, cost, or provider involvement.',
      why: 'GLP-1 and peptide buyers have been burned by shady telehealth. If you do not answer their real questions, interest dies before the form.',
      fix: 'Put education in the path: FAQs, provider-led content, clear process steps. The job of the click is not the sale — it is reducing fear enough to request a consult.',
    },
    {
      number: '08',
      title: 'Tracking breaks the moment iOS and privacy rules show up',
      problem:
        'Pixel-only setups, missing server events, thank-you pages that never fire, or CRM data that never returns to Meta.',
      why: 'Without reliable conversion signals, Meta optimizes on noise. You then “fix creative” that was never the real bottleneck.',
      fix: 'Implement durable tracking: browser + server events, consult as the primary conversion, and consistent UTM → CRM hygiene so optimization matches reality.',
    },
    {
      number: '09',
      title: 'Follow-up stops at the form fill',
      problem:
        'A lead submits. Nobody calls fast. No SMS. No email nurture. No reminder before consult. One-time patients never get a rebooking path.',
      why: 'Lead-gen agencies can stop at the contact. Clinics make money on booked and returning patients. Silence after the click is silent churn.',
      fix: 'Own the path after the form: speed-to-lead, nurture for the undecided, reminder sequences, rebooking/refill flows, and win-backs for lapsed patients.',
    },
    {
      number: '10',
      title: 'Your clinic looks identical to every other ad in the category',
      problem:
        'Same stock photo, same price hook, same vague “start your journey” line. No provider face, no point of view, no reason to choose you.',
      why: 'When everything looks the same, patients default to whoever feels cheapest or safest — and Meta’s auction gets more expensive for undifferentiated creatives.',
      fix: 'Differentiate with provider authority, specific program positioning, and proof you run a real clinical process. Be the credible option, not another clone.',
    },
  ] satisfies GuideReason[],
  closingTitle: 'Fix the system, not just the ad',
  closingBody:
    'Most clinics do not have ten separate Meta problems. They have one disconnected path — visibility, education, trust, conversion, follow-up, and optimization running as silos. When those stages hand patients to each other, ads stop feeling random.',
  ctaLabel: 'Find the gaps in your growth system',
  ctaHref: '/contact/',
  ctaNote: 'Thirty minutes. We’ll map what to fix first — whether or not you hire us.',
};

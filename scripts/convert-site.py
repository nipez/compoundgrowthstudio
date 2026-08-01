#!/usr/bin/env python3
"""Expand /site/ DC-runtime templates into static HTML partials for Astro."""

from __future__ import annotations

import html as html_lib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
OUT_PARTIALS = ROOT / "src" / "content" / "partials"
OUT_PUBLIC = ROOT / "public"
OUT_STYLES = ROOT / "src" / "styles"


def load_template(path: Path) -> str:
    text = path.read_text(errors="replace")
    return json.loads(
        re.search(r'<script type="__bundler/template">(.*?)</script>', text, re.S).group(1)
    )


def extract_manifest_images(path: Path) -> dict[str, bytes]:
    import base64

    text = path.read_text(errors="replace")
    manifest = json.loads(
        re.search(r'<script type="__bundler/manifest">(.*?)</script>', text, re.S).group(1)
    )
    images = {}
    for key, val in manifest.items():
        if not str(val.get("mime", "")).startswith("image/"):
            continue
        images[key] = base64.b64decode(val["data"])
    return images


def extract_scif(html: str, name: str) -> str:
    m = re.search(
        r'<sc-if value="\{\{\s*' + re.escape(name) + r'\s*\}\}"[^>]*>',
        html,
    )
    if not m:
        raise ValueError(f"missing sc-if {name}")
    start = m.end()
    i, depth = start, 1
    while i < len(html) and depth:
        nxt_open = html.find("<sc-if", i)
        nxt_close = html.find("</sc-if>", i)
        if nxt_close == -1:
            break
        if nxt_open != -1 and nxt_open < nxt_close:
            depth += 1
            i = nxt_open + 5
        else:
            depth -= 1
            if depth == 0:
                return html[start:nxt_close]
            i = nxt_close + 7
    raise ValueError(f"unclosed sc-if {name}")


def icon_svg(d: str) -> str:
    return (
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
        f'stroke-linejoin="round"><path d="{d}"></path></svg>'
    )


def site_data() -> dict:
    return {
        "cta": "Find the Gaps in Your Growth System",
        "navCta": "Find Your Growth Gaps",
        "leadLabel": "Send Me the Free Guide",
        "leadFootLabel": "Get the Guide",
        "leadNote": "Free guide + the twice-monthly newsletter. Unsubscribe anytime.",
        "subscribeLabel": "Send Me the Newsletter",
        "subscribeNote": "Twice a month. Unsubscribe anytime.",
        "contactLabel": "Request My Growth Gap Review",
        "contactNote": "No obligation. We’ll never share your clinic details.",
        "pillars": [
            {
                "icon": icon_svg(
                    "M12 21c-4-3.5-8-6.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 7.5-8 11z"
                ),
                "title": "We understand the patient journey",
                "body": "Patients need education, reassurance, and trust before they ever request a consultation.",
            },
            {
                "icon": icon_svg("M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"),
                "title": "We avoid hype-driven marketing",
                "body": "Responsible messaging, provider credibility, and claims clinics can review before publishing.",
            },
            {
                "icon": icon_svg("M4 12h5m6 0h5M12 4v5m0 6v5M8 8l8 8m0-8l-8 8"),
                "title": "We build connected systems",
                "body": "Content, visibility, landing pages, follow-up, and reporting work together — not in silos.",
            },
            {
                "icon": icon_svg("M3 17l6-6 4 4 8-8m0 0h-5m5 0v5"),
                "title": "We focus on consult-ready demand",
                "body": "Not just impressions — clearer education, stronger trust, and more qualified consultations.",
            },
        ],
        "serviceGroups": [
            {
                "num": "Stage 1",
                "stage": "Visibility",
                "items": [
                    {
                        "title": "Local SEO + Service Pages",
                        "body": "Service pages, location pages, blog content, and copy that helps local patients understand and act.",
                    },
                    {
                        "title": "Paid Acquisition + Landing Pages",
                        "body": "Campaign creative, landing page copy, lead forms, and consult flows designed around qualified interest.",
                    },
                ],
            },
            {
                "num": "Stage 2",
                "stage": "Education",
                "items": [
                    {
                        "title": "Treatment Education + Messaging",
                        "body": "Credible content for GLP-1, peptide therapy, weight loss, hormone health, and longevity — eligibility, expectations, and provider oversight.",
                    },
                    {
                        "title": "Social Media Management",
                        "body": "Educational content for Instagram, Facebook, TikTok, LinkedIn, YouTube Shorts, and Google Business Profile.",
                    },
                ],
            },
            {
                "num": "Stage 3",
                "stage": "Trust",
                "items": [
                    {
                        "title": "Provider Authority",
                        "body": "Content that helps clinic owners and providers become trusted local voices.",
                    },
                    {
                        "title": "Trust + Reputation Systems",
                        "body": "Review workflows, responsible trust signals, provider credibility, and patient-story structure for clinic approval.",
                    },
                ],
            },
            {
                "num": "Stage 4",
                "stage": "Conversion",
                "items": [
                    {
                        "title": "Website + Conversion Copy",
                        "body": "Homepage, service page, landing page, and consult-flow copy that makes complex programs easier to understand.",
                    },
                    {
                        "title": "Program Launch Campaigns",
                        "body": "Campaigns for new medically guided programs, new locations, seasonal education, and service rollouts.",
                    },
                ],
            },
            {
                "num": "Stage 5",
                "stage": "Follow-Up",
                "items": [
                    {
                        "title": "Email + SMS Follow-Up",
                        "body": "Lead education, consult reminders, reactivation, retention, and patient follow-up sequences.",
                    },
                ],
            },
            {
                "num": "Stage 6",
                "stage": "Optimization",
                "items": [
                    {
                        "title": "Reporting + Optimization",
                        "body": "Dashboards, call tracking, attribution, and conversion testing that show which campaigns produce consultations.",
                    },
                ],
            },
        ],
        "glpChallenges": [
            {
                "title": "Platform policy blocks the obvious ads",
                "body": "Prescription-medication language, before-and-after imagery, and outcome claims get rejected. Clinics either water everything down or keep resubmitting the same campaign.",
            },
            {
                "title": "Patients arrive skeptical",
                "body": "They have read conflicting things about compounded versus brand, side effects, and cost. Without education, interest never becomes a consultation request.",
            },
            {
                "title": "Every competitor looks identical",
                "body": "Same offer, same stock photo, same price anchor. Without provider credibility and a real point of view, the decision defaults to whoever is cheapest.",
            },
        ],
        "glpBuilds": [
            {
                "num": "01",
                "title": "Program positioning",
                "body": "What your program includes, who it is for, and why it is worth more than the cheapest option in town — stated plainly.",
            },
            {
                "num": "02",
                "title": "Compliant ad creative",
                "body": "Meta and Google campaigns structured around policy from the first draft, with creative that gets attention without triggering review.",
            },
            {
                "num": "03",
                "title": "Eligibility-first landing pages",
                "body": "Pages that qualify patients as they read — eligibility, expectations, provider oversight, cost transparency — then route them into intake.",
            },
            {
                "num": "04",
                "title": "Patient education library",
                "body": "Treatment explainers, FAQs, and comparison content that answers the real questions before someone books.",
            },
            {
                "num": "05",
                "title": "Provider-led authority content",
                "body": "Your clinicians on camera and in writing, so the trust signal comes from a person rather than a brand.",
            },
            {
                "num": "06",
                "title": "Nurture for the undecided",
                "body": "Email and SMS sequences for the majority who are interested but not ready — the largest missed opportunity in these programs.",
            },
        ],
        "glpCompliance": [
            {
                "title": "Your providers approve clinical content",
                "body": "Treatment details, eligibility, and any medical claim go through your licensed reviewers before publishing.",
            },
            {
                "title": "No outcome promises or before-and-afters",
                "body": "We build credibility through process, oversight, and education instead of results imagery that platforms reject.",
            },
            {
                "title": "Structured for prescription-ad review",
                "body": "Landing pages and creative follow platform requirements for regulated health categories from the start.",
            },
            {
                "title": "Documented and auditable",
                "body": "Every claim traces back to an approved source, so a review request never becomes a scramble.",
            },
        ],
        "stages": [
            {
                "num": "1",
                "title": "Visibility",
                "tag": "Get found by patients who can actually pay.",
                "desc": "Cash-pay GLP-1 and peptide patients are searching right now. We make sure your clinic shows up — through ads that clear Meta’s health-category review instead of getting rejected.",
                "builds": ["Compliant paid acquisition", "Local SEO", "Google Business Profile"],
                "handoffLabel": "Passes on",
                "handoff": "A visitor who found you but isn’t ready to book.",
            },
            {
                "num": "2",
                "title": "Education",
                "tag": "Answer the questions that stall a $600/mo decision.",
                "desc": "Peptide and hormone patients don’t convert on impulse. We build the content that resolves their doubts — dosing, safety, “is this legit” — before they ever fill out a form.",
                "builds": ["Treatment explainers", "Provider-led content", "FAQ resources"],
                "handoffLabel": "Passes on",
                "handoff": "A patient who understands the treatment but not yet you.",
            },
            {
                "num": "3",
                "title": "Trust",
                "tag": "Make your clinic the safe choice in a skeptical category.",
                "desc": "Weight-loss and TRT buyers have been burned by shady telehealth. We establish the provider authority and proof that separates you from the compounding-pharmacy noise.",
                "builds": ["Provider authority", "Reviews", "Responsible, compliant messaging"],
                "handoffLabel": "Passes on",
                "handoff": "A patient who trusts you and is ready to act.",
            },
            {
                "num": "4",
                "title": "Conversion",
                "tag": "Turn interest into booked consultations.",
                "desc": "A ready patient still leaves if the path is clunky. We build the landing pages, intake, and CTAs that move them from “interested” to on your calendar — with conversion tracking that survives Meta’s data restrictions.",
                "builds": ["Landing pages", "Intake forms", "Conversion tracking (CAPI)"],
                "handoffLabel": "Passes on",
                "handoff": "A booked lead worth keeping warm.",
            },
            {
                "num": "5",
                "title": "Follow-Up",
                "tag": "Stop losing patients between click and consult.",
                "desc": "No-shows and cold leads quietly bleed revenue. We keep qualified prospects engaged with automated nurture so the consultation actually happens.",
                "builds": ["Email nurture", "SMS reminders", "Lead routing"],
                "handoffLabel": "Passes on",
                "handoff": "The data on who booked and who didn’t.",
            },
            {
                "num": "6",
                "title": "Optimization",
                "tag": "Double down on what produces qualified consults.",
                "desc": "Most clinics can’t tell which ad produced which patient. We track it end to end, then reinvest in what works — so the whole system compounds instead of plateaus.",
                "builds": ["Attribution", "Campaign reporting", "Conversion testing"],
                "handoffLabel": "Loops back",
                "handoff": "Sharper targeting to Visibility — and the loop tightens.",
            },
        ],
        "stats": [
            {
                "id": "cnt1",
                "prefix": "$",
                "end": 150,
                "suffix": "M",
                "title": "B2B Brand & Revenue Growth",
                "body": "Conor supported revenue growth from $20M to $150M through integrated strategy and demand generation.",
            },
            {
                "id": "cnt2",
                "prefix": "",
                "end": 4,
                "suffix": "B+",
                "title": "Audience & Media Growth",
                "body": "A global media brand built to 300,000+ followers and over 4 billion impressions across platforms.",
            },
            {
                "id": "cnt3",
                "prefix": "$",
                "end": 25,
                "suffix": "M ARR",
                "title": "Scaled From the Ground Up",
                "body": "Nick helped scale Bitwage's U.S. ARR from essentially zero to ~$25M as VP of Growth.",
            },
            {
                "id": "cnt4",
                "prefix": "",
                "end": 100,
                "suffix": "+",
                "title": "Healthcare Growth Infrastructure",
                "body": "Marketing direction for a PE-backed healthcare organization with 100+ locations in multiple states.",
            },
        ],
        "partners": [
            {
                "name": "Tony Pardilla",
                "role": "Creative Partner, Design & Web",
                "bio": "Tony supports creative and web execution behind the studio’s clinic growth work — turning strategy into polished landing pages, campaign creative, visual systems, and conversion-focused digital experiences.",
                "helps": [
                    "Website design direction",
                    "Landing pages",
                    "Brand identity support",
                    "Campaign creative",
                    "Social templates",
                    "Conversion-focused design",
                ],
            },
            {
                "name": "Chris Cyril",
                "role": "Systems & Technology Partner",
                "bio": "Chris supports the systems and technology layer behind the growth engine — connecting forms, tracking, CRM workflows, automation, integrations, analytics, and reporting.",
                "helps": [
                    "Lead form setup",
                    "CRM workflow support",
                    "Tracking",
                    "Automation systems",
                    "Funnel infrastructure",
                    "Reporting systems",
                ],
            },
            {
                "name": "Jessica Rodrigues",
                "role": "Client Experience Coordinator",
                "bio": "Jessica supports onboarding, communication, scheduling, follow-ups, asset collection, and project coordination — so clinic teams always know what is happening and what comes next.",
                "helps": [
                    "Onboarding",
                    "Scheduling",
                    "Client communication",
                    "Follow-ups",
                    "Asset collection",
                    "Project coordination",
                ],
            },
        ],
        "track": [
            "Led growth at Capital One Shopping, increasing the user base by more than 600% in six months.",
            "Founded a digital marketing agency that was successfully acquired.",
            "Led a 25+ person global demand generation organization.",
            "Managed growth across more than a dozen SaaS products simultaneously.",
            "Generated 500 qualified leads nationally for a new service vertical.",
            "Created $1M in new recurring revenue through subscription-based programs.",
        ],
        "faqs": [
            {
                "q": "Do you only work with GLP-1 and weight loss clinics?",
                "a": "Those are the most common, but the system applies to any medically guided program with a high-value consultation: peptide therapy, hormone health, longevity, metabolic and functional health, and wellness programs.",
            },
            {
                "q": "Can you keep our ads from getting rejected?",
                "a": "We structure pages, creative, and copy around prescription-advertising policy from the start — that is the single biggest reason clinic campaigns stall. We cannot guarantee a platform decision, but compliance is designed in rather than patched later.",
            },
            {
                "q": "Who approves medical claims?",
                "a": "You do. Every treatment detail, eligibility statement, and patient-facing clinical claim goes to your licensed providers for review before it publishes. We write for review, not around it.",
            },
            {
                "q": "How long until we see results?",
                "a": "Conversion work (landing pages, intake flows, follow-up) tends to show movement in the first 30–60 days. Visibility and education compound over 3–6 months. We report on both timelines so you can tell which is which.",
            },
            {
                "q": "Do we have to buy the whole system?",
                "a": "No. Most clinics start with one stage — usually Conversion — and add Visibility, Follow-Up, or Optimization as capacity and demand grow. The stages are built to connect later.",
            },
            {
                "q": "Will you work with our existing website or agency?",
                "a": "Yes. We often build alongside an existing site and hand off documentation. If you already have an agency running paid media, we can own conversion and follow-up and feed them better inputs.",
            },
            {
                "q": "What do you need from us to start?",
                "a": "Access to your site, ad accounts, and analytics; one clinical reviewer for content approval; and roughly an hour a month from someone who can answer program questions. We handle the rest.",
            },
            {
                "q": "What happens on the growth gap call?",
                "a": "Thirty minutes. We look at your visibility, your consult path, and your follow-up, then send a written summary of the gaps we found and what we would fix first — whether or not you hire us.",
            },
        ],
    }


class Expander:
    def __init__(self, data: dict):
        self.data = data
        self.hover_rules: list[str] = []
        self.focus_rules: list[str] = []
        self._hover_i = 0
        self._focus_i = 0

    def resolve(self, expr: str, scope: dict):
        expr = expr.strip()
        if expr in ("true", "false"):
            return expr == "true"
        if expr in scope:
            return scope[expr]
        if expr in self.data:
            return self.data[expr]
        if "." in expr:
            root, *rest = expr.split(".")
            cur = scope.get(root, self.data.get(root))
            for part in rest:
                if isinstance(cur, dict):
                    cur = cur.get(part)
                else:
                    return None
            return cur
        return None

    def expand(self, html: str, scope: dict | None = None) -> str:
        scope = scope or {}
        # Expand sc-for recursively (innermost first via repeated passes)
        while True:
            m = None
            # Find innermost sc-for: one whose body has no nested sc-for
            for cand in re.finditer(
                r'<sc-for list="\{\{\s*([^}]+?)\s*\}\}" as="([^"]+)"[^>]*>(.*?)</sc-for>',
                html,
                re.S,
            ):
                if "<sc-for" in cand.group(3):
                    continue
                m = cand
                break
            if not m:
                break
            list_expr, as_name, body = m.group(1), m.group(2), m.group(3)
            items = self.resolve(list_expr, scope) or []
            chunks = []
            for item in items:
                child_scope = {**scope, as_name: item}
                chunks.append(self.expand(body, child_scope))
            html = html[: m.start()] + "".join(chunks) + html[m.end() :]

        # Replace {{ expr }}
        def repl(match: re.Match) -> str:
            expr = match.group(1).strip()
            # Special: stat.ref becomes data-counter
            if expr.endswith(".ref") or expr == "stat.ref":
                return ""
            val = self.resolve(expr, scope)
            if val is None:
                return ""
            if isinstance(val, bool):
                return "true" if val else "false"
            if isinstance(val, (int, float)):
                return str(val)
            return str(val)

        # Handle span ref="{{ stat.ref }}" before general replace
        html = re.sub(
            r'<span ref="\{\{\s*stat\.ref\s*\}\}">0</span>',
            lambda _m: (
                f'<span data-counter-end="{scope.get("stat", {}).get("end", 0)}">0</span>'
                if "stat" in scope
                else '<span data-counter-end="0">0</span>'
            ),
            html,
        )

        html = re.sub(r"\{\{\s*([^}]+?)\s*\}\}", repl, html)

        # Convert style-hover / style-focus to classes
        def hover_repl(match: re.Match) -> str:
            attrs = match.group(0)
            hover = re.search(r'style-hover="([^"]*)"', attrs)
            focus = re.search(r'style-focus="([^"]*)"', attrs)
            classes = []
            if hover:
                cls = f"cgs-h{self._hover_i}"
                self._hover_i += 1
                # hover CSS may set multiple props; apply on :hover
                rule = hover.group(1)
                self.hover_rules.append(f".{cls}:hover {{ {rule} }}")
                classes.append(cls)
                attrs = re.sub(r'\s*style-hover="[^"]*"', "", attrs)
            if focus:
                cls = f"cgs-f{self._focus_i}"
                self._focus_i += 1
                self.focus_rules.append(f".{cls}:focus {{ {rule if False else focus.group(1)} }}")
                classes.append(cls)
                attrs = re.sub(r'\s*style-focus="[^"]*"', "", attrs)
            if classes:
                if re.search(r'\bclass="', attrs):
                    attrs = re.sub(
                        r'\bclass="([^"]*)"',
                        lambda cm: f'class="{cm.group(1)} {" ".join(classes)}"',
                        attrs,
                        count=1,
                    )
                else:
                    # insert class after tag name
                    attrs = re.sub(
                        r"^<([a-zA-Z0-9-]+)",
                        rf'<\1 class="{" ".join(classes)}"',
                        attrs,
                        count=1,
                    )
            return attrs

        # Apply to opening tags that contain style-hover or style-focus
        html = re.sub(
            r"<[a-zA-Z0-9-]+[^>]*?(?:style-hover|style-focus)=[^>]*>",
            hover_repl,
            html,
        )

        # Convert sc-camel-* to real DOM attrs (DC runtime camelCases these).
        # e.g. sc-camel-view-box="0 0 560 420" → viewBox="0 0 560 420"
        def camel_attr(match: re.Match) -> str:
            kebab = match.group(1)
            value = match.group(2)
            if kebab in ("on-submit",):
                return ""  # wired separately as data-cgs-form
            if kebab == "default-checked":
                return " checked"
            parts = kebab.split("-")
            camel = parts[0] + "".join(p.title() for p in parts[1:])
            return f' {camel}="{value}"'

        html = re.sub(r'\s*sc-camel-([a-z0-9-]+)="([^"]*)"', camel_attr, html)
        html = re.sub(r'\s*hint-placeholder-[a-z-]+="[^"]*"', "", html)

        return html


# Wired on /pricing/ using the existing subscribe labels from the source component.
# The bundled export linked here from the footer but had no form markup.
NEWSLETTER_SECTION = """
  <section id="newsletter" style="max-width: 640px; margin: 0 auto; padding: 0 48px 96px;">
    <form data-cgs-form="newsletter" style="display: grid; gap: 12px; padding: 36px 32px; background: #FFFFFF; border: 1px solid rgba(10,29,56,.1); border-radius: 4px;">
      <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;" />
      <input type="email" name="email" required placeholder="you@yourclinic.com" style="padding: 15px 16px; font-family: 'Archivo', sans-serif; font-size: 15px; color: #0A1D38; background: #F4F7FB; border: 1px solid rgba(10,29,56,.2); border-radius: 3px; outline: none;" class="cgs-focus-blue" />
      <button type="submit" data-cgs-label-idle="Send Me the Newsletter" data-cgs-label-done="You're in — check your inbox" style="padding: 15px 0; font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 15px; color: #FFFFFF; background: #1A4FD0; border: none; border-radius: 3px; cursor: pointer; transition: background .2s;" class="cgs-h-navy">Send Me the Newsletter</button>
      <div data-cgs-note data-cgs-note-idle="Twice a month. Unsubscribe anytime." data-cgs-note-done="Thanks. First issue lands within two weeks." style="font-size: 12.5px; color: rgba(10,29,56,.55);">Twice a month. Unsubscribe anytime.</div>
    </form>
  </section>
"""


HONEYPOT = (
    '<input type="text" name="website" tabindex="-1" autocomplete="off" '
    'aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;" />'
)


def wire_lead_form(form: str, *, idle_label: str, done_label: str, note_idle: str | None, note_done: str | None) -> str:
    form = re.sub(r"<form\b", '<form data-cgs-form="lead_magnet"', form, count=1)
    if 'name="website"' not in form:
        form = re.sub(r"(<form[^>]*>)", rf"\1\n        {HONEYPOT}", form, count=1)
    # Ensure email input has name
    form = re.sub(
        r'<input(?![^>]*\bname=)([^>]*type="email"[^>]*)>',
        r'<input name="email"\1>',
        form,
        count=1,
    )
    form = re.sub(r'\srequired="required"', " required", form)
    if "data-cgs-label-idle" not in form:
        form = form.replace(
            f">{idle_label}</button>",
            f' data-cgs-label-idle="{idle_label}" data-cgs-label-done="{done_label}">{idle_label}</button>',
            1,
        )
    if note_idle and note_done and "data-cgs-note" not in form:
        form = form.replace(
            note_idle,
            (
                f'<span data-cgs-note data-cgs-note-idle="{html_lib.escape(note_idle, quote=True)}" '
                f'data-cgs-note-done="{html_lib.escape(note_done, quote=True)}">{note_idle}</span>'
            ),
            1,
        )
    return form


def wire_forms(html: str, kind: str) -> str:
    """Attach data-cgs-form attrs and honeypot fields to lead forms."""
    m = re.search(r"<form\b[^>]*>.*?</form>", html, re.S)
    if not m:
        return html
    if kind == "lead-home":
        form = wire_lead_form(
            m.group(0),
            idle_label="Send Me the Free Guide",
            done_label="Sent — check your inbox",
            note_idle="Free guide + the twice-monthly newsletter. Unsubscribe anytime.",
            note_done="On its way. You’re also on the newsletter — unsubscribe anytime.",
        )
        return html[: m.start()] + form + html[m.end() :]
    if kind == "lead-footer":
        form = wire_lead_form(
            m.group(0),
            idle_label="Get the Guide",
            done_label="Sent ✓",
            note_idle=None,
            note_done=None,
        )
        return html[: m.start()] + form + html[m.end() :]
    return html


def wire_contact_form(html: str) -> str:
    """Parse contact form and add names + honeypot while preserving markup."""
    m = re.search(r"<form\b[^>]*>.*?</form>", html, re.S)
    if not m:
        return html
    form = m.group(0)
    form = re.sub(r"<form\b(?![^>]*data-cgs-form)", '<form data-cgs-form="contact"', form, count=1)
    if 'name="website"' not in form:
        form = re.sub(r"(<form[^>]*>)", rf"\1\n        {HONEYPOT}", form, count=1)

    def name_input(im: re.Match) -> str:
        tag = im.group(0)
        if 'name="website"' in tag or re.search(r'\bname="(?!website)', tag):
            return tag
        ph = re.search(r'placeholder="([^"]*)"', tag)
        typ = re.search(r'type="([^"]*)"', tag)
        ph_v = (ph.group(1) if ph else "").lower()
        typ_v = (typ.group(1) if typ else "text").lower()
        name = None
        if "your name" in ph_v:
            name = "name"
        elif "clinic" in ph_v:
            name = "clinic"
        elif typ_v == "email" or "email" in ph_v:
            name = "email"
        elif typ_v == "checkbox":
            name = "newsletter"
        if name:
            tag = tag.replace("<input", f'<input name="{name}"', 1)
        return tag

    form = re.sub(r"<input\b[^>]*>", name_input, form)
    ta = re.search(r"<textarea\b[^>]*>", form)
    if ta and "name=" not in ta.group(0):
        form = form.replace("<textarea", '<textarea name="message"', 1)
    form = re.sub(r'\s*sc-camel-[a-z-]+="[^"]*"', "", form)
    form = re.sub(r'\srequired="required"', " required", form)
    # Default-checked newsletter checkbox (matches original sc-camel-default-checked)
    form = re.sub(
        r'(<input name="newsletter"[^>]*type="checkbox"[^>]*)>',
        lambda cm: cm.group(1) + " checked>" if "checked" not in cm.group(1) else cm.group(0),
        form,
        count=1,
    )
    if "data-cgs-label-idle" not in form:
        form = form.replace(
            ">Request My Growth Gap Review</button>",
            ' data-cgs-label-idle="Request My Growth Gap Review" '
            'data-cgs-label-done="Request received — we’ll reply within one business day">'
            "Request My Growth Gap Review</button>",
        )
    # Replace the note div contents once (binding already expanded)
    note_idle = "No obligation. We’ll never share your clinic details."
    note_done = "We’ll email you two or three times to find a slot that works."
    # Also accept straight apostrophe variants from data
    for variant in {
        note_idle,
        note_idle.replace("’", "'"),
        "No obligation. We\u2019ll never share your clinic details.",
    }:
        if variant in form and "data-cgs-note" not in form:
            form = form.replace(
                variant,
                (
                    f'<span data-cgs-note data-cgs-note-idle="{html_lib.escape(note_idle, quote=True)}" '
                    f'data-cgs-note-done="{html_lib.escape(note_done, quote=True)}">{note_idle}</span>'
                ),
                1,
            )
            break
    return html[: m.start()] + form + html[m.end() :]


def extract_nav_footer(xdc: str) -> tuple[str, str]:
    nav_m = re.search(r"<!-- NAV -->\s*(<nav[\s\S]*?</nav>)", xdc)
    foot_m = re.search(r"(<footer[\s\S]*?</footer>)", xdc)
    if not nav_m or not foot_m:
        raise ValueError("nav/footer missing")
    return nav_m.group(1), foot_m.group(1)


def main() -> None:
    home_path = SITE / "index.html"
    template = load_template(home_path)
    xdc = re.search(r"<x-dc>(.*?)</x-dc>", template, re.S).group(1)

    # Strip helmet — handled by Astro layout
    xdc_body = re.sub(r"<helmet>[\s\S]*?</helmet>", "", xdc)

    data = site_data()
    expander = Expander(data)

    nav_raw, footer_raw = extract_nav_footer(xdc_body)
    nav = expander.expand(nav_raw)
    footer = expander.expand(footer_raw)
    footer = wire_forms(footer, "lead-footer")
    footer = re.sub(
        r'(<a\b[^>]*\bhref=")/pricing/("([^>]*)>Join the newsletter</a>)',
        r"\1/pricing/#newsletter\2",
        footer,
    )

    sections = {
        "home": extract_scif(xdc_body, "isHome"),
        "services": extract_scif(xdc_body, "isServices"),
        "system": extract_scif(xdc_body, "isSystem"),
        "glp-1-peptide-marketing": extract_scif(xdc_body, "isGlp1"),
        "ai-voice-agent": extract_scif(xdc_body, "isVoice"),
        "pricing": extract_scif(xdc_body, "isPricing"),
        "leadership": extract_scif(xdc_body, "isLeadership"),
        "faq": extract_scif(xdc_body, "isFaq"),
        "contact": extract_scif(xdc_body, "isContact"),
    }

    OUT_PARTIALS.mkdir(parents=True, exist_ok=True)
    (OUT_PUBLIC / "images").mkdir(parents=True, exist_ok=True)

    # Images
    images = extract_manifest_images(home_path)
    mapping = {
        "461bc793-73ae-4578-9c07-6d396dadf5ae": "conor.jpg",
        "9075ed94-d299-4a96-b2d3-7366ed69c32d": "nick.jpg",
    }
    for uuid, filename in mapping.items():
        if uuid in images:
            (OUT_PUBLIC / "images" / filename).write_bytes(images[uuid])

    for name, raw in sections.items():
        expanded = expander.expand(raw)
        # Rewrite image srcs
        for uuid, filename in mapping.items():
            expanded = expanded.replace(f'src="{uuid}"', f'src="/images/{filename}"')
        if name == "home":
            expanded = wire_forms(expanded, "lead-home")
        if name == "contact":
            expanded = wire_contact_form(expanded)
        if name == "pricing":
            # Insert newsletter section before closing </div> of page root
            # Expand newsletter hover classes via a mini expand
            news = NEWSLETTER_SECTION
            # Adjust closing: pricing section ends with </div>\n — append before final close
            if expanded.rstrip().endswith("</div>"):
                expanded = expanded.rstrip()[:-6] + NEWSLETTER_SECTION + "\n</div>\n"
            else:
                expanded += NEWSLETTER_SECTION
        (OUT_PARTIALS / f"{name}.html").write_text(expanded)
        print(f"wrote {name}.html ({len(expanded)} bytes)")

    (OUT_PARTIALS / "nav.html").write_text(nav)
    (OUT_PARTIALS / "footer.html").write_text(footer)

    # Hover/focus CSS + extras used by newsletter
    css_parts = [
        "/* Generated hover/focus rules from style-hover / style-focus */",
        *expander.hover_rules,
        *expander.focus_rules,
        ".cgs-h-navy:hover { background: #0A1D38; }",
        ".cgs-focus-blue:focus { border: 1px solid #1A4FD0; }",
    ]
    OUT_STYLES.mkdir(parents=True, exist_ok=True)
    (OUT_STYLES / "interactions.css").write_text("\n".join(css_parts) + "\n")
    print(f"hover rules: {len(expander.hover_rules)}, focus rules: {len(expander.focus_rules)}")
    print("done")


if __name__ == "__main__":
    main()

# Doppel — your double lives your month before you do

**Tectonic Hackathon · KBC challenge**

> "Every banking app shows you your past. At KBC, your double is already living your future."

## The idea

Every KBC customer gets a digital double, **Doppel**: a fluffy character with the same income, expenses, contracts and habits as the customer. Doppel lives 30 days ahead and writes down what happened to him, in the first person and in the past tense ("Op 20 oktober kwam ik €900 tekort voor mijn btw"). The home screen is **Doppel's diary**: what is coming, not what already happened.

The app is in Dutch, like KBC Mobile for Flemish customers. The main parts:

| In the app | What it does |
|---|---|
| **Mijn dagboek** | Timeline of upcoming moments, each with a date and a confidence level. |
| **Action cards** | Per moment: a KBC offer, a partner offer, or a card with **no sales pitch at all** ("Geen verkoop"). |
| **Push preview** | The most urgent diary moment, shown as the push notification the customer would get. Push and app come from the same diary. |
| **Wat Doppel zag** | Every card shows the transactions and signals that led to it. |
| **Zo ben ik niet** | The customer corrects their double. The card disappears and Doppel stops using that rule. |
| **Wat als ik…** | Replay the month with one change (€100 a month savings, or a fixed energy contract). |
| **Doppel geeft door aan een mens** | When there are stress signals (falling balance, a first buy-now-pay-later payment), Doppel stops selling and offers a call from a KBC advisor. |
| **Profiel** | The customer decides what Doppel may see and can pause him. |

### Demo personas

Three personas are fully driven by the rule engine:

| Persona | Situation | Highlight |
|---|---|---|
| Lotte (24) | First job in Ghent, no savings buffer | Student discount ends, "what if I save €100 a month" |
| Jonas & Sarah Peeters | Moving house with a toddler | Six address changes, no fire insurance yet, winter energy costs |
| Karim (47) | Self-employed, his biggest client stopped paying | **Live event:** the client pays €3,200, Doppel relives the month and the VAT shortfall disappears |

Nine more personas (Arne, Emma & Wout, Georgette, Marc, Mateo, Nora, Sofie, Thomas, Yasmine) show the breadth of life moments: student abroad, marriage, fraud attempt, retirement, newcomer, parental leave, business owner, first investment, divorce. **Their diaries are scripted** in `database/data/personas/*.json` rather than computed by rules, but they go through the same composer, feedback and reset flow.

### Why it scales to 2.3 million customers

- Predictions come from a **rule-based signal detector** (13 plain PHP rules in `app/Services/Doppel/Rules`), no AI. That can run in batch for every customer.
- Weather is one lookup per city, not per customer: a KMI storm warning (mocked in the demo) is combined with what the account shows about home insurance, so Doppel warns before the storm, not after the damage.
- AI (Gemini on Google Cloud) only writes Doppel's opening line, and only when something changes. The result is stored, so there is no AI call on a normal page load. Without an API key, Doppel falls back to a fixed sentence, so the demo never breaks.
- One diary can feed the app, push notifications, the Kate assistant and a human advisor.

### Trust and security

- Every card explains itself. There is always at least one card that sells nothing.
- When things get tight, Doppel sells nothing and hands over to a human, only if the customer agrees.
- The customer is always taken from the logged-in session, never from an ID in the URL or request. Feedback can only be given on your own predictions.
- No real customer data: all data comes from seeders. No API keys in the repository; secrets live in `.env`, which is git-ignored.
- Audited with Aikido; see the before/after screenshots in the submission.

## Tech stack

Laravel 13, Inertia 3, React 19, TypeScript, Tailwind 4, MySQL 8, running in [ddev](https://ddev.com). Gemini (Google Cloud) for the diary opener.

## Running it locally

Requirements: [ddev](https://ddev.readthedocs.io/en/stable/users/install/) and Docker.

```bash
git clone https://github.com/tielebodyn/tectonic-hackaton.git
cd tectonic-hackaton
cp .env.example .env
```

In `.env`, set `DEMO_MODE=true` (required for the persona switcher and the live event) and optionally `GEMINI_API_KEY=...`. Then:

```bash
ddev start
ddev composer install
ddev artisan key:generate
ddev artisan migrate:fresh --seed
ddev npm install
ddev npm run build
```

Open https://tectonic-hackaton.ddev.site. In demo mode you land on the welcome screen: pick a persona (or open `/?as=karim`). In the app, use the demo bar at the top to switch persona, **Simuleer transactie** to trigger Karim's live event, and the reset button to start over.

## What is unfinished

- Nine of the twelve personas use a scripted diary instead of the rule engine.
- "Wat als ik…" replays the whole screen with the other scenario; the two Doppels are not yet shown side by side, and every persona sees both scenarios.
- Demo mode logs visitors straight into a persona without a password. It exists for the demo only and is off when `DEMO_MODE=false`.
- Demo data only; no connection to real banking data. Live updates use a page reload, not websockets.
- Not built: a shared "household Doppel", Doppel speaking in the customer's own voice, ElevenLabs audio briefing.

## Team

Built during the Tectonic Hackathon by Keano Van Cuyck, Lorenzo Verheecke, Tiele Bodyn and Peter Berwouts.

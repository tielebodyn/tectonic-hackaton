# Doppel — your double lives your month before you do

**Tectonic Hackathon · KBC challenge**

> "Every banking app shows you your past. At KBC, your double is already living your future."

## The idea

Every KBC customer gets a digital double, **Doppel** (its face is **Kobe**, an original character we drew ourselves). Doppel has the same income, expenses, contracts and habits as the customer, lives 30 days ahead, and writes down what happened to him. The home screen is **Doppel's diary**: what is coming, not what already happened.

- **What happened to Doppel**: a timeline of 4–6 upcoming moments, each with a date and a confidence level ("80% sure").
- **Action cards**: a KBC offer, a partner offer, and always at least one card with no sales pitch at all (for example "Your budget looks fine").
- **What Doppel saw**: every card explains which signals led to it.
- **That's not me**: the customer corrects their double. The card disappears and the feedback is stored.
- **What if I…**: change one parameter (for example "save €100/month") and see two Doppels side by side.
- **Doppel goes quiet**: when there are stress signals (balance dropping plus a first buy-now-pay-later purchase), Doppel stops selling and offers a call from a human KBC advisor.

### Demo personas

| Persona | Situation | Highlight in the demo |
|---|---|---|
| Lotte (24) | First job in Ghent, no savings buffer | "What if I save €100/month?" fork |
| The Peeters family | Moving house with a toddler | Change-of-address and winter energy bill |
| Karim (47) | Self-employed, income dropping | Live event: a client pays a €3,200 invoice, so Kobe relaxes and the credit offer disappears |

### Why it scales to 2.3 million customers

- Predictions come from a **rule-based signal detector** (plain PHP, no AI), which can run in batch for every customer.
- AI (Gemini on Google Cloud) is used only to write Doppel's diary opener in the first person, and only when something new happens. The result is stored, so there is no AI call on every page load.
- The same diary can feed the app, push notifications, the Kate assistant and a human advisor.

### Trust and security

- Every card explains itself, and every screen has at least one card that sells nothing.
- Everything sits behind login. A customer is always taken from the logged-in session, never from an ID in the URL or the request, so one Doppel can never read another customer's diary.
- Feedback, forks and simulated transactions are checked by authorization policies.
- No real customer data: all demo data comes from seeders.
- No API keys in the repository. Secrets live in `.env`, which is git-ignored.
- The code was audited with Aikido; see the before/after screenshots in the submission.

## Tech stack

Laravel 13, Inertia 3, React 19, TypeScript, Tailwind 4, MySQL 8, running in [ddev](https://ddev.com). Gemini (Google Cloud) for diary text.

## Running it locally

Requirements: [ddev](https://ddev.readthedocs.io/en/stable/users/install/) and Docker.

```bash
git clone <repo-url> tectonic-hackaton
cd tectonic-hackaton
cp .env.example .env            # add your GEMINI API key here (optional, see below)
ddev start
ddev composer install
ddev artisan key:generate
ddev artisan migrate:fresh --seed
ddev npm install
ddev npm run build               # or: ddev npm run dev
```

Open https://tectonic-hackaton.ddev.site and use the demo bar to log in as Lotte, the Peeters family or Karim. The "Simulate transaction" button triggers the live event.

Without a Gemini key the app still works: Doppel falls back to the pre-written diary text from the seeders.

## What is unfinished

<!-- Update this list right before submitting (target 22:15). -->

- Only rule-based signal detection with 6–8 rules; no machine-learning model.
- Demo data only (3 personas); no connection to real banking data.
- Live updates use a normal page reload, not websockets.
- Not built on purpose: a shared "household Doppel", Doppel speaking in the customer's own voice, and a full "Doppel world".
- Optional extras, if they did not make it: the fork for the Peeters family, the ElevenLabs morning briefing, and the KBC-side overview ("12,400 doubles are facing their first winter after a move").

## Team

<!-- Names and roles -->

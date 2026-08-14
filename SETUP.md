# SKP Solar World — Production Setup

Everything below must be done **before** the site goes live. Until it is, the
enquiry forms deliberately return an error rather than showing a false success.

There are four systems to configure: **Supabase** (lead storage), **Resend**
(notification email), **Vercel** (hosting), and **Hostinger** (DNS for your
domain).

---

## 1 · Supabase — permanent lead storage

1. Go to [supabase.com](https://supabase.com) → **New project**.
   - Name: `skp-solar-world`
   - Region: **Mumbai (ap-south-1)** — closest to your customers
   - Save the database password somewhere safe (you won't need it for the site)

2. Open **SQL Editor** → **New query**. Paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   You should see `Success. No rows returned`.

3. Go to **Project Settings → Data API** and copy:

   | Supabase field | Environment variable |
   |---|---|
   | Project URL | `SUPABASE_URL` |

4. Go to **Project Settings → API Keys** and copy:

   | Supabase field | Environment variable |
   |---|---|
   | `anon` / `public` key | `SUPABASE_ANON_KEY` |
   | `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` |

> **Why two keys?** The website uses the **anon** key, which can only *insert*
> leads — it cannot read them. That means even if it leaked, nobody could
> download your customer list. The **service_role** key can read, and is used
> only by the admin panel on the server. Never put the service_role key
> anywhere public, and never prefix it with `NEXT_PUBLIC_`.

**Where your leads live:** Supabase Dashboard → **Table Editor** → `leads`.

---

## 2 · Resend — enquiry notification email

1. Go to [resend.com](https://resend.com) and create an account.

2. **Domains → Add Domain** → enter `skpsolarworld.com`.
   Resend will show you a set of DNS records — see the Hostinger section below.

3. Once the domain shows **Verified**, go to **API Keys → Create API Key**
   (permission: *Sending access*) and copy it into `RESEND_API_KEY`.

4. Set the two address variables:

   ```
   LEAD_NOTIFICATION_EMAIL=sales@skpsolarworld.com
   LEAD_FROM_EMAIL=SKP Solar World <enquiries@skpsolarworld.com>
   ```

> **Before the domain is verified** you can leave `LEAD_FROM_EMAIL` unset. It
> falls back to Resend's shared sender, which only delivers to the email
> address that owns the Resend account — fine for testing, not for launch.

---

## 3 · Admin panel credentials

Two values you generate yourself:

```
ADMIN_PASSWORD=<a long, unique passphrase>
ADMIN_SESSION_SECRET=<random 32+ character string>
```

Generate the session secret by running this in Terminal:

```bash
openssl rand -base64 32
```

> `ADMIN_PASSWORD` is the only thing between the internet and your customer
> list. Use a passphrase you don't use anywhere else. Changing
> `ADMIN_SESSION_SECRET` immediately signs out every admin session.

---

## 4 · Vercel — hosting

1. [vercel.com](https://vercel.com) → **Add New → Project** → import
   `Yashikmehta/skp-solar-website` from GitHub.

2. Framework preset: **Next.js**. Leave build and output settings at their
   defaults — no `vercel.json` is needed.

3. **Settings → Environment Variables.** Add all nine, for
   *Production*, *Preview* and *Development*:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://www.skpsolarworld.com` |
   | `SUPABASE_URL` | from Supabase step 3 |
   | `SUPABASE_ANON_KEY` | from Supabase step 4 |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase step 4 |
   | `RESEND_API_KEY` | from Resend step 3 |
   | `LEAD_NOTIFICATION_EMAIL` | `sales@skpsolarworld.com` |
   | `LEAD_FROM_EMAIL` | `SKP Solar World <enquiries@skpsolarworld.com>` |
   | `ADMIN_PASSWORD` | your passphrase |
   | `ADMIN_SESSION_SECRET` | your generated secret |

4. **Settings → Domains** → add `skpsolarworld.com` and `www.skpsolarworld.com`.
   Vercel will show the DNS records to create at Hostinger.

> Do **not** add an `engines` field to `package.json`. Vercel picks a supported
> Node version automatically; pinning it to the version on your Mac (26.x)
> would fail the build.

---

## 5 · Hostinger — DNS

Hostinger is where `skpsolarworld.com` is registered, so every DNS record
below goes in **hPanel → Domains → DNS / Nameservers → Manage DNS records**.

### a) Point the domain at Vercel

Use the exact values Vercel shows you in **Settings → Domains**. They are
normally:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Delete any existing `A` or `CNAME` record for `@` or `www` that points at
Hostinger's own hosting, or the site will not resolve.

### b) Verify the domain for Resend

Add the records Resend gives you in **Domains → skpsolarworld.com**. There are
normally three:

| Type | Purpose |
|---|---|
| `TXT` | SPF — authorises Resend to send as your domain |
| `TXT` or `CNAME` | DKIM — signs your mail so it isn't marked as spam |
| `TXT` | DMARC (recommended) |

> **If you already receive email at `sales@skpsolarworld.com`**, be careful not
> to delete or overwrite the existing `MX` records — those are what deliver
> your incoming mail. Resend only needs the records above; it does not replace
> your mailbox.

DNS changes at Hostinger usually apply within 15–30 minutes.

---

## 6 · After deploying — verify it end to end

1. Submit a **real test enquiry** through `/contact`.
2. Check `sales@skpsolarworld.com` — the email should arrive within a minute
   with subject **"New Enquiry — SKP Solar World"**.
3. Submit a **test calculator report** through `/solar-calculator`.
   Subject should be **"New Solar Calculator Enquiry — SKP Solar World"**.
4. Sign in at `https://www.skpsolarworld.com/admin` and confirm both
   submissions appear under the correct section.
5. Delete the two test rows from Supabase → Table Editor → `leads`.

If a form shows an error instead of its success state, the lead was **not**
stored — check the Vercel deployment logs (**Deployments → … → Runtime Logs**)
for a line beginning `[leads]`.

---

## Environment variable reference

| Variable | Required | Used by |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | canonical URLs, sitemap, OG tags |
| `SUPABASE_URL` | yes | lead storage + admin panel |
| `SUPABASE_ANON_KEY` | yes | writing leads (insert-only) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | admin panel reads |
| `RESEND_API_KEY` | yes | notification email |
| `LEAD_NOTIFICATION_EMAIL` | yes | recipient address |
| `LEAD_FROM_EMAIL` | recommended | verified sender address |
| `ADMIN_PASSWORD` | yes | admin sign-in |
| `ADMIN_SESSION_SECRET` | yes | signs the admin session cookie |

None of these belong in Git. `.env*` is already gitignored; only
`.env.example` is tracked.

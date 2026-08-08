# Getting Aveyra onto both your phones

Two things to set up: **Supabase** (the backend that lets your two phones talk
to each other) and **Vercel** (which puts the app on the internet). Both are
free at the size of two people. Budget about half an hour, once.

You do not need to understand any of it. Follow the steps; where a step matters,
it says why.

---

## Part 1 — Supabase (about 15 minutes)

### 1. Make the project

1. Go to **supabase.com** and sign up (GitHub login is fastest).
2. Click **New project**.
3. Name it anything — `aveyra` is fine.
4. **Database password**: click Generate, then **save it in your password
   manager**. You'll rarely need it, but there is no way to recover it.
5. **Region — this one matters.** Pick the region closest to where you two
   actually are. This is the single biggest factor in whether the app feels
   instant or sluggish, because every message makes that round trip. If you're
   in Ghana, choose `eu-west-1 (Ireland)` or `eu-central-1 (Frankfurt)` — they're
   the closest available.
6. Click **Create new project** and let it finish (~2 minutes).

### 2. Get your two keys

In the project, go to **Project Settings → API**. Copy these two:

- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon public** key — a long string starting `eyJ...`

Both are meant to be public; they're safe to paste to me or put in a config
file. The thing that actually protects your data is row-level security, which
the migrations set up. **Never share the `service_role` key** on that same page
— that one bypasses everything.

### 3. Create the tables

1. In the left sidebar, open **SQL Editor** → **New query**.
2. Open `supabase/migrations/` in the repo. Run the files **in order by their
   filename** — paste the contents of each into the editor and press **Run**,
   one at a time:
   - `20260725000000_init.sql`
   - `20260808000000_full_app.sql`
   - `20260808120000_pings.sql`
   - `20260808140000_vault.sql`
3. Each should say *Success*. If one errors, stop and send me the message rather
   than skipping it — later files build on earlier ones.

### 4. Turn on email sign-in

**Authentication → Providers → Email**: make sure it's enabled. Turn **Confirm
email** ON. Aveyra signs you in with a 6-digit code, no passwords anywhere.

> Supabase's built-in email sender is rate-limited and mainly for testing. For
> two people it is fine. If codes stop arriving, tell me and I'll set up a
> proper sender.

### 5. Lock it to the two of you

Still in **Authentication → Providers → Email**, there's an **allow list**
setting (on some plans it's under Auth → Policies). Add:

```
your-email@example.com
his-email@example.com
```

If you can't find that setting on the free tier, tell me — I'll add the same
restriction in code instead, which works everywhere.

---

## Part 2 — Vercel (about 10 minutes)

1. Go to **vercel.com**, sign up with **GitHub**.
2. **Add New → Project**, and pick the `justforfun` repository.
3. Vercel will detect Next.js on its own. Don't change the build settings.
4. Before deploying, open **Environment Variables** and add both:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from step 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key from step 2 |

5. Set **Production Branch** to `claude/offline-couples-website-cxeptq` (under
   Settings → Git), since that's where the app lives.
6. Click **Deploy**. You'll get a URL like `justforfun.vercel.app` in a couple of
   minutes.

Every push to that branch redeploys automatically from then on.

### Put it on your phones

Open the URL in your phone browser, then:

- **iPhone**: Share button → *Add to Home Screen*
- **Android**: menu (⋮) → *Install app* / *Add to Home screen*

It then behaves like an installed app — own icon, no browser bar. Nothing is
downloaded from an app store, and it works the same on any phone either of you
ever switch to.

---

## Part 3 — First run, in order

The order matters for one step:

1. **You** open the app, sign in with your email, enter the code.
2. Create your space, and set his name.
3. Send him the invite link the app gives you.
4. **He** opens it on his phone, signs in with his email, joins.
5. **Both of you open the Vault once.** This is not optional and it isn't
   cosmetic: opening it publishes each phone's public key, which is how the two
   devices agree on an encryption key nobody else has. Until you've both done
   it, the vault will say it's waiting on the other person.
6. Answer the day's question on both phones and watch the reveal happen.

---

## When something's wrong

| What you see | What it means |
| --- | --- |
| Code never arrives | Check spam. Supabase's test sender is slow and rate-limited; wait a minute and retry. |
| "Supabase is not configured" | The two environment variables didn't reach the build. Re-check them in Vercel and redeploy. |
| Vault says it's waiting on him | He hasn't opened the Vault on his phone yet. Step 5 above. |
| A migration errored | Send me the exact message. Don't skip it and run the next one. |
| Photos won't open | Usually the key agreement is incomplete — both of you open the Vault once. |

---

## Later, when you open it to other people

Four things need doing before anyone else uses it, and none of them are urgent
now:

- Remove the email allowlist.
- Write a real privacy policy and terms — including the honest bit, which is
  that everything except the Vault is readable by whoever runs the server.
- Set up a proper email sender; the built-in one won't survive real traffic.
- Check what Supabase costs at your actual usage before it stops being free.

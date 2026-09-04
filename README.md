# Chhota Scholar - Kids Learning Website (Part 1)

A mobile-first, PWA-ready learning website for Nursery/LKG/UKG/Class 1 kids, built
with React + TypeScript + Tailwind. Writing Practice (finger tracing) is the core,
working feature in this first build.

## What's working right now

**Writing Practice (Part 1, unchanged and fully working)**
- Home screen with 9 sections, Writing Practice first and most prominent
- English A, B, C and Numbers 1-9 with the full 5-level system: dotted tracing,
  finish the incomplete letter, copy from example, free writing, erase & rewrite
- Real touch/mouse writing board: pen colors, sizes, eraser, undo, redo, clear

**English (Part 2)**
- Alphabet A-Z: every letter has a picture, a word, and a "hear it" button
  (browser text-to-speech, no audio files or API keys needed). A and B and C
  link straight into real Writing Practice; the rest say "coming soon" rather
  than pretending to link somewhere real.
- Simple Words (Apple, Ball, Cat, Dog, Sun, Pen, Bag) with picture + audio
- Class 1 Practice: a short picture/spelling/sentence quiz

**Hindi (Part 2)**
- All 12 Swar and all 33 Vyanjan: tap to hear pronunciation
- Tracing for Hindi is intentionally **not** included yet - see "decisions" below

**Maths (Part 2)**
- Number Writing links straight into the existing Writing Practice engine,
  now covering 1-9 (not just 1-3)
- Counting, Before/After/Between, Greater/Smaller/Equal, and Basic Addition
  as short quiz-style activities
- Subtraction, Shapes, Time and Money are listed as topics but marked "Soon"

**Colors & Shapes (Part 2)**
- 8 colors and 5 shapes, tap to hear the name
- "Find the Color" and "Find the Shape" mini quizzes

**Basic GK (Part 2)**
- 10 browsable topics (Animals, Birds, Fruits, Vegetables, Body Parts,
  Vehicles, Days, Months, Seasons, About India), tap any item to hear it
- A working quiz for Animals and Fruits, as a template for the rest

**Learning Games (Part 2)**
- Letter-Picture Match, Number Match, Choose the Word, Choose the Letter,
  Missing Number, and a Simple Quiz - all built on one reusable quiz engine
  with different content, same pattern as the Writing Practice engine in Part 1
- Memory Cards (flip-and-match) and Counting Objects are genuinely separate
  game mechanics, built from scratch

**Rewards (Part 2)**
- Stars for every writing activity and every correct quiz/game answer
- Badges: Writing Star (10 activities), ABC Champion (all available letters),
  Number Star (all available numbers), Quiz Whiz (20 correct answers) - with a
  celebratory popup the moment one is unlocked
- My Rewards screen shows stars, badges earned vs. locked, and simple totals

**Audio (Part 2)**
- Uses the phone browser's own text-to-speech - nothing to host, no API keys
- A mute/unmute button sits on the home screen and applies everywhere

**Progress (Part 2)**
- All progress (stars, badges, completed letters/numbers, quiz stats) goes
  through one `progressService` with a storage interface. Today it's backed
  by localStorage; swapping to Supabase later means writing one new class
  that implements the same interface - no component changes needed.

- Basic PWA setup (installable, works offline after first load)

## Decisions I made, and why

1. **3D**: still CSS-only (see Part 1 notes) - unchanged in Part 2.

2. **Hindi tracing was left out on purpose.** The brief asked for Swar/Vyanjan
   tracing too, but Devanagari stroke shapes are genuinely different from
   Latin letters and digits (more curves, matras, conjuncts) and I didn't want
   to hand-guess 45 unverified stroke paths - a wrong stroke shape actively
   teaches a child incorrect handwriting, which is worse than no tracing at
   all. Recognition + pronunciation for all 12 Swar and 33 Vyanjan are fully
   built and working. Tracing is the first thing planned for Part 3.

3. **Numbers 10 and above** need multi-digit tracing (two templates side by
   side) which the current single-character engine doesn't support yet - 1-9
   are complete, 10-100 is Part 3.

4. **"10 games" became "8 games on 4 engines."** Letter-Picture Match, Number
   Match, Choose the Word, Choose the Letter, Missing Number and Simple Quiz
   are all genuinely different *content* but reuse one QuizEngine component -
   same "one reusable engine, many templates" approach as the tracing system.
   Memory Cards and Counting Objects have their own real, distinct mechanics
   (card-flip matching, visual object counting).

5. **GK quiz** is fully wired for Animals and Fruits as a working example;
   the other 8 topics are browsable with audio but don't have a quiz yet -
   adding one is copying the same two-line pattern used for those two.

## Project structure additions since Part 1

```
src/
  data/              englishContent, hindiContent, mathsContent,
                     colorsShapesContent, gkContent, rewardsContent, models
  services/          progressService.ts (stars/badges, storage-abstracted)
                     audioService.ts (browser text-to-speech)
  components/        QuizEngine, BadgeToast, SpeakerButton, MuteToggle,
                     ScreenHeader (shared across the new sections)
  features/
    english/         EnglishHub, AlphabetPage, WordsPage
    hindi/           HindiHub, HindiCharsPage
    maths/           MathsHub
    colorsShapes/     ColorsShapesHub
    gk/              GkHub, GkTopicPage
    games/           GamesHub, GamePlayer, MemoryGame, CountingGame, gameData
    rewards/         RewardsPage
```

## Running it (on a computer, for reference)

```
npm install
npm run dev       # local dev server
npm run build     # production build (also type-checks)
```

## How you (Amit) can get this live from your phone

You don't need a computer. The plan is: this project's files -> a GitHub repo ->
Vercel builds and hosts it automatically, same as your other projects.

1. **Download this folder** from the link below (it comes as a `.zip`).
2. **Unzip it on your phone** - any file manager app with "Extract" works
   (e.g. the built-in Files app, or ZArchiver if you don't have one).
3. **Create a new GitHub repo** (e.g. `chhota-scholar`) from github.com in Chrome.
4. Inside the repo, use **Add file -> Upload files**, then tap to browse and
   select the files/folders from the unzipped project. If your phone's file
   picker won't let you select a whole nested folder in one go, upload folder
   by folder (e.g. open `src`, select everything inside it, upload, then go
   into `src/features`, etc.) - a bit repetitive but it works.
5. Once everything is pushed, go to **vercel.com -> Add New Project -> Import**
   the repo. Vercel will detect it's a Vite app automatically. Deploy.
6. Every time you upload new/changed files to GitHub, Vercel redeploys
   automatically.

If this multi-folder upload is painful on your phone, tell me and I can also
just hand you each file's content one at a time so you can paste them in using
GitHub's "Create new file" web editor instead - slower per file, but no zip or
folder structure to deal with.

## Testing on your Android phone

Once deployed on Vercel, just open the `.vercel.app` link in Chrome on your
phone. To test it like an installed app: open the site, then use Chrome's menu
-> "Add to Home screen".

## What's next (Part 3)

- Hindi Swar/Vyanjan tracing content (real, verified stroke paths)
- A-Z and full number range (10-100, needs multi-digit tracing support)
- Quizzes for the remaining 8 GK topics
- Rewards: more badge types, a simple progress-percentage view
- Parent Area (usage summary, settings)
- Optional: swap the CSS hero for a real React Three Fiber 3D classroom scene
- Later: move content from data/*.ts files into Supabase using the same
  service interfaces, so no screen code needs to change

---

# Part 3 - Supabase, Parent Auth, Admin Panel, Premium & Referrals

Everything below is new. Nothing from Part 1 or Part 2 was rewritten or
removed - Writing Practice, English, Hindi, Maths, Games and Rewards all work
exactly as before. Part 3 adds a real backend underneath them.

## What's built

- **Supabase schema** (`supabase/schema.sql`) - every table the brief asked
  for, with Row Level Security on all of them: profiles, child_profiles,
  subjects/lessons/writing_templates/tracing_paths/quizzes/quiz_questions/
  games, progress, badges/child_badges, usage_events, subscriptions,
  payments, referrals/referral_rewards, monetization_settings, ad_settings,
  admin_settings.
- **Parent authentication** - register, login, logout, password reset, all
  via Supabase Auth. A profile row (with a unique referral code) is created
  automatically on signup by a database trigger.
- **Child profiles** - a parent can add one or more children; the child's
  in-app progress (writing completions, quiz answers, badges) is mirrored to
  Supabase in the background whenever a parent is signed in, in addition to
  the local instant feedback that already worked in Part 1/2.
- **Parent Area** (replaces the old placeholder) - real, protected: shows
  the signed-in child's stars, writing/quiz stats, badges, a "could use more
  practice in..." hint from actual quiz misses, premium status, and referral
  code/link/stats.
- **Admin Panel** - protected by a real `role = 'admin'` check enforced by
  Row Level Security (not just hidden in the UI). Has a Dashboard (live
  counts: users, free vs premium, active subscriptions, activities,
  referrals, verified revenue), a Monetization tab (every toggle/number the
  brief asked for, saved straight to `monetization_settings`), and a Content
  tab (Lessons and Quiz Questions full CRUD, as the working pattern - see
  "decisions" below for why Writing Templates/Games admin screens aren't
  built yet).
- **Free usage limit** - enforced by the `check-usage` **edge function**,
  which counts a signed-in parent's real `usage_events` rows in the database
  - never a number the frontend can just claim. Shows the exact message from
  the brief ("🔒 Your free learning limit is complete...") when it's hit.
- **Premium/paid system** - a `PaymentProvider` abstraction with a mock
  provider for testing the full flow today, and the `verify-payment` edge
  function as the *only* place a payment can turn into a subscription -
  using the service-role key server-side, never trusting the frontend's
  "payment succeeded" callback.
- **Referral system** - unique code + link generated at signup, tracked in
  `referrals`, qualified and rewarded by the `process-referral` edge
  function, which enforces: no self-referrals, no double rewards for the
  same referral, and a configurable max total reward per referrer.
- **Security** - RLS on every table; subscriptions/payments are
  select-only from the client (writes only happen inside edge functions with
  the service-role key); the service-role key never appears in any frontend
  file or `VITE_` env var; child interfaces never show pricing/admin
  controls.

## Decisions I made, and why

1. **I could not test any of this against a live database.** I don't have a
   Supabase project or credentials - I've written the schema, RLS policies,
   edge functions and frontend code as carefully and correctly as I can, and
   the frontend builds cleanly with real Supabase types, but you'll be the
   first one to actually run it against a real project. Please treat the
   setup steps below as the real test, and tell me if anything errors -
   I can fix it from the error message even without my own project.

2. **Admin content management covers Lessons and Quiz Questions fully**, as
   the complete, working CRUD pattern - not all of Writing Templates, Games,
   subjects, levels, ad settings screens. Copying the same pattern
   (list + form + save/delete, all through `adminDataService.ts`) to the
   remaining content types is mechanical but is real additional work I
   didn't want to rush in this pass. Everything in the database itself is
   already there and RLS-protected - it just doesn't have an admin form yet.

3. **The free-usage limit only applies to signed-in parents.** A family can
   still explore the app before creating an account (matches how the rest of
   the app worked in Part 1/2). This is a deliberate reading of "meaningful
   learning sessions" - the brief also says usage must be verified
   server-side, which requires knowing *whose* usage it is.

4. **Payment provider is still a mock.** The brief explicitly said not to
   hard-code a provider. `paymentService.ts` and `verify-payment` are built
   so that swapping in Razorpay (or Stripe, or anything else) is: write one
   new `PaymentProvider` class on the frontend, and replace the
   `verifyWithProvider()` function in the edge function with a real call to
   that provider's verification API. Nothing else changes.

5. **Referral "qualification"** is intentionally light for this phase: it
   fires once the referred parent's child completes their very first writing
   activity. That's enough to filter out an empty signup while staying
   simple; a stricter bar (e.g. requiring a subscription) can be added later
   by editing one `if` in `process-referral`.

## Setup you'll need to do (step by step)

### 1. Create the Supabase project
Go to supabase.com, create a free project. Save the **Project URL** and the
**anon public key** from Project Settings -> API - you'll need both.

### 2. Run the database schema
Dashboard -> **SQL Editor** -> New query -> paste the entire contents of
`supabase/schema.sql` from this project -> Run. It's safe to re-run if
you're not sure it worked the first time.

### 3. Deploy the three edge functions
Dashboard -> **Edge Functions** -> Create function, once for each of these
(name them exactly as shown), pasting in the matching file's contents:
- `verify-payment` <- `supabase/functions/verify-payment/index.ts`
- `check-usage` <- `supabase/functions/check-usage/index.ts`
- `process-referral` <- `supabase/functions/process-referral/index.ts`

No CLI needed - the Dashboard's function editor works entirely in the browser.

### 4. Set environment variables in Vercel
Project -> Settings -> Environment Variables, add:
- `VITE_SUPABASE_URL` = your Project URL
- `VITE_SUPABASE_ANON_KEY` = your anon public key

Never add the **service_role** key here or anywhere in the GitHub repo - it
only belongs in the Edge Functions' own secrets (Supabase sets
`SUPABASE_SERVICE_ROLE_KEY` there automatically).

### 5. Create your admin account
Open the deployed app -> Parent Area -> Create Account, register normally.
Then in Supabase SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```
Log out and back in - you'll now see "🛠️ Open Admin Panel" in Parent Area.

### 6. Turn on what you want live
Admin Panel -> Monetization - everything defaults OFF/safe (paid system off,
free limit on at 15, referrals on). Flip Paid System on whenever you're
ready to actually sell premium.

## Database tables (all in `supabase/schema.sql`)

profiles, child_profiles, subjects, classes_levels, lessons,
writing_templates, tracing_paths, quizzes, quiz_questions, games, progress,
badges, child_badges, usage_events, subscriptions, payments, referrals,
referral_rewards, monetization_settings, ad_settings, admin_settings.

## What's next (Part 4)

- Admin screens for Writing Templates, Tracing Paths and Games (same CRUD
  pattern as Lessons/Quiz Questions)
- A real payment provider (Razorpay is the natural choice for India) wired
  into `verifyWithProvider()`
- Moving the static English/Hindi/Maths/GK content from `data/*.ts` into the
  `subjects`/`lessons` tables, so the Admin Panel can actually edit it
- Multiple child profile switching from inside the child-facing UI (a simple
  "who's learning?" picker), not just from Parent Area
- Ads integration (slot + provider) once `ads_enabled` is turned on
- Hindi tracing (still pending since Part 2)

---

# Part 4 - Ads, Final Monetization, PWA, Security & Polish

Nothing from Parts 1-3 was rewritten. This section adds Ads Management, rounds
out the Admin Panel's content tools, tightens the PWA, trims the bundle a
little, and closes with the full project audit requested at the end of the
brief.

## What's new in Part 4

- **Ads Management** (`src/features/admin/AdminAds.tsx`) - its own Admin Panel
  tab, separate from Monetization: a master ON/OFF plus three placement
  toggles (Home, Subject pages, Games). Backed by `ad_settings` in Supabase.
- **`AdSlot` component** - the only way an ad can ever appear. It fails
  *closed*: renders nothing at all unless ads are on, this placement is on,
  and the user isn't premium. It's placed on the Home screen, every subject
  hub (English/Hindi/Maths/Colors&Shapes/GK), and the Games hub - and
  nowhere else. It is not imported anywhere under `src/features/writing/`,
  which is how "ads never interrupt Writing Practice" is actually guaranteed
  rather than just promised.
- **Ad provider abstraction** (`src/services/adsService.ts`) - a `HouseProvider`
  placeholder renders a small labelled "ad space" card today; wiring a real
  child-directed-ad network later is one new class, same as the payment
  provider pattern from Part 3.
- **Admin Content now also covers Writing Templates and Games** (full CRUD,
  RLS-protected) - see the honest caveat below about what this does and
  doesn't do yet.
- **Admin Dashboard** now shows a Writing vs Quiz activity bar chart (a tiny
  dependency-free SVG component, not a charting library) and a
  "Configuration Status" panel summarizing every monetization/ads toggle at a
  glance.
- **Code-splitting**: Login/Register/Reset/Parent Area/Pricing/Admin Panel are
  now `React.lazy`-loaded instead of bundled into the main chunk. A child
  playing the app never downloads any of that code. Verified in the build
  output - see the bundle section below.
- **PWA**: added `apple-touch-icon`, maskable icon variants, iOS/Android
  "add to home screen" meta tags, and runtime caching for the Google Fonts
  files so the app shell still opens with no signal after the first load.

## An honest caveat: Admin Content vs. what the child sees

The Admin Panel's Lessons, Quiz Questions, Writing Templates and Games
managers all write real rows to Supabase, fully RLS-protected. But the
child-facing screens (English/Hindi/Maths/GK/Games hubs) still read from the
static files in `src/data/*.ts`, the same as they did in Part 2 - they do
not yet query these Supabase tables. So right now, editing content in the
Admin Panel does **not** make it appear for a child. Making that connection
(each child screen fetching from Supabase instead of its local data file,
falling back to the local file if the table is empty) is real, contained
work - each screen's data-fetching function is already isolated behind
`contentService.ts`/its own module, so it's a matter of swapping the
function body, not restructuring the screen. I did not want to rush this in
this pass and risk silently breaking a working child screen. This is the
single most important thing to know before telling anyone "the admin panel
manages the content."

## Bundle / performance

```
Main chunk (child experience): ~427 KB  (~122 KB gzipped)
Auth screens:                    ~5 KB combined
Parent Area:                     ~7 KB
Admin Panel:                    ~27 KB
```
Auth/Parent/Admin (~40 KB combined) are only downloaded if and when a parent
actually opens those screens. The main chunk still includes
`@supabase/supabase-js` because the child-facing screens need it too (the
usage-limit check and ad-visibility check both call Supabase) - that's a
real, necessary cost of the free-limit/ads features being server-verified
rather than trivially removable. Further reduction (e.g. only loading
Supabase once a parent signs in) is possible but touches the writing/games
screens directly, which I left alone per "do not rewrite working features."

## Final Project Audit

### Fully working today (verified: the project builds clean, `tsc` reports
no errors, and every screen's logic has been read through end-to-end)
- Writing Practice: all 5 levels, finger drawing, pen colors/sizes, eraser,
  undo, redo, clear, for English A/B/C and Numbers 1-9
- English, Hindi (recognition), Maths (concepts), Colors & Shapes, GK -
  content and quizzes, from static data
- 8 Learning Games across 4 reusable engines
- Rewards: stars, 4 badges, unlock celebration - stored locally, and mirrored
  to Supabase when a parent is signed in
- PWA: installable, offline app shell, correct icons/manifest
- Ads: fully gated logic (master + placement + premium check), currently
  showing a placeholder "house ad" since no real network is connected
- Code architecture: every content type is data-driven, not hard-coded in a
  component; every sensitive write (payments, subscriptions, referral
  rewards) only happens inside an edge function with the service-role key

### Requires you to configure something external before it works
- **Everything Supabase-backed** (Parent login, Parent Area data, Admin
  Panel, real free-limit enforcement, real premium unlock, real referral
  rewards, ad settings from the DB) needs the setup in the Part 3 section
  above: create the project, run `schema.sql`, deploy the 3 edge functions,
  set the two `VITE_` env vars in Vercel. Until that's done, the app still
  works fully for a child - it just runs "open" (no login, no limits, no
  ads) rather than throwing errors, by design.
- **Payments**: still the mock provider. A real gateway (Razorpay is the
  natural pick for India) needs its own account/KYC with the provider, then
  a few lines in `paymentService.ts` and `verify-payment/index.ts`.
- **A real ad network**: none is connected. Whichever one is chosen needs
  its own approval process (and, given this is a children's app, its own
  child-directed-advertising compliance review) before `adsService.ts`'s
  `HouseProvider` is replaced with a real one.

### Still needs real testing (I could build and reason about this code, but
could not click through it on an actual device)
- Actual on-device testing: Android phone, different screen sizes, touch
  behavior, PWA install flow on Chrome for Android specifically
- The full payment flow end-to-end against a live Supabase project
- The full referral flow with two real accounts
- Whether the free-limit's "meaningful activity, not a refresh" definition
  feels right in practice once real families use it
- Admin Panel usability on a phone screen (it was built mobile-first like
  everything else, but wasn't clicked through on a real device)

### Explicitly deferred (not started)
- Hindi finger-tracing (still recognition + audio only, per the Part 2
  decision)
- Numbers 10 and above (needs multi-digit tracing support)
- Wiring child screens to read Supabase content tables (see the caveat
  above) - this is the natural Part 5
- A-Z full alphabet tracing (currently A, B, C)
- Quizzes for the 8 remaining GK topics beyond Animals/Fruits

## What's next (Part 5, if wanted)
- Wire child-facing screens to Supabase content tables (with local-file
  fallback), so the Admin Panel's edits actually reach children
- A real payment provider and a real (child-appropriate) ad network
- On-device QA pass and fixes from real usage
- Hindi tracing, A-Z, numbers 10-100

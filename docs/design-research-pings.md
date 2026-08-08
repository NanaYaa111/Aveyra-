# Pings — and the SMS question

**Author request (2026-08-08):** *"a section for introvert lovers where they miss
each other but don't know what to say — sweet, short pings sent to their
partner's SMS to get their attention, and to reach the person if the partner has
no data."*

The insight is a good one and the feature is built. The **delivery channel** is
a separate decision that hasn't been made, because SMS reverses two recorded
decisions and carries consequences worth choosing deliberately rather than
inheriting.

---

## What was built

A ping is one tap from a **closed list of six** warm phrasings. Choosing from
six is easy where a blank message box is not — removing the composing step *is*
the feature, since "I miss you but don't know what to say" is a real reason
quiet people go silent on each other for days.

Two rules keep it honest:

1. **A ping never asks for anything.** None of the six is a question, and the UI
   says so outright ("Nothing here asks for a reply"). It cannot be left
   unanswered, so it can't become the guilt mechanic that unanswered texts and
   read receipts are.
2. **It cannot be used to pester.** Five per person per day, matching Section
   J's ceiling — enforced in the client *and* by a database trigger, since a cap
   that lives only in the client is not a cap and would not survive a second
   device. This is not an engagement limit. A channel that reaches someone
   unprompted is exactly the channel that can be turned against them, and an
   affectionate feature in a relationship app has to be built assuming the
   relationship might not always be kind.

Implementation reuses the message thread (`kind = 'ping'`) rather than adding a
parallel store, so pings inherit its RLS, realtime, and encryption unchanged.

---

## Why SMS wasn't switched on with it

### It reverses recorded decisions
- **Q15** settled that **email is the sole account identifier** — passwordless
  OTP, no phone number anywhere. SMS requires collecting and verifying a phone
  number for both partners: new PII, against the data-minimisation principle.
- **Section J** settled notifications v1 as *"none — in-app indicators only;
  push/email deferred."* SMS is a longer step than the push and email that were
  themselves deferred.

### It breaks the property you asked me to protect
The app currently makes **zero external runtime requests** and behaves
identically everywhere. SMS would be the first part that doesn't:
- It needs a paid gateway (Twilio, Vonage, MessageBird) — a real per-message
  cost and a hard third-party dependency.
- Delivery is regulated per country: **A2P 10DLC** registration in the US,
  **DLT** registration in India, sender-ID rules across the Gulf and much of
  Europe. An unregistered sender is silently filtered rather than rejected, so
  it fails invisibly.
- Cost and reliability vary by an order of magnitude between countries.

### The safety surface is different in kind
In-app, the worst case is an ignored line of text. Over SMS, the app becomes a
channel that reaches someone's lock screen wherever they are, and that is the
shape of a tool for coercive control. Any SMS build needs, at minimum: explicit
verified opt-in from the *recipient*, a cap enforced server-side, one-tap
disable that never notifies the sender, and STOP-keyword handling (legally
required in several jurisdictions anyway).

### The stated reason has a cheaper answer
"To reach them if they have no data" is a real problem, but SMS is a heavy
solution. Most of that gap is already covered: pings are queued and delivered by
realtime the moment they reconnect, and email reaches every country and device
with no install, no registration regime, and no phone number.

---

## Recommendation

Ship the in-app pings as built. If reaching someone away from the app matters
next, take **email** first: it costs nothing per message, works everywhere,
needs no new PII beyond the address already on file, and carries none of the
regulatory or safety weight.

If SMS is still wanted after that, it should be a deliberate amendment covering
the phone-number PII, the per-country registration work, the gateway cost, and
the recipient-consent and STOP handling above — **not** a quiet extension of
this feature.

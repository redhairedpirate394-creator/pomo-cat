# Example: the first exchange

A made-up but realistic first conversation, from "let's start" to the first
round report. The owner runs a small physiotherapy practice and has never
written software. Everything the team says below follows the rules in
`AGENTS.md`; nothing here is a script the owner has to follow.

---

**Owner:** let's start

**Team:** Welcome. I checked your computer: everything is in place except that
your GitHub command-line tool is a year old (2.52; current is 2.86). GitHub
has refused outdated versions before and then I could not publish for you, so
when you have a minute, run the one line for your system: on a Mac
`brew upgrade gh`, on Windows `winget upgrade GitHub.cli`. No hurry; I can
work in the meantime.

Before I ask about the product, six quick questions. Each one has my
suggestion after the arrow; a plain "yes" takes it, or just tell me in your
own words.

❓ **Q1 – The idea**: What should the product do, for whom, and what is better
afterwards?
➡️ (no suggestion here; this one is yours)

❓ **Q2 – First users**: Who tries it first, and with real or made-up data?
➡️ You, with made-up patients, until you tell me otherwise.

❓ **Q3 – What must be true**: What is the one thing that, if it doesn't work,
makes the whole product pointless?
➡️ (yours)

❓ **Q4 – Language**: Talk and app in English?
➡️ Yes, English.

❓ **Q5 – Publishing**: After each round you approve, should I keep it on your
machine, open a pull request for someone to check, or publish automatically so
you get a web address you can open on your phone?
➡️ Publish automatically, *unless* the product will hold real people's names
or contact details. Then I recommend keeping it on your machine until we have
talked about who may see the data.

❓ **Q6 – How technical should I be with you?**: "Just show me the app" (I
decide technical things and tell you in one sentence each) or "tell me the
technical decisions too"?
➡️ Just show me the app.

**Owner:** 1: my practice has 3 therapists. Patients call to book and we write
it in a paper calendar, then someone calls them the day before to remind them.
I want patients to book online and get the reminder automatically.
2: me with fake data, yes. 3: that a patient can pick a free slot without
double booking a therapist. 4: yes. 5: it will have patient names, so keep it
on my machine for now. 6: yes.

**Team:** Thank you. Here is what I noted; correct me if anything is off.

- Product: online booking for a 3-therapist physio practice, with automatic
  reminders.
- First users: you, with made-up patients. Nothing published yet because real
  names are coming. Plain explanations.
- The thing that must work first: a patient picks a free slot and no therapist
  is ever double-booked. That is what the first round will prove.

Before the product questions, one thing you should decide early because it
costs money and changes where data lives:

❓ **Q7 – Where the calendar lives**: The foundation I start from keeps all
data inside one browser on one computer, which is perfect for proving the
booking rules with made-up data. For patients to book from their own phones,
the calendar must live on a server, which means a small monthly hosting cost
(a few euros) and patient data stored outside your computer, with the data
protection duties that brings.
➡️ Round one on your machine with made-up data, to prove the booking rules.
Before the "Solid and usable" round I come back with a concrete proposal for
the server (cost, where the data is kept, what you need to decide for data
protection), and you decide then.

**Owner:** 7 yes

**Team:** Good. Now the product questions, a few at a time.

❓ **Q8 – Who sees the calendar**: Do patients see which therapist is free, or
just "a slot is free" and the practice assigns the therapist?
➡️ Patients choose a therapist, because many have a regular one, with "no
preference" as an option.

❓ **Q9 – Slot length**: Are appointments always the same length?
➡️ Yes, 30 minutes, with the possibility to set a different default later.

❓ **Q10 – Reminders**: Email or text message? Text messages cost a few cents
each and need an account with a messaging provider; email is free but patients
must give an address.
➡️ Start with email; keep text messages as a later option. Per booking I
would then store a name and an email address and nothing else about the
patient. Tell me if you need more (phone, insurance) and why.

❓ **Q11 – Cancellation**: Can patients cancel or move an appointment
themselves, and until when?
➡️ Yes, through a link in the confirmation email, until 24 hours before.
Later than that they have to call.

❓ **Q12 – Opening hours**: Same hours for every therapist?
➡️ Each therapist has their own weekly hours that you can set; start with
Monday–Friday 8:00–18:00 for all three.

**Owner:** 8 yes. 9 yes but our first appointment is always 60 min. 10 email
is fine, we only need name and email. 11 yes. 12 yes but Petra only works
Mon–Wed.

**Team:** Noted:

- Therapist choice with a "no preference" option.
- 30-minute slots; a patient's first appointment is 60 minutes. (That changes
  the free-slot check: I need two adjacent free slots for a first visit. Good
  that you said it now.)
- Email reminders; per booking we store name and email only.
- Self-service cancel/move until 24 h before.
- Hours Mon–Fri 8–18 for all; Petra Mon–Wed only.

One follow-up: how do I know it's a first appointment?

❓ **Q13 – First visit**: Ask the patient "Is this your first visit with us?"
when booking?
➡️ Yes, a simple yes/no question; the practice can correct it later.

**Owner:** yes

**Team:** Then I have what I need to start. I'll build the first working
slice: a patient picks a therapist (or no preference), sees free slots for the
next two weeks, books one, and the system refuses anything that would double
book — including the 60-minute first visit. Reminders and cancellation come in
the next round. This will take a while; I'll come back with a link and a
short report. When you see it, a fresh start is best: type `/clear` and then
just answer — the project folder holds everything I need.

---

*(later)*

**Team:**

# Round 1: First working slice

**What is new**
- Patients choose a therapist or "no preference", see free slots for the
  next 14 days, and book one.
- First visits take 60 minutes; Petra has no slots on Thursdays and Fridays.
- Double bookings are refused, even from two browser tabs at the same time.

**Where to try it:** http://127.0.0.1:5173/ (this computer only, as agreed).
If the page does not load, tell me and I'll start it again.

**Try these (made-up data only)**
1. Book a first visit with Petra on a Tuesday: only slots with a free hour
   after them appear, and the confirmation says 60 minutes.
2. Open a second tab and book the same slot again: it is refused with a clear
   message and offers the next free one.
3. Pick "no preference" on a Thursday: Petra is not offered.

Screenshots (saved with this round): Petra's Tuesday slots on a phone; the
refused double booking; the Thursday list without Petra.
**Your decisions**
- Q1 Is this round good enough to move on to reminders and cancellation?
  ➡️ Yes.
- Q2 When a slot is taken a moment before a patient confirms: offer the next
  free slot with the same therapist, or the same time with another therapist?
  ➡️ Same therapist, next free slot; most patients come for a person.

**How to answer:** just tell me in chat, in any form. I will write it down
and read it back to you.

**Known limits:** no reminders or cancellation yet; data lives in this
browser only; the server question (Q7) comes back before the next named round.

---

**Owner:** Looks good. 1 yes. 2 yes. Two things: the slot list is hard to read
on my phone, everything is tiny. And "no preference" should be the first
option, not the last.

**Team:** Thank you — here is what I wrote down:

- You approve round 1; next up are reminders and cancellation.
- r01 (fix next): the slot list is hard to read on a phone. I saw it in the
  screenshot too; I'll fix it first.
- r02 (next round): "no preference" should be the first therapist option.
- You chose: same therapist, next free slot, when a slot is taken last second.

As agreed, nothing is published. Round 2 starts with r01 and r02, then
reminders and cancellation, and I'll bring the server proposal (cost, where
data is kept, what you decide for data protection) with the next report.

import type { Section } from "@/workshop-shared";
import { ProTip } from "@/workshop-shared";
import { SectionHero, Callout, WWE, Steps, Shot, Prompt, HOST, IMG } from "@/decks/claimfox-slide-data";

/* ═══════════════════════════════════════════════════════════════════════════
   FIG'S FIRST HOUR WITH CLAUDE · CLAIMFOX BUILD DAY · SEPTEMBER 29, 2026

   Grounded in what Fig and Heidy actually asked for:
   - Heidy, Jul 10: Fig wants to start "very basic... this is how you log in",
     then extracting data, summarizing data, creating a PDF output.
   - Heidy, Aug 28: a sit-down "you click here, you do this, you do that".
   - Fig, May 6: her team spends 3-4 hours pulling data from several systems into
     one report; watching that happen in 5 minutes is what sold her.
   - Heidy, Jul 10: a place to ask questions about every client is something Fig
     "has always been looking for".
   So: clicks first, one idea at a time, on her own keyboard, assuming nothing.
   Practice files are fictional (the ClaimFox practice pack).

   Part 2 (added Sep 28 at Patrick's request) teaches her how to get better
   answers, not just what's possible: let it interview you, brief it like a new
   hire, ask for options and steer, have it check the work, plus a prompt card.
   Part 2 shows no sample outputs: nothing there was run in a clean Claude app
   session, so the "expect" lines describe what to look for instead.

   Sep 28 revision (Patrick): assume Fig already uses Claude sometimes. The
   "it remembers the thread" exercise was cut as too basic, exercise 1 now
   covers the parts a casual user may not have touched, and a new exercise 5
   covers standing context (CLAUDE.md + VOICE.md, in a folder or a Project).
   VOICE.md is built from her own sent emails: samples beat self-description
   (Agent Context Kit research, 2026-09-17).

   The cheat sheet (added Sep 28) carries the core ideas from the Cowork
   workshops (public-slide-data.tsx, pulsepoint-slide-data.tsx): the intern,
   Chat/Cowork/Code, models, tokens and the context window, tokenization and
   hallucination, data safety, skills/connectors/plugins, and three prompt
   moves. Plain English, one ClaimFox example per idea. Model names are family
   names only so the page doesn't go stale when versions change.
   ═══════════════════════════════════════════════════════════════════════════ */

const FIG_ZIP = `https://${HOST}/claimfox-files/claimfox-fig-practice.zip`;

function ClaudeSaid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 max-w-[860px]">
      <span className="type-label text-[var(--terra)] block mb-2">WHAT CAME BACK WHEN WE TRIED IT</span>
      <div className="rounded-xl bg-white border border-[var(--charcoal)]/15 shadow-sm p-6 type-body text-[var(--charcoal)]/90">{children}</div>
      <p className="type-body-sm text-[var(--charcoal)]/55 mt-2">Yours will be worded differently. Every time is a little different, and that's normal.</p>
    </div>
  );
}

const F = ({ children }: { children: React.ReactNode }) => <span className="font-mono text-[14px] bg-[var(--charcoal)]/[.06] px-1.5 py-0.5 rounded-sm">{children}</span>;

const G = "Part 1 · What it can do";
const G2 = "Part 2 · Better answers";

const sStart: Section = {
  id: "fig-start", num: "Start", group: G, title: "Before we start", shortTitle: "Start",
  slides: [
    {
      id: "fig-title", title: "Your first hour with Claude", titleHidden: true, dark: true, isHero: true,
      content: <SectionHero eyebrow="FIG · ONE-ON-ONE · SEPTEMBER 29" line1="Your first hour" line2="with Claude." sub="Part 1: six short exercises that show what it can do. Part 2: four habits that get you better answers. All on your own keyboard. No jargon." />,
    },
    {
      id: "fig-why", title: "What we're doing, and why", eyebrow: "BEFORE WE START",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Your team is going to show you what they built this afternoon. This hour is so you know what they're talking about, because you've done it yourself. Not so you can build it. So you can follow it, ask good questions, and use it in your own week.</p>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]"><strong>Part 1</strong> shows you what it can do. <strong>Part 2</strong> is how you get better at it: four habits that turn a so-so answer into one you'd actually use.</p>
          <Callout label="THE ONLY TWO THINGS TO REMEMBER" tone="terra">
            <p><strong>1. Talk to it like a very capable new assistant on their first day.</strong> Smart, fast, and knows nothing about ClaimFox. Tell it who you are, what you want, and what the result should look like.</p>
            <p className="mt-3"><strong>2. It only knows what you show it, and it's not a calculator.</strong> Give it the file. For numbers, ask it to work them out properly and show you how. Exercise 6 shows why.</p>
          </Callout>
          <Callout label="HAVE THIS READY" tone="indigo">
            The Claude app open on your laptop, and the practice folder on your Desktop: download <a className="underline" href={FIG_ZIP}>claimfox-fig-practice.zip</a>, unzip it, and drag the <F>ClaimFox practice - Fig</F> folder to your Desktop. The files in it are made up.
          </Callout>
        </>
      ),
    },
  ],
};

const s1: Section = {
  id: "fig-1", num: "1", group: G, title: "The parts that do the work", shortTitle: "1 · The app",
  slides: [
    {
      id: "fig-1-a", title: "Exercise 1 · The parts that do the work", eyebrow: "EXERCISE 1 OF 6 · 3 MINUTES",
      content: (
        <>
          <WWE
            what="Find the three parts of the app that turn Claude from a question box into something that does work."
            why="If you've mostly used Chat, these are what the rest of today runs on."
            expect="You know where each one is and what it's for."
          />
          <Shot src={`${IMG}/cowork-home-private.png`} alt="The Claude app home screen" w={992} h={865} max={760} caption="The Claude app. The list on the left is blurred for privacy. Yours will show your own chats." />
          <Steps items={[
            <><strong>The Chat / Cowork switch</strong>, under the message box. Cowork works on a folder of files on your laptop and makes real files: PDFs, spreadsheets, Word documents.</>,
            <><strong>The model menu</strong>, in the message box. Sonnet is the everyday model. Switch to Opus when a problem is hard or the first answer missed.</>,
            <><strong>Projects and Customize</strong>, in the left sidebar. Projects hold standing instructions and files for ongoing work (exercise 5). Customize is where the skills your team builds today will live.</>,
          ]} />
        </>
      ),
    },
  ],
};

const s2: Section = {
  id: "fig-2", num: "2", group: G, title: "Hand Claude a file", shortTitle: "2 · A folder",
  slides: [
    {
      id: "fig-2-a", title: "Exercise 2 · Hand Claude a file", eyebrow: "EXERCISE 2 OF 6 · 7 MINUTES",
      content: (
        <>
          <WWE
            what="Point Claude at a folder and ask it about one file in it: a week of updates from six leaders."
            why="This is the 3-hours-to-5-minutes moment. Reading and pulling together what several people sent is exactly what it's fast at."
            expect="Five bullets and a clear answer to 'what needs me.'"
          />
          <Steps items={[
            <>Click <strong>New</strong>. Switch the toggle to <strong>Cowork</strong>.</>,
            <>Click the <strong>folder icon</strong> under the box, and choose <F>ClaimFox practice - Fig</F> on your Desktop.</>,
            <>Paste the prompt below and press <strong>Enter</strong>. It may ask permission to read the folder. Say yes.</>,
          ]} />
          <Prompt label="Paste this" code={`Read the leadership updates file in this folder. Summarize it in five bullets, and tell me which items need me this week.`} />
          <ClaudeSaid>
            <ul className="space-y-2">
              <li>• <strong>Harborline is running behind.</strong> Amanda says turnaround averaged 5.8 days against a 5-day contract; she moved two people to help.</li>
              <li>• <strong>RecordPoint owes a lot and says it can't log in.</strong> Michelle wants a call with them.</li>
              <li>• <strong>August close is nearly done.</strong> The AWS bill is about 40% higher than July; a $25,000 adjustment is under review.</li>
              <li>• <strong>A security questionnaire is due Oct 9</strong> and a pen test is Oct 14.</li>
              <li>• <strong>3 new intake associates start Oct 5</strong> and don't have an onboarding plan yet.</li>
            </ul>
            <p className="mt-4"><strong>Needs you:</strong> a decision on the RecordPoint call, and whether you want a recovery plan from Amanda on Harborline.</p>
          </ClaudeSaid>
        </>
      ),
    },
  ],
};

const s3: Section = {
  id: "fig-3", num: "3", group: G, title: "Make a one-page PDF", shortTitle: "3 · A PDF",
  slides: [
    {
      id: "fig-3-a", title: "Exercise 3 · Turn it into a one-page PDF", eyebrow: "EXERCISE 3 OF 6 · 7 MINUTES",
      content: (
        <>
          <WWE
            what="Ask for the same summary as a finished document."
            why="You don't just get text back. It makes real files: PDFs, spreadsheets, Word documents. This is how a report gets made."
            expect="A PDF appears in your practice folder. Claude tells you it's there, and you can click to open it."
          />
          <Prompt label="Same conversation, paste this" code={`Turn that into a one-page PDF I could print and hand to my leadership team. Use navy and orange. Save it in this folder.`} />
          <Shot src={`${IMG}/fig-onepager.png`} alt="A one-page leadership update summary in navy and orange" w={1800} h={1482} max={860} caption="What came back when we tried it: a one-page PDF in the practice folder." />
          <ProTip>Don't like something? Say so: "make the Needs you box bigger," "add the dates at the top." It changes the file.</ProTip>
        </>
      ),
    },
  ],
};

const s4: Section = {
  id: "fig-4", num: "4", group: G, title: "Ask about all your clients", shortTitle: "4 · All the data",
  slides: [
    {
      id: "fig-4-a", title: "Exercise 4 · Ask a question about every client at once", eyebrow: "EXERCISE 4 OF 6 · 10 MINUTES",
      content: (
        <>
          <WWE
            what="Ask a question across a whole folder of request data: every request, every client, 21 months."
            why="This is the thing you've wanted for a long time: ask questions about all your clients and get the answer, without asking someone to build a report."
            expect="A direct answer, a small table, and a short explanation of how it worked the numbers out."
          />
          <Prompt label="Same folder, new conversation. Paste this" code={`Look at the request data in this folder. Which carrier client sent us the most requests this year, and whose on-time rate dropped the most since the first half of the year? Show me a small table, and tell me in one sentence how you worked it out.`} />
          <ClaudeSaid>
            <p><strong>Harborline Mutual</strong> sent the most requests this year, <strong>862</strong>, well ahead of Granite Shield at 486. Harborline also dropped the most: on time <strong>81%</strong> of the time in January to June, and <strong>49%</strong> since July.</p>
            <table className="mt-4 text-[15px] w-full max-w-[560px]">
              <thead><tr className="text-left text-[var(--charcoal)]/60"><th className="py-1">Client</th><th>Requests this year</th><th>On time, Jan to Jun</th><th>On time, since Jul</th></tr></thead>
              <tbody>
                <tr className="border-t border-[var(--charcoal)]/10"><td className="py-1">Harborline Mutual</td><td>862</td><td>81%</td><td className="text-[var(--terra)] font-medium">49%</td></tr>
                <tr className="border-t border-[var(--charcoal)]/10"><td className="py-1">Granite Shield</td><td>486</td><td>98%</td><td>96%</td></tr>
                <tr className="border-t border-[var(--charcoal)]/10"><td className="py-1">Keystone Auto</td><td>402</td><td>98%</td><td>100%</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-[var(--charcoal)]/70">How: I counted every request by client, then checked each finished request against its deadline, using a short program rather than estimating.</p>
          </ClaudeSaid>
          <ProTip>The last line matters. "How did you work that out?" is always a fair question, and a good answer names the data and the method.</ProTip>
        </>
      ),
    },
  ],
};

const s5: Section = {
  id: "fig-5", num: "5", group: G, title: "Give it standing context", shortTitle: "5 · Context",
  slides: [
    {
      id: "fig-5-a", title: "Exercise 5 · Give it standing context", eyebrow: "EXERCISE 5 OF 6 · 12 MINUTES",
      content: (
        <>
          <WWE
            what="Write two short files once: a CLAUDE.md about you and ClaimFox, and a VOICE.md about how you write. Then have Claude read them before it does anything."
            why="Every new chat starts from zero, so you keep re-explaining who you are, who your team is and how you like things. Put that in a file once and every answer starts from where you are."
            expect="Two files in your practice folder. Then a draft that already knows who Amanda is and sounds more like you than anything so far today."
          />
          <span className="type-label text-[var(--terra)] block mt-10 mb-3">TWO PLACES CONTEXT CAN LIVE</span>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border-2 border-[var(--indigo)] p-6">
              <span className="type-label text-[var(--indigo)]">A FOLDER ON YOUR LAPTOP · TODAY</span>
              <p className="type-body text-[var(--charcoal)]/85 mt-2">Put CLAUDE.md and VOICE.md in a folder and work in that folder with Cowork. Best for work that involves files: reports, spreadsheets, documents.</p>
            </div>
            <div className="border border-[var(--charcoal)]/15 p-6">
              <span className="type-label text-[var(--terra)]">A PROJECT IN THE APP</span>
              <p className="type-body text-[var(--charcoal)]/85 mt-2">Sidebar, then <strong>Projects</strong>, then <strong>New project</strong>. Paste the same text into the project's instructions. Every chat in it starts with that context. Best for an ongoing topic, like board prep.</p>
            </div>
          </div>
          <span className="type-label text-[var(--terra)] block mt-10 mb-2">STEP 1 · HAVE IT WRITE YOUR CLAUDE.MD</span>
          <p className="type-body text-[var(--charcoal)]/80 max-w-[860px]">In Cowork, with your practice folder selected. This is Habit 1 from Part 2: you answer, it writes.</p>
          <Prompt label="Paste this" code={`Interview me to write a CLAUDE.md file for this folder. Cover who I am, what ClaimFox does, my leadership team and their roles, and how I like answers from you. Ask one question at a time, no more than 8. Then save it here as CLAUDE.md.`} />
          <Prompt label="What a good one looks like (example, yours will say what's true for you)" code={`# About me
I'm Fig, CEO of ClaimFox. We retrieve claim-file records for auto and workers' comp insurance carriers.

# My leadership team
- Heidy Villarreal: Director of Technology
- Barbara: VP of Operations (contracts)
- Amanda: Director of Operations
- Michelle: Director of Customer Experience
- Christine: Assistant Comptroller. Scott: Controller.
- Chris: Security and compliance
- Mary: Client services, runs testing
- Kaela: HR Manager

# How I like answers
- Lead with the answer, then the detail.
- Put anything that needs a decision from me at the top.
- Calculate numbers, don't estimate them, and say where they came from.
- If the files don't say, tell me. Don't fill the gap.

# Before you show me a draft
Check it against VOICE.md.`} />
          <span className="type-label text-[var(--terra)] block mt-10 mb-2">STEP 2 · BUILD YOUR VOICE.MD FROM REAL EMAILS</span>
          <p className="type-body text-[var(--charcoal)]/80 max-w-[860px]">Describing your own style doesn't work well. Your actual emails do. Pick three you've sent that sound like you, and that you're comfortable pasting in.</p>
          <Prompt label="Paste this, then paste the three emails under it" code={`Here are three emails I've sent that sound like me. Write a VOICE.md that describes how I write: how long my emails are, how I open and close, the words I use and the ones I never use. Quote my own lines as examples. Save it in this folder.`} />
          <Prompt label="What a good one looks like (example)" code={`# How I write
- Short. Most emails are under 120 words.
- I open with the point, not a warm-up paragraph.
- I close with a clear ask and a date.
- Plain words: "fix," not "remediate."
- Never: "I hope this finds you well," "circle back," "synergy."

# Lines from my own emails
- "[a line you actually wrote]"
- "[another one]"`} />
          <span className="type-label text-[var(--terra)] block mt-10 mb-2">STEP 3 · TEST IT</span>
          <Prompt label="New conversation, same folder" code={`Read CLAUDE.md and VOICE.md first. Then draft a short note to Amanda asking for a recovery plan on Harborline by Friday.`} />
          <ProTip>Keep them alive. When Claude gets something about you wrong twice, add a line to CLAUDE.md. When a draft doesn't sound like you, say so, and have it update VOICE.md.</ProTip>
        </>
      ),
    },
  ],
};

const s6: Section = {
  id: "fig-6", num: "6", group: G, title: "Catch it guessing", shortTitle: "6 · Catch a guess",
  slides: [
    {
      id: "fig-6-a", title: "Exercise 6 · Why it sometimes makes things up", eyebrow: "EXERCISE 6 OF 6 · 10 MINUTES",
      content: (
        <>
          <WWE
            what="Ask Claude something the files don't answer, and see what it does."
            why="This is the one idea that changes how you read anything AI produces."
            expect="A good answer says 'the files don't say.' If it guesses instead, that's the lesson, and now you know what to look for."
          />
          <Callout label="THE IDEA, IN THREE SENTENCES" tone="terra">
            Claude doesn't look things up the way a person does. It writes the most likely next words, very well. When it knows the answer from what you gave it, that's great. When it doesn't, the most likely words can still sound confident, and that's what people call "making things up."
          </Callout>
          <Prompt label="Same folder, new conversation. Paste this" code={`What did Beacon Casualty's CEO say about why they're sending us less work?`} />
          <ClaudeSaid>
            <p>Nothing in these files says that. The only mention of Beacon is in Amanda's update: its volume "basically dried up, maybe 10 requests all week." The request data shows Beacon's volume fell from about 45 a month in March and April to 12 to 18 a month since May. It doesn't say why.</p>
          </ClaudeSaid>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              ["Where did this come from?", "A good answer points to a file, a clause or a row."],
              ["Show me how you worked it out.", "For numbers: it should have calculated, not estimated."],
              ["What don't you know?", "Good work says what's missing instead of filling the gap."],
            ].map(([q, d]) => (
              <div key={q} className="border-t-4 border-[var(--indigo)] pt-4">
                <p className="type-body-lg font-medium text-[var(--charcoal)]">"{q}"</p>
                <p className="type-body text-[var(--charcoal)]/70 mt-2">{d}</p>
              </div>
            ))}
          </div>
          <ProTip>Those three questions work on anything your team shows you this afternoon, whether they built it with AI or not.</ProTip>
        </>
      ),
    },
  ],
};


/* ── PART 2 · BETTER ANSWERS ─────────────────────────────────────────────── */

const s7: Section = {
  id: "fig-7", num: "7", group: G2, title: "Let it interview you", shortTitle: "7 · Interview me",
  slides: [
    {
      id: "fig-part2", title: "Part 2 · Getting better answers", titleHidden: true, dark: true, isHero: true,
      content: <SectionHero eyebrow="PART 2 · FOUR HABITS" line1="Getting better" line2="answers." sub="Part 1 showed what it can do. This part is how you get good at it. Each habit takes one sentence, and you'll use them every day." />,
    },
    {
      id: "fig-7-a", title: "Habit 1 · Let it interview you", eyebrow: "PART 2 · HABIT 1 OF 4 · 7 MINUTES",
      content: (
        <>
          <WWE
            what="Give Claude a real task, and tell it to ask you questions before it writes anything."
            why="Answers come back generic when Claude is missing what's in your head. Letting it ask is the fastest way to get it out of your head, and you don't have to know what to include."
            expect="One question at a time. After your fifth answer, a draft that reads like it came from someone who was in the room."
          />
          <Steps items={[
            <>Click <strong>New</strong>. Make sure the toggle says <strong>Chat</strong>.</>,
            <>Paste the prompt below and press <strong>Enter</strong>.</>,
            <>Answer each question briefly. A sentence or two is plenty.</>,
            <>When the draft appears, tell it what to change. You're the editor now.</>,
          ]} />
          <Prompt label="Paste this" code={`I need to write a short note to my leadership team about the AI build day we just had and what happens next. Before you write anything, interview me. Ask me one question at a time, wait for my answer, and stop after five questions. Then write the note.`} />
          <ProTip>Use this whenever you'd normally think "let me figure out what to include": a board update, a tough conversation, a job description. Prefer to answer everything at once? Say "ask me all your questions in a numbered list first."</ProTip>
        </>
      ),
    },
  ],
};

const s8: Section = {
  id: "fig-8", num: "8", group: G2, title: "Brief it like a new hire", shortTitle: "8 · Brief it",
  slides: [
    {
      id: "fig-8-a", title: "Habit 2 · Brief it like a new hire", eyebrow: "PART 2 · HABIT 2 OF 4 · 8 MINUTES",
      content: (
        <>
          <WWE
            what="Ask for the same email twice: once in one line, once with a proper brief. Then compare."
            why="The brief takes a minute longer to type and saves you three rounds of fixing. This habit makes the biggest difference of the four."
            expect="The one-line version comes back with questions for you, or a generic email full of blanks to fill in. The briefed version comes back close to ready to send."
          />
          <Prompt label="Try 1 · New chat, paste this" code={`Write an email to our client Harborline about our turnaround times.`} />
          <Prompt label="Try 2 · New chat, paste this" code={`I'm the CEO of ClaimFox. We retrieve claim-file records for auto and workers' comp insurance carriers. I'm writing to the VP of Claims at Harborline Mutual, one of our biggest clients.

The situation: our contract promises 5-day turnaround. Since July we've been on time 49% of the time, down from 81% in the first half of the year, and we're averaging 5.8 days. We've already moved two more people onto their account.

What I want: a short email that owns the problem, says what we've already done, and asks for a 20-minute call next week to walk through a recovery plan.

Tone: direct and warm. No corporate language, no over-apologizing. Under 150 words.

Don't promise a date for being back on track, and don't blame volume.`} />
          <p className="type-body-sm text-[var(--charcoal)]/55 mt-2">The Harborline numbers come from the practice files. They're made up.</p>
          <Callout label="THE FIVE THINGS A GOOD BRIEF COVERS" tone="terra">
            <div className="grid md:grid-cols-[210px_1fr] gap-x-6 gap-y-3">
              <strong>Who you are</strong><span>"I'm the CEO of ClaimFox..."</span>
              <strong>Who it's for</strong><span>"...the VP of Claims at Harborline, one of our biggest clients."</span>
              <strong>The facts</strong><span>The numbers and what's already been done. It can't know these unless you say them.</span>
              <strong>What good looks like</strong><span>Length, tone, and what the reader should do next.</span>
              <strong>What to avoid</strong><span>"Don't promise a date. Don't blame volume."</span>
            </div>
          </Callout>
          <ProTip>You don't need all five every time. When an answer misses, one of the five is usually what's missing.</ProTip>
        </>
      ),
    },
  ],
};

const s9: Section = {
  id: "fig-9", num: "9", group: G2, title: "Ask for options, then steer", shortTitle: "9 · Options",
  slides: [
    {
      id: "fig-9-a", title: "Habit 3 · Ask for options, then steer", eyebrow: "PART 2 · HABIT 3 OF 4 · 5 MINUTES",
      content: (
        <>
          <WWE
            what="Ask for three different versions, pick one, and tell it exactly what to change."
            why="It's easier to react than to describe what you want from scratch. You'll know the right one when you see it."
            expect="Three short versions labeled A, B and C. Then your pick comes back with only the changes you asked for."
          />
          <Prompt label="Same conversation as Try 2, paste this" code={`Give me three versions of that email. A: short and direct. B: warmer. C: leads with the fix. Label them.`} />
          <Prompt label="Then pick one, for example" code={`Use B. Cut the first sentence, and end by offering two times for the call.`} />
          <ProTip>Be specific about changes. "Make it better" gets a guess. "Shorter, and lose the second paragraph" gets exactly that. Another good one: paste something you wrote that you liked and say "match this style."</ProTip>
        </>
      ),
    },
  ],
};

const s10: Section = {
  id: "fig-10", num: "10", group: G2, title: "Have it check the work", shortTitle: "10 · Check it",
  slides: [
    {
      id: "fig-10-a", title: "Habit 4 · Have it check the work", eyebrow: "PART 2 · HABIT 4 OF 4 · 5 MINUTES",
      content: (
        <>
          <WWE
            what="Before you send it, ask Claude to read it as the person receiving it."
            why="It will catch what the reader would push back on while you can still fix it. Same instinct as exercise 6: don't treat the first answer as final."
            expect="Two or three specific points, like a missing detail or a line that sounds defensive, then a fixed version."
          />
          <Prompt label="Same conversation, paste this" code={`Before I send this, read it as Harborline's VP of Claims. What would bother them, what's missing, and what would they ask me on the call? Then fix the email.`} />
          <ProTip>This works on anything your team hands you, too: "What would a skeptical board member ask about this?"</ProTip>
        </>
      ),
    },
    {
      id: "fig-card", title: "Your prompt card", eyebrow: "KEEP THIS",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Copy this into a note on your phone or laptop. Fill in the brackets, and you have a good brief for almost anything.</p>
          <Prompt label="The template" code={`I'm [who you are]. I need [what you want] for [who it's for].

Background: [the facts it needs to know].

Good looks like: [length, tone, format, and what the reader should do next].

Don't: [anything to avoid].

Before you start, ask me anything you need to know.`} />
          <span className="type-label text-[var(--terra)] block mt-10 mb-3">WHEN AN ANSWER ISN'T RIGHT, TRY ONE OF THESE</span>
          <div className="border border-[var(--charcoal)]/15">
            {[
              ["It's generic", "\"Interview me first. One question at a time.\""],
              ["You're not sure what you want", "\"Give me three different versions.\""],
              ["It's close but not right", "Say exactly what to change: \"Shorter. Lose the second paragraph.\""],
              ["You're about to send it", "\"Read this as [the reader]. What's missing?\""],
              ["You don't trust a fact or number", "\"Where did that come from? Show me how you worked it out.\""],
              ["You don't know how to ask", "\"Here's what I'm trying to do. Write me a better prompt for it, then run it.\""],
            ].map(([when, say]) => (
              <div key={when} className="grid md:grid-cols-[260px_1fr] gap-3 px-5 py-4 border-b border-[var(--charcoal)]/10 last:border-b-0">
                <span className="type-body font-medium text-[var(--charcoal)]">{when}</span>
                <span className="type-body text-[var(--charcoal)]/80 italic">{say}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ],
};

/* ── CHEAT SHEET ─────────────────────────────────────────────────────────── */

const G3 = "Cheat sheet";

function Term({ tag, name, what, cf, doIt, color = "var(--indigo)" }: { tag: string; name: string; what: React.ReactNode; cf: React.ReactNode; doIt: React.ReactNode; color?: string }) {
  return (
    <div className="border border-[var(--charcoal)]/15 p-6 flex flex-col gap-3" style={{ borderTop: `4px solid ${color}` }}>
      <div>
        <span className="type-label" style={{ color }}>{tag}</span>
        <p className="type-body-lg font-medium text-[var(--charcoal)] mt-1">{name}</p>
      </div>
      <p className="type-body text-[var(--charcoal)]/85">{what}</p>
      <p className="type-body-sm text-[var(--charcoal)]/75"><strong className="text-[var(--charcoal)]">At ClaimFox: </strong>{cf}</p>
      <p className="type-body-sm text-[var(--charcoal)]/75"><strong className="text-[var(--charcoal)]">What to do: </strong>{doIt}</p>
    </div>
  );
}

const sCheat: Section = {
  id: "fig-cheat", num: "Ref", group: G3, title: "Cheat sheet", shortTitle: "Cheat sheet",
  slides: [
    {
      id: "fig-cheat-words", title: "The words you'll hear today", eyebrow: "CHEAT SHEET · 1 OF 3",
      content: (
        <>
          <Callout label="THE ONE IDEA UNDER ALL OF IT" tone="terra">
            Claude is like hiring a very capable intern who, on day one, doesn't know anything. Give them what they need, and they become the most valuable person in the building.
          </Callout>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <Term tag="THREE DOORS IN" name="Chat, Cowork and Code"
              what={<><strong>Chat</strong> is "think with me": a conversation. <strong>Cowork</strong> is "finish it for me": you give it a goal and a folder, and it works until it's done. <strong>Code</strong> is for writing software.</>}
              cf="Summaries and drafts in Chat. Reports built from a folder of files in Cowork. Code belongs to Heidy's team."
              doIt="Under 2 minutes and no files: Chat. Real work that ends in a file: Cowork. If you've never opened a code editor, you don't need Code." />
            <Term tag="WHICH BRAIN" name="Models" color="var(--terra)"
              what={<>Claude comes in sizes. <strong>Sonnet</strong> is the everyday one. <strong>Opus</strong> is for hard problems. <strong>Haiku</strong> is the fast, light one. <strong>Fable</strong> is the most powerful, and you won't need it yet.</>}
              cf="Everything in today's workbooks runs fine on Sonnet."
              doIt="Stay on Sonnet. If an answer disappoints you, switch to Opus in the model menu and run it again." />
            <Term tag="TEACHES HOW" name="Skill"
              what="A written set of instructions that teaches Claude how to do one task your way. It switches on by itself when your request matches."
              cf="That's what your team built today. Barbara's contract checker is a skill: how we read a contract, written down once, done the same way every time."
              doIt="Don't go hunting for skills to build. When you catch yourself typing the same instructions a third time, that's a skill. They live under Customize, then Skills." />
            <Term tag="GRANTS ACCESS" name="Connector" color="var(--terra)"
              what="A sign-in that lets Claude read, and sometimes act, inside another app, like email, calendar or SharePoint. It signs in as you, so it can only see what you can see."
              cf="Microsoft 365 would let Claude read SharePoint files directly. Heidy decides which connectors are turned on."
              doIt="If a tool isn't connected, export the report and drop it in a folder. That's how most people start." />
            <Term tag="THE BUNDLE" name="Plugin" color="var(--charcoal)"
              what="Skills and connectors packaged together and installed in one click. If a skill is a lesson and a connector is a login, a plugin is the whole playbook."
              cf="Down the road, today's skills could be packaged as one ClaimFox plugin that Heidy installs for everyone at once."
              doIt="Nothing yet. Just know the word when Heidy uses it." />
            <Term tag="WHAT IT CAN HOLD" name="Tokens and the context window"
              what="Claude reads text in small chunks called tokens, and can only hold so many at once. Everything in a conversation fills that space: your questions, the files, its own replies."
              cf="A chat that mixes Monday's client email, Tuesday's spreadsheet and Thursday's board prep gets worse answers, not better ones."
              doIt={<>New thought, new session. Click <strong>New</strong> each time you change topics.</>} />
            <Term tag="A STANDING WORKSPACE" name="Project" color="var(--terra)"
              what="A workspace in the app with its own instructions and files. Every chat inside it starts with that context already loaded."
              cf="A Board prep project with the latest financials and your board's usual questions, or one per big client."
              doIt="Sidebar, then Projects, then New project. One per ongoing piece of work." />
            <Term tag="CONTEXT IN A FILE" name="CLAUDE.md and VOICE.md" color="var(--charcoal)"
              what="Two plain text files. CLAUDE.md says who you are, what the business does and how you like answers. VOICE.md says how you write, built from your real emails."
              cf="Exercise 5. Every skill your team built today works the same way: written context, loaded before the task."
              doIt="Keep them in the folder you work in, or paste them into a Project. Add a line whenever Claude gets you wrong twice." />
          </div>
        </>
      ),
    },
    {
      id: "fig-cheat-how", title: "How it actually works", eyebrow: "CHEAT SHEET · 2 OF 3",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">A language model has exactly one job: <strong>predict the next word</strong> (the next token). That's all it does, very well. It's a different kind of software from the kind we grew up with.</p>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div className="border border-[var(--charcoal)]/15 p-6">
              <span className="type-label text-[var(--charcoal)]/60">A CALCULATOR</span>
              <p className="type-body-lg font-medium text-[var(--charcoal)] mt-2">2 + 2 = 4</p>
              <p className="type-body text-[var(--charcoal)]/80 mt-2">Excel computes it. Same answer every time, forever. It isn't guessing.</p>
            </div>
            <div className="border-2 border-[var(--indigo)] p-6">
              <span className="type-label text-[var(--indigo)]">A LANGUAGE MODEL</span>
              <p className="type-body-lg font-medium text-[var(--charcoal)] mt-2">2 + 2 ... probably = 4</p>
              <p className="type-body text-[var(--charcoal)]/80 mt-2">It predicts that "4" usually comes next, because it has seen that pattern millions of times. Right answer, no arithmetic.</p>
            </div>
          </div>
          <Callout label="TRY IT: PEANUT BUTTER AND ______" tone="indigo">
            Most people say jelly. Some say banana. Some say chocolate. None of them is wrong, and not everyone lands in the same place. That's what Claude does with every word. When the answer is in what you gave it, the likely words are the right ones. When it isn't, the likely words can still sound confident, and that's what people call <strong>making things up</strong> (the technical word is <strong>hallucination</strong>).
          </Callout>
          <span className="type-label text-[var(--terra)] block mt-10 mb-3">SO, IN PRACTICE</span>
          <Steps items={[
            <><strong>Give it the file.</strong> It answers best from what you hand it, not from memory.</>,
            <><strong>For numbers, ask it to calculate.</strong> "Work it out with a formula or a short program, and show me how." That's why the skills your team built today do their math in code.</>,
            <><strong>Ask where things came from.</strong> A good answer points to a file, a clause or a row, and says "the files don't say" when they don't.</>,
          ]} />
          <Callout label="HOW YOUR DATA STAYS SAFE · THE SHORT VERSION" tone="charcoal">
            <p><strong>Cowork works on files on your own laptop</strong> and asks permission before it reads a folder.</p>
            <p className="mt-2"><strong>Connectors sign in as you</strong>, so they can't see anything you can't already see.</p>
            <p className="mt-2"><strong>Anthropic doesn't train on your business data by default.</strong></p>
            <p className="mt-3 text-[var(--charcoal)]/70">What ClaimFox connects, and which real files go in, is Heidy's call. Ask her first.</p>
          </Callout>
        </>
      ),
    },
    {
      id: "fig-cheat-moves", title: "Three more prompt moves", eyebrow: "CHEAT SHEET · 3 OF 3",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">These come from our Cowork workshops. They build on the four habits in Part 2. Paste any of them before a task that matters.</p>
          <span className="type-label text-[var(--terra)] block mt-8 mb-1">1 · ASK FOR THE WORDS FIRST</span>
          <p className="type-body text-[var(--charcoal)]/80 max-w-[860px]">When a task is outside your lane, your first prompt is about the subject, not the task. Then use those words in your real prompt.</p>
          <Prompt code={`I need to make a really good [thing outside my expertise]. What are the five words an expert would use to describe what makes one great? Explain each in a sentence.`} />
          <span className="type-label text-[var(--terra)] block mt-8 mb-1">2 · THE 10-QUESTION CHECK</span>
          <p className="type-body text-[var(--charcoal)]/80 max-w-[860px]">The fastest version of Habit 1. It makes Claude find what it doesn't know before it starts.</p>
          <Prompt code={`Ask me 10 questions before you get started.`} />
          <span className="type-label text-[var(--terra)] block mt-8 mb-1">3 · THE PANEL OF EXPERTS</span>
          <p className="type-body text-[var(--charcoal)]/80 max-w-[860px]">Our favorite. You get three points of view on your plan before any work starts.</p>
          <Prompt code={`Call up a panel of 3 experts in this field, each with a different persona. Have them read my request and my goal, and have each one ask me a few questions from their own expertise.`} />
          <ProTip>Two minutes of questions up front saves twenty minutes of fixing afterward.</ProTip>
        </>
      ),
    },
  ],
};

const sAfter: Section = {
  id: "fig-after", num: "Next", group: "After today", title: "This afternoon, and this week", shortTitle: "Next",
  slides: [
    {
      id: "fig-team", title: "What your team is building today", eyebrow: "THIS AFTERNOON",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Each of these is the same idea you just used: hand Claude the files, tell it what you want, and have it show its work. Each one is written down once as a skill, so it's done the same way every time.</p>
          <div className="mt-6 border border-[var(--charcoal)]/15">
            {[
              ["Barbara", "Reads a client contract and flags every term that differs from how we normally work, with the clause cited."],
              ["Chris", "Drafts security questionnaire answers from our approved policies only. Anything without a source goes to a person."],
              ["Christine + Scott", "Checks the month's books and the bank rec, and shows the math in plain Excel formulas."],
              ["Amanda", "Builds a client's quarterly review from the request data: trends, on-time rate, and what changed."],
              ["Michelle", "A report card per requestor: unpaid invoices, what's about to expire, and why they call us."],
              ["Mary", "Turns a change ticket into a full test plan, and finds what the ticket forgot to say."],
              ["Kaela", "Builds an onboarding plan for a role, and never makes up policy."],
            ].map(([w, d]) => (
              <div key={w} className="grid md:grid-cols-[180px_1fr] gap-3 px-5 py-4 border-b border-[var(--charcoal)]/10 last:border-b-0">
                <span className="type-body font-medium text-[var(--charcoal)]">{w}</span>
                <span className="type-body text-[var(--charcoal)]/80">{d}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "fig-week", title: "Three things to try this week", eyebrow: "THIS WEEK",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Same moves as today, on your own work. Use only files you'd be comfortable sharing with Heidy's approved tools.</p>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              ["A long email thread", "Paste it into Chat. \"What's been decided, what hasn't, and what do they need from me?\""],
              ["A report someone sent you", "Put it in a folder, use Cowork. \"Give me the three things that matter and the one question I should ask.\""],
              ["Before a meeting", "\"I'm meeting [who] about [what]. Here's the background. What should I know, and what should I ask?\""],
            ].map(([t, p]) => (
              <div key={t} className="border border-[var(--charcoal)]/15 p-5">
                <span className="type-label text-[var(--terra)]">{t}</span>
                <p className="type-body text-[var(--charcoal)]/80 mt-2 italic">{p}</p>
              </div>
            ))}
          </div>
          <Callout label="WHEN IN DOUBT" tone="indigo">Start with the prompt card from Part 2, and ask: <em>"Where did that come from?"</em> For the words you'll hear today, see the cheat sheet.</Callout>
        </>
      ),
    },
  ],
};

export const SECTIONS: Section[] = [sStart, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, sAfter, sCheat];

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

const G = "Your first hour";

const sStart: Section = {
  id: "fig-start", num: "Start", group: G, title: "Before we start", shortTitle: "Start",
  slides: [
    {
      id: "fig-title", title: "Your first hour with Claude", titleHidden: true, dark: true, isHero: true,
      content: <SectionHero eyebrow="FIG · ONE-ON-ONE · SEPTEMBER 29" line1="Your first hour" line2="with Claude." sub="Six short exercises on your own keyboard. No jargon. By the end you'll have done, yourself, the things your team is building on today." />,
    },
    {
      id: "fig-why", title: "What we're doing, and why", eyebrow: "BEFORE WE START",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Your team is going to show you what they built this afternoon. This hour is so you know what they're talking about, because you've done it yourself. Not so you can build it. So you can follow it, ask good questions, and use it in your own week.</p>
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
  id: "fig-1", num: "1", group: G, title: "Find your way around", shortTitle: "1 · The app",
  slides: [
    {
      id: "fig-1-a", title: "Exercise 1 · Find your way around", eyebrow: "EXERCISE 1 OF 6 · 3 MINUTES",
      content: (
        <>
          <WWE
            what="Find the three things you'll use every time."
            why="Everything else on the screen can wait. These three get you through today."
            expect="You can point to each one without looking for it."
          />
          <Shot src={`${IMG}/cowork-home-private.png`} alt="The Claude app home screen" w={992} h={865} max={760} caption="The Claude app. The list on the left is blurred for privacy. Yours will show your own chats." />
          <Steps items={[
            <><strong>The box in the middle</strong> is where you type. Like a text message.</>,
            <><strong>Chat or Cowork</strong>, just under the box. <strong>Chat</strong> is a conversation. <strong>Cowork</strong> is Claude working on the files in a folder. You'll use both.</>,
            <><strong>New</strong>, top left, starts a fresh conversation. Start a new one whenever you change topics, like opening a new email.</>,
          ]} />
        </>
      ),
    },
  ],
};

const s2: Section = {
  id: "fig-2", num: "2", group: G, title: "Your first question", shortTitle: "2 · First question",
  slides: [
    {
      id: "fig-2-a", title: "Exercise 2 · Ask your first question", eyebrow: "EXERCISE 2 OF 6 · 5 MINUTES",
      content: (
        <>
          <WWE
            what="Ask Claude a question in Chat, then ask it to change its answer."
            why="It's a conversation, not a search box. It remembers what you just said, so you can steer it."
            expect="Five plain bullets, then a shorter version when you ask."
          />
          <Steps items={[
            <>Make sure the toggle under the box says <strong>Chat</strong>.</>,
            <>Click in the box, paste the question below, and press <strong>Enter</strong>.</>,
          ]} />
          <Prompt label="Paste this" code={`I'm the CEO of a company that handles claim-file record requests for auto and workers' comp insurance carriers. In plain English, what could you help me with in a normal week? Five bullet points, no jargon.`} />
          <ClaudeSaid>
            <ul className="space-y-2">
              <li>• <strong>Read the long stuff for you.</strong> Email threads, reports and contracts, boiled down to what needs your attention.</li>
              <li>• <strong>Turn spreadsheets into answers.</strong> Which clients grew, which are slipping, where the money is stuck.</li>
              <li>• <strong>Draft things you'd otherwise write from scratch.</strong> Letters, updates, policies, talking points.</li>
              <li>• <strong>Prepare you for meetings.</strong> The key facts, open issues and good questions to ask.</li>
              <li>• <strong>Pull your team's updates into one page</strong>, so you see the week in two minutes.</li>
            </ul>
          </ClaudeSaid>
          <Prompt label="Now type this, in the same conversation" code={`Make that three bullets, and put the one that would save me the most time first.`} />
          <ProTip>Notice you didn't repeat yourself. It kept the context. When an answer isn't right, don't start over. Tell it what to change.</ProTip>
        </>
      ),
    },
  ],
};

const s3: Section = {
  id: "fig-3", num: "3", group: G, title: "Hand Claude a file", shortTitle: "3 · A file",
  slides: [
    {
      id: "fig-3-a", title: "Exercise 3 · Hand Claude a file", eyebrow: "EXERCISE 3 OF 6 · 7 MINUTES",
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

const s4: Section = {
  id: "fig-4", num: "4", group: G, title: "Make a one-page PDF", shortTitle: "4 · A PDF",
  slides: [
    {
      id: "fig-4-a", title: "Exercise 4 · Turn it into a one-page PDF", eyebrow: "EXERCISE 4 OF 6 · 7 MINUTES",
      content: (
        <>
          <WWE
            what="Ask for the same summary as a finished document."
            why="You don't just get text back. It makes real files: PDFs, spreadsheets, Word documents. This is how a report gets made."
            expect="A PDF appears in your practice folder. Claude tells you it's there, and you can click to open it."
          />
          <Prompt label="Same conversation, paste this" code={`Turn that into a one-page PDF I could print and hand to my leadership team. Use navy and orange. Save it in this folder.`} />
          <Shot src={`${IMG}/fig-onepager.png`} alt="A one-page leadership update summary in navy and orange" w={1600} h={862} max={860} caption="What came back when we tried it: a one-page PDF in the practice folder." />
          <ProTip>Don't like something? Say so: "make the Needs you box bigger," "add the dates at the top." It changes the file.</ProTip>
        </>
      ),
    },
  ],
};

const s5: Section = {
  id: "fig-5", num: "5", group: G, title: "Ask about all your clients", shortTitle: "5 · All the data",
  slides: [
    {
      id: "fig-5-a", title: "Exercise 5 · Ask a question about every client at once", eyebrow: "EXERCISE 5 OF 6 · 10 MINUTES",
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
          <Prompt label="Same conversation, paste this" code={`What did Beacon Casualty's CEO say about why they're sending us less work?`} />
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
          <Callout label="WHEN IN DOUBT" tone="indigo">Ask it: <em>"Where did that come from?"</em></Callout>
        </>
      ),
    },
  ],
};

export const SECTIONS: Section[] = [sStart, s1, s2, s3, s4, s5, s6, sAfter];

import type { Section } from "@/workshop-shared";
import { ProTip, CodeBlock } from "@/workshop-shared";

/* ═══════════════════════════════════════════════════════════════════════════
   CLAIMFOX BUILD DAY · TUESDAY SEPTEMBER 29, 2026 · RONKONKOMA, 10am to 3pm

   A workbook, not a deck. One section per person, grouped by the four working
   groups in the left rail. Every step says what we're doing, why, and what
   should come back, with the prompt to paste and a screenshot of the real
   output from our practice run.

   Nothing confidential ships in this bundle. All data, contracts, policies and
   results shown are from the fictional practice pack. Screenshots of outputs
   are rendered from the actual example files; app screenshots have personal
   chat titles blurred. Fig's 1:1 lives in claimfox-fig-slide-data.tsx.
   ═══════════════════════════════════════════════════════════════════════════ */

export const HOST = "workshopfiles.com";
export const FILES_URL = `https://${HOST}/claimfox-files`;
export const IMG = "/images/claimfox";

/* ─── shared bits (Fig's workbook imports these too) ────────────────────── */

export function SectionHero({ eyebrow, line1, line2, sub }: { eyebrow: string; line1: string; line2?: string; sub: string }) {
  return (
    <div className="min-h-[46vh] flex flex-col justify-center py-8">
      <p className="type-label text-[var(--cream)]/50 mb-6">{eyebrow}</p>
      <p className="uppercase italic text-[var(--cream)] text-[clamp(40px,6.4vw,84px)] font-light leading-[0.92] tracking-[-0.02em]" style={{ fontFamily: "var(--font-display)", overflowWrap: "normal" }}>
        {line1}{line2 && <><br />{line2}</>}
      </p>
      <p className="type-subhead text-[var(--cream)]/65 mt-8 max-w-[760px]">{sub}</p>
    </div>
  );
}

export function Callout({ label, tone = "indigo", children }: { label: string; tone?: "indigo" | "terra" | "charcoal"; children: React.ReactNode }) {
  const c = tone === "indigo" ? "var(--indigo)" : tone === "terra" ? "var(--terra)" : "var(--charcoal)";
  return (
    <div className="mt-8 p-7" style={{ border: `2px solid ${c}`, background: tone === "charcoal" ? "rgba(26,20,40,.04)" : `color-mix(in srgb, ${c} 5%, transparent)` }}>
      <span className="type-label" style={{ color: c }}>{label}</span>
      <div className="type-body-lg text-[var(--charcoal)]/85 mt-3 max-w-[900px]">{children}</div>
    </div>
  );
}

/** The three questions every step answers. */
export function WWE({ what, why, expect }: { what: React.ReactNode; why: React.ReactNode; expect: React.ReactNode }) {
  const col = (label: string, color: string, body: React.ReactNode) => (
    <div className="border-t-4 pt-4" style={{ borderColor: color }}>
      <span className="type-label block mb-2" style={{ color }}>{label}</span>
      <div className="type-body text-[var(--charcoal)]/85">{body}</div>
    </div>
  );
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {col("WHAT WE'RE DOING", "var(--indigo)", what)}
      {col("WHY", "var(--charcoal)", why)}
      {col("WHAT TO EXPECT", "var(--terra)", expect)}
    </div>
  );
}

export function Expect({ title = "WHAT CAME BACK IN OUR PRACTICE RUN", items }: { title?: string; items: React.ReactNode[] }) {
  return (
    <div className="mt-8 border-l-4 border-[var(--terra)] bg-[var(--terra)]/[.05] p-6">
      <span className="type-label text-[var(--terra)] block mb-3">{title}</span>
      <ul className="space-y-2 type-body text-[var(--charcoal)]/85">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3"><span className="text-[var(--terra)] shrink-0">•</span><span>{it}</span></li>
        ))}
      </ul>
      <p className="type-body-sm text-[var(--charcoal)]/55 mt-4">Practice data is invented. Your wording and numbers will differ. The shape should match.</p>
    </div>
  );
}

export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-6 space-y-3 max-w-[900px]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4 type-body-lg text-[var(--charcoal)]/85">
          <span className="font-mono text-[14px] shrink-0 w-7 h-7 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center mt-[3px]">{i + 1}</span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}

export function Shot({ src, alt, w, h, caption = "Rendered from the actual output file of our practice run.", max = 1100 }: { src: string; alt: string; w: number; h: number; caption?: string; max?: number }) {
  return (
    <figure className="mt-8" style={{ maxWidth: max }}>
      <div className="border border-[var(--charcoal)]/15 rounded-sm overflow-hidden bg-white shadow-sm">
        <img src={src} alt={alt} width={w} height={h} className="w-full h-auto block" loading="lazy" />
      </div>
      <figcaption className="type-body-sm text-[var(--charcoal)]/55 mt-2">{caption}</figcaption>
    </figure>
  );
}

export function Checklist({ items }: { items: { what: React.ReactNode; where: React.ReactNode }[] }) {
  return (
    <div className="mt-6 border border-[var(--charcoal)]/15">
      {items.map((it, i) => (
        <div key={i} className="grid md:grid-cols-[28px_1fr_1fr] gap-3 px-5 py-4 border-b border-[var(--charcoal)]/10 last:border-b-0">
          <span className="w-5 h-5 border-2 border-[var(--indigo)] rounded-sm mt-1" aria-hidden="true" />
          <span className="type-body text-[var(--charcoal)]">{it.what}</span>
          <span className="type-body-sm text-[var(--charcoal)]/65">{it.where}</span>
        </div>
      ))}
    </div>
  );
}

const F = ({ children }: { children: React.ReactNode }) => <span className="font-mono text-[14px] bg-[var(--charcoal)]/[.06] px-1.5 py-0.5 rounded-sm">{children}</span>;

/* ─── per-person section builder ─────────────────────────────────────────── */

interface Person {
  id: string;
  num: string;
  group: string;
  who: string;
  skill: string;
  zip: string;
  heroLine1: string;
  heroLine2?: string;
  heroSub: string;
  brief: React.ReactNode;
  v1: React.ReactNode;
  example: { src: string; alt: string; w: number; h: number };
  run: { prompt: string; what: React.ReactNode; why: React.ReactNode; expect: React.ReactNode; results: React.ReactNode[]; shot: { src: string; alt: string; w: number; h: number }; tip?: React.ReactNode };
  follow: { prompt: string; what: React.ReactNode; why: React.ReactNode; expect: React.ReactNode; shot?: { src: string; alt: string; w: number; h: number } };
  yours: { what: React.ReactNode; where: React.ReactNode }[];
  real: { prompt: string; check: React.ReactNode[] };
  teach: string;
}

function personSection(p: Person): Section {
  return {
    id: p.id,
    num: p.num,
    group: p.group,
    title: p.who,
    shortTitle: p.who,
    slides: [
      {
        id: `${p.id}-hero`, title: p.who, titleHidden: true, dark: true, isHero: true,
        content: <SectionHero eyebrow={`${p.group.toUpperCase()} · ${p.who.toUpperCase()}`} line1={p.heroLine1} line2={p.heroLine2} sub={p.heroSub} />,
      },
      {
        id: `${p.id}-brief`, title: "What you're building", eyebrow: `${p.who.toUpperCase()} · THE BRIEF`,
        content: (
          <>
            <div className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[880px]">{p.brief}</div>
            <Callout label="TODAY'S FINISH LINE" tone="terra">{p.v1}</Callout>
            <p className="type-body text-[var(--charcoal)]/70 mt-8 max-w-[860px]">Here's the finished result from our practice run, so you know where you're headed. Your skill is <F>{p.skill}</F>, in <F>{p.zip}</F> on the <a className="underline" href={FILES_URL} target="_blank" rel="noopener noreferrer">files page</a>.</p>
            <Shot {...p.example} />
          </>
        ),
      },
      {
        id: `${p.id}-step1`, title: "Step 1 · Install your skill", eyebrow: `${p.who.toUpperCase()} · STEP 1 OF 5`,
        content: (
          <>
            <WWE
              what={<>Upload <F>{p.zip}</F> into Claude, so it knows how to do this job the ClaimFox way.</>}
              why="A skill is a written set of instructions Claude follows every time. Install it once and it's there for every future run."
              expect={<>The skill shows up under Customize, Skills, Yours, named <F>{p.skill}</F>.</>}
            />
            <Steps items={[
              <>Download <F>{p.zip}</F> from <span className="font-mono">{HOST}/claimfox-files</span>. <strong>Don't unzip it.</strong></>,
              <>In Claude, click <strong>Customize</strong> in the left sidebar.</>,
              <>Stay on the <strong>Skills</strong> tab. Click <strong>+ Add</strong> at the top right, then <strong>Upload skill</strong>.</>,
              <>Pick the zip. When it finishes, check the <strong>Yours</strong> tab for <F>{p.skill}</F>.</>,
            ]} />
            <ProTip>Upload failed? The zip has to go in as it is, not unzipped. If it still fails, check that skills are turned on for your account. Heidy is the admin.</ProTip>
          </>
        ),
      },
      {
        id: `${p.id}-step2`, title: "Step 2 · Run it on the practice data", eyebrow: `${p.who.toUpperCase()} · STEP 2 OF 5`,
        content: (
          <>
            <WWE what={p.run.what} why={p.run.why} expect={p.run.expect} />
            <Steps items={[
              <>Start a <strong>New</strong> task and switch the toggle under the prompt box to <strong>Cowork</strong>.</>,
              <>Click the folder icon under the prompt box and choose the <F>claimfox-practice-data</F> folder on your Desktop.</>,
              <>Paste the prompt below and press Enter. Let it work. It will tell you what it's doing as it goes.</>,
            ]} />
            <CodeBlock label="Paste this" code={p.run.prompt} />
            <Expect items={p.run.results} />
            <Shot {...p.run.shot} />
            {p.run.tip && <ProTip>{p.run.tip}</ProTip>}
          </>
        ),
      },
      {
        id: `${p.id}-step3`, title: "Step 3 · Ask a follow-up", eyebrow: `${p.who.toUpperCase()} · STEP 3 OF 5`,
        content: (
          <>
            <WWE what={p.follow.what} why={p.follow.why} expect={p.follow.expect} />
            <CodeBlock label="Same task, paste this next" code={p.follow.prompt} />
            {p.follow.shot && <Shot {...p.follow.shot} />}
          </>
        ),
      },
      {
        id: `${p.id}-step4`, title: "Step 4 · Make it yours", eyebrow: `${p.who.toUpperCase()} · STEP 4 OF 5`,
        content: (
          <>
            <WWE
              what="Swap the sample reference files for ClaimFox's real ones."
              why="The skill came with invented samples so it could run today. It only becomes ClaimFox's once it has ClaimFox's rules in it. This is the part only you can do."
              expect="An updated skill file that Claude hands you to upload, replacing the old one. After that, every run uses your real rules."
            />
            <Checklist items={p.yours} />
            <CodeBlock label="How to update the skill: paste this with the file attached" code={`Update my ${p.skill} skill. Replace the SAMPLE reference with the file I've attached, keep everything else the same, and give me the updated skill as a zip I can upload.`} />
            <ProTip>Open the skill any time (Customize, then Skills) and read it. It's plain English. If a rule isn't written down in there, Claude is guessing.</ProTip>
          </>
        ),
      },
      {
        id: `${p.id}-step5`, title: "Step 5 · First real run", eyebrow: `${p.who.toUpperCase()} · STEP 5 OF 5`,
        content: (
          <>
            <WWE
              what="Run it on one real file. Only a file Heidy has cleared."
              why="The practice data proves the skill works. A real file proves it works on ClaimFox's reality, which is always messier."
              expect="Something will be a little off the first time. That's the point of the second pass: we fix it together, and teach the skill so it's right next time."
            />
            <CodeBlock label="Paste this, with the real file in the folder" code={p.real.prompt} />
            <Callout label="CHECK THESE BEFORE YOU TRUST IT" tone="charcoal">
              <ul className="space-y-2">{p.real.check.map((c, i) => <li key={i}>• {c}</li>)}</ul>
            </Callout>
            <Callout label="WHEN IT GETS SOMETHING WRONG" tone="terra">
              Tell it, in plain words. Then say: <em>"{p.teach}"</em> Every skill ends by offering to write your correction into itself. Say yes. That's how it gets better every time you use it.
            </Callout>
          </>
        ),
      },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   START HERE
   ═══════════════════════════════════════════════════════════════════════════ */

const sectionStart: Section = {
  id: "start",
  num: "Start",
  group: "Start here",
  title: "Today",
  shortTitle: "Today",
  slides: [
    {
      id: "slide-title", title: "ClaimFox Build Day", titleHidden: true, dark: true, isHero: true,
      content: <SectionHero eyebrow="CLAIMFOX × ADVENTURE MEDIA · TUESDAY SEPTEMBER 29 · 10AM TO 3PM" line1="Build day." sub="Everyone builds their own first version today, at their own desk, on something they actually need. This workbook has your steps. Find your name in the left rail." />,
    },
    {
      id: "slide-how", title: "How today works", eyebrow: "START HERE",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">You'll work in four groups. Patrick comes to each group twice. The first visit gets you set up and running. The second, after lunch, fixes whatever broke. We finish with each of you showing what you built.</p>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {[
              ["Group 1", "Contracts and security", "Barbara · Chris"],
              ["Group 2", "Finance", "Christine · Scott"],
              ["Group 3", "Client and requestor reporting", "Amanda · Michelle"],
              ["Group 4", "Testing and onboarding", "Mary · Kaela"],
            ].map(([g, t, w]) => (
              <div key={g} className="border border-[var(--charcoal)]/15 p-5">
                <span className="type-label text-[var(--terra)]">{g}</span>
                <p className="type-body-lg font-medium text-[var(--charcoal)] mt-1">{t}</p>
                <p className="type-body text-[var(--charcoal)]/65">{w}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-[var(--charcoal)]/15">
            {[
              ["10:00", "Setup check with Heidy"],
              ["10:15", "Fig and Patrick, one-on-one"],
              ["11:00", "First visit: 25 minutes per group. Steps 1 to 3"],
              ["12:40", "You work on your own, lunch. Steps 4 and 5"],
              ["1:15", "Second visit: 20 minutes per group. Fix what broke"],
              ["2:35", "Show and tell: 3 minutes each"],
            ].map(([t, w]) => (
              <div key={t} className="grid grid-cols-[80px_1fr] px-5 py-3 border-b border-[var(--charcoal)]/10 last:border-b-0">
                <span className="font-mono text-[14px] text-[var(--indigo)]">{t}</span>
                <span className="type-body text-[var(--charcoal)]/85">{w}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "slide-setup", title: "Before you start: 2 downloads", eyebrow: "START HERE · SETUP",
      content: (
        <>
          <WWE
            what="Get the practice data and your own skill onto your computer."
            why="The practice data lets you watch your skill work before you trust it with a real file. Your skill is the starter we built from the brief you sent Heidy."
            expect={<>A <F>claimfox-practice-data</F> folder on your Desktop, and one zip file for your skill.</>}
          />
          <Steps items={[
            <>Go to <a className="underline font-medium" href={FILES_URL} target="_blank" rel="noopener noreferrer">{HOST}/claimfox-files</a>.</>,
            <>Download <strong>the practice data</strong>. Unzip it and move the <F>claimfox-practice-data</F> folder to your Desktop.</>,
            <>Download <strong>your skill</strong> (your name is next to it). Leave it zipped. You'll upload it in Step 1 of your section.</>,
          ]} />
          <Callout label="THE PRACTICE DATA IS INVENTED" tone="terra">
            Every carrier, requestor, invoice, contract, policy and dollar in it is fictional. We planted problems in it on purpose (a duplicate bill, a contract amendment, invoices about to expire) so you can watch your skill find them. Real ClaimFox files come in Step 5, and only the ones Heidy has cleared.
          </Callout>
        </>
      ),
    },
    {
      id: "slide-app", title: "Where things are in Claude", eyebrow: "START HERE · THE APP",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">Everything today happens in the Claude desktop app, in <strong>Cowork</strong>. Cowork is the mode where Claude works on your files: it opens the folder, reads what's inside, runs the numbers, and saves finished files back to the folder.</p>
          <Shot src="/images/claimfox/cowork-home-private.png" alt="The Claude desktop app home screen with the Chat and Cowork toggle under the prompt box, the model picker, the folder icon, and Customize in the left sidebar" w={992} h={865} max={820} caption="The Claude desktop app. Customize (left) is where skills live. Under the prompt box: the Chat or Cowork toggle, the model, and the folder icon." />
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              ["Customize", "Left sidebar. Where you upload and open skills."],
              ["Chat / Cowork", "Under the prompt box. Use Cowork today."],
              ["Folder icon", "Under the prompt box. Choose which folder Claude can work in."],
            ].map(([t, d]) => (
              <div key={t} className="border border-[var(--charcoal)]/15 p-5">
                <span className="type-label text-[var(--indigo)]">{t}</span>
                <p className="type-body text-[var(--charcoal)]/80 mt-2">{d}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "slide-skill", title: "What a skill is, in one minute", eyebrow: "START HERE · HOW IT WORKS",
      content: (
        <>
          <p className="type-body-lg text-[var(--charcoal)]/85 mt-4 max-w-[860px]">A skill is a page of plain-English instructions that tells Claude how to do one job the ClaimFox way: what files to read, what the output looks like, and the rules. Every skill you get today follows the same three rules.</p>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              ["Numbers come from code", "Claude is great with words and unreliable at arithmetic. So for anything with numbers, it writes a small program and runs it, and the math is exact."],
              ["Every answer has a source", "Contract clause, policy section, spreadsheet row. If it can't point to where something came from, it doesn't say it."],
              ["It flags. It doesn't guess.", "Missing a document or a rule? It says so and leaves a blank for you. It never fills gaps with something that sounds right."],
            ].map(([t, d]) => (
              <div key={t} className="border-t-4 border-[var(--terra)] pt-4">
                <p className="type-body-lg font-medium text-[var(--charcoal)]">{t}</p>
                <p className="type-body text-[var(--charcoal)]/75 mt-2">{d}</p>
              </div>
            ))}
          </div>
          <Shot src="/images/cowork-workshop/platform-customize-skills.png" alt="The Customize screen in Claude showing the Skills directory" w={2528} h={1850} max={900} caption="Customize, then Skills. Your uploaded skills appear under Yours." />
        </>
      ),
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   THE PEOPLE
   ═══════════════════════════════════════════════════════════════════════════ */

const G1 = "Group 1 · Contracts & security";
const G2 = "Group 2 · Finance";
const G3 = "Group 3 · Client & requestor reporting";
const G4 = "Group 4 · Testing & onboarding";

const barbara = personSection({
  id: "barbara", num: "1a", group: G1, who: "Barbara", skill: "claimfox-contract-requirements", zip: "claimfox-contract-requirements.zip",
  heroLine1: "Every contract,", heroLine2: "one table.",
  heroSub: "Read a client agreement and every amendment, pull out every requirement with the clause it came from, and flag everything that differs from how ClaimFox normally works.",
  brief: <>From your brief: use the SharePoint client-contract folder as the source of truth. Find the right agreement, extract operational, security, compliance, retention, redaction and turnaround requirements into a standard matrix, and flag anything that differs from the standard process. Later this becomes the base for client audits, SOPs and a security Q&amp;A.</>,
  v1: "A matrix for one real client: every requirement, the clause it came from, and a status of Stricter, Looser, Matches, Adds, Not specified or Unclear against ClaimFox's standard.",
  example: { src: `${IMG}/barbara-portfolio.png`, alt: "Portfolio sheet comparing two clients' contract requirements side by side, color-coded by status", w: 1600, h: 943 },
  run: {
    prompt: `Build the contract requirements for Harborline Mutual and Tri-County Workers' Comp Fund. Their documents are in the contracts folder.`,
    what: "Claude reads two practice clients' contracts, including a later amendment, and builds the matrix.",
    why: "You'll see the three things that make this trustworthy: it uses the amendment over the original, it cites every clause, and it says 'not specified' instead of guessing.",
    expect: "A workbook with one sheet per client, a side-by-side Portfolio sheet, an Actions list with owners, Key dates, and a short summary in the chat.",
    results: [
      <>Harborline's turnaround shows as <strong>5 business days</strong>, from Amendment No. 2, not the 7 in the original contract. Subpoenas: 3 days.</>,
      <>At the top of the summary: Harborline's clause requiring <strong>written approval before using AI or machine learning</strong> to decide what's released.</>,
      <>Harborline marked <strong>PROVISIONAL</strong>, because the contract mentions an Exhibit B and an Amendment No. 1 that weren't in the folder.</>,
      <>Tri-County's court-order deadline, "handled promptly," marked <strong>Unclear</strong> rather than turned into a number.</>,
    ],
    shot: { src: `${IMG}/barbara-matrix.png`, alt: "Harborline contract matrix with requirement, contract language, source clause and status columns", w: 1600, h: 1164 },
    tip: "If it asks for the missing Exhibit B, tell it to go ahead without it and mark the matrix provisional. That's the right call today.",
  },
  follow: {
    prompt: `Can we release Harborline records to an adverse carrier without asking them first?`,
    what: "Ask a plain question instead of asking for a table.",
    why: "This is how you'll use it most days. Someone asks what a client allows, and you get an answer with the clause in 30 seconds.",
    expect: "A two or three sentence answer citing the section (in the practice contract: no, written approval from the claim representative is required, s.3.2), then an offer to show the full matrix.",
  },
  yours: [
    { what: <>ClaimFox's real standard process (turnaround, redactions, retention, notice times)</>, where: <>Replaces <F>references/standard-process.SAMPLE.md</F></> },
    { what: "The SharePoint folder path for client contracts", where: "Goes in the skill's Customize section" },
    { what: "Any category you track that isn't on the list", where: "Tell Claude to add it to the standard" },
  ],
  real: {
    prompt: `Build the contract requirements for [client name]. Use the documents in this folder. Compare against our standard process.`,
    check: ["Pick three rows and open the contract to the cited section. Does it say that?", "Is every amendment reflected, and is the most recent term shown?", "Anything marked Not specified that you know is covered somewhere else, like a side letter?"],
  },
  teach: "Add that to this skill so it's right next time.",
});

const chris = personSection({
  id: "chris", num: "1b", group: G1, who: "Chris", skill: "claimfox-ddq-responder", zip: "claimfox-ddq-responder.zip",
  heroLine1: "Answer the DDQ.", heroLine2: "Cite everything.",
  heroSub: "Draft security questionnaire answers from approved policies and prior approved answers only. Every answer points to its source. Anything without one goes to a person.",
  brief: <>From your brief: take an incoming security DDQ and draft responses using approved policies, prior approved answers and supporting evidence. Flag questions that still need review, and point back to the source for each answer. Longer term, automate more of the DDQ and policy-review workflow.</>,
  v1: "A real DDQ filled in with sourced answers, a review sheet showing where each answer came from, and a list of what still needs a person.",
  example: { src: `${IMG}/chris-review.png`, alt: "DDQ review sheet with each question, draft answer, status, source and exact source text", w: 1600, h: 1400 },
  run: {
    prompt: `Pioneer Standard sent us this DDQ, due Oct 9. It's in the ddq folder, along with our policies and our approved answer bank. Draft the responses.`,
    what: "Claude reads a 24-question practice DDQ, five policies (one of them a draft) and a bank of past answers.",
    why: "You'll watch it refuse to answer from the draft policy, and catch an old answer that contradicts current policy. Those two behaviors are what make it safe to use.",
    expect: "Pioneer's own spreadsheet filled in (the original untouched), a review sheet, and a summary grouped by who needs to answer what.",
    results: [
      <>About two thirds of the questions answered, each with its source and the exact supporting sentence.</>,
      <>An old answer bank entry saying "SOC 2 Type I" <strong>held for review</strong>, because the current policy says ISO 27001.</>,
      <>The AI question <strong>left blank</strong>. The only source was a policy marked DRAFT, and drafts don't count.</>,
      <>A list of topics with no policy at all (backups, business continuity, physical security), which doubles as a to-do list of policies to write.</>,
    ],
    shot: { src: `${IMG}/chris-owners.png`, alt: "Questions for owners sheet listing each open item, its owner and a reply-by date", w: 1600, h: 1375 },
  },
  follow: {
    prompt: `Draft a short email to each owner with just their open questions, and a reply-by date of October 6.`,
    what: "Turn the open items into messages you can send.",
    why: "The slowest part of a DDQ is chasing people. This gets it down to a handful of emails.",
    expect: "One short draft per owner (security, operations, finance and so on) listing only their questions. It drafts; you send.",
  },
  yours: [
    { what: "Current approved security policies", where: <>Into <F>references/policies/</F></> },
    { what: "The answer bank Heidy already keeps", where: <>As <F>references/approved-answer-bank.csv</F></> },
    { what: "Who approves answers in each area", where: "The skill's Approvers by area list" },
  ],
  real: {
    prompt: `Here's a DDQ we already answered last year. Draft it from our policies and answer bank so I can compare it with what we actually sent.`,
    check: ["Compare five answers with what you actually sent. Better, worse, or just different?", "Did it cite anything that isn't an approved document?", "Is anything answered that you'd have sent to a person?"],
  },
  teach: "Add that wording rule to this skill so every future answer follows it.",
});

const finance = personSection({
  id: "finance", num: "2", group: G2, who: "Christine + Scott", skill: "claimfox-gl-review", zip: "claimfox-gl-review.zip",
  heroLine1: "Close the month.", heroLine2: "Check the math.",
  heroSub: "A month-end review that runs the same checks every month and shows its work in plain Excel formulas you can click on.",
  brief: <>From your brief: a reusable finance skill that understands the GL structure, account coding and reconciliation logic, then reviews GL and reconciliation data for inconsistencies, duplicates, missing items, coding concerns, calculation issues and unexplained variances. Scott would like ratio analysis over time.</>,
  v1: "One month's GL run through the checks, an exception list you agree with, and the Proof tab tying out.",
  example: { src: `${IMG}/gl-exceptions.png`, alt: "Exceptions sheet listing each finding with severity, amount, suggested action and linked findings", w: 1600, h: 754 },
  run: {
    prompt: `Review the August GL before we close. Everything is in the finance folder: August, June and July, the chart of accounts, the bank statement and the disbursements register. Is the close clean?`,
    what: "Claude runs a checking program over three months of practice ledger data and the bank statement, then explains what it found.",
    why: "AI is unreliable at arithmetic, so it doesn't do any. The program does the math, and the Proof tab lets you check every total yourself with ordinary Excel formulas.",
    expect: "An answer to 'is the close clean?', a list to fix before close, and a workbook with Exceptions, Proof, Account variance and Checks run tabs.",
    results: [
      <>Not clean. A journal entry <strong>off by $45</strong>, flagged as two swapped digits.</>,
      <>A bill <strong>posted twice</strong>, a <strong>$25,000 adjustment posted on a Sunday</strong> with no support, and an AI subscription coded to office supplies.</>,
      <>A <strong>missing check number</strong>, and a check recorded at $3,215 that cleared the bank at $3,251, against a $3,500 bill.</>,
      <>Each account swing linked to its likely cause, so you see the real issues and not twenty rows.</>,
    ],
    shot: { src: `${IMG}/gl-proof.png`, alt: "Proof tab showing each total as a live Excel formula next to the script's result", w: 1600, h: 902 },
    tip: "Scott: open the Proof tab and click any number in column B. It's a plain SUM or SUMIF over the raw rows. Nothing to take on faith.",
  },
  follow: {
    prompt: `Prepare the correcting entries as a draft I can review. Don't post anything.`,
    what: "Turn the findings into proposed journal entries.",
    why: "It saves the typing, and you still approve every entry. The skill never changes the books.",
    expect: "A CSV labeled DRAFT with one proposed entry per fix, each tied to the finding it corrects.",
  },
  yours: [
    { what: "ClaimFox's real chart of accounts", where: <>Replaces <F>references/chart_of_accounts.csv</F></> },
    { what: "Your vendor coding rules (vendor to account)", where: <>Expand <F>references/coding_rules.csv</F>. This is where most of the value is.</> },
    { what: "How you export the GL, and your thresholds", where: "The skill's Customize section" },
  ],
  real: {
    prompt: `Here's the GL for a month we've already closed, plus the month before. Run the review and tell me what you find.`,
    check: ["Did it find the things you found when you closed that month?", "What did it flag that you'd call noise? Tell it, and it stops flagging it.", "Does the Proof tab tie out?"],
  },
  teach: "Remember that pattern so it isn't flagged next month.",
});

const amanda = personSection({
  id: "amanda", num: "3a", group: G3, who: "Amanda", skill: "claimfox-client-review", zip: "claimfox-client-review.zip",
  heroLine1: "The client review,", heroLine2: "in minutes.",
  heroSub: "A monthly, quarterly or annual review for one carrier: what we did, how well, and what changed, with a private note for you on what the client shouldn't see.",
  brief: <>From your brief: take the client data we already collect and turn it into monthly, quarterly or annual reviews. Surface trends, seasonality, workload and performance, allow follow-up questions against the data, and help build the client-facing story.</>,
  v1: "A client-ready one-page review for one real carrier and quarter, plus the internal note.",
  example: { src: `${IMG}/amanda-review.png`, alt: "One-page quarterly operations review with headline, scorecard, charts and findings", w: 1600, h: 1969 },
  run: {
    prompt: `Build the Q3 client review for Harborline Mutual Insurance, client-facing. The data is in the requests folder and their contract is in the contracts folder. Then tell me which requestors drove the volume increase.`,
    what: "Claude runs the numbers on 21 months of practice request data, checks them against the contract's deadlines, and writes the story.",
    why: "The numbers come from code, so they're right. The story is where the time goes today, and it gets that to a strong first draft.",
    expect: "A one-page review in ClaimFox colors, an internal cover note just for you, and an answer to the follow-up question.",
    results: [
      <>Requests <strong>up 44%</strong> on last year. On-time delivery down to <strong>49%</strong>, in two steps: when the contract deadlines tightened in February, then a July slowdown a month before August's peak.</>,
      <>Subpoenas were only <strong>5% on time</strong> against their 3-day deadline.</>,
      <>No single requestor drove the growth. The top two added 13 and 10 requests.</>,
      <>The internal note flags the months that crossed the contract's <strong>service-credit trigger</strong>, and keeps them out of the client version.</>,
    ],
    shot: { src: `${IMG}/amanda-review.png`, alt: "The finished client review page", w: 1600, h: 1969 },
    tip: <>The "What we're doing about it" box is left blank on purpose. That's yours. It won't make commitments to a client for you.</>,
  },
  follow: {
    prompt: `How did subpoenas do compared with everything else, by month?`,
    what: "Ask a question the review didn't answer.",
    why: "This is the part you asked for: questions against the data, answered with numbers instead of a new report request.",
    expect: "A small table by month and request type, calculated with code, with a sentence on what it shows.",
  },
  yours: [
    { what: "How to pull the request export from the Ecosystem, and who pulls it", where: "The skill's Customize section" },
    { what: "Each client's contracted deadlines and any credit clauses", where: "From Barbara's contract matrices, or noted in the skill" },
    { what: "Which metrics go in each cadence", where: "Tell Claude; it updates the skill" },
  ],
  real: {
    prompt: `Build the [quarter] review for [client], client-facing. The export is in this folder.`,
    check: ["Do the totals match what the Ecosystem shows for that client and period?", "Is the on-time rate measured against the right contract deadline?", "Would you send this sentence to the client as written?"],
  },
  teach: "Save that as a preference for this client.",
});

const michelle = personSection({
  id: "michelle", num: "3b", group: G3, who: "Michelle", skill: "claimfox-requestor-report-card", zip: "claimfox-requestor-report-card.zip",
  heroLine1: "Report cards", heroLine2: "that collect.",
  heroSub: "A quarterly card for each chosen requestor: volume, carriers, unpaid invoices, what's about to hit the archive deadline, and the ticket reasons behind it.",
  brief: <>From your brief: a requestor report card on a quarterly cadence for chosen requestors. Volume, breakdown by carrier, unpaid, open and pending requests, cancelled invoices, all-time unpaid by year with a note on anything nearing two years, support tickets and the top reasons, and room for comments.</>,
  v1: "Cards for two or three real requestors, plus a statement of open invoices you could send one of them.",
  example: { src: `${IMG}/michelle-card.png`, alt: "Requestor report card with volume, money, aging, archive warning and ticket sections", w: 1600, h: 1600 },
  run: {
    prompt: `Build Q3 report cards for RecordPoint Retrieval and Morrison & Pratt LLP. The data is in the requests folder. Then give me a statement of RecordPoint's open invoices.`,
    what: "Claude runs the numbers for two practice requestors against everyone else, then writes a card for each.",
    why: "The archive deadline is money that disappears if nobody acts. The card puts the date and the dollars in front of you before it passes.",
    expect: "One page per requestor, a workbook with a watchlist and countdown, and a ready-to-send statement.",
    results: [
      <>RecordPoint: <strong>55% of Q3 invoices unpaid</strong>, against 21% for similar requestors.</>,
      <><strong>13 invoices reach their archive date by December 16</strong>, one already passed, and a bigger wave follows in January to March.</>,
      <>Portal login is RecordPoint's top ticket reason. Many of the unpaid invoices are on requests that had a login ticket.</>,
      <>Morrison &amp; Pratt pays fine. Its problem is duplicate requests.</>,
    ],
    shot: { src: `${IMG}/michelle-watchlist.png`, alt: "Archive watchlist listing each invoice near its archive date with amount and days left", w: 1600, h: 723 },
    tip: "The two-year archive rule isn't final yet, so every card shows the rule it used. Change it by saying so: 'use 18 months.'",
  },
  follow: {
    prompt: `Rank every requestor by dollars that reach the archive date in the next 90 days.`,
    what: "Look across all requestors, not just the two you picked.",
    why: "It tells you who belongs on next quarter's list.",
    expect: "A ranked table with counts and dollars, calculated with code.",
    shot: { src: `${IMG}/michelle-statement.png`, alt: "Statement of open invoices with pay-by dates", w: 1600, h: 1309 },
  },
  yours: [
    { what: "The final archive rule (24 months? from invoice or request date?)", where: "The skill's defaults" },
    { what: "Your standing list of requestors for the quarterly run", where: "The skill's Standing list section" },
    { what: "Where the invoice and ticket exports come from", where: "The skill's Customize section" },
  ],
  real: {
    prompt: `Build this quarter's report card for [requestor]. The exports are in this folder.`,
    check: ["Spot-check two unpaid invoices in the billing system.", "Is the archive date right for one invoice you know?", "Would you be comfortable if the requestor saw this page?"],
  },
  teach: "Make that part of the standard card.",
});

const mary = personSection({
  id: "mary", num: "4a", group: G4, who: "Mary", skill: "claimfox-uat-builder", zip: "claimfox-uat-builder.zip",
  heroLine1: "From EREQ", heroLine2: "to test plan.",
  heroSub: "Turn a change ticket into a complete test package, and find what the ticket forgot to say before it reaches production.",
  brief: <>From your brief: take an EREQ ticket or change description and generate the UAT test plan and script, with a reusable test-case structure by system module, expected results, and a consistent severity and triage rubric. Later, explore having Claude do some of the testing.</>,
  v1: "A UAT workbook for one real EREQ that a tester could run from, plus the open questions for the ticket owner.",
  example: { src: `${IMG}/mary-summary.png`, alt: "UAT Summary sheet with live counts of cases by module and risk, open questions and exit criteria", w: 1600, h: 1326 },
  run: {
    prompt: `Build the UAT package for EREQ-2147. The ticket is in the ereq folder and the client contracts are in the contracts folder.`,
    what: "Claude reads a practice ticket for a new $35 expedite option, maps everything it touches, and checks it against client contracts.",
    why: "Tickets describe the happy path. The value is in what they miss: the edge cases and the contract conflicts nobody thought to check.",
    expect: "A workbook with a live Summary, test cases with Result dropdowns, traceability, contract conflicts, a due-date matrix and open questions, plus a short test plan document.",
    results: [
      <><strong>About 60 test cases</strong> across 10 modules, and <strong>13 open questions</strong> the ticket doesn't answer.</>,
      <>The headline catch: the new 2-day expedite clock replaces the client's own deadline, so for some Harborline subpoenas it would <strong>make the due date later than the contract allows</strong>.</>,
      <>Every expected due date calculated by a business-day calculator that handles weekends, holidays, the 5pm cutoff and time zones.</>,
    ],
    shot: { src: `${IMG}/mary-cases.png`, alt: "Test cases sheet with steps, expected results, risk and a Result dropdown", w: 1600, h: 1141 },
  },
  follow: {
    prompt: `A requestor in California submits an expedited request at 3pm Pacific on the Friday before Thanksgiving week. When is it due?`,
    what: "Ask it a date question you'd normally work out on a calendar.",
    why: "Due dates are where testing goes wrong by hand. It runs the calculator instead of guessing.",
    expect: "A specific date, with the rule it applied (after cutoff in Eastern time, so the clock starts Monday).",
    shot: { src: `${IMG}/mary-duedates.png`, alt: "Due-date matrix showing due dates for each clock and receipt time", w: 1600, h: 590 },
  },
  yours: [
    { what: "The real list of Ecosystem modules and the checks you always run", where: <>Replaces <F>references/modules.SAMPLE.md</F></> },
    { what: "How you actually rate severity", where: <>Replaces <F>references/severity-rubric.SAMPLE.md</F></> },
    { what: "ClaimFox's holidays and the real cutoff time", where: <>Replaces <F>references/holidays.SAMPLE.csv</F></> },
  ],
  real: {
    prompt: `Build the UAT package for [EREQ number]. The ticket is in this folder.`,
    check: ["Compare with the last test plan you wrote by hand for a similar change. What did it cover that you didn't, and what did it miss?", "Pick two due dates and check them on a calendar.", "Are the open questions ones the ticket owner can actually answer?"],
  },
  teach: "Add that as a standard regression check for that module.",
});

const kaela = personSection({
  id: "kaela", num: "4b", group: G4, who: "Kaela", skill: "claimfox-onboarding-builder", zip: "claimfox-onboarding-builder.zip",
  heroLine1: "Onboarding,", heroLine2: "role by role.",
  heroSub: "Drop in a job description and get a complete onboarding package for that role, with nothing invented. Anything it doesn't know comes back to you as a question.",
  brief: <>From your brief: a role-based onboarding template builder. Drop in a job title, description or responsibilities and get a pre-start checklist, first-day itinerary, day-by-day schedule, 30/60/90 milestones and role-based checklists. It should never invent policies, trainings or standards, and should flag anything missing for HR.</>,
  v1: "A plan for one real upcoming hire (or the three starting October 5), with the open items you need to answer.",
  example: { src: `${IMG}/kaela-plan.png`, alt: "Onboarding plan Word document for Global Intake Associates", w: 1600, h: 1900 },
  run: {
    prompt: `We have 3 Global Intake Associates starting Monday, October 5. The job description is in the hr folder. The Intake Team Lead role is vacant right now. Build the onboarding plan.`,
    what: "Claude reads a practice job description and builds a cohort plan for three hires starting in a week.",
    why: "The rule that matters most: it never makes up policy. Everything it doesn't know becomes a numbered question for the right person.",
    expect: "A Word plan, a checklist workbook with a tab per owner, and a summary of what's due today.",
    results: [
      <>It opens with <strong>what's due today</strong>, because the start date is close.</>,
      <>A <strong>readiness gate</strong>: nobody touches real claim files until training and sign-off are done.</>,
      <>Around <strong>28 open items</strong>, grouped by who can answer (HR, IT, Security, manager), with a draft message to each.</>,
      <>No invented policy. Targets and probation terms are left for you to confirm.</>,
    ],
    shot: { src: `${IMG}/kaela-missing.png`, alt: "Missing information sheet grouping open onboarding items by owner", w: 1600, h: 729 },
  },
  follow: {
    prompt: `Write the welcome email for each of the three new hires from the Intake Team Lead, with their start time in their own time zone.`,
    what: "Turn the plan into something you send on day minus 3.",
    why: "It's the small, repeated task that eats an afternoon every time a cohort starts.",
    expect: "Three short drafts, one per hire, with placeholders for anything not decided yet. It drafts; you send.",
    shot: { src: `${IMG}/kaela-gate.png`, alt: "Readiness gate tab listing each condition per hire", w: 1600, h: 410 },
  },
  yours: [
    { what: "The employee handbook and the required-training list", where: <>Into <F>references/</F></> },
    { what: "The real systems-and-access list", where: <>Replaces <F>references/systems-and-access.SAMPLE.md</F></> },
    { what: "Role targets, once they're set", where: "Tell Claude; it updates the skill" },
  ],
  real: {
    prompt: `Build the onboarding plan for [role], starting [date]. The job description is in this folder.`,
    check: ["Anything in the plan that sounds like policy but isn't one? That's a bug. Tell it.", "Are the open items going to the right people?", "Would the new hire have a good first day?"],
  },
  teach: "Save that lesson to this role's notes for next time.",
});

/* ═══════════════════════════════════════════════════════════════════════════
   WRAP
   ═══════════════════════════════════════════════════════════════════════════ */

const sectionWrap: Section = {
  id: "wrap",
  num: "End",
  group: "Wrap up",
  title: "Show & tell, then next steps",
  shortTitle: "Wrap",
  slides: [
    {
      id: "wrap-show", title: "Show and tell: 3 minutes each", eyebrow: "WRAP UP",
      content: (
        <>
          <WWE
            what="Each person shows what they built to the room."
            why="Seeing seven teammates' builds is how the next idea shows up. It's also how Fig sees what her team can do now."
            expect="Three minutes, three things, then questions."
          />
          <Steps items={[
            "What it does, in one sentence.",
            "One result it produced today, practice or real.",
            "The one thing you'll add to it in the next two weeks.",
          ]} />
        </>
      ),
    },
    {
      id: "wrap-next", title: "The next two weeks", eyebrow: "WRAP UP",
      content: (
        <>
          <Steps items={[
            "Finish Step 4 for your skill: swap every SAMPLE file for the real one.",
            "Use it on real work at least twice. Each time, tell it what it got wrong and let it update itself.",
            "Keep a short note of what you'd change. That becomes the next version.",
          ]} />
          <Callout label="WHERE EVERYTHING LIVES" tone="indigo">
            Workbook: <span className="font-mono">{HOST}/claimfox</span> · Files: <span className="font-mono">{HOST}/claimfox-files</span>. Questions after today: Patrick, or ask Heidy to loop us in.
          </Callout>
        </>
      ),
    },
  ],
};

export const SECTIONS: Section[] = [sectionStart, barbara, chris, finance, amanda, michelle, mary, kaela, sectionWrap];

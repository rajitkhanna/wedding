/**
 * Renders a guest's own itinerary to a PDF.
 *
 * Visibility mirrors the schedule page: an event shows when it is
 * informational, or when someone on the party is attending it. The shuttle and
 * jacket pickup only appear for parties they were linked to.
 *
 * Used by scripts/build-itinerary-pdf.ts (preview) and
 * scripts/send-itinerary.ts (one PDF per party, attached to their email).
 */

import { chromium } from "playwright";

export type ItineraryEvent = {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  locationUrl?: string | null;
  description?: string | null;
  dressCode?: string | null;
  informational?: boolean;
};

export type ItineraryPdfInput = {
  guestName: string;
  guestCode: string;
  events: ItineraryEvent[];
};

const DAYS: Array<{ key: string; label: string; date: string }> = [
  { key: "friday", label: "Friday", date: "November 27" },
  { key: "saturday", label: "Saturday", date: "November 28" },
  { key: "sunday", label: "Sunday", date: "November 29" },
];

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** "6:30 PM · Cocktail hour" lines become the running order. */
function splitDescription(description?: string | null) {
  const agenda: Array<{ time: string; label: string }> = [];
  const intro: string[] = [];
  for (const raw of String(description ?? "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(
      /^(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*(?:·|:)\s*(.+)$/i,
    );
    if (m) agenda.push({ time: m[1].toUpperCase(), label: m[2].trim() });
    else intro.push(line);
  }
  return { agenda, intro };
}

function html({ guestName, guestCode, events }: ItineraryPdfInput) {
  const days = DAYS.map((day) => {
    const list = events.filter((e) => e.day === day.key);
    if (!list.length) return "";

    const cards = list
      .map((e) => {
        const { agenda, intro } = splitDescription(e.description);
        const order = agenda.length
          ? `<ul class="order">${agenda
              .map(
                (a) =>
                  `<li><span>${esc(a.time)}</span><span>${esc(a.label)}</span></li>`,
              )
              .join("")}</ul>`
          : "";
        const desc = intro.length
          ? `<p class="desc">${esc(intro.join(" "))}</p>`
          : "";
        const meta = [
          e.location
            ? e.locationUrl
              ? `<span class="pin"><a href="${esc(e.locationUrl)}">${esc(e.location)}</a></span>`
              : `<span class="pin">${esc(e.location)}</span>`
            : "",
          e.dressCode ? `<span class="dress">${esc(e.dressCode)}</span>` : "",
        ]
          .filter(Boolean)
          .join("");
        return `
          <article class="event">
            <div class="when">
              <p class="start">${esc(e.startTime)}</p>
              ${e.endTime ? `<p class="end">${esc(e.endTime)}</p>` : ""}
            </div>
            <div class="body">
              <h3>${esc(e.title)}</h3>
              ${desc}
              ${order}
              ${meta ? `<p class="meta">${meta}</p>` : ""}
            </div>
          </article>`;
      })
      .join("");

    return `
      <section class="day">
        <header>
          <h2>${day.label}</h2>
          <p>${day.date}</p>
        </header>
        ${cards}
      </section>`;
  }).join("");

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html { background: #fdf4e8; }
  body {
    margin: 0; padding: 18mm 16mm; background: #fdf4e8;
    font-family: "Jost", "Helvetica Neue", Arial, sans-serif;
    color: #105666;
    font-weight: 300;
    -webkit-print-color-adjust: exact;
  }

  .masthead { text-align: center; padding-bottom: 10px; }
  .masthead .rule { width: 34px; height: 1px; background: #dc8880; margin: 0 auto 14px; opacity: .6; }
  .masthead .over {
    font-size: 7.5pt; letter-spacing: .38em; text-transform: uppercase;
    color: #839958; margin: 0 0 12px;
  }
  .masthead h1 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 400; font-size: 27pt; letter-spacing: .055em;
    color: #0A3323; margin: 0 0 8px; line-height: 1.08;
  }
  .masthead .for {
    font-size: 8pt; letter-spacing: .24em; text-transform: uppercase;
    color: #c06e68; margin: 0;
  }

  .day { margin-top: 14px; }
  .day > header {
    border-bottom: 1px solid #ddd8c4; padding-bottom: 8px; margin-bottom: 10px;
    break-after: avoid;
  }
  .day > header h2 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 400; font-size: 19pt; color: #c06e68; margin: 0; line-height: 1.75; display: inline;
    letter-spacing: .02em;
  }
  .day > header p {
    display: inline-block; margin: 0 0 0 10px;
    font-size: 7.5pt; letter-spacing: .26em; text-transform: uppercase;
    color: #839958; vertical-align: 2px;
  }

  .event {
    display: grid; grid-template-columns: 78px 1fr; gap: 16px;
    padding: 11px 0 10px; border-bottom: 1px solid rgba(221,216,196,.55);
    break-inside: avoid;
  }
  .event:last-child { border-bottom: 0; }
  .when { padding-top: 3px; }
  .when .start {
    font-size: 8pt; letter-spacing: .1em; text-transform: uppercase;
    color: #c06e68; margin: 0; font-weight: 400;
  }
  .when .end {
    font-size: 7pt; letter-spacing: .1em; text-transform: uppercase;
    color: #839958; margin: 3px 0 0;
  }
  .body h3 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 400; font-size: 16pt; color: #0A3323;
    margin: 0 0 5px; line-height: 1.2;
  }
  .desc { font-size: 9.5pt; line-height: 1.6; margin: 0 0 6px; color: #105666; }
  .order { list-style: none; margin: 7px 0 6px; padding: 7px 0 0; border-top: 1px solid rgba(221,216,196,.6); }
  .order li { display: flex; gap: 12px; font-size: 9pt; line-height: 1.75; }
  .order li span:first-child {
    flex: none; width: 56px; font-size: 7pt; letter-spacing: .09em;
    text-transform: uppercase; color: #839958; padding-top: 1px;
  }
  .meta { margin: 6px 0 0; font-size: 8.5pt; line-height: 1.6; color: #839958; }
  .meta .pin { display: block; }
  .meta .pin a { color: inherit; text-decoration: underline; text-decoration-color: #839958; text-underline-offset: 2px; }
  .meta .dress {
    display: inline-block; margin-top: 4px; padding: 2px 8px;
    border: 1px solid #ddd8c4; border-radius: 999px;
    font-size: 7pt; letter-spacing: .14em; text-transform: uppercase;
    color: #839958;
  }

  .codecard {
    margin-top: 18px; border: 1px solid #ddd8c4; border-radius: 5px;
    background: #f2e7d6; padding: 16px 20px;
    display: flex; align-items: center; gap: 18px; break-inside: avoid;
  }
  .codecard .lbl {
    font-size: 7pt; letter-spacing: .26em; text-transform: uppercase;
    color: #839958; margin: 0 0 4px;
  }
  .codecard .val {
    font-family: "Jost", Helvetica, sans-serif; font-weight: 500;
    font-size: 15pt; letter-spacing: .26em; color: #0A3323; margin: 0;
  }
  .codecard .hint {
    margin: 0 0 0 auto; font-size: 8pt; line-height: 1.6;
    color: #839958; max-width: 210px;
  }

  .foot {
    margin-top: 14px; padding-top: 10px; border-top: 1px solid #ddd8c4;
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 7.5pt; letter-spacing: .1em; color: #839958;
  }
  .foot .brand {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 9pt; letter-spacing: .16em; text-transform: uppercase;
    color: #c06e68;
  }
</style></head>
<body>
  <header class="masthead">
    <div class="rule"></div>
    <p class="over">November 27–29, 2026 · Boston</p>
    <h1>Meghana &amp; Rajit</h1>
    <p class="for">${esc(guestName)}</p>
  </header>

  ${days}

  <section class="codecard">
    <div>
      <p class="lbl">Your code</p>
      <p class="val">${esc(guestCode)}</p>
    </div>
    <p class="hint">Enter it at meghanarajit.com for the live schedule, RSVP details, and travel notes.</p>
  </section>

  <footer class="foot">
    <span class="brand">Meghana &amp; Rajit</span>
    <span>Questions? hi@meghanarajit.com</span>
  </footer>
</body></html>`;
}

export async function renderItineraryPdf(input: ItineraryPdfInput) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html(input), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
  } finally {
    await browser.close();
  }
}

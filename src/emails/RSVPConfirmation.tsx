import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { buildDateRange } from "@/lib/schedule/dateRange";

export type RSVPEvent = {
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  dressCode?: string;
  attendees: string[];
};

type Props = {
  guestName: string;
  events: RSVPEvent[];
  heroImageUrl: string;
  secondImageUrl: string;
  guestCode?: string;
};

const DAY_LABELS: Record<string, string> = {
  thursday: "Thursday, November 26",
  friday: "Friday, November 27",
  saturday: "Saturday, November 28",
  sunday: "Sunday, November 29",
};

const DAY_ORDER = ["thursday", "friday", "saturday", "sunday"];

const gold = "#dc8880";        // lotus coral pink — matches --color-gold
const goldDim = "#c06e68";    // muted lotus pink — matches --color-gold-dim
const dark = "#0A3323";       // dark green — matches --color-text
const bg = "#dce8d2";         // warm sage — matches --color-bg
const surface = "#fdf4e8";    // warm ivory — matches --color-surface
const textMuted = "#105666";  // midnight green — matches --color-text-muted
const textDim = "#839958";    // moss green — matches --color-text-dim
const border = "#ddd8c4";     // beige border — matches --color-border
const borderGold = "#7aaa90"; // teal-green border — matches --color-border-gold

export function RSVPConfirmation({
  guestName,
  events,
  heroImageUrl,
  secondImageUrl,
  guestCode,
}: Props) {
  const dateRange = buildDateRange(events.map((e) => e.day)) ?? "November 27–29, 2026";
  const byDay = events.reduce<Record<string, RSVPEvent[]>>((acc, ev) => {
    if (!acc[ev.day]) acc[ev.day] = [];
    acc[ev.day].push(ev);
    return acc;
  }, {});
  const days = DAY_ORDER.filter((d) => byDay[d]);

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Jost"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/jost/v18/92zPtBhPNqw79Ij1E865zBUv7myRJQ.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Your RSVP is confirmed — Meghana &amp; Rajit · November 2026
      </Preview>
      <Body
        style={{
          backgroundColor: bg,
          margin: 0,
          padding: "32px 0",
          fontFamily: "'Jost', Helvetica, Arial, sans-serif",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Dark header */}
          <Section
            style={{
              backgroundColor: dark,
              padding: "40px 48px 32px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: gold,
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                margin: "0 0 14px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              {dateRange} · Boston
            </Text>
            <Heading
              style={{
                color: gold,
                fontSize: "40px",
                fontWeight: 400,
                margin: "0 0 10px",
                letterSpacing: "0.06em",
                lineHeight: "1.1",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Meghana &amp; Rajit
            </Heading>
            <Text
              style={{
                color: "rgba(220,232,210,0.70)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              We can&apos;t wait to celebrate with you
            </Text>
          </Section>

          {/* Hero image */}
          <Img
            src={heroImageUrl}
            alt="Meghana and Rajit"
            width="600"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "380px",
              objectFit: "cover",
            }}
          />

          {/* Confirmation */}
          <Section
            style={{ backgroundColor: surface, padding: "40px 48px 36px" }}
          >
            <Text
              style={{
                color: goldDim,
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 14px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              RSVP Confirmed
            </Text>
            <Heading
              style={{
                color: dark,
                fontSize: "26px",
                fontWeight: 400,
                margin: "0 0 16px",
                lineHeight: "1.3",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Thank you, {guestName}!
            </Heading>
            <Text
              style={{
                color: textMuted,
                fontSize: "15px",
                lineHeight: "1.75",
                margin: "0 0 24px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              We&apos;re so thrilled you&apos;ll be joining us. Your schedule
              for the weekend is below — we&apos;ll send any updates to this
              address.
            </Text>
            {guestCode && (
              <Section
                style={{
                  backgroundColor: bg,
                  borderRadius: "6px",
                  padding: "16px 20px",
                  textAlign: "center",
                  border: `1px solid ${borderGold}`,
                }}
              >
                <Text
                  style={{
                    color: textMuted,
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                    fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  }}
                >
                  Your invite code
                </Text>
                <Text
                  style={{
                    color: dark,
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    margin: 0,
                    fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  }}
                >
                  {guestCode}
                </Text>
                <Text
                  style={{
                    color: textDim,
                    fontSize: "11px",
                    margin: "8px 0 0",
                    fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  }}
                >
                  Use this to access the wedding website at meghanarajit.com
                </Text>
              </Section>
            )}
          </Section>

          <Hr style={{ borderColor: border, margin: 0 }} />

          {/* Schedule */}
          <Section
            style={{ backgroundColor: surface, padding: "32px 48px 40px" }}
          >
            <Text
              style={{
                color: gold,
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                margin: "0 0 28px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              Your Schedule
            </Text>

            {days.map((day) => (
              <Section key={day} style={{ marginBottom: "28px" }}>
                <Text
                  style={{
                    color: goldDim,
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    margin: "0 0 14px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${borderGold}`,
                    fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  }}
                >
                  {DAY_LABELS[day] ?? day}
                </Text>
                {(byDay[day] ?? []).map((ev, i) => (
                  <Row key={i} style={{ marginBottom: "14px" }}>
                    <Column
                      style={{
                        width: "4px",
                        backgroundColor: gold,
                        borderRadius: "2px",
                        verticalAlign: "top",
                      }}
                    />
                    <Column style={{ paddingLeft: "16px" }}>
                      <Text
                        style={{
                          color: dark,
                          fontSize: "15px",
                          fontWeight: 600,
                          margin: "0 0 3px",
                          lineHeight: "1.3",
                          fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                        }}
                      >
                        {ev.title}
                      </Text>
                      <Text
                        style={{
                          color: textMuted,
                          fontSize: "13px",
                          margin: "0 0 2px",
                          fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                        }}
                      >
                        {ev.startTime}
                        {ev.endTime ? ` – ${ev.endTime}` : ""}
                        {ev.location ? (
                          <>
                            {" · "}
                            {ev.locationUrl ? (
                              <Link href={ev.locationUrl} style={{ color: textMuted, textDecoration: "underline" }}>
                                {ev.location}
                              </Link>
                            ) : (
                              ev.location
                            )}
                          </>
                        ) : null}
                      </Text>
                      {ev.dressCode && (
                        <Text
                          style={{
                            color: textDim,
                            fontSize: "12px",
                            margin: "0 0 2px",
                            fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                          }}
                        >
                          Dress code: {ev.dressCode}
                        </Text>
                      )}
                      {ev.attendees.length > 1 && (
                        <Text
                          style={{ color: textDim, fontSize: "12px", margin: 0, fontFamily: "'Jost', Helvetica, Arial, sans-serif" }}
                        >
                          {ev.attendees.join(", ")}
                        </Text>
                      )}
                    </Column>
                  </Row>
                ))}
              </Section>
            ))}
          </Section>

          {/* Second photo */}
          <Img
            src={secondImageUrl}
            alt="Meghana and Rajit"
            width="600"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "340px",
              objectFit: "cover",
            }}
          />

          {/* Footer */}
          <Section
            style={{
              backgroundColor: dark,
              padding: "36px 48px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "rgba(220,232,210,0.55)",
                fontSize: "12px",
                lineHeight: "1.7",
                margin: "0 0 12px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              Questions? Respond to this email —{" "}
              <span style={{ color: "rgba(220,232,210,0.75)" }}>
                we&apos;d love to hear from you.
              </span>
            </Text>
            <Hr
              style={{
                borderColor: "rgba(220,136,128,0.30)",
                margin: "0 0 16px",
              }}
            />
            <Text
              style={{
                color: gold,
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              Meghana &amp; Rajit · November 2026 · Boston
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

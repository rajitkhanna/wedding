import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
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
  dressCode?: string;
  attendees: string[];
};

type Props = {
  guestName: string;
  events: RSVPEvent[];
  heroImageUrl: string;
  secondImageUrl: string;
};

const DAY_LABELS: Record<string, string> = {
  thursday: "Thursday, November 26",
  friday: "Friday, November 27",
  saturday: "Saturday, November 28",
  sunday: "Sunday, November 29",
};

const DAY_ORDER = ["thursday", "friday", "saturday", "sunday"];

const gold = "#c9a84c";
const dark = "#1a0808";
const cream = "#f8f4ee";

export function RSVPConfirmation({
  guestName,
  events,
  heroImageUrl,
  secondImageUrl,
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
      <Head />
      <Preview>
        Your RSVP is confirmed — Meghana &amp; Rajit · November 2026
      </Preview>
      <Body
        style={{
          backgroundColor: cream,
          margin: 0,
          padding: "32px 0",
          fontFamily: "Georgia, 'Times New Roman', serif",
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
              }}
            >
              Meghana &amp; Rajit
            </Heading>
            <Text
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                margin: 0,
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
            style={{ backgroundColor: "#fff", padding: "40px 48px 36px" }}
          >
            <Text
              style={{
                color: "#8a6820",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 14px",
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
              }}
            >
              Thank you, {guestName}!
            </Heading>
            <Text
              style={{
                color: "#555",
                fontSize: "15px",
                lineHeight: "1.75",
                margin: 0,
              }}
            >
              We&apos;re so thrilled you&apos;ll be joining us. Your schedule
              for the weekend is below — we&apos;ll send any updates to this
              address.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e8ddd0", margin: 0 }} />

          {/* Schedule */}
          <Section
            style={{ backgroundColor: "#fff", padding: "32px 48px 40px" }}
          >
            <Text
              style={{
                color: gold,
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                margin: "0 0 28px",
              }}
            >
              Your Schedule
            </Text>

            {days.map((day) => (
              <Section key={day} style={{ marginBottom: "28px" }}>
                <Text
                  style={{
                    color: "#8a6820",
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    margin: "0 0 14px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #f0e8d8",
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
                        }}
                      >
                        {ev.title}
                      </Text>
                      <Text
                        style={{
                          color: "#777",
                          fontSize: "13px",
                          margin: "0 0 2px",
                        }}
                      >
                        {ev.startTime}
                        {ev.endTime ? ` – ${ev.endTime}` : ""}
                        {ev.location ? ` · ${ev.location}` : ""}
                      </Text>
                      {ev.dressCode && (
                        <Text
                          style={{
                            color: "#999",
                            fontSize: "12px",
                            margin: "0 0 2px",
                          }}
                        >
                          Dress code: {ev.dressCode}
                        </Text>
                      )}
                      {ev.attendees.length > 0 && (
                        <Text
                          style={{ color: "#aaa", fontSize: "12px", margin: 0 }}
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
                color: "rgba(255,255,255,0.45)",
                fontSize: "12px",
                lineHeight: "1.7",
                margin: "0 0 12px",
              }}
            >
              Questions? Respond to this email —{" "}
              <span style={{ color: "rgba(255,255,255,0.65)" }}>
                we&apos;d love to hear from you.
              </span>
            </Text>
            <Hr
              style={{
                borderColor: "rgba(201,168,76,0.25)",
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

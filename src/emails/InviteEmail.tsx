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
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { buildDateRange } from "@/lib/schedule/dateRange";

type Props = {
  guestName: string;
  guestCode: string;
  heroImageUrl: string;
  eventDays: string[];
};

const gold = "#dc8880";
const goldDim = "#c06e68";
const dark = "#0A3323";
const bg = "#dce8d2";
const surface = "#fdf4e8";
const textMuted = "#105666";
const textDim = "#839958";
const border = "#ddd8c4";
const borderGold = "#7aaa90";

export function InviteEmail({ guestName, guestCode, heroImageUrl, eventDays }: Props) {
  const dateRange = buildDateRange(eventDays) ?? "November 27–29, 2026";
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
      <Preview>You&apos;re invited — Meghana &amp; Rajit · November 2026 · Boston</Preview>
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

          {/* Body */}
          <Section style={{ backgroundColor: surface, padding: "40px 48px 36px" }}>
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
              You&apos;re Invited
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
              Dear {guestName},
            </Heading>
            <Text
              style={{
                color: textMuted,
                fontSize: "15px",
                lineHeight: "1.75",
                margin: "0 0 28px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              We are so happy you&apos;ll be joining us for our wedding. Visit our
              wedding website to RSVP, see your schedule for the weekend, and find
              everything you need to know before the big day.
            </Text>

            {/* Code box */}
            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "20px 24px",
                textAlign: "center",
                border: `1px solid ${borderGold}`,
                marginBottom: "28px",
              }}
            >
              <Text
                style={{
                  color: textMuted,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 10px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Your invite code
              </Text>
              <Text
                style={{
                  color: dark,
                  fontSize: "28px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  margin: "0 0 10px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                {guestCode}
              </Text>
              <Text
                style={{
                  color: textDim,
                  fontSize: "12px",
                  margin: 0,
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Enter this at{" "}
                <Link
                  href="https://meghanarajit.com"
                  style={{ color: textMuted, textDecoration: "underline" }}
                >
                  meghanarajit.com
                </Link>{" "}
                to access your personal invitation
              </Text>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: "center" }}>
              <Link
                href="https://meghanarajit.com"
                style={{
                  backgroundColor: gold,
                  color: dark,
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "14px 40px",
                  borderRadius: "4px",
                  display: "inline-block",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  fontWeight: 500,
                }}
              >
                Visit the Wedding Website
              </Link>
            </Section>
          </Section>

          <Hr style={{ borderColor: border, margin: 0 }} />

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
              Questions? Reply to this email —{" "}
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

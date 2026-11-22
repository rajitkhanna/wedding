import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type Props = {
  guestCode: string;
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

const SITE = "https://meghanarajit.com";

export function ItineraryEmail({ guestCode }: Props) {
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
      <Preview>Your schedule and code — Meghana &amp; Rajit, Nov 27–29</Preview>
      <Body
        style={{
          backgroundColor: bg,
          margin: 0,
          padding: "32px 0",
          fontFamily: "'Jost', Helvetica, Arial, sans-serif",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
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
              November 27–29, 2026 · Boston
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
              }}
            >
              See you this week
            </Text>
          </Section>

          <Section
            style={{ backgroundColor: surface, padding: "40px 48px 36px" }}
          >
            <Text
              style={{
                color: textMuted,
                fontSize: "15px",
                lineHeight: "1.75",
                margin: "0 0 16px",
              }}
            >
              Hey, we&apos;re so excited to see you all this week. As a
              reminder, here&apos;s your code to login to the website.
            </Text>

            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "20px 24px",
                textAlign: "center",
                border: `1px solid ${borderGold}`,
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  color: textMuted,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 10px",
                }}
              >
                Your code
              </Text>
              <Text
                style={{
                  color: dark,
                  fontSize: "28px",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  margin: "0 0 10px",
                }}
              >
                {guestCode}
              </Text>
              <Text style={{ color: textDim, fontSize: "12px", margin: 0 }}>
                Enter it at{" "}
                <Link
                  href={SITE}
                  style={{ color: textMuted, textDecoration: "underline" }}
                >
                  meghanarajit.com
                </Link>
              </Text>
            </Section>

            <Text
              style={{
                color: textMuted,
                fontSize: "14px",
                lineHeight: "1.75",
                margin: "0 0 20px",
              }}
            >
              We&apos;ve also attached a PDF with your schedule. Please feel
              free to respond to this email if you have any questions.
            </Text>

            <Section style={{ textAlign: "center" }}>
              <Link
                href={SITE}
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
                  fontWeight: 500,
                }}
              >
                Open Your Schedule
              </Link>
            </Section>

            <Hr style={{ borderColor: border, margin: "32px 0 20px" }} />

            <Text
              style={{
                color: textMuted,
                fontSize: "14px",
                lineHeight: "1.75",
                margin: 0,
              }}
            >
              Our wedding planner will be in touch shortly.
            </Text>
          </Section>

          <Hr style={{ borderColor: border, margin: 0 }} />

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
              }}
            >
              Questions?{" "}
              <Link
                href="mailto:hi@meghanarajit.com"
                style={{ color: "rgba(220,232,210,0.85)" }}
              >
                hi@meghanarajit.com
              </Link>
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

export default ItineraryEmail;

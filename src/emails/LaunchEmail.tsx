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
  postUrl?: string;
  tweetUrl?: string;
  ideasUrl?: string;
};

const gold = "#dc8880";
const goldDim = "#c06e68";
const dark = "#0A3323";
const bg = "#dce8d2";
const surface = "#fdf4e8";
const textMuted = "#105666";
const border = "#ddd8c4";
const borderGold = "#7aaa90";

const LINKEDIN_URL = "https://lnkd.in/p/g_ZD6ijU";
const TWEET_URL = "https://x.com/RajitWrites/status/2103168653256712603?s=20";
const IDEAS_URL =
  "https://docs.google.com/document/d/1RXgu6_Ie7cOOBLN-mp0Vo4lVnleJAmPYqBckkkkpMbE/edit?usp=sharing";

export function LaunchEmail({ postUrl, tweetUrl, ideasUrl }: Props) {
  const linkedin = postUrl ?? LINKEDIN_URL;
  const tweet = tweetUrl ?? TWEET_URL;
  const ideas = ideasUrl ?? IDEAS_URL;

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
        My startup Prism launched today — would love your support
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
              Meghana &amp; Rajit
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
              We&apos;re live
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
              A small favor to ask
            </Text>
          </Section>

          {/* Body */}
          <Section
            style={{ backgroundColor: surface, padding: "40px 48px 36px" }}
          >
            <Heading
              style={{
                color: dark,
                fontSize: "19px",
                fontWeight: 400,
                margin: "0 0 14px",
                lineHeight: "1.3",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Hi everyone,
            </Heading>
            <Text
              style={{
                color: textMuted,
                fontSize: "15px",
                lineHeight: "1.75",
                margin: "0 0 20px",
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              My startup{" "}
              <Link
                href="https://prisminference.com"
                style={{ color: textMuted, textDecoration: "underline" }}
              >
                Prism
              </Link>{" "}
              launched on social media today. I&apos;ve attached the LinkedIn
              and Twitter posts below. I&apos;d appreciate if you could like,
              comment, and repost. There&apos;s a Google doc below with ideas of
              what to comment.
            </Text>

            {/* LinkedIn */}
            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "20px 24px",
                border: `1px solid ${borderGold}`,
                marginBottom: "14px",
              }}
            >
              <Text
                style={{
                  color: goldDim,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                LinkedIn
              </Text>
              <Link
                href={linkedin}
                style={{
                  color: dark,
                  fontSize: "15px",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                {linkedin}
              </Link>
            </Section>

            {/* X */}
            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "20px 24px",
                border: `1px solid ${borderGold}`,
                marginBottom: "14px",
              }}
            >
              <Text
                style={{
                  color: goldDim,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Twitter
              </Text>
              <Link
                href={tweet}
                style={{
                  color: dark,
                  fontSize: "15px",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                {tweet}
              </Link>
            </Section>

            {/* Ideas doc */}
            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "20px 24px",
                border: `1px solid ${borderGold}`,
                marginBottom: "28px",
              }}
            >
              <Text
                style={{
                  color: goldDim,
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Ideas for what to comment
              </Text>
              <Link
                href={ideas}
                style={{
                  color: dark,
                  fontSize: "15px",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Open the doc
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
              Meghana &amp; Rajit
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

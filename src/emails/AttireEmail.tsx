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

type Props = {
  heroImageUrl: string;
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

const guide = { label: "Hitched: What to Wear Guide", href: "https://www.hitched.co.uk/wedding-planning/bridalwear-articles/what-to-wear-indian-wedding/" };

const shops = [
  { label: "Lashkaraa", href: "https://www.lashkaraa.com/" },
  { label: "House of Indya", href: "https://www.houseofindya.com/" },
  { label: "Pernia's Pop Up Shop", href: "https://www.perniaspopupshop.com/" },
  { label: "Aza Fashions", href: "https://www.azafashions.com/" },
];

export function AttireEmail({ heroImageUrl }: Props) {
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
      <Preview>What to wear — Meghana &amp; Rajit · November 2026 · Boston</Preview>
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
              What to Wear
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
              Hello everyone,
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
              We got a few questions about what to wear for the wedding, so here&apos;s some more information.
            </Text>

            {/* FAQ box */}
            <Section
              style={{
                backgroundColor: bg,
                borderRadius: "6px",
                padding: "24px 28px",
                border: `1px solid ${borderGold}`,
                marginBottom: "28px",
              }}
            >
              <Text
                style={{
                  color: dark,
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  margin: "0 0 10px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                What does traditional Indian attire mean?
              </Text>
              <Text
                style={{
                  color: textMuted,
                  fontSize: "14px",
                  lineHeight: "1.75",
                  margin: "0 0 20px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Search terms to check on Indian clothing websites include &ldquo;festive wear&rdquo; or &ldquo;occasion wear.&rdquo; For men, a festive kurta set, Nehru jacket with trousers, or a bandhgala jacket are all great options — avoid cotton; silk, silk blend, and chanderi are ideal fabrics. For women, anything that&apos;s not bridal attire works beautifully.
              </Text>
              <Text
                style={{
                  color: textDim,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Further reading
              </Text>
              <Text style={{ margin: "0 0 16px", fontFamily: "'Jost', Helvetica, Arial, sans-serif" }}>
                <Link href={guide.href} style={{ color: goldDim, fontSize: "14px", textDecoration: "underline" }}>
                  {guide.label}
                </Link>
              </Text>
              <Text
                style={{
                  color: textDim,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 8px",
                  fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                }}
              >
                Places to shop
              </Text>
              {shops.map((shop) => (
                <Text
                  key={shop.href}
                  style={{
                    margin: "0 0 4px",
                    fontFamily: "'Jost', Helvetica, Arial, sans-serif",
                  }}
                >
                  <Link
                    href={shop.href}
                    style={{
                      color: goldDim,
                      fontSize: "14px",
                      textDecoration: "underline",
                    }}
                  >
                    {shop.label}
                  </Link>
                </Text>
              ))}
            </Section>

            <Text
              style={{
                color: textMuted,
                fontSize: "15px",
                lineHeight: "1.75",
                margin: 0,
                fontFamily: "'Jost', Helvetica, Arial, sans-serif",
              }}
            >
              As always, if you have any questions you can text Rajit at{" "}
              <Link
                href="sms:+16039218190"
                style={{ color: goldDim, textDecoration: "underline" }}
              >
                +1 (603) 921-8190
              </Link>
              .
            </Text>
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

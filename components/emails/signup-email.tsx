import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

// TODO: use sitemap instead
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000";

interface SignupEmailProps {
  // username: string;
  verificationCode: string;
  // location: string;
  currentYear: number;
  address: string;
}

const SignupEmail = (props: SignupEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily={["Arial", "sans-serif"]}
            webFont={{
              url: "https://fonts.gstatic.com/s/geist/v1/gyByhwUxId8gMEwcGFU.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body
          className="bg-[#fdfdfd] py-10"
          style={{ fontFamily: "'Geist', Arial, sans-serif" }}
        >
          <Container
            className="mx-auto max-w-lg bg-[#fdfdfd] px-12 py-10"
            style={{ border: "1px solid #e4e4e7", borderRadius: "8px" }}
          >
            {/* Logo */}
            <Section className="mb-12">
              <Text className="m-0 font-bold text-[#1C1C1E] text-[24px]">
                ▲
              </Text>
            </Section>

            {/* Main Heading */}
            <Heading className="mt-0 mb-8 font-semibold text-[#1C1C1E] text-[24px]">
              Sign up for Paluwagan
            </Heading>

            {/* Description */}
            <Text className="mb-4 text-[#1C1C1E] text-[16px] leading-6">
              A sign up to Paluwagan account was requested.
              {/*from{" "} <strong className="font-semibold">{props.location}</strong>.*/}
            </Text>

            <Text className="mb-4 text-[#1C1C1E] text-[16px] leading-6">
              Enter this code in your browser to continue:
            </Text>

            {/* Verification Code */}
            <Section className="mb-8">
              <Text
                className="m-0 py-2 text-center font-bold font-mono text-[#1C1C1E] text-[24px] tracking-[6px]"
                style={{
                  backgroundColor: "#f4f4f5",
                  border: "1px solid #e4e4e7",
                  borderRadius: "6px",
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {props.verificationCode}
              </Text>
            </Section>

            {/* Expiration */}
            <Text className="m-0 mb-4 text-[#1C1C1E] text-[16px] leading-6">
              This code expires in 30 minutes.
            </Text>

            {/* Terms */}
            <Text className="m-0 mb-4 text-[#1C1C1E] text-[16px] leading-6">
              By signing up, you agree to our{" "}
              <Link
                href={`${BASE_URL}/terms`}
                style={{ color: "#155dfc", textDecoration: "underline" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={`${BASE_URL}/privacy`}
                style={{ color: "#155dfc", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>
              .
            </Text>

            {/* Divider */}
            <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />

            {/* Security Notice */}
            <Text
              className="mb-4 text-[14px] leading-6"
              style={{ color: "#52525b" }}
            >
              If you didn't request this, ignore this email. Paluwagan will
              never ask for this code by phone, chat, or email. For help, visit
              our{" "}
              <Link
                href={`${BASE_URL}/help`}
                style={{ color: "#52525b", textDecoration: "underline" }}
              >
                Help page
              </Link>
              .
            </Text>

            {/* Footer */}
            <Text
              className="m-0 text-[14px] leading-6"
              style={{ color: "#52525b" }}
            >
              Copyright © {props.currentYear} Paluwagan Inc. All rights
              reserved.
              <br />
              {props.address}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SignupEmail;

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const EmailTemplate = ({ body }: any) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://zaintravel.vercel.app/logo.svg`}
          width="300"
          height="200"
          alt="Zain Travel"
          style={logo}
        />
        <Text style={paragraph}>مرحبا, {body.fullName}</Text>
        <Text style={paragraph}>
          شكرا لتسجيلك معانا نرحب بكم دائما
          <br />
        </Text>
        <Text style={paragraph}>{body.message}</Text>

        <Text style={paragraph}>{body.day}</Text>

        {body.trip_type && <Text style={paragraph}>{body.trip_type}</Text>}

        {body.seats && <Text style={paragraph}>{body.seats}</Text>}

        {body.bag_type && <Text style={paragraph}>{body.bag_type}</Text>}

        <Text style={paragraph}>{body.start_time}</Text>

        {body.amount && (
          <Text style={paragraph}>تكلفة الرحلة: {body.amount} ج.م</Text>
        )}
        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${process.env.NEXT_PUBLIC_URL}/profile`}
          >
            زيارة حسابك
          </Button>
        </Section>
        <Text style={paragraph}>
          من,
          <br />
          فريق الزين ترافل
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2024 زين للرحلات و النقل السياحى. كل الحقوق محفوظة
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "red",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

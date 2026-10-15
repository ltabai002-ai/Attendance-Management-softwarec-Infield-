import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — INFIELD Workforce Management App" },
      {
        name: "description",
        content:
          "How INFIELD handles visitor data, including the Meta Pixel used for visit measurement and ad optimization.",
      },
      { property: "og:title", content: "Privacy Policy — INFIELD" },
      {
        property: "og:description",
        content:
          "How INFIELD handles visitor data, including the Meta Pixel used for visit measurement and ad optimization.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3 grid gap-3 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: 13 October 2026
        </p>

        <Section title="Who we are">
          <p>
            INFIELD ("we", "us") operates this website for its workforce
            management app. For privacy questions, email us at: Confirm with
            INFIELD.
          </p>
        </Section>

        <Section title="What we collect">
          <p>
            This website uses the Meta Pixel, a measurement tool from Meta
            Platforms. When you visit, the Pixel collects:
          </p>
          <ul className="list-disc pl-5">
            <li>Pages you visit on this website;</li>
            <li>Device and browser details (type, operating system, screen size);</li>
            <li>The Meta cookie ID stored in your browser (the _fbp cookie).</li>
          </ul>
          <p>
            The demo request form is stored by us so we can contact you; it is
            not shared with Meta through the Pixel.
          </p>
        </Section>

        <Section title="Who receives it">
          <p>
            The Pixel data is received by{" "}
            <strong>Meta Platforms Ireland Ltd.</strong> for visitors in the
            EU/EEA/UK and <strong>Meta Platforms, Inc.</strong> elsewhere. Where
            data is transferred outside your region, Meta relies on standard
            contractual clauses and other safeguards described in its own
            terms.
          </p>
        </Section>

        <Section title="Why (purposes)">
          <p>
            We use this data to measure how many people visit this page, to
            measure how our advertising performs, and to improve the ads we run
            (optimization). We do not sell your data.
          </p>
        </Section>

        <Section title="Your choice">
          <p>
            In regions where consent is required, the Pixel is blocked until
            you accept. You can accept or decline in the banner shown on your
            first visit, and change your mind anytime via{" "}
            <strong>Cookie Settings</strong> in the footer of any page. If you
            decline, no Pixel data is sent from your browser. You can also
            block or delete cookies in your browser settings, including the
            _fbp cookie.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Your cookie choice is stored in your browser until you clear it.
            How long Meta retains Pixel data is described in Meta's data
            policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions or requests about this policy: email Confirm with
            INFIELD, or reach us on WhatsApp at +91 9164060961.
          </p>
        </Section>
      </div>
    </main>
  );
}

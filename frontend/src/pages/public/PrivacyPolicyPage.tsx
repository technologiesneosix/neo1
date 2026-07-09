import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/ui/Reveal';

const sections = [
  {
    title: '1. Information We Collect',
    paragraphs: [
      'We collect information you provide directly to us, such as when you fill in a contact form, apply for a position, subscribe to our newsletter or otherwise communicate with us. This typically includes your name, email address, phone number and the content of your message or application.',
      'We also collect limited technical information automatically when you visit our website, including your browser type, device information, pages visited and approximate location derived from your IP address. This information is aggregated and used to understand how our website performs.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    paragraphs: [
      'We use the information we collect to respond to your inquiries, process job applications, deliver the newsletter you subscribed to, improve our website and services, and comply with legal obligations.',
      'We do not sell, rent or trade your personal information to third parties. We may share information with trusted service providers who help us operate our website and business, and only to the extent necessary for them to perform those services on our behalf.',
    ],
  },
  {
    title: '3. Cookies and Analytics',
    paragraphs: [
      'Our website uses a small number of cookies that are strictly necessary for it to function, along with privacy-respecting analytics that help us understand aggregate usage. You can configure your browser to refuse cookies; core pages of the site will continue to work.',
    ],
  },
  {
    title: '4. Data Retention and Security',
    paragraphs: [
      'We retain personal information only for as long as necessary to fulfill the purposes described in this policy, or as required by law. Contact messages and job applications are reviewed regularly and deleted when no longer needed.',
      'We apply industry-standard technical and organizational measures to protect your data, including encryption in transit, access controls and routine security reviews. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Your Rights',
    paragraphs: [
      'Depending on your jurisdiction, you may have the right to access, correct, export or delete the personal information we hold about you, and to object to or restrict certain processing. To exercise any of these rights, contact us using the details below and we will respond within thirty days.',
    ],
  },
  {
    title: '6. Changes and Contact',
    paragraphs: [
      'We may update this policy from time to time. When we do, we will revise the date at the top of this page and, for material changes, provide a more prominent notice.',
      'If you have questions about this policy or how we handle your data, contact our privacy team at privacy@neosix.io or write to us through the contact page.',
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy — Neosix"
        description="How Neosix collects, uses, protects and retains your personal information."
      />
      <PageHero
        label="LEGAL"
        title="Privacy Policy"
        lead="Last updated July 2026 — how we collect, use and protect your information."
        crumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            {sections.map((section) => (
              <Reveal key={section.title} className="mb-10">
                <h2 className="text-xl font-bold md:text-2xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-4 text-[15px] leading-8 text-body">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Reveal } from '@/components/ui/Reveal';

const sections = [
  {
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using the Neosix website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, please do not use the website. We may update these terms from time to time; continued use after changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    title: '2. Use of the Website',
    paragraphs: [
      'You may use this website for lawful purposes only. You agree not to attempt to gain unauthorized access to any part of the site, interfere with its operation, scrape content at scale, or use it to transmit malicious code or unsolicited communications.',
      'Content on this website is provided for general information about our company and services. It does not constitute professional advice, and project outcomes described in case studies are specific to those engagements.',
    ],
  },
  {
    title: '3. Intellectual Property',
    paragraphs: [
      'All content on this website — including text, graphics, logos, illustrations and code samples — is the property of Neosix or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute or create derivative works from this content without our prior written consent, except for brief quotations with attribution.',
      'Work delivered to clients under a services agreement is governed by that agreement, which typically assigns full ownership of project deliverables to the client.',
    ],
  },
  {
    title: '4. Client Engagements',
    paragraphs: [
      'Proposals, statements of work and master service agreements govern all commercial engagements with Neosix. Nothing on this website constitutes a binding offer; estimates and timelines shown in marketing materials are illustrative only.',
    ],
  },
  {
    title: '5. Disclaimers and Limitation of Liability',
    paragraphs: [
      'This website is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. Neosix does not warrant that the website will be uninterrupted, error-free or free of harmful components.',
      'To the maximum extent permitted by law, Neosix shall not be liable for any indirect, incidental, special or consequential damages arising out of your use of, or inability to use, this website.',
    ],
  },
  {
    title: '6. Governing Law and Contact',
    paragraphs: [
      'These terms are governed by the laws of India, without regard to conflict-of-law principles. Any disputes arising from these terms shall be resolved in the courts located in Mumbai, Maharashtra.',
      'Questions about these terms can be sent to technologiesneosix@gmail.com or submitted through our contact page.',
    ],
  },
];

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service — Neosix"
        description="The terms and conditions that govern the use of the Neosix website and services."
      />
      <PageHero
        label="LEGAL"
        title="Terms of Service"
        lead="Last updated July 2026 — the rules that govern the use of this website and our services."
        crumbs={[{ label: 'Terms of Service' }]}
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

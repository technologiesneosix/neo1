import { Seo } from '@/components/common/Seo';
import {
  AboutPreviewSection,
  BlogPreviewSection,
  CtaSection,
  FaqSection,
  HeroSection,
  IndustriesSection,
  PortfolioPreviewSection,
  ProcessSection,
  ServicesSection,
  SolutionsSection,
  TechStackSection,
  TestimonialsSection,
} from '@/features/home';

/** Neosix home page — Porto-style marketing sections composed in order. */
export function HomePage() {
  return (
    <>
      <Seo
        title="Neosix — Enterprise Software, Delivered"
        description="Neosix designs, builds and operates enterprise-grade web, mobile, cloud and AI products for companies that want to move faster."
      />
      <HeroSection />
      <AboutPreviewSection />
      <ServicesSection />
      <SolutionsSection />
      <IndustriesSection />
      <TechStackSection />
      <ProcessSection />
      <PortfolioPreviewSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}

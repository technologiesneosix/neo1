import { motion } from 'framer-motion';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { AboutNav } from '@/features/about/AboutNav';
import { FounderCard } from '@/features/about/FounderCard';

export function TeamPage() {
  const { data: teamMembers, isLoading } = useList(api.teamMembers);
  const members = [...(teamMembers ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title="Our Team | Neosix"
        description="The leaders behind Neosix — engineers, designers and product thinkers who ship."
      />
      <PageHero
        label="OUR TEAM"
        title="The People Behind the Products"
        lead="Senior, kind and relentlessly curious — meet the team your project would work with."
        crumbs={[{ label: 'About', path: '/about' }, { label: 'Our Team' }]}
      />
      <AboutNav />

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            label="LEADERSHIP"
            title="Meet Our Founders"
            lead="A focused leadership team guiding strategy, product, technology, and growth."
          />

          {isLoading && <PageLoader />}

          {members.length > 0 && (
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {members.map((member) => (
                <motion.li key={member.id} variants={staggerItem}>
                  <FounderCard member={member} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </section>
    </>
  );
}

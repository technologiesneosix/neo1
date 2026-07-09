import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useSiteSettings } from '@/api/hooks';
import { api } from '@/api/services';
import { Logo } from '@/components/common/Logo';
import { SocialIcons } from '@/components/common/SocialIcons';
import { parsePhoneNumbers, phoneHref } from '@/lib/utils';

const exploreLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Careers', path: '/careers' },
  { label: 'Blog', path: '/blog' },
];

const supportLinks = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms' },
];

export function Footer() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const phoneNumbers = parsePhoneNumbers(settings?.phone ?? '');

  const subscribe = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await api.subscribers.create({ email: email.trim(), active: true });
      toast.success('Subscribed! Welcome aboard.');
      setEmail('');
    } catch {
      toast.error('Subscription failed — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-ink-900 text-neutral-400">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 md:py-20">
        <div>
          <Logo dark />
          <p className="mt-5 text-sm leading-7">{settings?.footerText}</p>
          {settings && (
            <SocialIcons
              links={settings.socialLinks}
              className="mt-6"
              iconClassName="text-neutral-400 hover:text-white"
              size={18}
            />
          )}
        </div>

        <nav aria-label="Explore">
          <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white">Explore</h4>
          <ul className="space-y-3">
            {exploreLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-sm transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support">
          <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white">Support</h4>
          <ul className="space-y-3">
            {supportLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-sm transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <address className="mt-6 space-y-3 text-sm not-italic">
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-1 shrink-0 text-accent-400" aria-hidden="true" />
              <span className="whitespace-pre-line">{settings?.address}</span>
            </p>
            <div className="flex items-start gap-2.5">
              <Phone size={15} className="mt-1 shrink-0 text-primary-400" aria-hidden="true" />
              <div>
                {phoneNumbers.map((phone) => (
                  <a key={phone} href={phoneHref(phone)} className="block transition-colors hover:text-white">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <p className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-primary-400" aria-hidden="true" />
              <a href={settings?.email ? `mailto:${settings.email}` : undefined} className="transition-colors hover:text-white">
                {settings?.email}
              </a>
            </p>
          </address>
        </nav>

        <div>
          <h4 className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-white">Newsletter</h4>
          <p className="text-sm leading-7">
            Engineering insights and company news, once a month. No spam, ever.
          </p>
          {settings?.newsletterEnabled !== false && (
            <form onSubmit={subscribe} className="mt-5 flex">
              <label className="sr-only" htmlFor="footer-newsletter">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
                className="w-full rounded-l-btn border border-ink-800 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={submitting}
                aria-label="Subscribe"
                className="rounded-r-btn bg-brand-gradient px-4 text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container-site text-center text-[13px] text-neutral-500">
          {settings?.copyrightText}
        </p>
      </div>
    </footer>
  );
}

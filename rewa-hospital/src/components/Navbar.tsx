import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Departments', href: '#departments' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Services', href: '#services' },
  { label: 'Insurance', href: '#insurance' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  // --------------- scroll background ---------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --------------- active section via IntersectionObserver ---------------
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(handleIntersect, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      });
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // --------------- smooth scroll handler ---------------
  const scrollTo = useCallback(
    (href: string) => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setMobileOpen(false);
    },
    [],
  );

  // --------------- lock body scroll when mobile menu open ---------------
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-navy-dark/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20 lg:h-[5.5rem]">
            {/* ---------- Logo ---------- */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#home');
              }}
              className="flex items-center gap-3 group"
            >
              {/* Monogram */}
              <span className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gold-gradient text-navy-dark font-serif font-black text-lg tracking-tight select-none shadow-lg shadow-gold-accent/20 group-hover:shadow-gold-accent/40 transition-shadow duration-300">
                VHRC
              </span>
              {/* Name */}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-gold-gradient font-serif font-bold text-base lg:text-lg tracking-wide">
                  Vindhya Hospital
                </span>
                <span className="text-gray-400 text-[0.65rem] lg:text-xs tracking-widest uppercase font-sans">
                  &amp; Research Centre
                </span>
              </div>
            </a>

            {/* ---------- Desktop Links ---------- */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeSection === href.slice(1);
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(href);
                    }}
                    className={`relative px-3 xl:px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded-md ${
                      isActive
                        ? 'text-gold-accent'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {label}
                    {/* Active underline */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold-gradient rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* ---------- Right Actions ---------- */}
            <div className="flex items-center gap-3">
              {/* Emergency CTA */}
              <a
                href="tel:+919589899826"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-gold-gradient text-navy-dark text-sm font-semibold rounded-lg shadow-lg shadow-gold-accent/20 hover:shadow-gold-accent/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Emergency:</span>
                <span>+91 9589899826</span>
              </a>

              {/* Mobile Hamburger */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden relative flex items-center justify-center w-11 h-11 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ==================== MOBILE DRAWER ==================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-sm bg-navy-dark/98 backdrop-blur-2xl border-l border-white/5 flex flex-col lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/5">
                <span className="text-gold-gradient font-serif font-bold text-lg">
                  Vindhya Hospital
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <ul className="space-y-1">
                  {NAV_LINKS.map(({ label, href }, i) => {
                    const isActive = activeSection === href.slice(1);
                    return (
                      <motion.li
                        key={href}
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 * i, duration: 0.35 }}
                      >
                        <a
                          href={href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollTo(href);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-gold-accent/10 text-gold-accent'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {/* Active pip */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                              isActive ? 'bg-gold-accent' : 'bg-transparent'
                            }`}
                          />
                          {label}
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Emergency CTA at bottom */}
              <div className="p-6 border-t border-white/5">
                <a
                  href="tel:+919589899826"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-gold-gradient text-navy-dark font-semibold rounded-lg shadow-lg shadow-gold-accent/20 hover:shadow-gold-accent/40 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Emergency: +91 9589899826
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

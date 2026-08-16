import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Droplets, Baby, Scissors, Stethoscope, Sparkles, HeartPulse,
  Activity, Brain, Syringe, Zap, Wind, HeartHandshake, Smile,
  AudioLines, Apple, Microscope, Droplet, Heart, ClipboardCheck,
  AlertTriangle, Truck, Hospital, Monitor, ScanLine, Dumbbell,
  Pill, UtensilsCrossed, Shield, Phone, Mail, MapPin, Clock,
  Star, ChevronRight, ArrowRight, CheckCircle, MessageCircle,
  Users, Award, Building2, Bed, PersonStanding, Quote,
} from 'lucide-react';
import Navbar from '../components/Navbar';

/* ═══════════════════════════════════════════
   CountUp Component — animates numbers on scroll
   ═══════════════════════════════════════════ */
interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

const CountUp = ({ end, duration = 2, suffix = '', prefix = '', separator = ',' }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formatted = count.toLocaleString('en-IN');
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};

/* ═══════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */
const departments = [
  { name: 'Urology & Urosurgery', desc: 'Advanced Mini-TURP technique', Icon: Droplets },
  { name: 'Obstetrics & Gynecology', desc: 'IVF, High-Risk Pregnancy, AC Labour Suite', Icon: Baby },
  { name: 'General & Laparoscopic Surgery', desc: 'Minimally invasive procedures', Icon: Scissors },
  { name: 'Orthopedics & Trauma', desc: '24×7 Advanced Trauma Centre', Icon: PersonStanding },
  { name: 'General Medicine', desc: 'Comprehensive medical care', Icon: Stethoscope },
  { name: 'Plastic Surgery & Burns', desc: 'Reconstructive & cosmetic surgery', Icon: Sparkles },
  { name: 'Pediatrics & Neonatology', desc: 'Specialized child care', Icon: Baby },
  { name: 'ICU & Dialysis', desc: 'Critical care & renal support', Icon: HeartPulse },
  { name: 'Spine Surgery', desc: 'Advanced spinal procedures', Icon: Activity },
  { name: 'Neurosurgery', desc: 'Brain & nervous system surgery', Icon: Brain },
  { name: 'Anaesthesiology', desc: 'Safe surgical sedation', Icon: Syringe },
  { name: 'Oncology', desc: 'Radiation & clinical oncology', Icon: Zap },
  { name: 'Pulmonology', desc: 'Respiratory & lung care', Icon: Wind },
  { name: 'Psychiatry', desc: 'Mental health support', Icon: HeartHandshake },
  { name: 'Dental & Maxillofacial', desc: 'Oral surgery & dental care', Icon: Smile },
  { name: 'ENT', desc: 'Ear, nose & throat care', Icon: AudioLines },
  { name: 'Gastroenterology', desc: 'Digestive system care', Icon: Apple },
  { name: 'Pathology Lab', desc: 'Hematology, Biochemistry, Microbiology', Icon: Microscope },
  { name: 'Blood Bank', desc: '24×7 blood availability', Icon: Droplet },
  { name: 'IVF Centre', desc: 'Fertility & reproductive health', Icon: Heart },
  { name: 'Health Checkup', desc: 'Comprehensive health packages', Icon: ClipboardCheck },
];

const doctors = [
  { name: 'Dr. Vishal Mishra', qualification: 'M.Ch (Urology)', specialty: 'Director, Urology & Andrology', initials: 'VM', gradient: 'from-teal-rich to-teal-light' },
  { name: 'Dr. Mukund Pandey', qualification: 'MBBS, MS', specialty: 'Senior Specialist', initials: 'MP', gradient: 'from-gold-dark to-gold-accent' },
  { name: 'Dr. Nishant Kumar Jain', qualification: 'MBBS, MD', specialty: 'Specialist', initials: 'NJ', gradient: 'from-teal-light to-emerald-600' },
  { name: 'Dr. Saurabh Pandey', qualification: 'MBBS, MS', specialty: 'Specialist', initials: 'SP', gradient: 'from-gold-accent to-amber-500' },
  { name: 'Dr. Vinit Tiwari', qualification: 'MBBS, MD', specialty: 'Specialist', initials: 'VT', gradient: 'from-teal-rich to-cyan-600' },
  { name: 'Dr. Anusha Pandey', qualification: 'MBBS, MS (OBG)', specialty: "Women's Health Specialist", initials: 'AP', gradient: 'from-rose-500 to-gold-accent' },
];

const services = [
  { name: '24×7 Emergency', Icon: AlertTriangle },
  { name: 'Advanced Ambulance', Icon: Truck },
  { name: 'Modular OT', Icon: Hospital },
  { name: 'Intensive Care Units', Icon: Monitor },
  { name: 'Pathology Lab', Icon: Microscope },
  { name: 'X-Ray, ECG, TMT', Icon: ScanLine },
  { name: 'Physiotherapy', Icon: Dumbbell },
  { name: '24×7 Pharmacy', Icon: Pill },
  { name: 'Diet & Nutrition', Icon: UtensilsCrossed },
  { name: 'Mediclaim Support', Icon: Shield },
];

const testimonials = [
  { name: 'Rajesh Sharma', quote: 'The urology department provided exceptional care. Dr. Vishal Mishra and his team were highly professional and compassionate. I felt confident throughout my treatment.', rating: 5 },
  { name: 'Priya Tiwari', quote: 'I had my delivery at Vindhya Hospital and the OBG team was amazing. The AC Labour Suite and round-the-clock nursing staff made the experience comfortable and safe.', rating: 5 },
  { name: 'Amit Verma', quote: 'After a severe accident, the trauma centre at Vindhya Hospital saved my life. The 24/7 emergency services are truly a blessing for Rewa and surrounding districts.', rating: 5 },
  { name: 'Sunita Devi', quote: 'Very affordable healthcare with world-class facilities. The staff is courteous and the hospital is well-maintained. Highly recommend for anyone in the Vindhya region.', rating: 4 },
];

const blogPosts = [
  { category: 'Urology', title: 'Understanding Kidney Stones: Prevention & Modern Treatment', excerpt: 'Learn about the causes, symptoms and the latest minimally invasive techniques for kidney stone treatment available at our urology centre.' },
  { category: 'Gynecology', title: 'High-Risk Pregnancy: What Every Mother Should Know', excerpt: 'Expert guidance on managing high-risk pregnancies, warning signs, and how specialized care can ensure a healthy delivery.' },
  { category: 'Pediatrics', title: 'Childhood Vaccinations: A Complete Guide for Parents', excerpt: 'Stay informed about essential vaccinations, schedules, and why timely immunization is crucial for your child\'s health.' },
];

const insuranceSchemes = [
  'Ayushman Bharat', 'ECHS', 'SGHS', 'CGHS', 'Cashless Insurance', 'TPA Facilities',
];

const whyChooseUs = [
  { title: 'Advanced Technology', desc: 'State-of-the-art equipment and modular operating theatres', Icon: Monitor },
  { title: 'Expert Specialists', desc: '20+ departments led by experienced specialists', Icon: Users },
  { title: 'Affordable Care', desc: 'Quality healthcare accessible to all strata of society', Icon: Heart },
  { title: '24×7 Support', desc: 'Round-the-clock emergency, pharmacy, and blood bank', Icon: Clock },
];

const galleryItems = [
  { src: '/images/hero-bg.png', label: 'Hospital Exterior', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/urology-spec.png', label: 'Urology Department', span: '' },
  { src: '/images/obgyn-spec.png', label: 'OB-GYN Department', span: '' },
  { src: '/images/ortho-spec.png', label: 'Orthopedics & Trauma', span: 'md:col-span-2' },
  { src: '/images/hero-bg.png', label: 'Patient Care', span: '' },
  { src: '/images/urology-spec.png', label: 'Operating Theatre', span: '' },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const HospitalHome = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Testimonial auto-cycling
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Appointment form
  const [formData, setFormData] = useState({
    name: '', phone: '', department: '', date: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', phone: '', department: '', date: '', message: '' });
  }, []);

  return (
    <div className="min-h-screen bg-navy-dark text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════ */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <img
            src="/images/hero-bg.png"
            alt="Vindhya Hospital"
            className="w-full h-[130%] object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/90 via-navy-dark/60 to-navy-dark z-[1]" />

        {/* Animated Particles */}
        <div className="absolute inset-0 z-[1]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold-accent/30"
              style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 text-xs font-sans uppercase tracking-[0.3em] text-gold-accent border border-gold-accent/30 rounded-full bg-gold-accent/5">
              First 100-Bed Super Specialty Hospital of Vindhya Region
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your Health,{' '}
            <span className="text-gold-gradient">Our Priority</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Caring Beyond Boundaries — Delivering Trusted Healthcare with Compassion and Excellence
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <a
              href="#appointment"
              className="group px-8 py-4 bg-gold-gradient text-navy-dark font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-accent/25 transition-all duration-300 flex items-center gap-2"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:+919589899826"
              className="group px-8 py-4 border border-red-500/50 text-red-400 font-semibold rounded-xl hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 animate-pulse" />
              Emergency: Call Now
            </a>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {[
              { value: 120000, suffix: '+', label: 'Patients Treated', prefix: '' },
              { value: 24, suffix: '×7', label: 'Emergency Services', prefix: '' },
              { value: 20, suffix: '+', label: 'Specialties', prefix: '' },
              { value: 100, suffix: '', label: 'Beds', prefix: '' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-4 sm:p-6 text-center glow-teal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-gold-gradient font-serif">
                  <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1 font-sans">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold-accent/40 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-1.5 bg-gold-accent rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          2. ABOUT SECTION
          ═══════════════════════════════════════ */}
      <section id="about" className="py-20 lg:py-28 bg-navy-dark relative">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUp}
            >
              <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
                About Us
              </span>
              <h2 className="section-title text-left">
                About <span className="text-gold-gradient">Vindhya Hospital</span>
              </h2>
              <div className="gold-line !mx-0 mb-6" />
              <p className="text-gray-300 leading-relaxed mb-6 font-sans">
                Since our founding, Vindhya Hospital has stood as the beacon of advanced medical care in Rewa
                and the entire Vindhya belt. As the first 100-bedded super-specialty hospital in the region,
                we serve patients from Rewa, Satna, Sidhi, Singroli, Umariya, Anuppur, Katni, Panna,
                Shahdol and surrounding areas.
              </p>
              <div className="glass-card p-6 border-l-4 border-l-gold-accent mb-8">
                <p className="text-gold-light italic font-serif text-lg">
                  "Affordable, holistic, individualized, quality healthcare for all strata of society"
                </p>
                <p className="text-gray-400 text-sm mt-2 font-sans">— Our Mission</p>
              </div>
            </motion.div>

            {/* Right: Decorative Card */}
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUp}
              custom={2}
            >
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-teal-rich/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gold-accent/10 to-transparent rounded-tr-full" />
                <div className="relative z-10">
                  <Building2 className="w-12 h-12 text-gold-accent mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">Vindhya Hospital & Research Centre</h3>
                  <p className="text-gray-400 font-sans text-sm mb-6">
                    Proudly serving the Vindhya region with advanced multi-specialty healthcare since our inception.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 120000, suffix: '+', label: 'Patients' },
                      { value: 20, suffix: '+', label: 'Departments' },
                      { value: 100, suffix: '', label: 'Beds' },
                      { value: 10, suffix: '+', label: 'Years' },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 rounded-lg bg-navy-dark/50">
                        <div className="text-xl font-bold text-gold-accent font-serif">
                          <CountUp end={item.value} suffix={item.suffix} />
                        </div>
                        <div className="text-xs text-gray-400 font-sans">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. DEPARTMENTS SECTION
          ═══════════════════════════════════════ */}
      <section id="departments" className="py-20 lg:py-28 bg-navy-medium/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,107,107,0.08),transparent_60%)]" />
        <div className="section-container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              What We Offer
            </span>
            <h2 className="section-title">
              Our <span className="text-gold-gradient">Departments</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              Comprehensive care across 21 specialized departments
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                className="glass-card p-5 sm:p-6 group cursor-pointer text-center"
                variants={scaleIn}
                custom={i}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-teal-rich/20 flex items-center justify-center group-hover:bg-teal-rich/40 transition-colors duration-300">
                  <dept.Icon className="w-6 h-6 text-teal-light group-hover:text-gold-accent transition-colors duration-300" />
                </div>
                <h3 className="font-serif font-semibold text-sm sm:text-base text-white mb-1 leading-tight">
                  {dept.name}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{dept.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. DOCTORS SECTION
          ═══════════════════════════════════════ */}
      <section id="doctors" className="py-20 lg:py-28 bg-navy-dark relative">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Our Team
            </span>
            <h2 className="section-title">
              Our Expert <span className="text-gold-gradient">Doctors</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              Experienced specialists dedicated to your health and recovery
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {doctors.map((doc, i) => (
              <motion.div
                key={doc.name}
                className="glass-card p-6 sm:p-8 text-center group hover:border-gold-accent/40 transition-all duration-500"
                variants={scaleIn}
                custom={i}
              >
                {/* Avatar */}
                <div className={`w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br ${doc.gradient} flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg group-hover:shadow-gold-accent/20 transition-shadow duration-500`}>
                  {doc.initials}
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">{doc.name}</h3>
                <p className="text-gray-400 text-sm font-sans mb-3">{doc.qualification}</p>
                <span className="inline-block px-4 py-1.5 text-xs font-sans uppercase tracking-wider border border-gold-accent/40 text-gold-accent rounded-full bg-gold-accent/5">
                  {doc.specialty}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. SERVICES SECTION
          ═══════════════════════════════════════ */}
      <section id="services" className="py-20 lg:py-28 bg-navy-medium/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,76,0.05),transparent_60%)]" />
        <div className="section-container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Facilities
            </span>
            <h2 className="section-title">
              Our <span className="text-gold-gradient">Services</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              World-class facilities for complete patient care
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                className="glass-card p-6 text-center group cursor-pointer"
                variants={scaleIn}
                custom={i}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-rich/30 to-navy-light/50 flex items-center justify-center group-hover:from-gold-accent/20 group-hover:to-gold-dark/20 transition-all duration-500">
                  <service.Icon className="w-7 h-7 text-teal-light group-hover:text-gold-accent transition-colors duration-300" />
                </div>
                <h3 className="font-sans font-semibold text-sm text-white leading-tight">{service.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. WHY CHOOSE US
          ═══════════════════════════════════════ */}
      <section id="why-us" className="py-20 lg:py-28 bg-navy-dark relative overflow-hidden">
        {/* Animated SVG heartbeat line */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg viewBox="0 0 1200 200" className="w-full max-w-6xl" preserveAspectRatio="none">
            <motion.path
              d="M0,100 L200,100 L250,30 L300,170 L350,60 L400,140 L450,100 L1200,100"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        <div className="section-container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Our Promise
            </span>
            <h2 className="section-title">
              Why Choose <span className="text-gold-gradient">Vindhya Hospital</span>
            </h2>
            <div className="gold-line mb-4" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-8 text-center group relative overflow-hidden"
                variants={scaleIn}
                custom={i}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-teal-rich/20 flex items-center justify-center group-hover:bg-gold-accent/15 transition-colors duration-500">
                  <item.Icon className="w-8 h-8 text-teal-light group-hover:text-gold-accent transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. INSURANCE & SCHEMES
          ═══════════════════════════════════════ */}
      <section id="insurance" className="py-20 lg:py-28 bg-navy-medium/30 relative">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Financial Assistance
            </span>
            <h2 className="section-title">
              Insurance & <span className="text-gold-gradient">Government Schemes</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              Cashless treatment with major insurance providers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {insuranceSchemes.map((scheme, i) => (
              <motion.div
                key={scheme}
                className="glass-card p-5 text-center group cursor-pointer"
                variants={scaleIn}
                custom={i}
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-3 text-teal-light group-hover:text-gold-accent transition-colors duration-300" />
                <p className="font-sans font-semibold text-sm text-white">{scheme}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. GALLERY
          ═══════════════════════════════════════ */}
      <section id="gallery" className="py-20 lg:py-28 bg-navy-dark relative">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Our Facility
            </span>
            <h2 className="section-title">
              Hospital <span className="text-gold-gradient">Gallery</span>
            </h2>
            <div className="gold-line mb-4" />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${item.span}`}
                variants={scaleIn}
                custom={i}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <p className="p-4 font-serif text-base font-semibold text-white">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section id="testimonials" className="py-20 lg:py-28 bg-navy-medium/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,107,107,0.06),transparent_60%)]" />
        <div className="section-container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Testimonials
            </span>
            <h2 className="section-title">
              What Our <span className="text-gold-gradient">Patients Say</span>
            </h2>
            <div className="gold-line mb-4" />
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="glass-card p-8 sm:p-10 relative glow-teal">
                {/* Decorative Quote */}
                <Quote className="w-12 h-12 text-gold-accent/20 absolute top-6 left-6" />

                <div className="relative z-10">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-200 text-lg sm:text-xl leading-relaxed font-sans italic mb-6 pl-8">
                      "{testimonials[activeTestimonial].quote}"
                    </p>
                    <div className="flex items-center justify-between pl-8">
                      <div>
                        <p className="font-serif font-bold text-white text-lg">
                          {testimonials[activeTestimonial].name}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-4 h-4 ${starIdx < testimonials[activeTestimonial].rating ? 'text-gold-accent fill-gold-accent' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeTestimonial
                          ? 'bg-gold-accent w-8'
                          : 'bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. HEALTH BLOG PREVIEW
          ═══════════════════════════════════════ */}
      <section id="blog" className="py-20 lg:py-28 bg-navy-dark relative">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Knowledge Centre
            </span>
            <h2 className="section-title">
              Health Tips & <span className="text-gold-gradient">Articles</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              Stay informed with expert health advice from our specialists
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.title}
                className="glass-card p-6 sm:p-8 group flex flex-col"
                variants={scaleIn}
                custom={i}
              >
                <span className="inline-block self-start px-3 py-1 text-xs font-sans uppercase tracking-wider bg-teal-rich/20 text-teal-light rounded-full mb-4">
                  {post.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-3 leading-snug group-hover:text-gold-accent transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm font-sans leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>
                <button className="inline-flex items-center gap-2 text-sm text-teal-light hover:text-gold-accent font-sans font-medium transition-colors duration-300 self-start group/link">
                  Read More
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          11. APPOINTMENT BOOKING
          ═══════════════════════════════════════ */}
      <section id="appointment" className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,107,107,0.12),transparent_50%)]" />
        <div className="section-container relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-teal-light text-sm font-sans uppercase tracking-[0.2em] mb-3 inline-block">
              Get In Touch
            </span>
            <h2 className="section-title">
              Book Your <span className="text-gold-gradient">Consultation</span>
            </h2>
            <div className="gold-line mb-4" />
            <p className="section-subtitle">
              Schedule an appointment with our specialists today
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <div className="glass-card p-8 sm:p-10">
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-teal-rich/20 border border-teal-light/30 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-teal-light flex-shrink-0" />
                  <p className="text-teal-light font-sans text-sm">
                    Thank you! Your consultation request has been submitted. We'll contact you shortly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-navy-dark/80 border border-navy-light/50 rounded-xl text-white placeholder-gray-500 font-sans text-sm focus:outline-none focus:border-teal-light/70 focus:ring-1 focus:ring-teal-light/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-navy-dark/80 border border-navy-light/50 rounded-xl text-white placeholder-gray-500 font-sans text-sm focus:outline-none focus:border-teal-light/70 focus:ring-1 focus:ring-teal-light/30 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-1.5">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-navy-dark/80 border border-navy-light/50 rounded-xl text-white font-sans text-sm focus:outline-none focus:border-teal-light/70 focus:ring-1 focus:ring-teal-light/30 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name} className="bg-navy-dark">
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 font-sans mb-1.5">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-navy-dark/80 border border-navy-light/50 rounded-xl text-white font-sans text-sm focus:outline-none focus:border-teal-light/70 focus:ring-1 focus:ring-teal-light/30 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 font-sans mb-1.5">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder="Describe your symptoms or requirements..."
                    className="w-full px-4 py-3 bg-navy-dark/80 border border-navy-light/50 rounded-xl text-white placeholder-gray-500 font-sans text-sm focus:outline-none focus:border-teal-light/70 focus:ring-1 focus:ring-teal-light/30 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold-gradient text-navy-dark font-semibold font-sans rounded-xl hover:shadow-lg hover:shadow-gold-accent/25 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                >
                  Book Your Consultation
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. FOOTER
          ═══════════════════════════════════════ */}
      <footer id="footer" className="bg-navy-dark border-t border-white/5 pt-16 pb-6">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            {/* Col 1 — Logo & Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center">
                  <span className="font-serif font-bold text-navy-dark text-lg">V</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-lg leading-none">VHRC</h3>
                  <p className="text-xs text-gray-400 font-sans">Vindhya Hospital</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-sans leading-relaxed mb-4">
                Caring Beyond Boundaries — Delivering Trusted Healthcare with Compassion and Excellence.
              </p>
              <div className="flex gap-3">
                <a href="tel:+919589899826" className="w-9 h-9 rounded-lg bg-navy-light/50 flex items-center justify-center hover:bg-teal-rich/30 transition-colors" aria-label="Phone">
                  <Phone className="w-4 h-4 text-gray-400" />
                </a>
                <a href="mailto:vhrcrewa@gmail.com" className="w-9 h-9 rounded-lg bg-navy-light/50 flex items-center justify-center hover:bg-teal-rich/30 transition-colors" aria-label="Email">
                  <Mail className="w-4 h-4 text-gray-400" />
                </a>
                <a href="https://wa.me/919589899826" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-navy-light/50 flex items-center justify-center hover:bg-green-600/30 transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4 text-base">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', href: '#hero' },
                  { label: 'About', href: '#about' },
                  { label: 'Departments', href: '#departments' },
                  { label: 'Doctors', href: '#doctors' },
                  { label: 'Services', href: '#services' },
                  { label: 'Contact', href: '#appointment' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 text-sm font-sans hover:text-gold-accent transition-colors duration-300 flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Departments */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4 text-base">Departments</h4>
              <ul className="space-y-2.5">
                {['Urology', 'Gynecology', 'Orthopedics', 'General Medicine', 'Neurosurgery', 'Pediatrics'].map((dept) => (
                  <li key={dept}>
                    <a
                      href="#departments"
                      className="text-gray-400 text-sm font-sans hover:text-gold-accent transition-colors duration-300 flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {dept}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4 text-base">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-light mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm font-sans">Near Old Bus Stand, Bansh Ghat, Rewa, MP 486001</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-light mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 text-sm font-sans">
                    <a href="tel:+919589899826" className="hover:text-gold-accent transition-colors block">+91 9589899826</a>
                    <a href="tel:07662406000" className="hover:text-gold-accent transition-colors block">07662-406000</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-teal-light mt-0.5 flex-shrink-0" />
                  <a href="mailto:vhrcrewa@gmail.com" className="text-gray-400 text-sm font-sans hover:text-gold-accent transition-colors">vhrcrewa@gmail.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-teal-light mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 text-sm font-sans">
                    <p>OPD: Mon–Sun 9AM–9PM</p>
                    <p>Emergency: 24×7</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Google Maps */}
          <div className="rounded-xl overflow-hidden mb-10 border border-white/5">
            <iframe
              title="Vindhya Hospital Rewa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.8!2d81.3!3d24.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVindhya+Hospital+Rewa!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-70 hover:opacity-100 transition-opacity duration-500"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
              <p className="text-gray-500 text-xs font-sans">
                © 2024 Vindhya Hospital & Research Centre. All Rights Reserved.
              </p>
              <p className="text-gray-500 text-xs font-sans flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Open 24 Hours | Emergency: +91 9589899826
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          FLOATING WHATSAPP BUTTON
          ═══════════════════════════════════════ */}
      <a
        href="https://wa.me/919589899826"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
        <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default HospitalHome;

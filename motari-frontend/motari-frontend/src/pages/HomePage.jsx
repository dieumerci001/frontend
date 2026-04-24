import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe, Bike, Users, ShieldCheck, BarChart2, Smartphone, MapPin, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import ChatWidget from '../components/ChatWidget';

// ─────────────────────────────────────────────────────────────
// 📁 IMAGE GUIDE — where to put your images:
//    Place all images inside:
//    src/assets/
//
//    Then import them like:
//    import heroImg from '../assets/hero.jpg'
//    import aboutImg from '../assets/about.jpg'
//    import t1Img from '../assets/jean.jpg'
//    import t2Img from '../assets/amina.jpg'
//    import t3Img from '../assets/emmanuel.jpg'
//
// 🌐 FREE IMAGE SOURCES:
//    • https://unsplash.com  — search "motorcycle rwanda" or "africa moto"
//    • https://pexels.com    — search "motorcycle taxi africa"
//    • https://pixabay.com   — free commercial use images
//    • https://freepik.com   — illustrations and photos
//
// 📐 RECOMMENDED SIZES:
//    hero.jpg       → 1200×700px  (hero section background/side image)
//    about.jpg      → 600×500px   (about section image)
//    jean.jpg       → 80×80px     (testimonial avatar)
//    amina.jpg      → 80×80px     (testimonial avatar)
//    emmanuel.jpg   → 80×80px     (testimonial avatar)
// ─────────────────────────────────────────────────────────────

// STEP 1: Download images and put them in src/assets/
// STEP 2: Uncomment the imports below and remove the placeholder divs

// import heroImg from '../assets/hero.jpg';
// import aboutImg from '../assets/about.jpg';
// import t1Img from '../assets/jean.jpg';
// import t2Img from '../assets/amina.jpg';
// import t3Img from '../assets/emmanuel.jpg';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { dark, toggle } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  const features = [
    { icon: <Bike size={28} />, title: t('f1Title'), desc: t('f1Desc') },
    { icon: <Users size={28} />, title: t('f2Title'), desc: t('f2Desc') },
    { icon: <ShieldCheck size={28} />, title: t('f3Title'), desc: t('f3Desc') },
    { icon: <BarChart2 size={28} />, title: t('f4Title'), desc: t('f4Desc') },
    { icon: <Smartphone size={28} />, title: t('f5Title'), desc: t('f5Desc') },
    { icon: <MapPin size={28} />, title: t('f6Title'), desc: t('f6Desc') },
  ];

  const stats = [
    { value: '5,000+', label: t('statMotari') },
    { value: '50,000+', label: t('statRides') },
    { value: '30+', label: t('statDistricts') },
    { value: '99.9%', label: t('statUptime') },
  ];

  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
  ];

  const testimonials = [
    { name: t('t1name'), role: t('t1role'), text: t('t1text'), stars: 5,
      // STEP 3: Replace this placeholder with: avatar: t1Img
      avatar: null },
    { name: t('t2name'), role: t('t2role'), text: t('t2text'), stars: 5,
      avatar: null },
    { name: t('t3name'), role: t('t3role'), text: t('t3text'), stars: 5,
      avatar: null },
  ];

  return (
    <div className="home-page">

      {/* ── NAVBAR ── */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-logo">🏍️ MMS Rwanda</div>

          <div className={`home-nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>{t('featuresLabel')}</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>{t('aboutLabel')}</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)}>{t('testimonialsLabel')}</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>{t('faqLabel')}</a>

            {/* Language switcher */}
            <div className="home-lang-wrapper">
              <button className="home-lang-btn" onClick={() => setLangOpen(o => !o)}>
                <Globe size={15} /> {currentLang.flag} {currentLang.label}
              </button>
              {langOpen && (
                <div className="home-lang-dropdown">
                  {LANGS.map(l => (
                    <button key={l.code}
                      className={`home-lang-option ${i18n.language === l.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(l.code)}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button className="home-theme-btn" onClick={toggle} title={dark ? t('lightMode') : t('darkMode')}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link to="/login" className="nav-btn-outline" onClick={() => setMenuOpen(false)}>{t('signIn')}</Link>
            <Link to="/register" className="nav-btn-filled" onClick={() => setMenuOpen(false)}>{t('getStarted')}</Link>
          </div>

          <button className="home-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-badge">🇷🇼 Built for Rwanda</span>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSub')}</p>
          <div className="hero-btns">
            <Link to="/register" className="btn-hero-primary">{t('getStarted')}</Link>
            <Link to="/login" className="btn-hero-secondary">{t('signIn')} →</Link>
          </div>
        </div>

        {/* ── HERO IMAGE ──
            📌 TO ADD IMAGE:
            1. Download a moto/Rwanda image from unsplash.com
            2. Save it as: src/assets/hero.jpg
            3. Import at top: import heroImg from '../assets/hero.jpg'
            4. Replace the placeholder div below with:
               <img src={heroImg} alt="MMS Rwanda" className="hero-img" />
        */}
        <div className="hero-visual">
          <div className="hero-img-placeholder">
            <span>📸</span>
            <p>Add hero.jpg<br/>here</p>
          </div>
          <div className="hero-card">
            <div className="hero-card-header">🏍️ Live Ride</div>
            <div className="hero-card-row"><span>Status</span><span className="badge-live">● Active</span></div>
            <div className="hero-card-row"><span>Pickup</span><span>Kigali CBD</span></div>
            <div className="hero-card-row"><span>Destination</span><span>Kimironko</span></div>
            <div className="hero-card-row"><span>Fare</span><span style={{fontWeight:700,color:'#004a99'}}>500 RWF</span></div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home-stats" id="stats">
        {stats.map((s, i) => (
          <div key={i} className="home-stat">
            <div className="home-stat-value">{s.value}</div>
            <div className="home-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="home-section" id="features">
        <div className="section-label">{t('featuresLabel')}</div>
        <h2 className="section-title">{t('featuresTitle')}</h2>
        <p className="section-sub">{t('featuresSub')}</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="home-section home-about" id="about">
        {/* ── ABOUT IMAGE ──
            📌 TO ADD IMAGE:
            1. Download a Rwanda/team image from pexels.com
            2. Save it as: src/assets/about.jpg
            3. Import at top: import aboutImg from '../assets/about.jpg'
            4. Replace the placeholder div below with:
               <img src={aboutImg} alt="About MMS" className="about-img" />
        */}
        <div className="about-img-placeholder">
          <span>📸</span>
          <p>Add about.jpg<br/>here</p>
        </div>

        <div className="about-text">
          <div className="section-label">{t('aboutLabel')}</div>
          <h2 className="section-title">{t('aboutTitle')}</h2>
          <p>{t('aboutP1')}</p>
          <p style={{marginTop:16}}>{t('aboutP2')}</p>
          <div className="about-points">
            {[t('point1'), t('point2'), t('point3'), t('point4')].map((p, i) => (
              <div key={i} className="about-point">✅ {p}</div>
            ))}
          </div>
          <Link to="/register" className="btn-hero-primary" style={{marginTop:28,display:'inline-block'}}>
            {t('registerNow')}
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-section" id="testimonials">
        <div className="section-label">{t('testimonialsLabel')}</div>
        <h2 className="section-title">{t('testimonialsTitle')}</h2>
        <div className="testimonials-grid">
          {testimonials.map((t2, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{'★'.repeat(t2.stars)}</div>
              <p>"{t2.text}"</p>
              <div className="testimonial-author">
                {/* ── TESTIMONIAL AVATAR IMAGE ──
                    📌 TO ADD IMAGE:
                    1. Save photos as: src/assets/jean.jpg, amina.jpg, emmanuel.jpg
                    2. Import them at top of file
                    3. Set avatar: t1Img in the testimonials array above
                    4. The img tag below will show automatically
                */}
                {t2.avatar
                  ? <img src={t2.avatar} alt={t2.name} className="testimonial-avatar-img" />
                  : <div className="testimonial-avatar">{t2.name[0]}</div>
                }
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{t2.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{t2.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="home-section" id="faq">
        <div className="section-label">{t('faqLabel')}</div>
        <h2 className="section-title">{t('faqTitle')}</h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaSub')}</p>
        <div className="hero-btns">
          <Link to="/register" className="btn-hero-primary">{t('createAccount')}</Link>
          <Link to="/login" className="btn-hero-secondary">{t('signIn')} →</Link>
        </div>
      </section>

      {/* ── FLOATING AI CHAT ── */}
      <ChatWidget />

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="home-logo">🏍️ MMS Rwanda</div>
            <p>{t('footerTagline')}</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>{t('featuresLabel')}</strong>
              <a href="#features">{t('featuresLabel')}</a>
              <a href="#about">{t('aboutLabel')}</a>
              <a href="#faq">{t('faqLabel')}</a>
            </div>
            <div>
              <strong>Account</strong>
              <Link to="/login">{t('signIn')}</Link>
              <Link to="/register">{t('getStarted')}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} MMS Rwanda. All rights reserved.</div>
      </footer>
    </div>
  );
}

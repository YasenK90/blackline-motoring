import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const cars = [
  {
    id: '911-turbo-s',
    model: '911 Turbo S',
    make: 'Porsche',
    year: '2026',
    price: '$248,900',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=88',
    accent: '01',
    engine: '3.7L Flat-6 Twin-Turbo',
    power: 650,
    zeroSixty: 2.6,
    topSpeed: 205,
    torque: 590,
    trace: '0,56 30,54 60,47 90,50 120,39 150,43 180,30 210,35 240,22 270,27 300,14 320,9',
  },
  {
    id: 'gt-black',
    model: 'AMG GT 63',
    make: 'Mercedes-AMG',
    year: '2025',
    price: '$196,500',
    category: 'Grand Tourer',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1800&q=88',
    accent: '02',
    engine: '4.0L V8 Biturbo',
    power: 577,
    zeroSixty: 3.1,
    topSpeed: 196,
    torque: 590,
    trace: '0,50 30,46 60,51 90,42 120,47 150,36 180,41 210,28 240,33 270,21 300,25 320,13',
  },
  {
    id: 'm4-csl',
    model: 'M4 CSL',
    make: 'BMW M',
    year: '2025',
    price: '$139,800',
    category: 'Track Focused',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1800&q=88',
    accent: '03',
    engine: '3.0L I6 Twin-Turbo',
    power: 543,
    zeroSixty: 3.6,
    topSpeed: 191,
    torque: 479,
    trace: '0,58 30,51 60,55 90,45 120,49 150,38 180,44 210,33 240,39 270,27 300,31 320,19',
  },
  {
    id: 'gt3-rs',
    model: '911 GT3 RS',
    make: 'Porsche',
    year: '2024',
    price: '$319,000',
    category: 'Collector',
    image: 'https://images.pexels.com/photos/10712932/pexels-photo-10712932.jpeg?auto=compress&cs=tinysrgb&w=1800',
    accent: '04',
    engine: '4.0L Flat-6 Naturally Aspirated',
    power: 518,
    zeroSixty: 3.0,
    topSpeed: 184,
    torque: 346,
    trace: '0,46 30,53 60,44 90,49 120,36 150,43 180,32 210,37 240,24 270,29 300,16 320,7',
  },
];

function useSweep(target, { duration = 950, decimals = 0 } = {}) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || current.current === target) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * eased;
      current.current = decimals ? Number(v.toFixed(decimals)) : Math.round(v);
      setValue(current.current);
      if (p < 1) raf = requestAnimationFrame(tick);
      else { current.current = target; setValue(target); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals]);

  return value;
}

function HeroTelemetry({ car }) {
  const power = useSweep(car.power);
  const accel = useSweep(car.zeroSixty, { decimals: 1 });
  const speed = useSweep(car.topSpeed);
  const torque = useSweep(car.torque);
  const fill = Math.min(100, (car.power / 700) * 100);

  return (
    <div className="hero-telemetry reveal delay-3">
      <div className="telemetry-head">
        <span className="live-dot" aria-hidden="true" />
        <span>LIVE SPEC</span>
        <span className="telemetry-id">BL-{car.accent}</span>
      </div>
      <div className="telemetry-grid">
        <div className="telemetry-cell"><span>POWER</span><strong>{power}<small>HP</small></strong></div>
        <div className="telemetry-cell"><span>0&ndash;60 MPH</span><strong>{accel.toFixed(1)}<small>S</small></strong></div>
        <div className="telemetry-cell"><span>TOP SPEED</span><strong>{speed}<small>MPH</small></strong></div>
        <div className="telemetry-cell"><span>TORQUE</span><strong>{torque}<small>LB-FT</small></strong></div>
      </div>
      <div className="power-track" aria-hidden="true"><div className="power-fill" style={{ width: `${fill}%` }} /></div>
      <div className="power-scale" aria-hidden="true"><span>0</span><span>700 HP SCALE</span></div>
      <svg key={car.id} className="speed-trace" viewBox="0 0 320 64" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={car.trace} />
      </svg>
    </div>
  );
}

function App() {
  const [activeCar, setActiveCar] = useState(cars[0]);
  const [shownImage, setShownImage] = useState(cars[0].image);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [notice, setNotice] = useState('');
  const cursor = useRef(null);
  const ring = useRef(null);
  const modalRef = useRef(null);
  const lastTrigger = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (cursor.current) {
        cursor.current.style.opacity = '1';
        cursor.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.opacity = '1';
        ring.current.animate(
          { transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)` },
          { duration: 450, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }
        );
      }
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showBooking ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showBooking]);

  useEffect(() => {
    if (!showBooking) return;
    lastTrigger.current = document.activeElement;
    modalRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setShowBooking(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showBooking]);

  useEffect(() => {
    if (showBooking || !lastTrigger.current) return;
    lastTrigger.current.focus();
    lastTrigger.current = null;
  }, [showBooking]);

  useEffect(() => {
    const t = setTimeout(() => setShownImage(activeCar.image), 850);
    return () => clearTimeout(t);
  }, [activeCar]);

  const ticker = useMemo(() => [
    'PRIVATE VIEWINGS', '0–60 IN 2.6S', 'BESPOKE SOURCING', '650 HP ON STANDBY',
    'CURATED PERFORMANCE', '11 COUNTRIES SOURCED', 'TRADE-IN CONSULTATION', 'BY APPOINTMENT ONLY',
  ], []);

  const openBooking = (car = activeCar) => {
    setActiveCar(car);
    setShowBooking(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice('Request received — our concierge will be in touch shortly.');
    e.currentTarget.reset();
  };

  const activeIndex = cars.findIndex(c => c.id === activeCar.id) + 1;

  return (
    <div className="site">
      <div className="cursor-dot" ref={cursor} />
      <div className="cursor-ring" ref={ring} />

      <header className="nav">
        <a href="#top" className="brand magnetic" aria-label="Blackline home">
          <span className="brand-mark" />
          <span>BLACKLINE</span>
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#collection" onClick={() => setMenuOpen(false)}><b>01</b>Collection</a>
          <a href="#about" onClick={() => setMenuOpen(false)}><b>02</b>The House</a>
          <a href="#journal" onClick={() => setMenuOpen(false)}><b>03</b>Journal</a>
          <button className="nav-cta" onClick={() => { openBooking(); setMenuOpen(false); }}>Private Viewing</button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"><span/><span/></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-image under" style={{ backgroundImage: `url(${shownImage})` }} />
          <div className="hero-image" key={activeCar.id} style={{ backgroundImage: `url(${activeCar.image})` }} />
          <div className="hero-duotone" aria-hidden="true" />
          <div className="hero-vignette" />
          <div className="hero-grid" />
          <div className="hud-frame" aria-hidden="true">
            <span className="hud-corner tl" /><span className="hud-corner tr" />
            <span className="hud-corner bl" /><span className="hud-corner br" />
          </div>

          <div className="hero-copy">
            <div className="eyebrow reveal"><span>EST. 2014 — CAIRO</span><i /></div>
            <h1 className="reveal delay-1">The art<br />of <em>motion.</em></h1>
            <p className="hero-sub reveal delay-2">A private collection of performance automobiles, selected for people who notice the details.</p>
            <div className="hero-actions reveal delay-3">
              <button className="btn btn-light" onClick={() => openBooking(activeCar)}>Request a viewing <span>↗</span></button>
              <a className="text-link" href="#collection">Explore collection <span>↓</span></a>
            </div>
          </div>

          <HeroTelemetry car={activeCar} />

          <div className="hero-meta reveal delay-2">
            <span>{activeCar.year} / {activeCar.category}</span>
            <span>{activeCar.make}</span>
            <span>30.0444° N / 31.2357° E</span>
          </div>
          <div className="hero-scroll">SCROLL TO EXPLORE <span /></div>
          <div className="hero-index"><span>0{activeIndex}</span><i /><span>04</span></div>
        </section>

        <section className="marquee" aria-label="Blackline services">
          <div className="marquee-track">
            {[...ticker, ...ticker].map((item, i) => <span key={i}>{item}<b>◆</b></span>)}
          </div>
        </section>

        <section className="collection section" id="collection">
          <div className="section-head reveal">
            <div><span className="eyebrow-dark">01 / THE COLLECTION</span><h2>Machines with<br /><em>a point of view.</em></h2></div>
            <p>Not a showroom. A selection. Every car is acquired for its character, condition, and the feeling it gives you at the wheel.</p>
          </div>

          <div className="featured reveal">
            <div className="featured-image-wrap">
              <img src={activeCar.image} alt={`${activeCar.make} ${activeCar.model}`} className="featured-image" />
              <div className="image-label">BLACKLINE / {activeCar.accent}</div>
              <button className="round-arrow" onClick={() => openBooking(activeCar)} aria-label="Book viewing">↗</button>
            </div>
            <div className="featured-info">
              <div className="small-index">{activeCar.accent} / 04 — IN ROTATION</div>
              <div>
                <div className="make">{activeCar.make}</div>
                <h3>{activeCar.model}</h3>
              </div>
              <div className="spec-grid">
                <div><span>POWER</span><strong>{activeCar.power}<small> hp</small></strong></div>
                <div><span>0–60 MPH</span><strong>{activeCar.zeroSixty.toFixed(1)}<small> s</small></strong></div>
                <div><span>TOP SPEED</span><strong>{activeCar.topSpeed}<small> mph</small></strong></div>
                <div><span>TORQUE</span><strong>{activeCar.torque}<small> lb-ft</small></strong></div>
              </div>
              <div className="engine-line"><span>ENGINE</span><strong>{activeCar.engine}</strong></div>
              <div className="price-row"><span>Acquisition</span><strong>{activeCar.price}</strong></div>
              <button className="outline-btn" onClick={() => openBooking(activeCar)}>Private viewing <span>↗</span></button>
            </div>
          </div>

          <div className="car-strip">
            {cars.map(car => (
              <button key={car.id} className={`car-thumb ${activeCar.id === car.id ? 'active' : ''}`} onClick={() => setActiveCar(car)}>
                <img src={car.image} alt="" />
                <span><b>{car.make}</b>{car.model}</span>
                <small>{car.year} <i>BL-{car.accent}</i></small>
              </button>
            ))}
          </div>
        </section>

        <section className="manifesto" id="about">
          <div className="manifesto-image reveal">
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=88" alt="Sports car interior" />
            <div className="manifesto-caption">04:27 / empty roads</div>
          </div>
          <div className="manifesto-copy">
            <span className="eyebrow-dark reveal">02 / THE HOUSE</span>
            <h2 className="reveal delay-1">We believe the right car<br />should make you <em>look back.</em></h2>
            <p className="reveal delay-2">Blackline is an independent automotive house for collectors, enthusiasts, and people who would rather feel something than simply own something.</p>
            <div className="rule reveal delay-3" />
            <div className="manifesto-stats reveal delay-3">
              <div><strong>18</strong><span>Cars in rotation</span></div>
              <div><strong>11</strong><span>Countries sourced from</span></div>
              <div><strong>10+</strong><span>Years independent</span></div>
            </div>
          </div>
        </section>

        <section className="journal section" id="journal">
          <div className="section-head reveal">
            <div><span className="eyebrow-dark">03 / JOURNAL</span><h2>Notes from<br /><em>the road.</em></h2></div>
            <a className="text-link dark" href="#top">Read journal <span>↗</span></a>
          </div>
          <div className="journal-grid">
            <article className="journal-card reveal">
              <div className="journal-image"><img src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=88" alt="Driving at night" /><span>01</span></div>
              <div className="journal-meta"><span>FIELD NOTES</span><time>06.09.26</time></div>
              <h3>Why the best drives happen after everyone else goes home.</h3>
              <a href="#top">Read story ↗</a>
            </article>
            <article className="journal-card reveal delay-1">
              <div className="journal-image"><img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=88" alt="Classic performance car" /><span>02</span></div>
              <div className="journal-meta"><span>THE EDIT</span><time>28.08.26</time></div>
              <h3>The quiet thrill of a car built for one purpose.</h3>
              <a href="#top">Read story ↗</a>
            </article>
            <article className="journal-card reveal delay-2">
              <div className="journal-image"><img src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=88" alt="Luxury sports car" /><span>03</span></div>
              <div className="journal-meta"><span>GARAGE</span><time>12.08.26</time></div>
              <h3>Five details we look for before a car enters Blackline.</h3>
              <a href="#top">Read story ↗</a>
            </article>
          </div>
        </section>

        <section className="cta">
          <div className="cta-bg" />
          <div className="cta-content reveal">
            <span className="eyebrow">PRIVATE BY DESIGN</span>
            <h2>Come see<br /><em>what moves you.</em></h2>
            <button className="btn btn-light" onClick={() => openBooking(activeCar)}>Arrange a private viewing <span>↗</span></button>
          </div>
          <div className="cta-footer"><span>BLACKLINE MOToring / CAIRO</span><span>By appointment only</span></div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <a href="#top" className="brand"><span className="brand-mark" /><span>BLACKLINE</span></a>
          <p>A private automotive house for people<br />who know what they like.</p>
        </div>
        <div className="footer-links">
          <div><span>EXPLORE</span><a href="#collection">Collection</a><a href="#about">The House</a><a href="#journal">Journal</a></div>
          <div><span>CONTACT</span><a href="mailto:hello@blackline.example">hello@blackline.example</a><a href="tel:+201000000000">+20 10 0000 0000</a><a href="#top">Cairo, Egypt</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 BLACKLINE MOToring</span><span>Designed for the driven.</span></div>
      </footer>

      {showBooking && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowBooking(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" ref={modalRef} tabIndex={-1}>
            <div className="modal-pass">
              <span>BLACKLINE // ACCESS PASS</span>
              <span>BL-{activeCar.accent}</span>
            </div>
            <button className="modal-close" onClick={() => setShowBooking(false)} aria-label="Close">×</button>
            <div className="modal-eyebrow">PRIVATE VIEWING</div>
            <h2 id="booking-title">Let's find your<br /><em>next drive.</em></h2>
            <p>Tell us a little about what you're looking for. We'll arrange the rest.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Name<input required name="name" placeholder="Your name" /></label>
                <label>Phone<input required name="phone" placeholder="+20 …" /></label>
              </div>
              <label>Vehicle<select name="car" value={activeCar.id} onChange={(e) => setActiveCar(cars.find(c => c.id === e.target.value) || activeCar)}>{cars.map(c => <option key={c.id} value={c.id}>{c.make === 'BMW M' ? 'BMW' : c.make} {c.model}</option>)}</select></label>
              <div className="form-row">
                <label>Preferred day<input type="date" name="date" /></label>
                <label>Time<select name="time"><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
              </div>
              <label>Message<textarea name="message" rows="3" placeholder="Anything you'd like us to know?" /></label>
              <button className="btn btn-light submit" type="submit">Send request <span>↗</span></button>
              {notice && <div className="notice">{notice}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

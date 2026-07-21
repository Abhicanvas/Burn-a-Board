import { useState } from 'react';
import Register from './Register';

const rules = [
  'Participants must bring their own electronic components, sensors, development boards, and other required hardware',
  'Participants are encouraged to bring their own laptops and necessary software/tools',
  'Technical guidance and mentorship will be provided by the organizing team and mentors',
  'Basic tools and common equipment may be available at the venue, subject to availability',
  'Participants should bring necessary chargers, adapters, USB cables, and other essential accessories',
  'Food and accommodation will be provided',
  'Participants are expected to maintain discipline and safety standards',
  'Use of hazardous, high-voltage, or unsafe equipment requires prior approval from the organizing team',
  'The decision of the judging panel shall be final and binding'
];
const tracks = [['TRK-01', 'AGRICULTURE & WATER', 'Soil moisture, irrigation control, crop/storage monitoring, water quality & handpump sensing.'], ['TRK-02', 'POWER & ENERGY', 'Solar charge controllers, off-grid battery & microgrid monitoring.'], ['TRK-03', 'HEALTHCARE & SAFETY', 'Portable vital-sign monitors, flood/landslide early warning.'], ['TRK-04', 'EDUCATION & CONNECTIVITY', 'Rugged low-power teaching aids, rural connectivity solutions.']];
const sdgs = [['SDG-01', 'No Poverty', 'Low-cost tools for underserved communities'], ['SDG-04', 'Quality Education', 'Hands-on engineering beyond the classroom'], ['SDG-05', 'Gender Equality', 'Encourages participation by women in hardware'], ['SDG-08', 'Decent Work', 'Builds job-ready technical skills'], ['SDG-09', 'Industry & Infrastructure', 'Hardware innovation using institutional facilities'], ['SDG-11', 'Sustainable Communities', 'Agriculture, water, power, safety solutions'], ['SDG-17', 'Partnerships', 'Multi-institution, IEEE, and IDEA LAB collaboration']];
const provisions = [['SUPPLY-01', 'Meals', 'breakfast, lunch, dinner, refreshments'], ['SUPPLY-02', 'Rest', 'overnight accommodation & resting areas'], ['SUPPLY-03', 'Support', 'continuous technical & volunteer staff'], ['SUPPLY-04', 'Prize Pool', '₹50,000 across top teams']];

function App() {
  if (window.location.pathname === '/register') return <Register />;

  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ['Home', 'About', 'Tracks', 'FAQ'];
  const impactPoints = [
    'Positions FISAT as an outward-facing innovation centre',
    'Generates SDG-mapped outcomes for accreditation',
    'Strengthens IEEE FISAT Student Branch’s regional standing',
    'Showcases IDEA LAB to a wider student audience',
    'Opens alumni & industry engagement as mentors or sponsors',
  ];

  return (
    <div className="site">
      <div className="bokeh bokeh-one" />
      <div className="bokeh bokeh-two" />

      <SiteHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((current) => !current)}
        onNavigate={() => setMenuOpen(false)}
        navItems={navItems}
      />

      <main id="home">
        <Hero />
        <PartnerStrip />
        <AboutSection />
        <ObjectivesSection />
        <TracksSection />
        <ScheduleSection />
        <SponsorsSection />
        <SupportSection />
        <ImpactSection impactPoints={impactPoints} />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader({ menuOpen, onToggleMenu, onNavigate, navItems }) {
  return (
    <header className="sphere-nav">
      <a className="sphere-wordmark" href="#home">
        <img src="/img/logos/ieee logo.png" alt="" />
      </a>

      <nav className={menuOpen ? 'sphere-links open' : 'sphere-links'}>
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={onNavigate}>
            {item}
          </a>
        ))}
      </nav>

      <a className="sphere-register" href="/register">
        Register
      </a>

      <button className="sphere-menu" onClick={onToggleMenu} aria-label="Open navigation">
        <i />
        <i />
      </button>
    </header>
  );
}

function PartnerStrip() {
  return (
    <div className="partner-strip">
      <div className="partner-collab">
        <img className="partner-logo partner-logo-sb" src="/img/logos/sb%20logo.png" alt="IEEE FISAT Student Branch" />
        <span className="partner-collab-x" aria-hidden="true">
          X
        </span>
        <img className="partner-logo partner-logo-idealab" src="/img/logos/idealab.png" alt="IDEA LAB" />
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="data-section overview" id="about">
      <SectionFrame code="SEC.01" title="SYSTEM OVERVIEW">
        <div className="overview-grid">
          <dl className="spec-strip">
            <Spec label="EVENT ID" value="BURN-A-BOARD" />
            <Spec label="DURATION" value="24H CONTINUOUS" />
            <Spec label="DATE" value="08–09 AUG 2026" />
            <Spec label="VENUE" value="IDEA LAB, FISAT" />
            <Spec label="TEAMS" value="15 × 4" />
          </dl>

          <div className="overview-copy">
            <p>
              Burn-a-Board is a <em>24-hour electronics hackathon</em> organized by{' '}
              <em>IDEA LAB, FISAT</em> in collaboration with{' '}
              <em>IEEE FISAT Student Branch</em>, themed <em>“Innovation for Rural India.”</em>
            </p>

            <p>
              The hackathon brings together students, innovators, and makers to design, prototype, and demonstrate{' '}
              <em>real hardware solutions—not software demos</em> that address practical challenges in{' '}
              <em>agriculture, healthcare, water, power, education, and disaster response.</em>
            </p>

            <p>
              Over the course of 24 hours, participating teams transform innovative ideas into working hardware prototypes,
              applying electronics and embedded systems to create impactful solutions for rural communities.
            </p>

            <p>
              Burn-a-Board is a platform to innovate, build, test, and showcase solutions that make a real difference through
              technology.
            </p>

            <div className="leader-note">
              <i />
              <span>
                REF-A1 / ONE CONTINUOUS BUILD
                <br />
                <b>from rural need to working circuit</b>
              </span>
            </div>
          </div>
        </div>
      </SectionFrame>
    </section>
  );
}

function ObjectivesSection() {
  return (
  <section className="data-section" id="rules">
    <SectionFrame code="SEC.02" title="RULES & REGULATIONS">
      <div className="pin-list">
        {rules.map((item, index) => (
          <div key={item}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </SectionFrame>
  </section>
);
}

function TracksSection() {
  return (
    <section className="data-section track-specs" id="tracks">
      <SectionFrame code="SEC.03" title="TRACK SPECIFICATIONS">
        <div className="track-board">
          <div className="board-diagram">
            <span />
            <span />
            <span />
            <span />
            <b>BB / PCB-01</b>
          </div>

          {tracks.map(([code, title, copy], index) => (
            <article className={`track-callout track-${index + 1}`} key={code}>
              <i />
              <small>[ {code} ]</small>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </SectionFrame>
    </section>
  );
}

function ScheduleSection() {
  return (
    <section className="data-section revision" id="schedule">
      <SectionFrame code="SEC.04" title="REV. NOTES">
        <div className="revision-block">
          <p>— Hardware-only: no software demos, no slideware.</p>
          <p>— Access to IDEA LAB fabrication &amp; test rigs.</p>
          <p>— Mentorship-driven evaluation, not just a scoreboard.</p>
          <p>— Strong builds route to IEEE papers / SIH entries.</p>
        </div>
      </SectionFrame>
    </section>
  );
}

function SponsorsSection() {
  return (
    <section className="data-section matrix" id="sponsors">
      <SectionFrame code="SEC.05" title="COMPLIANCE MATRIX">
        <p className="data-intro">
          Rural-theme outcomes mapped to the UN Sustainable Development Goals, supporting NAAC, NBA, and NIRF documentation.
        </p>

        <table>
          <thead>
            <tr>
              <th>CODE</th>
              <th>GOAL</th>
              <th>MAPPING</th>
            </tr>
          </thead>
          <tbody>
            {sdgs.map(([code, goal, mapping]) => (
              <tr key={code}>
                <td>{code}</td>
                <td>{goal}</td>
                <td>{mapping}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionFrame>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="data-section" id="support">
      <SectionFrame code="SEC.06" title="PROVISIONING LIST">
        <div className="pin-list manifest">
          {provisions.map(([code, title, copy]) => (
            <div key={code}>
              <b>[ {code} ]</b>
              <span>
                <strong>{title}</strong> — {copy}
              </span>
            </div>
          ))}
        </div>

        <p className="data-note">Certificates of participation and merit awarded to all qualifying teams.</p>
      </SectionFrame>
    </section>
  );
}

function ImpactSection({ impactPoints }) {
  return (
    <section className="data-section impact-log">
      <SectionFrame code="SEC.07" title="IMPACT LOG">
        <div className="log-list">
          {impactPoints.map((item) => (
            <p key={item}>
              <i />
              {item}
            </p>
          ))}
        </div>
      </SectionFrame>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="boot-sequence" id="faq">
      <div className="boot-lines">
        <p>&gt; initializing burn-a-board_2026...</p>
        <p>
          &gt; registration_status: <b>OPEN</b>
        </p>
        <p>&gt; seats_remaining: LIMITED</p>
      </div>

      <h2>REGISTER TO BUILD</h2>
      <a className="data-cta" href="/register">
        Register Now →
      </a>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="reference-panel">
      <div>
        <small>ADDRESS</small>
        <p>
          IDEA LAB, FISAT
          <br />
          Angamaly, Kerala
        </p>
      </div>

      <div>
        <small>LINKS</small>
        <p>
          <a href="#about">About</a> · <a href="#tracks">Tracks</a> · <a href="#schedule">Schedule</a> ·{' '}
          <a href="#sponsors">Sponsors</a>
        </p>
      </div>

      <div>
        <small>CONNECT</small>
        <p>
          Instagram · LinkedIn · Facebook
          <br />
          ieeefisat.org
        </p>
      </div>

      <p className="copyright">© 2026 IEEE_FISAT_STUDENT_BRANCH — BURN-A-BOARD</p>
    </footer>
  );
}

function Hero() {
  return (
    <section className="sphere-hero">
      <div className="sphere-heading">
        <p className="eyebrow">
          <i /> IEEE FISAT × IDEA LAB
        </p>
        <h1>
          <span>BURN-A-BOARD</span>
        </h1>
        <p>24-HOUR ELECTRONICS HACKATHON</p>
        <div className="hero-meta">
          <b>08 – 09 AUGUST 2026</b>
          <span>·</span>
          <strong>FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY</strong>
        </div>
      </div>

      <div className="pcb-hero-object">
        <img src="/img/hero.png" alt="Photorealistic matte charcoal PCB with warm orange circuit traces" />
      </div>

      <FeatureCard className="feature-tl" title="PRIZE POOL">
        ₹50,000 distributed among the top teams by an expert judging panel.
      </FeatureCard>
      <FeatureCard className="feature-tr" title="24 HOURS">
        One continuous build — from rural problem statement to working circuit demo.
      </FeatureCard>
      <FeatureCard className="feature-ml" title="MEALS + REST">
        Breakfast, lunch, dinner, refreshments, overnight accommodation, and resting facilities covered.
      </FeatureCard>
      <FeatureCard className="feature-mr" title="IDEA LAB ACCESS">
        IDEA LAB fabrication tools, testing infrastructure, mentors, and volunteer support throughout.
      </FeatureCard>

      <div className="sphere-tagline">
        <strong>
          UNMATCHED HACKATHON
          <br />
          EXPERIENCE
        </strong>
        <a href="#about" aria-label="Scroll to about">
          ↘
        </a>
      </div>

      <img className="hero-idealab-logo" src="/img/logos/clg clr.png" alt="IDEA LAB" />
    </section>
  );
}

function SectionFrame({ code, title, children }) {
  return (
    <div className="data-frame">
      <div className="frame-tag">
        [ {code} — {title} ]<span>_</span>
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function FeatureCard({ className, title, children }) {
  return (
    <article className={`feature-card ${className}`}>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export default App;

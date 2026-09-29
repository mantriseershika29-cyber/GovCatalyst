import { useState } from "react";
import "./Home.css";
import heroImage from "../../assets/hero.png";

export default function Home({ setPage }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const languages = [
    "English",
    "हिन्दी",
    "తెలుగు",
    "தமிழ்",
    "ಕನ್ನಡ",
    "മലയാളം",
    "मराठी",
    "বাংলা",
    "ગુજરાતી",
    "ਪੰਜਾਬੀ",
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  return (
    <div className="home-page">

      {/* ================= TOP GOVERNMENT BAR ================= */}

      <div className="home-topbar">
        <div className="home-container topbar-inner">

          <div className="government-text">
            Government of India
          </div>

          <div className="topbar-right">

            {/* LANGUAGE */}
            <div className="language-wrapper">

              <button
                className="language-button"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                🌐 English
                <span>⌄</span>
              </button>

              {languageOpen && (
                <div className="language-menu">

                  <div className="language-menu-title">
                    Select Language
                  </div>

                  <div className="language-list">

                    {languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => setLanguageOpen(false)}
                      >
                        {language}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            </div>

            <button className="top-link">
              Accessibility
            </button>

            <button
              className="top-login"
              onClick={() => setPage("login")}
            >
              Login
            </button>

            <button
              className="top-register"
              onClick={() => setPage("login")}
            >
              Register
            </button>

          </div>

        </div>
      </div>


      {/* ================= MAIN HEADER ================= */}

      <header className="home-header">

        <div className="home-container header-inner">

          {/* LOGO */}

          <div
            className="brand"
            onClick={() => setPage("home")}
          >

            <div className="brand-symbol">
              G
            </div>

            <div>

              <div className="brand-name">
                GovCatalyst
              </div>

              <div className="brand-tagline">
                Government • Innovation • Startups
              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="header-search">

            <input
              type="text"
              placeholder="Search GovCatalyst"
            />

            <button>
              🔍
            </button>

          </div>


          {/* MOBILE MENU */}

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

      </header>


      {/* ================= NAVIGATION ================= */}

      <nav className={`home-navigation ${menuOpen ? "open" : ""}`}>

        <div className="home-container nav-inner">

          <button
            className="nav-item active"
            onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth"
            })}
          >
            Home
          </button>

          <button
            className="nav-item"
            onClick={() => scrollToSection("challenges")}
          >
            Challenges
          </button>

          <button
            className="nav-item"
            onClick={() => scrollToSection("ecosystem")}
          >
            Ecosystem
          </button>

          <button
            className="nav-item"
            onClick={() => scrollToSection("procurement")}
          >
            Procurement
          </button>

          <button
            className="nav-item"
            onClick={() => scrollToSection("resources")}
          >
            Resources
          </button>

          <button
            className="nav-item"
            onClick={() => scrollToSection("about")}
          >
            About GovCatalyst
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="home-container hero-content">

          <div className="hero-left">

            <div className="hero-label">
              PUBLIC INNOVATION PLATFORM
            </div>

            <h1>
              Connecting
              <span> Government </span>
              with Innovation
            </h1>

            <p>
              GovCatalyst helps government departments discover,
              evaluate, pilot and procure innovative startup
              solutions for real-world public challenges.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() => setPage("role")}
              >
                Explore GovCatalyst
                <span>→</span>
              </button>

              <button
                className="secondary-button"
                onClick={() => setPage("login")}
              >
                Join the Platform
              </button>

            </div>

            <div className="hero-note">
              A structured bridge between public challenges
              and startup innovation.
            </div>

          </div>


          {/* HERO IMAGE */}

          <div className="hero-visual">

            <img
              src={heroImage}
              alt="GovCatalyst innovation"
              className="hero-image"
            />

            <div className="hero-floating-card government-card">

              <div className="floating-icon">
                🏛️
              </div>

              <div>
                <strong>Government</strong>
                <small>Public Challenges</small>
              </div>

            </div>


            <div className="hero-floating-card startup-card">

              <div className="floating-icon">
                🚀
              </div>

              <div>
                <strong>Startups</strong>
                <small>Innovative Solutions</small>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="stats-section">

        <div className="home-container stats-grid">

          <div className="stat-box">
            <strong>01</strong>
            <span>Connected Platform</span>
          </div>

          <div className="stat-box">
            <strong>02</strong>
            <span>Government + Startup Roles</span>
          </div>

          <div className="stat-box">
            <strong>04</strong>
            <span>Core Innovation Stages</span>
          </div>

          <div className="stat-box">
            <strong>01</strong>
            <span>End-to-End Procurement Journey</span>
          </div>

        </div>

      </section>


      {/* ================= INTRO ================= */}

      <section className="intro-section">

        <div className="home-container">

          <div className="section-heading">

            <span>
              THE PROBLEM WE SOLVE
            </span>

            <h2>
              Making Public Procurement
              <br />
              More Connected & Accessible
            </h2>

            <p>
              Government departments often face real-world problems
              while innovative startups have solutions that are difficult
              to discover, evaluate and take into public procurement.
              GovCatalyst creates a structured bridge between the two,
              helping departments identify needs, discover relevant
              solutions, evaluate pilots and move toward procurement.
            </p>

          </div>

        </div>

      </section>


      {/* ================= PROBLEM TO SOLUTION ================= */}

      <section className="how-section" id="problem-solution">
        <div className="home-container">

          <div className="section-heading centered">
            <span>
              HOW GOVCATALYST ADDRESSES THE GAP
            </span>

            <h2>
              From Government Need to
              <br />
              Startup-Led Public Impact
            </h2>

            <p>
              GovCatalyst connects the key stages that are often fragmented
              across the innovation and procurement journey.
            </p>
          </div>

          <div className="process-grid">

            <div className="process-card">
              <div className="process-number">01</div>
              <div className="process-icon">🏛️</div>
              <h3>Identify the Need</h3>
              <p>
                Government departments define a real public challenge,
                requirements and the outcome they need.
              </p>
            </div>

            <div className="process-line" />

            <div className="process-card">
              <div className="process-number">02</div>
              <div className="process-icon">🔎</div>
              <h3>Discover Solutions</h3>
              <p>
                Relevant startup solutions can be surfaced against the
                department's challenge instead of relying only on manual discovery.
              </p>
            </div>

            <div className="process-line" />

            <div className="process-card">
              <div className="process-number">03</div>
              <div className="process-icon">🧪</div>
              <h3>Evaluate & Pilot</h3>
              <p>
                Shortlisted solutions can be assessed through structured
                evaluation and pilot programs before wider adoption.
              </p>
            </div>

            <div className="process-line" />

            <div className="process-card">
              <div className="process-number">04</div>
              <div className="process-icon">📋</div>
              <h3>Procure & Scale</h3>
              <p>
                Solutions that meet the required outcomes can move toward
                transparent procurement and wider public deployment.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= CHALLENGES ================= */}

      <section
        className="challenges-section"
        id="challenges"
      >

        <div className="home-container">

          <div className="section-heading">

            <span>
              INNOVATION OPPORTUNITIES
            </span>

            <h2>
              Explore Public Challenges
            </h2>

            <p>
              Discover areas where technology and startup
              innovation can create measurable public impact.
            </p>

          </div>


          <div className="challenge-grid">

            <div className="challenge-card">

              <div className="challenge-icon">
                🌾
              </div>

              <h3>
                Agriculture & Rural Development
              </h3>

              <p>
                Discover innovative solutions for farming,
                rural services and food systems.
              </p>

              <button>
                Explore Challenges →
              </button>

            </div>


            <div className="challenge-card">

              <div className="challenge-icon">
                🏥
              </div>

              <h3>
                Healthcare & Public Health
              </h3>

              <p>
                Find startup solutions that can improve
                healthcare delivery and accessibility.
              </p>

              <button>
                Explore Challenges →
              </button>

            </div>


            <div className="challenge-card">

              <div className="challenge-icon">
                🏙️
              </div>

              <h3>
                Smart Cities & Infrastructure
              </h3>

              <p>
                Explore technology for smarter, safer
                and more sustainable communities.
              </p>

              <button>
                Explore Challenges →
              </button>

            </div>

          </div>


          <div className="center-button">

            <button
              className="outline-button"
              onClick={() => setPage("role")}
            >
              View All Opportunities
            </button>

          </div>

        </div>

      </section>


      {/* ================= ECOSYSTEM ================= */}

      <section
        className="ecosystem-section"
        id="ecosystem"
      >

        <div className="home-container">

          <div className="section-heading centered">

            <span>
              ONE CONNECTED ECOSYSTEM
            </span>

            <h2>
              Built for Every Innovation Stakeholder
            </h2>

            <p>
              GovCatalyst brings the key participants of
              public innovation onto one platform.
            </p>

          </div>


          <div className="ecosystem-grid">

            <div className="ecosystem-card">

              <div className="ecosystem-icon">
                🏛️
              </div>

              <h3>
                Government Departments
              </h3>

              <p>
                Publish challenges and discover solutions
                for public-sector needs.
              </p>

              <button>
                Learn More →
              </button>

            </div>


            <div className="ecosystem-card">

              <div className="ecosystem-icon">
                🚀
              </div>

              <h3>
                Startups
              </h3>

              <p>
                Showcase your solution and access
                government opportunities.
              </p>

              <button>
                Learn More →
              </button>

            </div>


            <div className="ecosystem-card">

              <div className="ecosystem-icon">
                🤝
              </div>

              <h3>
                Innovation Partners
              </h3>

              <p>
                Connect startups, departments,
                incubators and ecosystem partners.
              </p>

              <button>
                Learn More →
              </button>

            </div>


            <div className="ecosystem-card">

              <div className="ecosystem-icon">
                📊
              </div>

              <h3>
                Evaluation & Insights
              </h3>

              <p>
                Track pilots, outcomes and innovation
                performance.
              </p>

              <button>
                Learn More →
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PROCUREMENT ================= */}

      <section
        className="procurement-section"
        id="procurement"
      >

        <div className="home-container procurement-content">

          <div>

            <span className="section-label-light">
              GOVERNMENT PROCUREMENT
            </span>

            <h2>
              From Innovation
              <br />
              to Implementation
            </h2>

            <p>
              GovCatalyst provides a structured path from a
              government challenge to solution discovery, evaluation,
              piloting, procurement and wider deployment.
            </p>

          </div>


          <div className="procurement-steps">

            <div>
              <strong>01</strong>
              <span>Discover</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Evaluate</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Pilot</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Procure</span>
            </div>

            <div>
              <strong>05</strong>
              <span>Scale</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= RESOURCES ================= */}

      <section
        className="resources-section"
        id="resources"
      >

        <div className="home-container">

          <div className="section-heading centered">

            <span>
              RESOURCES
            </span>

            <h2>
              Navigate Public Innovation
            </h2>

            <p>
              Tools and information to help government
              departments and startups participate effectively.
            </p>

          </div>


          <div className="resource-grid">

            <div className="resource-card">
              <span>📘</span>
              <h3>Innovation Guide</h3>
              <p>
                Understand the GovCatalyst innovation journey.
              </p>
              <button>Read Guide →</button>
            </div>

            <div className="resource-card">
              <span>📋</span>
              <h3>Procurement Guide</h3>
              <p>
                Learn how solutions can move from pilot to procurement.
              </p>
              <button>Read Guide →</button>
            </div>

            <div className="resource-card">
              <span>❓</span>
              <h3>Frequently Asked Questions</h3>
              <p>
                Find answers about the GovCatalyst platform.
              </p>
              <button>View FAQs →</button>
            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="home-container about-content">

          <div>

            <span>
              ABOUT GOVCATALYST
            </span>

            <h2>
              Making Government Innovation
              <br />
              More Connected
            </h2>

          </div>

          <p>
            GovCatalyst is designed as a structured public
            innovation platform where government departments
            can identify challenges and startups can present
            solutions. The platform connects discovery,
            evaluation, piloting and procurement into one
            coordinated journey.
          </p>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="home-container cta-content">

          <div>

            <span>
              JOIN THE GOVCATALYST ECOSYSTEM
            </span>

            <h2>
              Have a Public Challenge
              <br />
              or an Innovative Solution?
            </h2>

          </div>


          <div className="cta-buttons">

            <button
              className="primary-button"
              onClick={() => setPage("login")}
            >
              Get Started →
            </button>

            <button
              className="secondary-button"
              onClick={() => setPage("role")}
            >
              Explore Platform
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-container footer-grid">

          <div className="footer-brand">

            <div className="footer-logo">
              G
            </div>

            <h3>
              GovCatalyst
            </h3>

            <p>
              A public innovation platform connecting
              government challenges with startup solutions.
            </p>

          </div>


          <div className="footer-column">

            <h4>
              Platform
            </h4>

            <button onClick={() => scrollToSection("challenges")}>Challenges</button>
            <button onClick={() => setPage("role")}>Startups</button>
            <button onClick={() => setPage("role")}>Government</button>
            <button onClick={() => scrollToSection("procurement")}>Procurement</button>

          </div>


          <div className="footer-column">

            <h4>
              Resources
            </h4>

            <button onClick={() => scrollToSection("resources")}>Innovation Guide</button>
            <button onClick={() => scrollToSection("procurement")}>Procurement Guide</button>
            <button onClick={() => scrollToSection("resources")}>FAQs</button>
            <button onClick={() => setPage("login")}>Help Centre</button>

          </div>


          <div className="footer-column">

            <h4>
              GovCatalyst
            </h4>

            <button onClick={() => scrollToSection("about")}>About Us</button>
            <button onClick={() => setPage("login")}>Contact</button>
            <button onClick={() => scrollToSection("about")}>Privacy Policy</button>
            <button onClick={() => scrollToSection("about")}>Terms of Use</button>

          </div>

        </div>


        <div className="footer-bottom">

          <div className="home-container">
            © 2026 GovCatalyst. Public Innovation Platform.
          </div>

        </div>

      </footer>

    </div>
  );
}
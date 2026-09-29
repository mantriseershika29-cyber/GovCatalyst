import { useState } from "react";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import "./RoleSelection.css";

function RoleSelection({ setPage }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="role-page">

      {/* ================= GOVERNMENT TOP BAR ================= */}

      <header className="role-government-bar">

        <div className="role-government-brand">

          <div className="role-emblem">
            🇮🇳
          </div>

          <div className="role-government-text">
            <strong>GOVCATALYST</strong>

            <span>
              GOVERNMENT OF INDIA • PUBLIC INNOVATION PLATFORM
            </span>
          </div>

        </div>

        <div className="role-government-right">

          <span>
            Public Innovation & Procurement
          </span>

          <LanguageSelector />

        </div>

      </header>


      {/* ================= MAIN NAVBAR ================= */}

      <nav className="role-navbar">

        <div className="role-navbar-brand">

          <strong>
            GovCatalyst
          </strong>

          <span>
            Innovation & Procurement
          </span>

        </div>


        <div className="role-navbar-actions">

          {/* SEARCH */}

          <div className="role-search-box">

            <input
              type="text"
              placeholder="Search here"
            />

            <button type="button">
              🔍
            </button>

          </div>


          {/* PROFILE */}

          <div className="role-profile-container">

            <button
              type="button"
              className="role-profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Open profile menu"
            >
              👤
            </button>


            {profileOpen && (

              <div className="role-profile-menu">

                <button type="button">
                  👤
                  <span>
                    View Profile
                  </span>
                </button>

                <button type="button">
                  ✏️
                  <span>
                    Edit Profile
                  </span>
                </button>

                <div className="profile-divider"></div>

                <button type="button">
                  🔗
                  <span>
                    My Connections
                  </span>
                </button>

                <button type="button">
                  🔔
                  <span>
                    Notifications
                  </span>
                </button>

                <button type="button">
                  ⚙️
                  <span>
                    Settings
                  </span>
                </button>

                <div className="profile-divider"></div>

                <button
                  type="button"
                  className="profile-logout"
                  onClick={() => {
                    setProfileOpen(false);
                    setPage("login");
                  }}
                >
                  🚪
                  <span>
                    Logout
                  </span>
                </button>

              </div>

            )}

          </div>

        </div>

      </nav>


      {/* ================= MAIN CONTENT ================= */}

      <main className="role-main">

        {/* WELCOME */}

        <section className="role-welcome">

          <span className="role-welcome-tag">
            SECURE GOVCATALYST ACCESS
          </span>

          <h1>
            Welcome to <em>GovCatalyst</em>
          </h1>

          <p>
            Select the role that best describes your organization
            to continue to the innovation and procurement platform.
          </p>

        </section>


        {/* ================= ROLE SELECTION ================= */}

        <section className="role-selection">

          <div className="role-selection-heading">

            <span>
              TELL US WHO YOU ARE? &nbsp; SELECT ONE OF THESE
            </span>

          </div>


          <div className="role-card-container">


            {/* ================= GOVERNMENT ================= */}

            <button
              type="button"
              className="role-selection-card role-government-card"
              onClick={() => setPage("government")}
            >

              <div className="role-card-icon government-role-icon">
                🏛️
              </div>


              <div className="role-card-content">

                <span className="role-card-label">
                  FOR GOVERNMENT DEPARTMENTS
                </span>

                <h2>
                  Government Department
                </h2>

                <p>
                  Discover innovative startup solutions, publish
                  public-sector challenges, evaluate proposals and
                  manage innovation procurement.
                </p>

                <span className="role-card-link">
                  Enter Government Portal
                  <strong>→</strong>
                </span>

              </div>


              <div className="role-card-check">
                ✓
              </div>

            </button>


            {/* ================= STARTUP ================= */}

            <button
              type="button"
              className="role-selection-card role-startup-card"
              onClick={() => setPage("startup")}
            >

              <div className="role-card-icon startup-role-icon">
                🚀
              </div>


              <div className="role-card-content">

                <span className="role-card-label">
                  FOR INNOVATIVE STARTUPS
                </span>

                <h2>
                  Startup
                </h2>

                <p>
                  Showcase your solution, discover government
                  opportunities, apply to public-sector challenges
                  and participate in innovation pilots.
                </p>

                <span className="role-card-link">
                  Enter Startup Portal
                  <strong>→</strong>
                </span>

              </div>


              <div className="role-card-check">
                ✓
              </div>

            </button>

          </div>

        </section>


        {/* ================= INFORMATION STRIP ================= */}

        <section className="role-information">

          <div className="role-information-item">

            <div className="information-icon">
              🔐
            </div>

            <div>

              <strong>
                Secure Access
              </strong>

              <span>
                Protected platform access
              </span>

            </div>

          </div>


          <div className="information-divider"></div>


          <div className="role-information-item">

            <div className="information-icon">
              🤝
            </div>

            <div>

              <strong>
                Government + Startup
              </strong>

              <span>
                Connecting challenges with innovation
              </span>

            </div>

          </div>


          <div className="information-divider"></div>


          <div className="role-information-item">

            <div className="information-icon">
              📋
            </div>

            <div>

              <strong>
                Structured Procurement
              </strong>

              <span>
                From challenge to implementation
              </span>

            </div>

          </div>

        </section>


        {/* ================= BACK BUTTON ================= */}

        <button
          type="button"
          className="role-back-button"
          onClick={() => setPage("login")}
        >
          ← Back to Login
        </button>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="role-footer">

        <span>
          © 2026 GovCatalyst
        </span>

        <span>
          Government • Innovation • Procurement
        </span>

        <span>
          Secure Public Innovation Platform
        </span>

      </footer>

    </div>
  );
}

export default RoleSelection;
import { useMemo, useState } from "react";
import "./StartupDashboard.css";

function StartupDashboard({
  setPage,
  challenges = [],
  proposals = [],
  onSubmitProposal,
}) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    startupName: "",
    contactPerson: "",
    email: "",
    solutionTitle: "",
    solutionDescription: "",
    technology: "",
    proposedBudget: "",
    implementationPlan: "",
  });

  const activeChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.status === "Active"),
    [challenges]
  );

  const startupProposals = useMemo(
    () => proposals,
    [proposals]
  );

  const submittedCount = startupProposals.length;

  const underReviewCount = startupProposals.filter(
    (proposal) => proposal.status === "Under Review"
  ).length;

  const shortlistedCount = startupProposals.filter(
    (proposal) => proposal.status === "Shortlisted"
  ).length;

  const pilotCount = startupProposals.filter(
    (proposal) =>
      proposal.status === "Approved for Pilot" ||
      proposal.status === "Pilot Started" ||
      proposal.status === "Pilot Completed"
  ).length;

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSelectedChallenge(null);
    setShowProposalForm(false);
  };

  // =========================================================
  // VIEW CHALLENGE
  // =========================================================

  const handleViewChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setShowProposalForm(false);
    setActiveSection("challenges");
  };

  // =========================================================
  // START PROPOSAL
  // =========================================================

  const handleStartProposal = (challenge) => {
    setSelectedChallenge(challenge);
    setShowProposalForm(true);
    setActiveSection("challenges");
  };

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleProposalChange = (e) => {
    const { name, value } = e.target;

    setProposalForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT PROPOSAL
  // =========================================================

  const handleProposalSubmit = (e) => {
    e.preventDefault();

    if (!selectedChallenge) {
      return;
    }

    const newProposal = {
      id: `PROP-${Date.now()}`,

      challengeId: selectedChallenge.id,

      challengeTitle: selectedChallenge.title,

      department: selectedChallenge.department,

      startupName: proposalForm.startupName,

      contactPerson: proposalForm.contactPerson,

      email: proposalForm.email,

      solutionTitle: proposalForm.solutionTitle,

      solutionDescription: proposalForm.solutionDescription,

      technology: proposalForm.technology,

      proposedBudget: proposalForm.proposedBudget,

      implementationPlan: proposalForm.implementationPlan,

      submittedAt: new Date().toLocaleString(),

      status: "Submitted",
    };

    onSubmitProposal(newProposal);

    setProposalForm({
      startupName: "",
      contactPerson: "",
      email: "",
      solutionTitle: "",
      solutionDescription: "",
      technology: "",
      proposedBudget: "",
      implementationPlan: "",
    });

    setShowProposalForm(false);
    setSelectedChallenge(null);
    setActiveSection("proposals");
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    if (status === "Submitted") {
      return "status-submitted";
    }

    if (status === "Under Review") {
      return "status-review";
    }

    if (status === "Shortlisted") {
      return "status-shortlisted";
    }

    if (status === "Approved for Pilot") {
      return "status-approved";
    }

    if (status === "Pilot Started") {
      return "status-pilot";
    }

    if (status === "Pilot Completed") {
      return "status-completed";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "status-default";
  };

  // =========================================================
  // DASHBOARD
  // =========================================================

  const renderDashboard = () => {
    return (
      <>
        <div className="startup-welcome">
          <div>
            <span className="startup-eyebrow">
              STARTUP INNOVATION PORTAL
            </span>

            <h1>Welcome to GovCatalyst</h1>

            <p>
              Discover government challenges, submit your solution,
              participate in pilots and scale your innovation through
              public procurement.
            </p>
          </div>

          <button
            className="primary-startup-button"
            onClick={() => handleNavigation("challenges")}
          >
            Browse Challenges →
          </button>
        </div>

        <div className="startup-stats-grid">
          <div className="startup-stat-card">
            <div className="startup-stat-icon">🔎</div>
            <div>
              <span>Active Challenges</span>
              <strong>{activeChallenges.length}</strong>
            </div>
          </div>

          <div className="startup-stat-card">
            <div className="startup-stat-icon">📄</div>
            <div>
              <span>My Proposals</span>
              <strong>{submittedCount}</strong>
            </div>
          </div>

          <div className="startup-stat-card">
            <div className="startup-stat-icon">⏳</div>
            <div>
              <span>Under Review</span>
              <strong>{underReviewCount}</strong>
            </div>
          </div>

          <div className="startup-stat-card">
            <div className="startup-stat-icon">🚀</div>
            <div>
              <span>Selected / Pilot</span>
              <strong>{shortlistedCount + pilotCount}</strong>
            </div>
          </div>
        </div>

        <section className="startup-section-card">
          <div className="startup-section-header">
            <div>
              <span className="startup-section-label">
                OPPORTUNITIES
              </span>

              <h2>Latest Government Challenges</h2>
            </div>

            <button
              className="text-button"
              onClick={() => handleNavigation("challenges")}
            >
              View All →
            </button>
          </div>

          <div className="challenge-preview-grid">
            {activeChallenges.slice(0, 3).map((challenge) => (
              <div className="challenge-preview-card" key={challenge.id}>
                <div className="challenge-card-top">
                  <span className="challenge-id">
                    {challenge.id}
                  </span>

                  <span className="active-badge">
                    Active
                  </span>
                </div>

                <span className="challenge-category">
                  {challenge.category}
                </span>

                <h3>{challenge.title}</h3>

                <p>{challenge.description}</p>

                <div className="challenge-meta">
                  <span>💰 {challenge.budget}</span>
                  <span>📅 {challenge.deadline}</span>
                </div>

                <button
                  className="outline-startup-button"
                  onClick={() => handleViewChallenge(challenge)}
                >
                  View Challenge
                </button>
              </div>
            ))}

            {activeChallenges.length === 0 && (
              <div className="empty-startup-state">
                <div>📭</div>
                <h3>No active challenges</h3>
                <p>
                  Government departments have not published any
                  active challenges yet.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="startup-section-card">
          <div className="startup-section-header">
            <div>
              <span className="startup-section-label">
                YOUR ACTIVITY
              </span>

              <h2>Recent Proposals</h2>
            </div>

            <button
              className="text-button"
              onClick={() => handleNavigation("proposals")}
            >
              View All →
            </button>
          </div>

          {startupProposals.length === 0 ? (
            <div className="empty-startup-state compact">
              <div>📄</div>
              <h3>No proposals submitted yet</h3>
              <p>
                Browse government challenges and submit your first
                proposal.
              </p>
            </div>
          ) : (
            <div className="proposal-list">
              {startupProposals.slice(0, 4).map((proposal) => (
                <div className="proposal-row" key={proposal.id}>
                  <div>
                    <span className="proposal-id">
                      {proposal.id}
                    </span>

                    <h3>{proposal.solutionTitle}</h3>

                    <p>{proposal.challengeTitle}</p>
                  </div>

                  <span
                    className={`proposal-status ${getStatusClass(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  // =========================================================
  // CHALLENGES
  // =========================================================

  const renderChallenges = () => {
    if (selectedChallenge && showProposalForm) {
      return (
        <section className="startup-section-card proposal-form-card">
          <div className="startup-section-header">
            <div>
              <span className="startup-section-label">
                SUBMIT PROPOSAL
              </span>

              <h2>{selectedChallenge.title}</h2>

              <p className="section-description">
                Submit your startup solution for this government
                challenge.
              </p>
            </div>

            <button
              className="back-button"
              onClick={() => {
                setShowProposalForm(false);
              }}
            >
              ← Back
            </button>
          </div>

          <div className="selected-challenge-summary">
            <div>
              <span>Challenge</span>
              <strong>{selectedChallenge.title}</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>{selectedChallenge.department}</strong>
            </div>

            <div>
              <span>Budget</span>
              <strong>{selectedChallenge.budget}</strong>
            </div>

            <div>
              <span>Deadline</span>
              <strong>{selectedChallenge.deadline}</strong>
            </div>
          </div>

          <form
            className="proposal-form"
            onSubmit={handleProposalSubmit}
          >
            <div className="form-section-title">
              Startup Information
            </div>

            <div className="form-grid">
              <div className="startup-form-group">
                <label>Startup Name *</label>

                <input
                  name="startupName"
                  value={proposalForm.startupName}
                  onChange={handleProposalChange}
                  placeholder="Enter startup name"
                  required
                />
              </div>

              <div className="startup-form-group">
                <label>Contact Person *</label>

                <input
                  name="contactPerson"
                  value={proposalForm.contactPerson}
                  onChange={handleProposalChange}
                  placeholder="Enter contact person"
                  required
                />
              </div>

              <div className="startup-form-group">
                <label>Email *</label>

                <input
                  type="email"
                  name="email"
                  value={proposalForm.email}
                  onChange={handleProposalChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="startup-form-group">
                <label>Proposed Budget</label>

                <input
                  name="proposedBudget"
                  value={proposalForm.proposedBudget}
                  onChange={handleProposalChange}
                  placeholder="Example: ₹18,00,000"
                />
              </div>
            </div>

            <div className="form-section-title">
              Solution Information
            </div>

            <div className="startup-form-group">
              <label>Solution Title *</label>

              <input
                name="solutionTitle"
                value={proposalForm.solutionTitle}
                onChange={handleProposalChange}
                placeholder="Enter your solution title"
                required
              />
            </div>

            <div className="startup-form-group">
              <label>Solution Description *</label>

              <textarea
                name="solutionDescription"
                value={proposalForm.solutionDescription}
                onChange={handleProposalChange}
                placeholder="Describe how your solution addresses the government challenge..."
                rows="5"
                required
              ></textarea>
            </div>

            <div className="startup-form-group">
              <label>Technology / Innovation</label>

              <textarea
                name="technology"
                value={proposalForm.technology}
                onChange={handleProposalChange}
                placeholder="Describe the technology, AI, IoT, platform or innovation used..."
                rows="4"
              ></textarea>
            </div>

            <div className="startup-form-group">
              <label>Implementation Plan</label>

              <textarea
                name="implementationPlan"
                value={proposalForm.implementationPlan}
                onChange={handleProposalChange}
                placeholder="Describe how you would implement the solution..."
                rows="4"
              ></textarea>
            </div>

            <div className="proposal-form-actions">
              <button
                type="button"
                className="secondary-startup-button"
                onClick={() => setShowProposalForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-startup-button"
              >
                Submit Proposal →
              </button>
            </div>
          </form>
        </section>
      );
    }

    if (selectedChallenge) {
      return (
        <section className="startup-section-card">
          <div className="startup-section-header">
            <div>
              <span className="startup-section-label">
                GOVERNMENT CHALLENGE
              </span>

              <h2>{selectedChallenge.title}</h2>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedChallenge(null)}
            >
              ← Back
            </button>
          </div>

          <div className="challenge-detail-layout">
            <div className="challenge-detail-main">
              <span className="challenge-category large">
                {selectedChallenge.category}
              </span>

              <h1>{selectedChallenge.title}</h1>

              <p className="challenge-detail-description">
                {selectedChallenge.description}
              </p>

              <div className="detail-block">
                <h3>Problem Statement</h3>
                <p>{selectedChallenge.problem}</p>
              </div>

              <div className="detail-block">
                <h3>Expected Solution</h3>
                <p>{selectedChallenge.solution}</p>
              </div>

              <div className="detail-block">
                <h3>Eligibility</h3>
                <p>{selectedChallenge.eligibility}</p>
              </div>
            </div>

            <aside className="challenge-detail-sidebar">
              <div className="detail-info-item">
                <span>Department</span>
                <strong>
                  {selectedChallenge.department}
                </strong>
              </div>

              <div className="detail-info-item">
                <span>Budget</span>
                <strong>{selectedChallenge.budget}</strong>
              </div>

              <div className="detail-info-item">
                <span>Deadline</span>
                <strong>{selectedChallenge.deadline}</strong>
              </div>

              <div className="detail-info-item">
                <span>Duration</span>
                <strong>{selectedChallenge.duration}</strong>
              </div>

              <div className="detail-info-item">
                <span>Current Stage</span>
                <strong>{selectedChallenge.stage}</strong>
              </div>

              <button
                className="primary-startup-button full-width"
                onClick={() =>
                  handleStartProposal(selectedChallenge)
                }
              >
                Submit Proposal →
              </button>
            </aside>
          </div>
        </section>
      );
    }

    return (
      <section className="startup-section-card">
        <div className="startup-section-header">
          <div>
            <span className="startup-section-label">
              OPPORTUNITIES
            </span>

            <h2>Government Challenges</h2>

            <p className="section-description">
              Discover public-sector problems where your startup
              can provide innovative solutions.
            </p>
          </div>
        </div>

        <div className="challenge-filter-bar">
          <div className="challenge-count">
            {activeChallenges.length} Active Challenges
          </div>
        </div>

        <div className="all-challenges-grid">
          {activeChallenges.map((challenge) => (
            <div
              className="challenge-full-card"
              key={challenge.id}
            >
              <div className="challenge-card-top">
                <span className="challenge-id">
                  {challenge.id}
                </span>

                <span className="active-badge">
                  Active
                </span>
              </div>

              <span className="challenge-category">
                {challenge.category}
              </span>

              <h3>{challenge.title}</h3>

              <p>{challenge.description}</p>

              <div className="challenge-meta stacked">
                <span>
                  🏛️ {challenge.department}
                </span>

                <span>
                  💰 {challenge.budget}
                </span>

                <span>
                  📅 Deadline: {challenge.deadline}
                </span>

                <span>
                  ⏱️ Duration: {challenge.duration}
                </span>
              </div>

              <div className="challenge-card-actions">
                <button
                  className="outline-startup-button"
                  onClick={() =>
                    handleViewChallenge(challenge)
                  }
                >
                  View Details
                </button>

                <button
                  className="primary-small-button"
                  onClick={() =>
                    handleStartProposal(challenge)
                  }
                >
                  Apply Now →
                </button>
              </div>
            </div>
          ))}

          {activeChallenges.length === 0 && (
            <div className="empty-startup-state">
              <div>📭</div>

              <h3>No active challenges</h3>

              <p>
                New government opportunities will appear here
                when departments publish them.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // PROPOSALS
  // =========================================================

  const renderProposals = () => {
    return (
      <section className="startup-section-card">
        <div className="startup-section-header">
          <div>
            <span className="startup-section-label">
              APPLICATION TRACKING
            </span>

            <h2>My Proposals</h2>

            <p className="section-description">
              Track the status of solutions submitted to government
              departments.
            </p>
          </div>
        </div>

        {startupProposals.length === 0 ? (
          <div className="empty-startup-state">
            <div>📄</div>

            <h3>No proposals submitted</h3>

            <p>
              Your submitted proposals will appear here.
            </p>

            <button
              className="primary-startup-button"
              onClick={() => handleNavigation("challenges")}
            >
              Browse Challenges
            </button>
          </div>
        ) : (
          <div className="proposal-table-wrapper">
            <table className="startup-proposal-table">
              <thead>
                <tr>
                  <th>Proposal</th>
                  <th>Challenge</th>
                  <th>Department</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {startupProposals.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>
                      <strong>
                        {proposal.solutionTitle}
                      </strong>

                      <small>{proposal.id}</small>
                    </td>

                    <td>{proposal.challengeTitle}</td>

                    <td>{proposal.department}</td>

                    <td>{proposal.submittedAt}</td>

                    <td>
                      <span
                        className={`proposal-status ${getStatusClass(
                          proposal.status
                        )}`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  };

  // =========================================================
  // PILOTS
  // =========================================================

  const renderPilots = () => {
    const pilotProposals = startupProposals.filter(
      (proposal) =>
        proposal.status === "Approved for Pilot" ||
        proposal.status === "Pilot Started" ||
        proposal.status === "Pilot Completed"
    );

    return (
      <section className="startup-section-card">
        <div className="startup-section-header">
          <div>
            <span className="startup-section-label">
              IMPLEMENTATION
            </span>

            <h2>Pilot Programs</h2>

            <p className="section-description">
              Track government-approved pilot implementations.
            </p>
          </div>
        </div>

        {pilotProposals.length === 0 ? (
          <div className="empty-startup-state">
            <div>🧪</div>

            <h3>No active pilots</h3>

            <p>
              Approved pilot programs will appear here.
            </p>
          </div>
        ) : (
          <div className="pilot-list">
            {pilotProposals.map((proposal) => {
              let progress = 0;

              if (proposal.status === "Pilot Started") {
                progress = 50;
              }

              if (proposal.status === "Pilot Completed") {
                progress = 100;
              }

              return (
                <div
                  className="pilot-card"
                  key={proposal.id}
                >
                  <div className="pilot-card-header">
                    <div>
                      <span className="proposal-id">
                        {proposal.id}
                      </span>

                      <h3>{proposal.solutionTitle}</h3>

                      <p>{proposal.challengeTitle}</p>
                    </div>

                    <span
                      className={`proposal-status ${getStatusClass(
                        proposal.status
                      )}`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <div className="pilot-progress">
                    <div className="pilot-progress-label">
                      <span>Pilot Progress</span>
                      <strong>{progress}%</strong>
                    </div>

                    <div className="pilot-progress-track">
                      <div
                        className="pilot-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // =========================================================
  // PROCUREMENT
  // =========================================================

  const renderProcurement = () => {
    const procurementProposals = startupProposals.filter(
      (proposal) =>
        proposal.status === "Pilot Completed" ||
        proposal.status === "Procurement Review" ||
        proposal.status === "Procurement Approved" ||
        proposal.status === "Contract Ready" ||
        proposal.status === "Deployment Started"
    );

    return (
      <section className="startup-section-card">
        <div className="startup-section-header">
          <div>
            <span className="startup-section-label">
              SCALE & DEPLOYMENT
            </span>

            <h2>Procurement</h2>

            <p className="section-description">
              Track solutions moving from pilot completion toward
              government procurement and deployment.
            </p>
          </div>
        </div>

        {procurementProposals.length === 0 ? (
          <div className="empty-startup-state">
            <div>📦</div>

            <h3>No procurement activity</h3>

            <p>
              Completed pilots will move into procurement review.
            </p>
          </div>
        ) : (
          <div className="procurement-list">
            {procurementProposals.map((proposal) => (
              <div
                className="procurement-card"
                key={proposal.id}
              >
                <div>
                  <span className="proposal-id">
                    {proposal.id}
                  </span>

                  <h3>{proposal.solutionTitle}</h3>

                  <p>{proposal.challengeTitle}</p>
                </div>

                <span
                  className={`proposal-status ${getStatusClass(
                    proposal.status
                  )}`}
                >
                  {proposal.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // =========================================================
  // ANALYTICS
  // =========================================================

  const renderAnalytics = () => {
    return (
      <section className="startup-section-card">
        <div className="startup-section-header">
          <div>
            <span className="startup-section-label">
              STARTUP INTELLIGENCE
            </span>

            <h2>My Performance</h2>

            <p className="section-description">
              Overview of your participation in GovCatalyst.
            </p>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <span>Total Proposals</span>
            <strong>{submittedCount}</strong>
          </div>

          <div className="analytics-card">
            <span>Under Review</span>
            <strong>{underReviewCount}</strong>
          </div>

          <div className="analytics-card">
            <span>Shortlisted</span>
            <strong>{shortlistedCount}</strong>
          </div>

          <div className="analytics-card">
            <span>Pilot Programs</span>
            <strong>{pilotCount}</strong>
          </div>
        </div>

        <div className="startup-process-card">
          <h3>GovCatalyst Participation Journey</h3>

          <div className="startup-process">
            <div className="process-step active">
              <span>1</span>
              <strong>Discover</strong>
              <small>Find challenges</small>
            </div>

            <div className="process-line"></div>

            <div className="process-step">
              <span>2</span>
              <strong>Apply</strong>
              <small>Submit proposal</small>
            </div>

            <div className="process-line"></div>

            <div className="process-step">
              <span>3</span>
              <strong>Pilot</strong>
              <small>Prove solution</small>
            </div>

            <div className="process-line"></div>

            <div className="process-step">
              <span>4</span>
              <strong>Scale</strong>
              <small>Government deployment</small>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================
  // MAIN CONTENT
  // =========================================================

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return renderDashboard();
    }

    if (activeSection === "challenges") {
      return renderChallenges();
    }

    if (activeSection === "proposals") {
      return renderProposals();
    }

    if (activeSection === "pilots") {
      return renderPilots();
    }

    if (activeSection === "procurement") {
      return renderProcurement();
    }

    if (activeSection === "analytics") {
      return renderAnalytics();
    }

    return renderDashboard();
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="startup-dashboard">
      <aside className="startup-sidebar">
        <div className="startup-brand">
          <div className="startup-brand-logo">
            GC
          </div>

          <div>
            <strong>GovCatalyst</strong>
            <span>STARTUP PORTAL</span>
          </div>
        </div>

        <div className="startup-profile">
          <div className="startup-avatar">
            S
          </div>

          <div>
            <strong>Startup Partner</strong>
            <span>Innovation Startup</span>
          </div>
        </div>

        <nav className="startup-nav">
          <button
            className={
              activeSection === "dashboard"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              activeSection === "challenges"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("challenges")}
          >
            <span>◈</span>
            Browse Challenges
          </button>

          <button
            className={
              activeSection === "proposals"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("proposals")}
          >
            <span>▤</span>
            My Proposals
            {submittedCount > 0 && (
              <em>{submittedCount}</em>
            )}
          </button>

          <button
            className={
              activeSection === "pilots"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("pilots")}
          >
            <span>◉</span>
            Pilots
          </button>

          <button
            className={
              activeSection === "procurement"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("procurement")}
          >
            <span>▣</span>
            Procurement
          </button>

          <button
            className={
              activeSection === "analytics"
                ? "startup-nav-item active"
                : "startup-nav-item"
            }
            onClick={() => handleNavigation("analytics")}
          >
            <span>◫</span>
            Analytics
          </button>
        </nav>

        <div className="startup-sidebar-bottom">
          <button
            className="startup-sidebar-action"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

          <button
            className="startup-sidebar-action logout"
            onClick={() => setPage("login")}
          >
            ⇥ Logout
          </button>
        </div>
      </aside>

      <main className="startup-main">
        <header className="startup-topbar">
          <div>
            <span>STARTUP PORTAL</span>
            <h2>
              {activeSection === "dashboard" &&
                "Startup Dashboard"}

              {activeSection === "challenges" &&
                "Government Challenges"}

              {activeSection === "proposals" &&
                "My Proposals"}

              {activeSection === "pilots" &&
                "Pilot Programs"}

              {activeSection === "procurement" &&
                "Procurement"}

              {activeSection === "analytics" &&
                "Analytics"}
            </h2>
          </div>

          <div className="startup-topbar-right">
            <span className="portal-status">
              ● Portal Active
            </span>

            <div className="topbar-user">
              <div className="startup-avatar small">
                S
              </div>

              <span>Startup Partner</span>
            </div>
          </div>
        </header>

        <div className="startup-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default StartupDashboard;
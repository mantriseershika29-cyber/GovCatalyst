import { useState } from "react";
import "./CreateChallenge.css";

export default function CreateChallenge({
  setPage,
  onPublishChallenge,
}) {
  const [form, setForm] = useState({
    title: "",
    department: "",
    category: "",
    problem: "",
    solution: "",
    budget: "",
    duration: "",
    eligibility: "",
    deadline: "",
  });

  const [published, setPublished] =
    useState(false);

  const [publishedChallenge, setPublishedChallenge] =
    useState(null);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      title: "",
      department: "",
      category: "",
      problem: "",
      solution: "",
      budget: "",
      duration: "",
      eligibility: "",
      deadline: "",
    });

    setPublished(false);
    setPublishedChallenge(null);
  };

  // =========================================================
  // PUBLISH CHALLENGE
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a challenge title.");
      return;
    }

    if (!form.department) {
      alert(
        "Please select a government department."
      );
      return;
    }

    if (!form.category) {
      alert(
        "Please select a challenge category."
      );
      return;
    }

    if (!form.problem.trim()) {
      alert(
        "Please enter the problem statement."
      );
      return;
    }

    if (!form.deadline) {
      alert(
        "Please select a proposal deadline."
      );
      return;
    }

    const formattedBudget = form.budget
      ? `₹${Number(
          form.budget
        ).toLocaleString("en-IN")}`
      : "Not specified";

    const newChallenge = {
      id: `GC-${String(
        Date.now()
      ).slice(-6)}`,

      title: form.title.trim(),

      department: form.department,

      category: form.category,

      description: form.problem.trim(),

      problem: form.problem.trim(),

      solution:
        form.solution.trim(),

      budget: formattedBudget,

      budgetValue: form.budget,

      duration: form.duration,

      eligibility:
        form.eligibility.trim(),

      deadline: form.deadline,

      applications: 0,

      stage: "Challenge Created",

      status: "Active",

      createdAt:
        new Date().toLocaleString(),
    };

    // IMPORTANT:
    // Send the challenge to App.jsx so it becomes
    // available everywhere in the application.
    if (onPublishChallenge) {
      onPublishChallenge(
        newChallenge
      );
    }

    setPublishedChallenge(
      newChallenge
    );

    setPublished(true);
  };

  return (
    <div className="create-challenge-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="create-challenge-header">

        <div
          className="create-challenge-logo"
          onClick={() =>
            setPage("home")
          }
        >
          <span>Gov</span>
          Catalyst
        </div>

        <div className="create-challenge-header-right">

          <span>
            Government Department
          </span>

          <button
            type="button"
            className="create-challenge-back"
            onClick={() =>
              setPage("government")
            }
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="create-challenge-main">

        <div className="create-challenge-heading">

          <div>

            <p className="create-challenge-eyebrow">
              GOVERNMENT PROCUREMENT
            </p>

            <h1>
              Create Public Challenge
            </h1>

            <p>
              Publish a clearly defined government
              problem and invite eligible startups
              to propose innovative solutions.
            </p>

          </div>

          <div className="challenge-step">

            <span className="active-step">
              1
            </span>

            <span className="step-line"></span>

            <span className={published ? "active-step" : ""}>
              2
            </span>

            <span className="step-line"></span>

            <span className={published ? "active-step" : ""}>
              3
            </span>

          </div>

        </div>

        {/* ===================================================
            SUCCESS
        =================================================== */}

        {published ? (
          <div className="challenge-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Challenge Published Successfully
            </h2>

            <p>
              Your public challenge has been created
              and is now available for eligible startups
              to discover and respond to.
            </p>

            <div className="published-card">

              <div>
                <span>
                  Challenge
                </span>

                <strong>
                  {publishedChallenge?.title}
                </strong>
              </div>

              <div>
                <span>
                  Department
                </span>

                <strong>
                  {publishedChallenge?.department}
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {publishedChallenge?.category}
                </strong>
              </div>

              <div>
                <span>
                  Budget
                </span>

                <strong>
                  {
                    publishedChallenge?.budget ||
                    "Not specified"
                  }
                </strong>
              </div>

              <div>
                <span>
                  Deadline
                </span>

                <strong>
                  {
                    publishedChallenge?.deadline ||
                    "Not specified"
                  }
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  Active
                </strong>
              </div>

            </div>

            <div className="success-actions">

              <button
                type="button"
                className="primary-challenge-btn"
                onClick={resetForm}
              >
                + Create Another Challenge
              </button>

              <button
                type="button"
                className="secondary-challenge-btn"
                onClick={() =>
                  setPage("government")
                }
              >
                Back to Dashboard
              </button>

            </div>

          </div>
        ) : (

          /* =================================================
             FORM
          ================================================= */

          <form
            className="challenge-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                SECTION 01
            ================================================= */}

            <section className="challenge-form-section">

              <div className="section-title">

                <span className="section-number">
                  01
                </span>

                <div>
                  <h2>
                    Challenge Information
                  </h2>

                  <p>
                    Describe the government problem
                    you want startups to help solve.
                  </p>
                </div>

              </div>

              <div className="form-grid">

                <div className="form-field full-width">

                  <label>
                    Challenge Title{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. AI-based Crop Disease Detection"
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Government Department{" "}
                    <span>*</span>
                  </label>

                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select department
                    </option>

                    <option>
                      Agriculture Department
                    </option>

                    <option>
                      Health Department
                    </option>

                    <option>
                      Education Department
                    </option>

                    <option>
                      Transport Department
                    </option>

                    <option>
                      Rural Development Department
                    </option>

                    <option>
                      Urban Development Department
                    </option>

                    <option>
                      Environment Department
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-field">

                  <label>
                    Challenge Category{" "}
                    <span>*</span>
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    <option>
                      Artificial Intelligence
                    </option>

                    <option>
                      Agriculture
                    </option>

                    <option>
                      Healthcare
                    </option>

                    <option>
                      Education
                    </option>

                    <option>
                      Climate & Environment
                    </option>

                    <option>
                      Smart Cities
                    </option>

                    <option>
                      Digital Governance
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-field full-width">

                  <label>
                    Problem Statement{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    name="problem"
                    value={form.problem}
                    onChange={handleChange}
                    placeholder="Clearly explain the problem faced by the department..."
                    rows="5"
                    required
                  />

                </div>

                <div className="form-field full-width">

                  <label>
                    Expected Solution
                  </label>

                  <textarea
                    name="solution"
                    value={form.solution}
                    onChange={handleChange}
                    placeholder="Describe the type of solution, technology or outcome you are looking for..."
                    rows="4"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                SECTION 02
            ================================================= */}

            <section className="challenge-form-section">

              <div className="section-title">

                <span className="section-number">
                  02
                </span>

                <div>

                  <h2>
                    Pilot & Procurement Details
                  </h2>

                  <p>
                    Define the expected budget,
                    timeline and participation requirements.
                  </p>

                </div>

              </div>

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Estimated Budget
                  </label>

                  <div className="input-with-prefix">

                    <span>₹</span>

                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="500000"
                      min="0"
                    />

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    Pilot Duration
                  </label>

                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select duration
                    </option>

                    <option>
                      1 Month
                    </option>

                    <option>
                      3 Months
                    </option>

                    <option>
                      6 Months
                    </option>

                    <option>
                      12 Months
                    </option>

                    <option>
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-field full-width">

                  <label>
                    Startup Eligibility
                  </label>

                  <textarea
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    placeholder="e.g. DPIIT-recognized startups with an operational product..."
                    rows="3"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Proposal Deadline{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                PREVIEW
            ================================================= */}

            <section className="challenge-preview">

              <div>

                <span className="preview-label">
                  BEFORE PUBLISHING
                </span>

                <h3>
                  Review your challenge
                </h3>

                <p>
                  Make sure the problem statement
                  and requirements are clear enough
                  for startups to understand the opportunity.
                </p>

              </div>

              <div className="preview-flow">

                <span>
                  Government Need
                </span>

                <b>→</b>

                <span>
                  Startup Solutions
                </span>

                <b>→</b>

                <span>
                  Pilot
                </span>

                <b>→</b>

                <span>
                  Procurement
                </span>

              </div>

            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="challenge-form-actions">

              <button
                type="button"
                className="cancel-challenge-btn"
                onClick={() =>
                  setPage("government")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="publish-challenge-btn"
              >
                Publish Public Challenge →
              </button>

            </div>

          </form>
        )}

      </main>

    </div>
  );
}
import { useEffect, useState } from "react";

import "./App.css";

import RoleSelection from "./components/RoleSelection/RoleSelection";

import GovernmentDashboard from "./components/GovernmentDashboard/GovernmentDashboard";

import CreateChallenge from "./components/CreateChallenge/CreateChallenge";

import Home from "./components/Home/Home";

import StartupDashboard from "./components/StartupDashboard/StartupDashboard";

function App() {
  const [page, setPage] = useState("login");

  // =========================================================
  // SHARED GOVCATALYST DATA
  // =========================================================

  const [challenges, setChallenges] = useState(() => {
    try {
      const savedChallenges = localStorage.getItem(
        "govstart_challenges"
      );

      if (savedChallenges) {
        return JSON.parse(savedChallenges);
      }

      return [
        {
          id: "GC-001",
          title: "Smart Crop Monitoring",
          department: "Department of Agriculture",
          category: "Agriculture",
          description:
            "Develop an affordable technology solution for early detection of crop stress and agricultural risks.",
          problem:
            "Develop an affordable technology solution for early detection of crop stress and agricultural risks.",
          solution:
            "Technology solutions using AI, remote sensing, computer vision or related approaches.",
          budget: "₹25,00,000",
          deadline: "30 Oct 2026",
          duration: "6 Months",
          eligibility:
            "Eligible startups with an operational technology solution.",
          applications: 0,
          stage: "Challenge Created",
          status: "Active",
        },

        {
          id: "GC-002",
          title: "Rural Telemedicine Access",
          department: "Department of Health",
          category: "Healthcare",
          description:
            "Enable accessible remote healthcare services for citizens in rural and underserved communities.",
          problem:
            "Enable accessible remote healthcare services for citizens in rural and underserved communities.",
          solution:
            "Digital healthcare, telemedicine and remote consultation solutions.",
          budget: "₹40,00,000",
          deadline: "15 Nov 2026",
          duration: "6 Months",
          eligibility:
            "Healthcare technology startups with deployable solutions.",
          applications: 0,
          stage: "Challenge Created",
          status: "Active",
        },

        {
          id: "GC-003",
          title: "Urban Waste Optimization",
          department: "Smart City Mission",
          category: "Smart Cities",
          description:
            "Create intelligent solutions for waste collection, monitoring, routing and resource optimization.",
          problem:
            "Create intelligent solutions for waste collection, monitoring, routing and resource optimization.",
          solution:
            "AI, IoT, analytics and intelligent routing solutions for urban waste management.",
          budget: "₹30,00,000",
          deadline: "20 Nov 2026",
          duration: "6 Months",
          eligibility:
            "Startups with working smart-city or waste-management technology.",
          applications: 0,
          stage: "Challenge Created",
          status: "Active",
        },
      ];
    } catch (error) {
      console.error(
        "Failed to load challenges from LocalStorage:",
        error
      );

      return [];
    }
  });

  // =========================================================
  // SAVE CHALLENGES TO LOCALSTORAGE
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "govstart_challenges",
        JSON.stringify(challenges)
      );
    } catch (error) {
      console.error(
        "Failed to save challenges to LocalStorage:",
        error
      );
    }
  }, [challenges]);

  const [proposals, setProposals] = useState([]);

  // =========================================================
  // GOVERNMENT CREATES A NEW CHALLENGE
  // =========================================================

  const handlePublishChallenge = (newChallenge) => {
    setChallenges((previous) => {
      const generatedId =
        newChallenge.id ||
        `GC-${String(previous.length + 1).padStart(3, "0")}`;

      return [
        ...previous,
        {
          ...newChallenge,
          id: generatedId,
          applications: Number(newChallenge.applications || 0),
          stage: newChallenge.stage || "Challenge Created",
          status: newChallenge.status || "Active",
        },
      ];
    });
  };

  // =========================================================
  // STARTUP SUBMITS A PROPOSAL
  // =========================================================

  const handleSubmitProposal = (newProposal) => {
    setProposals((previous) => [
      ...previous,
      {
        ...newProposal,
        status: newProposal.status || "Submitted",
      },
    ]);

    // Update the related challenge
    setChallenges((previous) =>
      previous.map((challenge) => {
        if (challenge.id !== newProposal.challengeId) {
          return challenge;
        }

        return {
          ...challenge,
          applications: Number(challenge.applications || 0) + 1,
          stage: "Proposal Received",
        };
      })
    );
  };

  // =========================================================
  // GOVERNMENT UPDATES PROPOSAL STATUS
  // =========================================================

  const handleUpdateProposalStatus = (proposalId, newStatus) => {
    const existingProposal = proposals.find(
      (proposal) => proposal.id === proposalId
    );

    if (!existingProposal) {
      return;
    }

    const relatedChallengeId = existingProposal.challengeId;

    // UPDATE PROPOSAL STATUS
    setProposals((previous) =>
      previous.map((proposal) => {
        if (proposal.id !== proposalId) {
          return proposal;
        }

        return {
          ...proposal,
          status: newStatus,
          updatedAt: new Date().toLocaleString(),
        };
      })
    );

    // UPDATE RELATED CHALLENGE STAGE
    setChallenges((previous) =>
      previous.map((challenge) => {
        if (challenge.id !== relatedChallengeId) {
          return challenge;
        }

        let stage = challenge.stage;

        // ---------------------------------------------------
        // EVALUATION STAGES
        // ---------------------------------------------------

        if (newStatus === "Submitted") {
          stage = "Proposal Received";
        } else if (newStatus === "Under Review") {
          stage = "Under Evaluation";
        } else if (newStatus === "Shortlisted") {
          stage = "Startup Shortlisted";
        } else if (newStatus === "Approved for Pilot") {
          stage = "Pilot Ready";
        } else if (newStatus === "Rejected") {
          stage = "Proposal Rejected";
        }

        // ---------------------------------------------------
        // PILOT STAGES
        // ---------------------------------------------------

        else if (newStatus === "Pilot Started") {
          stage = "Pilot In Progress";
        } else if (newStatus === "Pilot Completed") {
          stage = "Pilot Completed";
        }

        // ---------------------------------------------------
        // PROCUREMENT STAGES
        // ---------------------------------------------------

        else if (newStatus === "Procurement Review") {
          stage = "Under Procurement Review";
        } else if (newStatus === "Procurement Approved") {
          stage = "Procurement Approved";
        } else if (newStatus === "Contract Ready") {
          stage = "Contract Ready";
        }

        // ---------------------------------------------------
        // DEPLOYMENT
        // ---------------------------------------------------

        else if (newStatus === "Deployment Started") {
          stage = "Deployment Started";
        }

        return {
          ...challenge,
          stage,
        };
      })
    );
  };

  // =========================================================
  // LOGIN FORM
  // =========================================================

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [captcha, setCaptcha] = useState("G7kP4");

  const [captchaInput, setCaptchaInput] = useState("");

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    captcha: false,
  });

  const [errors, setErrors] = useState({});

  // =========================================================
  // REGISTER FORM
  // =========================================================

  const [registerName, setRegisterName] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");

  const [registerPassword, setRegisterPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerCaptcha, setRegisterCaptcha] = useState("K8mR3");

  const [registerCaptchaInput, setRegisterCaptchaInput] =
    useState("");

  const [registerTouched, setRegisterTouched] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    captcha: false,
  });

  const [registerErrors, setRegisterErrors] = useState({});

  // =========================================================
  // CAPTCHA GENERATOR
  // =========================================================

  const createCaptcha = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    let newCaptcha = "";

    for (let i = 0; i < 5; i++) {
      newCaptcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return newCaptcha;
  };

  // =========================================================
  // LOGIN CAPTCHA
  // =========================================================

  const generateCaptcha = () => {
    setCaptcha(createCaptcha());

    setCaptchaInput("");

    setErrors((previous) => ({
      ...previous,
      captcha: "",
    }));

    setTouched((previous) => ({
      ...previous,
      captcha: false,
    }));
  };

  // =========================================================
  // REGISTER CAPTCHA
  // =========================================================

  const generateRegisterCaptcha = () => {
    setRegisterCaptcha(createCaptcha());

    setRegisterCaptchaInput("");

    setRegisterErrors((previous) => ({
      ...previous,
      captcha: "",
    }));

    setRegisterTouched((previous) => ({
      ...previous,
      captcha: false,
    }));
  };

  // =========================================================
  // USERNAME VALIDATION
  // =========================================================

  const validateUsername = (value) => {
    if (!value.trim()) {
      return "username is required.";
    }

    if (value.length < 6) {
      return "username should be at least 6 characters.";
    }

    if (value.length > 20) {
      return "username cannot exceed 20 characters.";
    }

    if (!/^[A-Za-z0-9_]+$/.test(value)) {
      return "username can contain only letters, numbers and underscore.";
    }

    return "";
  };

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "email id is required.";
    }

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        value
      )
    ) {
      return "please enter a valid email id.";
    }

    return "";
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  const validatePassword = (value) => {
    if (!value) {
      return "password is required.";
    }

    if (value.length < 8) {
      return "password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
      return "password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(value)) {
      return "password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return "password must contain at least one special character.";
    }

    return "";
  };

  // =========================================================
  // CAPTCHA VALIDATION
  // =========================================================

  const validateCaptcha = (value, currentCaptcha) => {
    if (!value.trim()) {
      return "captcha is required.";
    }

    if (value.trim() !== currentCaptcha) {
      return "incorrect captcha.";
    }

    return "";
  };

  // =========================================================
  // REGISTER NAME VALIDATION
  // =========================================================

  const validateName = (value) => {
    if (!value.trim()) {
      return "full name is required.";
    }

    if (value.trim().length < 3) {
      return "full name should be at least 3 characters.";
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      return "full name can contain only letters.";
    }

    return "";
  };

  // =========================================================
  // CONFIRM PASSWORD VALIDATION
  // =========================================================

  const validateConfirmPassword = (value) => {
    if (!value) {
      return "please confirm your password.";
    }

    if (value !== registerPassword) {
      return "passwords do not match.";
    }

    return "";
  };

  // =========================================================
  // LOGIN INPUT HANDLERS
  // =========================================================

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    setUsername(value);

    setTouched((previous) => ({
      ...previous,
      username: true,
    }));

    setErrors((previous) => ({
      ...previous,
      username: validateUsername(value),
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setTouched((previous) => ({
      ...previous,
      email: true,
    }));

    setErrors((previous) => ({
      ...previous,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    setTouched((previous) => ({
      ...previous,
      password: true,
    }));

    setErrors((previous) => ({
      ...previous,
      password: validatePassword(value),
    }));
  };

  const handleCaptchaChange = (e) => {
    const value = e.target.value;

    setCaptchaInput(value);

    setTouched((previous) => ({
      ...previous,
      captcha: true,
    }));

    setErrors((previous) => ({
      ...previous,
      captcha: value
        ? validateCaptcha(value, captcha)
        : "",
    }));
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = () => {
    const newErrors = {};

    const usernameError = validateUsername(username);

    const emailError = validateEmail(email);

    const passwordError = validatePassword(password);

    const captchaError = validateCaptcha(
      captchaInput,
      captcha
    );

    if (usernameError) {
      newErrors.username = usernameError;
    }

    if (emailError) {
      newErrors.email = emailError;
    }

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (captchaError) {
      newErrors.captcha = captchaError;
    }

    setTouched({
      username: true,
      email: true,
      password: true,
      captcha: true,
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setPage("home");
  };

  // =========================================================
  // REGISTER INPUT HANDLERS
  // =========================================================

  const handleRegisterName = (e) => {
    const value = e.target.value;

    setRegisterName(value);

    setRegisterTouched((previous) => ({
      ...previous,
      name: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      name: validateName(value),
    }));
  };

  const handleRegisterUsername = (e) => {
    const value = e.target.value;

    setRegisterUsername(value);

    setRegisterTouched((previous) => ({
      ...previous,
      username: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      username: validateUsername(value),
    }));
  };

  const handleRegisterEmail = (e) => {
    const value = e.target.value;

    setRegisterEmail(value);

    setRegisterTouched((previous) => ({
      ...previous,
      email: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      email: validateEmail(value),
    }));
  };

  const handleRegisterPassword = (e) => {
    const value = e.target.value;

    setRegisterPassword(value);

    setRegisterTouched((previous) => ({
      ...previous,
      password: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      password: validatePassword(value),
      confirmPassword: confirmPassword
        ? value === confirmPassword
          ? ""
          : "passwords do not match."
        : "",
    }));
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);

    setRegisterTouched((previous) => ({
      ...previous,
      confirmPassword: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      confirmPassword: value
        ? value === registerPassword
          ? ""
          : "passwords do not match."
        : "please confirm your password.",
    }));
  };

  const handleRegisterCaptcha = (e) => {
    const value = e.target.value;

    setRegisterCaptchaInput(value);

    setRegisterTouched((previous) => ({
      ...previous,
      captcha: true,
    }));

    setRegisterErrors((previous) => ({
      ...previous,
      captcha: value
        ? validateCaptcha(value, registerCaptcha)
        : "",
    }));
  };

  // =========================================================
  // CREATE ACCOUNT
  // =========================================================

  const handleCreateAccount = () => {
    const newErrors = {};

    const nameError = validateName(registerName);

    const usernameError = validateUsername(registerUsername);

    const emailError = validateEmail(registerEmail);

    const passwordError = validatePassword(registerPassword);

    const confirmError =
      validateConfirmPassword(confirmPassword);

    const captchaError = validateCaptcha(
      registerCaptchaInput,
      registerCaptcha
    );

    if (nameError) {
      newErrors.name = nameError;
    }

    if (usernameError) {
      newErrors.username = usernameError;
    }

    if (emailError) {
      newErrors.email = emailError;
    }

    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (confirmError) {
      newErrors.confirmPassword = confirmError;
    }

    if (captchaError) {
      newErrors.captcha = captchaError;
    }

    setRegisterTouched({
      name: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      captcha: true,
    });

    setRegisterErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setPage("role");
  };

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (page === "login") {
    return (
      <div className="gov-home">
        <div className="orange-shape"></div>

        <div className="green-shape"></div>

        <div className="white-curve"></div>

        <header className="gov-topbar">
          <div className="gov-brand">
            <strong>GovCatalyst</strong>

            <span>
              Public Innovation & Procurement Platform
            </span>
          </div>
        </header>

        <main className="gov-content">
          <section className="gov-intro">
            <span className="official-tag">
              GOVERNMENT INNOVATION PLATFORM
            </span>

            <h1>
              Connecting
              <br />
              <strong>Innovation</strong>
              <br />
              with Government.
            </h1>

            <p>
              GovCatalyst enables government departments to
              discover innovative startup solutions and create
              a structured path from public-sector challenges
              to implementation.
            </p>
          </section>

          <section className="login-box">
            <div className="login-header">
              <h2>GovCatalyst</h2>

              <p>
                Public Innovation & Procurement Platform
              </p>
            </div>

            <div className="login-title">
              <h1>Welcome</h1>

              <p>
                Sign in to continue to GovCatalyst
              </p>
            </div>

            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter username"
              />

              {touched.username && errors.username && (
                <p className="field-error">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Email ID</label>

              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email ID"
              />

              {touched.email && errors.email && (
                <p className="field-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
              />

              {touched.password && errors.password && (
                <p className="field-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="password-hint">
              <span>
                8+ characters • uppercase • lowercase •
                number • special character
              </span>
            </div>

            <div className="captcha-section">
              <label>Security Verification</label>

              <div className="captcha-row">
                <div className="captcha-image">
                  <div className="captcha-line line-one"></div>

                  <div className="captcha-line line-two"></div>

                  <div className="captcha-line line-three"></div>

                  <span className="captcha-char char-one">
                    {captcha[0]}
                  </span>

                  <span className="captcha-char char-two">
                    {captcha[1]}
                  </span>

                  <span className="captcha-char char-three">
                    {captcha[2]}
                  </span>

                  <span className="captcha-char char-four">
                    {captcha[3]}
                  </span>

                  <span className="captcha-char char-five">
                    {captcha[4]}
                  </span>

                  <span className="captcha-dot dot-one"></span>

                  <span className="captcha-dot dot-two"></span>

                  <span className="captcha-dot dot-three"></span>

                  <span className="captcha-dot dot-four"></span>
                </div>

                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={generateCaptcha}
                >
                  ↻
                </button>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={handleCaptchaChange}
                placeholder="Enter the characters shown above"
                className="captcha-input"
              />

              {touched.captcha && errors.captcha && (
                <p className="field-error captcha-field-error">
                  {errors.captcha}
                </p>
              )}
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() =>
                  alert(
                    "Password recovery will be connected next."
                  )
                }
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={handleLogin}
            >
              LOGIN
            </button>

            <div className="create-account">
              <span>Don't have an account?</span>

              <button
                type="button"
                className="create-account-btn"
                onClick={() => setPage("register")}
              >
                Create Account
              </button>
            </div>

            <p className="login-footer">
              Secure Government Innovation Platform
            </p>
          </section>
        </main>

        <footer className="gov-footer">
          <span>© 2026 GovCatalyst</span>

          <span>
            Government • Innovation • Procurement
          </span>
        </footer>
      </div>
    );
  }

  // =========================================================
  // REGISTER PAGE
  // =========================================================

  if (page === "register") {
    return (
      <div className="gov-home">
        <div className="orange-shape"></div>

        <div className="green-shape"></div>

        <div className="white-curve"></div>

        <header className="gov-topbar">
          <div className="gov-brand">
            <strong>GovCatalyst</strong>

            <span>
              Public Innovation & Procurement Platform
            </span>
          </div>
        </header>

        <main className="gov-content">
          <section className="gov-intro">
            <span className="official-tag">
              JOIN GOVCATALYST
            </span>

            <h1>
              Start Your
              <br />
              <strong>Innovation</strong>
              <br />
              Journey.
            </h1>

            <p>
              Create your GovCatalyst account to connect
              with government innovation opportunities and
              participate in public-sector procurement
              programs.
            </p>
          </section>

          <section className="login-box register-box">
            <div className="login-header">
              <h2>GovCatalyst</h2>

              <p>Create your account</p>
            </div>

            <div className="login-title">
              <h1>Create Account</h1>

              <p>
                Register to continue to GovCatalyst
              </p>
            </div>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                value={registerName}
                onChange={handleRegisterName}
                placeholder="Enter full name"
              />

              {registerTouched.name &&
                registerErrors.name && (
                  <p className="field-error">
                    {registerErrors.name}
                  </p>
                )}
            </div>

            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                value={registerUsername}
                onChange={handleRegisterUsername}
                placeholder="Create username"
              />

              {registerTouched.username &&
                registerErrors.username && (
                  <p className="field-error">
                    {registerErrors.username}
                  </p>
                )}
            </div>

            <div className="form-group">
              <label>Email ID</label>

              <input
                type="email"
                value={registerEmail}
                onChange={handleRegisterEmail}
                placeholder="Enter email ID"
              />

              {registerTouched.email &&
                registerErrors.email && (
                  <p className="field-error">
                    {registerErrors.email}
                  </p>
                )}
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={registerPassword}
                onChange={handleRegisterPassword}
                placeholder="Create password"
              />

              {registerTouched.password &&
                registerErrors.password && (
                  <p className="field-error">
                    {registerErrors.password}
                  </p>
                )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                placeholder="Confirm password"
              />

              {registerTouched.confirmPassword &&
                registerErrors.confirmPassword && (
                  <p className="field-error">
                    {registerErrors.confirmPassword}
                  </p>
                )}
            </div>

            <div className="password-hint">
              <span>
                8+ characters • uppercase • lowercase •
                number • special character
              </span>
            </div>

            <div className="captcha-section">
              <label>Security Verification</label>

              <div className="captcha-row">
                <div className="captcha-image">
                  <div className="captcha-line line-one"></div>

                  <div className="captcha-line line-two"></div>

                  <div className="captcha-line line-three"></div>

                  <span className="captcha-char char-one">
                    {registerCaptcha[0]}
                  </span>

                  <span className="captcha-char char-two">
                    {registerCaptcha[1]}
                  </span>

                  <span className="captcha-char char-three">
                    {registerCaptcha[2]}
                  </span>

                  <span className="captcha-char char-four">
                    {registerCaptcha[3]}
                  </span>

                  <span className="captcha-char char-five">
                    {registerCaptcha[4]}
                  </span>

                  <span className="captcha-dot dot-one"></span>

                  <span className="captcha-dot dot-two"></span>

                  <span className="captcha-dot dot-three"></span>

                  <span className="captcha-dot dot-four"></span>
                </div>

                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={generateRegisterCaptcha}
                >
                  ↻
                </button>
              </div>

              <input
                type="text"
                value={registerCaptchaInput}
                onChange={handleRegisterCaptcha}
                placeholder="Enter the characters shown above"
                className="captcha-input"
              />

              {registerTouched.captcha &&
                registerErrors.captcha && (
                  <p className="field-error captcha-field-error">
                    {registerErrors.captcha}
                  </p>
                )}
            </div>

            <button
              type="button"
              className="login-btn"
              onClick={handleCreateAccount}
            >
              CREATE ACCOUNT
            </button>

            <div className="create-account">
              <span>Already have an account?</span>

              <button
                type="button"
                className="create-account-btn"
                onClick={() => setPage("login")}
              >
                Login
              </button>
            </div>

            <p className="login-footer">
              Secure Government Innovation Platform
            </p>
          </section>
        </main>

        <footer className="gov-footer">
          <span>© 2026 GovCatalyst</span>

          <span>
            Government • Innovation • Procurement
          </span>
        </footer>
      </div>
    );
  }

  // =========================================================
  // HOME PAGE
  // =========================================================

  if (page === "home") {
    return <Home setPage={setPage} />;
  }

  // =========================================================
  // ROLE SELECTION
  // =========================================================

  if (page === "role") {
    return <RoleSelection setPage={setPage} />;
  }

  // =========================================================
  // GOVERNMENT DASHBOARD
  // =========================================================

  if (page === "government") {
    return (
      <GovernmentDashboard
        setPage={setPage}
        challenges={challenges}
        onPublishChallenge={handlePublishChallenge}
        proposals={proposals}
        onUpdateProposalStatus={handleUpdateProposalStatus}
      />
    );
  }

  // =========================================================
  // CREATE PUBLIC CHALLENGE
  // =========================================================

  if (page === "create-challenge") {
    return (
      <CreateChallenge
        setPage={setPage}
        onPublishChallenge={handlePublishChallenge}
      />
    );
  }

  // =========================================================
  // STARTUP DASHBOARD
  // =========================================================

  if (page === "startup") {
    return (
      <StartupDashboard
        setPage={setPage}
        challenges={challenges}
        proposals={proposals}
        onSubmitProposal={handleSubmitProposal}
      />
    );
  }

  return null;
}

export default App;
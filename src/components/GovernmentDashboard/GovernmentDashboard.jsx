import { useEffect, useState } from "react";
import "./GovernmentDashboard.css";
/* =======================================================
   PROPOSAL PROGRESS TRACKING
======================================================= */

const getProposalProgress = (status) => {
  const progressMap = {
    Submitted: 10,
    "Under Review": 25,
    "Evaluation Score": 40,
    Shortlisted: 55,
    "Approved for Pilot": 65,
    "Pilot Started": 75,
    "Pilot Completed": 85,
    "Procurement Review": 90,
    "Procurement Approved": 94,
    "Contract Ready": 97,
    "Deployment Started": 100,
    Rejected: 0,
  };

  return progressMap[status] ?? 10;
};


const getProposalProgressLabel = (status) => {
  const labels = {
    Submitted: "Proposal Submitted",
    "Under Review": "Under Review",
    "Evaluation Score": "Evaluation Completed",
    Shortlisted: "Shortlisted",
    "Approved for Pilot": "Approved for Pilot",
    "Pilot Started": "Pilot in Progress",
    "Pilot Completed": "Pilot Completed",
    "Procurement Review": "Procurement Review",
    "Procurement Approved": "Procurement Approved",
    "Contract Ready": "Contract Ready",
    "Deployment Started": "Deployment Started",
    Rejected: "Proposal Rejected",
  };

  return labels[status] || "Proposal Submitted";
};


/* YOUR EXISTING CODE CONTINUES HERE */
/* =========================================================
   EVALUATION CRITERIA
========================================================= */

const evaluationCriteria = [
  {
    key: "technicalCapability",
    label: "Technical Capability",
    weight: 25,
  },
  {
    key: "innovation",
    label: "Innovation",
    weight: 20,
  },
  {
    key: "feasibility",
    label: "Feasibility",
    weight: 20,
  },
  {
    key: "budget",
    label: "Budget",
    weight: 15,
  },
  {
    key: "expectedImpact",
    label: "Expected Impact",
    weight: 20,
  },
];

/* =========================================================
   SCORE CALCULATION
========================================================= */

const calculateOverallScore = (scores = {}) => {
  let total = 0;

  evaluationCriteria.forEach((criterion) => {
    const score = Number(scores[criterion.key] || 0);

    total += score * (criterion.weight / 100);
  });

  return Number(total.toFixed(2));
};

const isEvaluationComplete = (scores = {}) => {
  return evaluationCriteria.every((criterion) => {
    const value = scores[criterion.key];

    return (
      value !== undefined &&
      value !== "" &&
      !Number.isNaN(Number(value)) &&
      Number(value) >= 0 &&
      Number(value) <= 10
    );
  });
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GovernmentDashboard({
  setPage,
  challenges = [],
  onPublishChallenge,
  proposals = [],
  onUpdateProposalStatus,
}) {

  const [activeSection, setActiveSection] = useState("dashboard");
const [backendChallenges, setBackendChallenges] = useState([]);
const [backendMatches, setBackendMatches] = useState([]);
const [loadingBackendData, setLoadingBackendData] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  
    /* =======================================================
   NOTIFICATIONS
======================================================= */
useEffect(() => {
  const loadBackendChallenges = async () => {
    try {
      setLoadingBackendData(true);

    
     const response = await fetch(
  "https://govcatalyst-backend.onrender.com/api/problems"
);
      
      if (!response.ok) {
        throw new Error("Failed to load challenges.");
      }

      const data = await response.json();

      const problems = Array.isArray(data)
        ? data
        : data.problems || data.data || [];

      setBackendChallenges(problems);
    } catch (error) {
      console.error("Failed to load backend challenges:", error);
    } finally {
      setLoadingBackendData(false);
    }
  };

  loadBackendChallenges();
}, []);

const [notifications, setNotifications] = useState(() => {
  try {
    const stored = localStorage.getItem("govstart_notifications");

    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            title: "New Proposal Submitted",
            message: "A startup has submitted a proposal for review.",
            type: "proposal",
            time: "Just now",
            read: false,
          },
          {
            id: 2,
            title: "Evaluation Required",
            message: "A proposal is waiting for government evaluation.",
            type: "evaluation",
            time: "10 min ago",
            read: false,
          },
          {
            id: 3,
            title: "Pilot Approval Update",
            message: "A proposal has been approved for the pilot stage.",
            type: "pilot",
            time: "1 hour ago",
            read: true,
          },
        ];
  } catch {
    return [];
  }
});
const unreadNotificationCount = notifications.filter(
  (notification) => !notification.read
).length;

const markNotificationAsRead = (id) => {
  setNotifications((current) =>
    current.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    )
  );
};

const markAllNotificationsAsRead = () => {
  setNotifications((current) =>
    current.map((notification) => ({
      ...notification,
      read: true,
    }))
  );
};
useEffect(() => {
  try {
    localStorage.setItem(
      "govstart_notifications",
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.error(
      "Failed to save notifications:",
      error
    );
  }
}, [notifications]);
/* =========================================
   LOCAL STORAGE
========================================= */

useEffect(() => {
  try {
    localStorage.setItem(
      "govstart_proposals",
      JSON.stringify(proposals)
    );
  } catch (error) {
    console.error("Failed to save proposals:", error);
  }
}, [proposals]);

  /* =======================================================
     AI MATCHING STATE
  ======================================================= */

  const [selectedMatchingChallenge, setSelectedMatchingChallenge] =
    useState(null);

  const [matchingStarted, setMatchingStarted] =
    useState(false);

  const [recommendedStartup, setRecommendedStartup] =
    useState(null);

  /* =======================================================
     EVALUATION STATE
  ======================================================= */

  const [evaluationScores, setEvaluationScores] =
    useState({});

  /* =======================================================
     CHALLENGE FORM
  ======================================================= */

  const [challengeForm, setChallengeForm] = useState({
    title: "",
    department: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
  });

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigationItems = [
    {
      id: "dashboard",
      icon: "▦",
      label: "Dashboard",
    },
    {
      id: "challenges",
      icon: "📋",
      label: "Challenges",
    },
    {
      id: "matching",
      icon: "🤖",
      label: "AI Matching",
    },
    {
      id: "evaluation",
      icon: "🔎",
      label: "Evaluation",
    },
    {
      id: "pilots",
      icon: "🧪",
      label: "Pilot Programs",
    },
    {
      id: "procurement",
      icon: "📑",
      label: "Procurement",
    },
    {
      id: "analytics",
      icon: "📊",
      label: "Impact & Analytics",
    },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
    },
  ];

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setChallengeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

const createChallenge = async (e) => {
  e.preventDefault();

  if (!challengeForm.title.trim()) {
    alert("Please enter the challenge title.");
    return;
  }

  if (!challengeForm.department.trim()) {
    alert("Please enter the government department.");
    return;
  }

  try {
   const response = await fetch("https://govcatalyst-backend.onrender.com/api/problems", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: challengeForm.title.trim(),
        department: challengeForm.department.trim(),
        category: challengeForm.category || "General",
        description:
          challengeForm.description.trim() ||
          "Government innovation challenge.",
        budget: Number(challengeForm.budget) || 0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create challenge.");
    }

    const createdProblem = data.problem || data;

    const newChallenge = {
      id: createdProblem.id,
      title: createdProblem.title,
      department: createdProblem.department,
      category: createdProblem.category,
      description: createdProblem.description,
      problem: createdProblem.description,
      budget: createdProblem.budget,
      deadline: challengeForm.deadline || "To be decided",
      applications: 0,
      stage: "Challenge Created",
      status: createdProblem.status || "Open",
    };

    if (onPublishChallenge) {
      onPublishChallenge(newChallenge);
    }

    setChallengeForm({
      title: "",
      department: "",
      category: "",
      description: "",
      budget: "",
      deadline: "",
    });

    setShowChallengeForm(false);
    setActiveSection("challenges");

    alert("Challenge published successfully.");
  } catch (error) {
    console.error("Challenge creation failed:", error);
    alert(error.message || "Failed to publish challenge.");
  }
};
  /* =======================================================
     NAVIGATION HELPERS
  ======================================================= */

  const handleNavigation = (section) => {
    setActiveSection(section);

    setShowChallengeForm(false);

    setSelectedProposal(null);

  };

  const openCreateChallenge = () => {
    setActiveSection("challenges");

    setShowChallengeForm(true);

    setSelectedProposal(null);
  };

  /* =======================================================
     PROPOSAL STATUS
  ======================================================= */

  const changeProposalStatus = (proposal, status) => {
    if (onUpdateProposalStatus) {
      onUpdateProposalStatus(
        proposal.id,
        status
      );
    }

    setSelectedProposal({
      ...proposal,
      status,
    });
  };

  /* =======================================================
     EVALUATION HELPERS
  ======================================================= */

  const getProposalEvaluation = (proposal) => {
    if (!proposal) {
      return {
        technicalCapability: "",
        innovation: "",
        feasibility: "",
        budget: "",
        expectedImpact: "",
      };
    }

    return (
      evaluationScores[proposal.id] || {
        technicalCapability:
          proposal.evaluation?.technicalCapability ??
          "",
        innovation:
          proposal.evaluation?.innovation ??
          "",
        feasibility:
          proposal.evaluation?.feasibility ??
          "",
        budget:
          proposal.evaluation?.budget ??
          "",
        expectedImpact:
          proposal.evaluation?.expectedImpact ??
          "",
      }
    );
  };

  const handleEvaluationScoreChange = (
    proposalId,
    criterionKey,
    value
  ) => {
    if (value === "") {
      setEvaluationScores((previous) => ({
        ...previous,

        [proposalId]: {
          ...(
            previous[proposalId] || {
              technicalCapability: "",
              innovation: "",
              feasibility: "",
              budget: "",
              expectedImpact: "",
            }
          ),

          [criterionKey]: "",
        },
      }));

      return;
    }

    let score = Number(value);

    if (Number.isNaN(score)) {
      return;
    }

    if (score < 0) {
      score = 0;
    }

    if (score > 10) {
      score = 10;
    }

    setEvaluationScores((previous) => ({
      ...previous,

      [proposalId]: {
        ...(
          previous[proposalId] || {
            technicalCapability: "",
            innovation: "",
            feasibility: "",
            budget: "",
            expectedImpact: "",
          }
        ),

        [criterionKey]: score,
      },
    }));
  };

  const saveEvaluationScore = (proposal) => {
    const scores =
      getProposalEvaluation(proposal);

    if (!isEvaluationComplete(scores)) {
      alert(
        "Please enter a score from 0 to 10 for every evaluation criterion."
      );

      return;
    }

    changeProposalStatus(
      proposal,
      "Evaluation Score"
    );

    alert(
      `Evaluation saved successfully. Overall score: ${calculateOverallScore(
        scores
      )}/10`
    );
  };

  const shortlistEvaluatedProposal = (
    proposal
  ) => {
    const scores =
      getProposalEvaluation(proposal);

    if (!isEvaluationComplete(scores)) {
      alert(
        "Please complete all evaluation scores before shortlisting."
      );

      return;
    }

    changeProposalStatus(
      proposal,
      "Shortlisted"
    );
  };

  const approveEvaluatedProposal = (
    proposal
  ) => {
    const scores =
      getProposalEvaluation(proposal);

    if (!isEvaluationComplete(scores)) {
      alert(
        "Please complete all evaluation scores before approving the proposal for pilot."
      );

      return;
    }

    changeProposalStatus(
      proposal,
      "Approved for Pilot"
    );
  };

  /* =======================================================
     COUNTS
  ======================================================= */

  const activeChallengeCount =
    challenges.filter(
      (challenge) =>
        challenge.status !== "Closed"
    ).length;

  const submittedCount =
    proposals.length;

  const reviewCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Under Review"
    ).length;

  const evaluationCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Evaluation Score"
    ).length;

  const shortlistedCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Shortlisted"
    ).length;

  const pilotCount =
    proposals.filter(
      (proposal) =>
        proposal.status ===
        "Approved for Pilot"
    ).length;

  const rejectedCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Rejected"
    ).length;

  const pilotStartedCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Pilot Started"
    ).length;

  const pilotCompletedCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Pilot Completed"
    ).length;

  const procurementReviewCount =
    proposals.filter(
      (proposal) =>
        proposal.status ===
        "Procurement Review"
    ).length;

  const procurementApprovedCount =
    proposals.filter(
      (proposal) =>
        proposal.status ===
        "Procurement Approved"
    ).length;

  const contractReadyCount =
    proposals.filter(
      (proposal) =>
        proposal.status === "Contract Ready"
    ).length;

  const deploymentStartedCount =
    proposals.filter(
      (proposal) =>
        proposal.status ===
        "Deployment Started"
    ).length;

  /* =======================================================
     CATEGORY ICON
  ======================================================= */

  const getCategoryIcon = (category) => {
    if (category === "Agriculture")
      return "🌾";

    if (category === "Healthcare")
      return "🏥";

    if (category === "Smart Cities")
      return "🏙️";

    if (category === "Education")
      return "🎓";

    if (category === "Environment")
      return "🌱";

    return "📋";
  };

  /* =======================================================
     PILOT HELPERS
  ======================================================= */

  const getPilotProgress = (status) => {
    if (
      status === "Approved for Pilot"
    )
      return 0;

    if (status === "Pilot Started")
      return 50;

    if (status === "Pilot Completed")
      return 100;

    return 0;
  };

  const getPilotLabel = (status) => {
    if (
      status === "Approved for Pilot"
    )
      return "Pilot Ready";

    if (status === "Pilot Started")
      return "Pilot In Progress";

    if (status === "Pilot Completed")
      return "Pilot Completed";

    return "Pilot";
  };

  const getProcurementLabel = (
    status
  ) => {
    if (status === "Pilot Completed")
      return "Pilot Completed";

    if (
      status === "Procurement Review"
    )
      return "Procurement Review";

    if (
      status === "Procurement Approved"
    )
      return "Procurement Approved";

    if (status === "Contract Ready")
      return "Contract Ready";

    if (
      status === "Deployment Started"
    )
      return "Deployment Started";

    return status;
  };

  /* =======================================================
     AI MATCHING ENGINE
  ======================================================= */

  const demoStartups = [
    {
      id: "STARTUP-001",
      name: "AgriSense Technologies",
      initials: "AS",
      categories: ["Agriculture"],
      technologies: [
        "AI",
        "Remote Sensing",
        "Computer Vision",
        "Analytics",
      ],
      description:
        "AI-powered crop monitoring and early detection of crop stress using satellite imagery, remote sensing and computer vision.",
      readiness: 92,
    },

    {
      id: "STARTUP-002",
      name: "CropVision Labs",
      initials: "CV",
      categories: ["Agriculture"],
      technologies: [
        "Computer Vision",
        "AI",
        "Image Processing",
      ],
      description:
        "Computer vision platform for detecting crop disease, plant stress and field-level agricultural risks.",
      readiness: 88,
    },

    {
      id: "STARTUP-003",
      name: "FarmTech Solutions",
      initials: "FT",
      categories: [
        "Agriculture",
        "Smart Cities",
      ],
      technologies: [
        "IoT",
        "Sensors",
        "Analytics",
        "AI",
      ],
      description:
        "IoT-enabled agriculture monitoring platform combining field sensors, analytics and predictive alerts.",
      readiness: 84,
    },

    {
      id: "STARTUP-004",
      name: "HealthConnect AI",
      initials: "HC",
      categories: ["Healthcare"],
      technologies: [
        "AI",
        "Telemedicine",
        "Cloud",
        "Analytics",
      ],
      description:
        "Digital healthcare platform supporting remote consultation, patient monitoring and AI-assisted healthcare workflows.",
      readiness: 91,
    },

    {
      id: "STARTUP-005",
      name: "UrbanFlow Technologies",
      initials: "UF",
      categories: ["Smart Cities"],
      technologies: [
        "IoT",
        "AI",
        "Analytics",
        "Routing",
      ],
      description:
        "Intelligent urban operations platform using IoT, analytics and AI-powered routing optimization.",
      readiness: 89,
    },

    {
      id: "STARTUP-006",
      name: "EduTech Labs",
      initials: "EL",
      categories: ["Education"],
      technologies: [
        "AI",
        "Learning Analytics",
        "Cloud",
        "Mobile",
      ],
      description:
        "Digital education platform using AI and learning analytics to improve accessibility and student outcomes.",
      readiness: 86,
    },

    {
      id: "STARTUP-007",
      name: "GreenGrid Innovations",
      initials: "GG",
      categories: [
        "Environment",
        "Smart Cities",
      ],
      technologies: [
        "IoT",
        "Analytics",
        "Sustainability",
        "AI",
      ],
      description:
        "Environmental monitoring and sustainability platform using IoT sensors and analytics.",
      readiness: 87,
    },
  ];

  /* =======================================================
     REAL STARTUP PROPOSALS
  ======================================================= */

  const proposalStartupProfiles =
    proposals.map((proposal) => ({
      id: proposal.id,

      name:
        proposal.startupName ||
        "Startup",

      initials: (
        proposal.startupName ||
        "ST"
      )
        .substring(0, 2)
        .toUpperCase(),

      categories: [
        proposal.category || "",
      ],

      technologies: [
        proposal.technology || "",
      ],

      description:
        proposal.solutionDescription ||
        proposal.solutionTitle ||
        "",

      readiness: 80,

      proposal,
    }));

  const startupProfiles = [
    ...demoStartups,
    ...proposalStartupProfiles,
  ];

  /* =======================================================
     MATCHING SCORE
  ======================================================= */

  const calculateMatch = (
    challenge,
    startup
  ) => {
    if (!challenge || !startup) {
      return {
        total: 0,
        problemFit: 0,
        technologyFit: 0,
        readiness: 0,
        reason:
          "No matching information available.",
      };
    }

    const challengeText = `
      ${challenge.title || ""}
      ${challenge.description || ""}
      ${challenge.problem || ""}
      ${challenge.solution || ""}
      ${challenge.category || ""}
    `.toLowerCase();

    const category =
      (
        challenge.category || ""
      ).toLowerCase();

    const startupText = `
      ${startup.name || ""}
      ${startup.description || ""}
      ${(startup.categories || []).join(
        " "
      )}
      ${(startup.technologies || []).join(
        " "
      )}
    `.toLowerCase();

    let categoryScore = 55;

    if (
      startup.categories?.some(
        (item) =>
          item.toLowerCase() ===
          category
      )
    ) {
      categoryScore = 95;
    }

    const technologyKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "computer vision",
      "iot",
      "analytics",
      "remote sensing",
      "telemedicine",
      "cloud",
      "sensors",
      "routing",
      "mobile",
      "satellite",
      "sustainability",
      "learning analytics",
    ];

    const matchedTechnologyKeywords =
      technologyKeywords.filter(
        (keyword) =>
          challengeText.includes(
            keyword
          ) &&
          startupText.includes(keyword)
      );

    const technologyFit = Math.min(
      98,
      55 +
        matchedTechnologyKeywords.length *
          8 +
        (categoryScore >= 90 ? 10 : 0)
    );

    const problemWords =
      challengeText
        .split(/[^a-zA-Z]+/)
        .filter(
          (word) => word.length >= 5
        );

    const startupWords = new Set(
      startupText
        .split(/[^a-zA-Z]+/)
        .filter(
          (word) => word.length >= 5
        )
    );

    const commonWords =
      problemWords.filter((word) =>
        startupWords.has(word)
      );

    const problemFit = Math.min(
      97,
      Math.max(
        58,
        60 +
          Math.min(
            20,
            commonWords.length * 2
          ) +
          (categoryScore >= 90
            ? 10
            : 0)
      )
    );

    const readiness =
      startup.readiness || 80;

    const total = Math.round(
      problemFit * 0.35 +
        technologyFit * 0.35 +
        readiness * 0.3
    );

    let reason =
      "Startup capabilities show potential alignment with this challenge.";

    if (
      categoryScore >= 90 &&
      matchedTechnologyKeywords.length >=
        2
    ) {
      reason = `Strong ${
        challenge.category
      } alignment with ${matchedTechnologyKeywords
        .slice(0, 3)
        .join(", ")} capabilities.`;
    } else if (
      categoryScore >= 90
    ) {
      reason = `Startup operates in the ${challenge.category} sector and shows relevant solution capabilities.`;
    } else if (
      matchedTechnologyKeywords.length >
      0
    ) {
      reason =
        "Technology capabilities overlap with the requirements identified in this challenge.";
    }

    return {
      total,
      problemFit,
      technologyFit,
      readiness,
      reason,
    };
  };

  /* =======================================================
     GENERATE MATCHES
  ======================================================= */

  const [matchingResults, setMatchingResults] = useState([]);

const startMatching = async () => {
  if (!selectedMatchingChallenge) {
    alert("Please select a government challenge first.");
    return;
  }

  try {
    setMatchingStarted(true);
    setRecommendedStartup(null);

    const problemId = selectedMatchingChallenge.id;
const runResponse = await fetch(
  `https://govcatalyst-backend.onrender.com/api/matches/run/${problemId}`,
  {
        method: "POST",
       headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
},
      }
    );
    if (!runResponse.ok) {
      const errorData = await runResponse.json().catch(() => ({}));

      throw new Error(
        errorData.message ||
          "Failed to run AI matching."
      );
    }

    await runResponse.json();

    const resultsResponse = await fetch(
  `https://govcatalyst-backend.onrender.com/api/matches/problem/${problemId}`
);

    if (!resultsResponse.ok) {
      throw new Error(
        "Failed to load AI matching results."
      );
    }

    const resultsData = await resultsResponse.json();

    const results =
      resultsData.matches ||
      resultsData.data ||
      [];

    setMatchingResults(results);
  } catch (error) {
    console.error("AI matching failed:", error);

    setMatchingStarted(false);

    alert(
      error.message ||
        "AI matching failed. Please try again."
    );
  }
};

   
const selectMatchingChallenge = (challengeId) => {
  const challenge =
    challenges.find(
      (item) => String(item.id) === String(challengeId)
    ) ||
    backendChallenges.find(
      (item) => String(item.id) === String(challengeId)
    );

  setSelectedMatchingChallenge(challenge || null);
  setMatchingStarted(false);
  setRecommendedStartup(null);
};

  const recommendStartup = (
    startup
  ) => {
    setRecommendedStartup(startup);

    if (startup.proposal) {
      setSelectedProposal(
        startup.proposal
      );
    }
  };

  const openStartupProposal = (
    startup
  ) => {
    if (startup.proposal) {
      setSelectedProposal(
        startup.proposal
      );

      setActiveSection("evaluation");
    } else {
      alert(
        `${startup.name} is a prototype startup profile. A live proposal will appear here when the startup submits one.`
      );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="government-dashboard">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="government-sidebar">

        <div className="government-brand">

          <div className="government-brand-icon">
            G
          </div>

          <div>
            <strong>
              GovCatalyst
            </strong>

            <span>
              Government Innovation
            </span>
          </div>

        </div>


        <div className="government-sidebar-label">
          WORKSPACE
        </div>


        <nav className="government-navigation">

          {navigationItems.map(
            (item) => (
              <button
                type="button"
                key={item.id}
                className={`government-nav-item ${
                  activeSection ===
                  item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(
                    item.id
                  )
                }
              >

                <span className="government-nav-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </button>
            )
          )}

        </nav>


        <div className="government-sidebar-bottom">

          <div className="government-sidebar-profile">

            <div className="government-profile-avatar">
              G
            </div>

            <div>
              <strong>
                Government
              </strong>

              <span>
                Administration
              </span>
            </div>

          </div>


          {setPage && (
            <button
              type="button"
              className="government-logout-button"
              onClick={() =>
                setPage("home")
              }
            >
              ← Exit Dashboard
            </button>
          )}

        </div>

      </aside>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="government-main">

        {/* HEADER */}

        <header className="government-dashboard-header">
<div className="notification-bell">
  <button
    type="button"
    onClick={() => setActiveSection("notifications")}
    title="Notifications"
  >
    🔔
    {unreadNotificationCount > 0 && (
      <span className="notification-count">
        {unreadNotificationCount}
      </span>
    )}
  </button>
</div>
          <div>

            <span>
              GOVERNMENT INNOVATION PLATFORM
            </span>

            <h1>
              Government Dashboard
            </h1>

          </div>

          <div className="government-header-right">

            <div className="government-live-indicator">
              <span></span>
              Platform Active
            </div>

            <div className="government-header-avatar">
              G
            </div>

          </div>

        </header>


        <div className="government-content">

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeSection === "notifications" && (
            <section className="government-page-section notifications-page">

              <div className="government-page-title">

                <div>
                  <span>ACTIVITY CENTER</span>
                  <h2>Notifications</h2>
                  <p>Stay updated on proposals, evaluations and pilot activities.</p>
                </div>

                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    className="government-secondary-button"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark All as Read
                  </button>
                )}

              </div>

              <div className="notifications-list">

                {notifications.length === 0 ? (
                  <div className="government-empty-state">
                    No notifications available.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-card ${
                        notification.read ? "read" : "unread"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >

                      <div className="notification-icon">
                        {notification.type === "proposal" && "📄"}
                        {notification.type === "evaluation" && "📝"}
                        {notification.type === "pilot" && "🧪"}
                      </div>

                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <small>{notification.time}</small>
                      </div>

                      {!notification.read && (
                        <span className="notification-dot"></span>
                      )}

                    </div>
                  ))
                )}

              </div>

            </section>
          )}

          {/* =================================================
              DASHBOARD
          ================================================= */}

          {activeSection ===
            "dashboard" && (
            <>

              <section className="government-welcome">

                <div>

                  <span>
                    GOVERNMENT WORKSPACE
                  </span>

                  <h2>
                    Manage Public Innovation
                  </h2>

                  <p>
                    Create challenges, discover
                    startups, evaluate solutions
                    and move successful innovations
                    toward deployment.
                  </p>

                </div>

                <button
                  type="button"
                  className="government-primary-button"
                  onClick={
                    openCreateChallenge
                  }
                >
                  + Create Challenge
                </button>

              </section>


              {/* STATS */}

              <div className="government-stat-grid">

                <div className="government-stat-card">

                  <div className="government-stat-icon blue">
                    📋
                  </div>

                  <div>
                    <span>
                      Active Challenges
                    </span>

                    <strong>
                      {activeChallengeCount}
                    </strong>

                    <small>
                      Government opportunities
                    </small>
                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon orange">
                    📥
                  </div>

                  <div>
                    <span>
                      Proposals
                    </span>

                    <strong>
                      {submittedCount}
                    </strong>

                    <small>
                      Startup submissions
                    </small>
                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon purple">
                    ⭐
                  </div>

                  <div>
                    <span>
                      Shortlisted
                    </span>

                    <strong>
                      {shortlistedCount}
                    </strong>

                    <small>
                      Solutions progressing
                    </small>
                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon green">
                    🧪
                  </div>

                  <div>
                    <span>
                      Pilot Ready
                    </span>

                    <strong>
                      {pilotCount}
                    </strong>

                    <small>
                      Approved solutions
                    </small>
                  </div>

                </div>

              </div>


              {/* TWO COLUMN */}

              <div className="government-two-column">

                {/* CHALLENGES */}

                <section className="government-section">

                  <div className="government-section-heading">

                    <div>

                      <span>
                        CURRENT WORK
                      </span>

                      <h3>
                        Active Challenges
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="government-link-button"
                      onClick={() =>
                        setActiveSection(
                          "challenges"
                        )
                      }
                    >
                      View All →
                    </button>

                  </div>


                  <div className="government-challenge-list">

                    {challenges.length ===
                    0 ? (
                      <div className="government-empty-state">
                        No challenges available yet.
                      </div>
                    ) : (
                      challenges
                        .slice(0, 4)
                        .map(
                          (
                            challenge
                          ) => (
                            <div
                              className="government-challenge-row"
                              key={
                                challenge.id
                              }
                            >

                              <div className="challenge-row-icon">
                                {getCategoryIcon(
                                  challenge.category
                                )}
                              </div>

                              <div className="challenge-row-main">

                                <strong>
                                  {
                                    challenge.title
                                  }
                                </strong>

                                <span>
                                  {
                                    challenge.id
                                  }{" "}
                                  •{" "}
                                  {
                                    challenge.category
                                  }
                                </span>

                              </div>

                              <div className="challenge-row-status">

                                <span className="status-dot"></span>

                                {
                                  challenge.applications ||
                                  0
                                }{" "}
                                applications

                              </div>

                            </div>
                          )
                        )
                    )}

                  </div>

                </section>


                {/* PROPOSAL OVERVIEW */}

                <section className="government-section">

                  <div className="government-section-heading">

                    <div>

                      <span>
                        STARTUP ACTIVITY
                      </span>

                      <h3>
                        Proposal Overview
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="government-link-button"
                      onClick={() =>
                        setActiveSection(
                          "evaluation"
                        )
                      }
                    >
                      Review →
                    </button>

                  </div>


                  <div className="government-activity-list">

                    <div className="government-activity-item">

                      <div className="activity-icon">
                        📥
                      </div>

                      <div className="activity-content">

                        <strong>
                          Proposals Received
                        </strong>

                        <p>
                          {
                            submittedCount
                          }{" "}
                          startup{" "}
                          {
                            submittedCount ===
                            1
                              ? "proposal"
                              : "proposals"
                          }{" "}
                          submitted.
                        </p>

                      </div>

                    </div>


                    <div className="government-activity-item">

                      <div className="activity-icon">
                        🔎
                      </div>

                      <div className="activity-content">

                        <strong>
                          Under Review
                        </strong>

                        <p>
                          {
                            reviewCount
                          }{" "}
                          proposal
                          {
                            reviewCount !==
                            1
                              ? "s"
                              : ""
                          }{" "}
                          currently being evaluated.
                        </p>

                      </div>

                    </div>


                    <div className="government-activity-item">

                      <div className="activity-icon">
                        ⭐
                      </div>

                      <div className="activity-content">

                        <strong>
                          Shortlisted
                        </strong>

                        <p>
                          {
                            shortlistedCount
                          }{" "}
                          startup
                          {
                            shortlistedCount !==
                            1
                              ? "s"
                              : ""
                          }{" "}
                          shortlisted.
                        </p>

                      </div>

                    </div>

                  </div>

                </section>

              </div>


              {/* QUICK ACTIONS */}

              <section className="government-section">

                <div className="government-section-heading">

                  <div>

                    <span>
                      QUICK ACTIONS
                    </span>

                    <h3>
                      Manage Innovation Workflow
                    </h3>

                  </div>

                </div>


                <div className="government-quick-actions">

                  <button
                    type="button"
                    onClick={
                      openCreateChallenge
                    }
                  >
                    <span>
                      📋
                    </span>

                    <strong>
                      Create Challenge
                    </strong>

                    <small>
                      Publish a new public-sector need
                    </small>
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "matching"
                      )
                    }
                  >
                    <span>
                      🤖
                    </span>

                    <strong>
                      Find Startups
                    </strong>

                    <small>
                      Discover relevant solutions
                    </small>
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "evaluation"
                      )
                    }
                  >
                    <span>
                      🔎
                    </span>

                    <strong>
                      Review Proposals
                    </strong>

                    <small>
                      Evaluate startup submissions
                    </small>
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "pilots"
                      )
                    }
                  >
                    <span>
                      🧪
                    </span>

                    <strong>
                      Manage Pilots
                    </strong>

                    <small>
                      Track approved solutions
                    </small>
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "procurement"
                      )
                    }
                  >
                    <span>
                      📑
                    </span>

                    <strong>
                      Procurement
                    </strong>

                    <small>
                      Continue toward adoption
                    </small>
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "analytics"
                      )
                    }
                  >
                    <span>
                      📊
                    </span>

                    <strong>
                      Analytics
                    </strong>

                    <small>
                      View platform outcomes
                    </small>
                  </button>

                </div>

              </section>

            </>
          )}


          {/* =================================================
              CHALLENGES
          ================================================= */}

          {activeSection ===
            "challenges" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    GOVERNMENT CHALLENGES
                  </span>

                  <h2>
                    Public Challenge Management
                  </h2>

                  <p>
                    Define public-sector needs
                    and publish opportunities for
                    eligible startups.
                  </p>

                </div>

                <button
                  type="button"
                  className="government-primary-button"
                  onClick={() =>
                    setShowChallengeForm(
                      true
                    )
                  }
                >
                  + Create Challenge
                </button>

              </div>


              {showChallengeForm && (
                <div className="challenge-form-card">

                  <div className="form-card-header">

                    <div>

                      <span>
                        NEW OPPORTUNITY
                      </span>

                      <h3>
                        Create Public Challenge
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="form-close"
                      onClick={() =>
                        setShowChallengeForm(
                          false
                        )
                      }
                    >
                      ×
                    </button>

                  </div>


                  <form
                    onSubmit={
                      createChallenge
                    }
                  >

                    <div className="form-grid">

                      <div className="form-group full">

                        <label>
                          Challenge Title
                        </label>

                        <input
                          type="text"
                          name="title"
                          value={
                            challengeForm.title
                          }
                          onChange={
                            handleFormChange
                          }
                          placeholder="Example: AI-based crop stress detection"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Government Department
                        </label>

                        <input
                          type="text"
                          name="department"
                          value={
                            challengeForm.department
                          }
                          onChange={
                            handleFormChange
                          }
                          placeholder="Department name"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Challenge Category
                        </label>

                        <select
                          name="category"
                          value={
                            challengeForm.category
                          }
                          onChange={
                            handleFormChange
                          }
                        >

                          <option value="">
                            Select category
                          </option>

                          <option value="Agriculture">
                            Agriculture
                          </option>

                          <option value="Healthcare">
                            Healthcare
                          </option>

                          <option value="Smart Cities">
                            Smart Cities
                          </option>

                          <option value="Education">
                            Education
                          </option>

                          <option value="Environment">
                            Environment
                          </option>

                          <option value="Public Safety">
                            Public Safety
                          </option>

                        </select>

                      </div>


                      <div className="form-group">

                        <label>
                          Indicative Budget
                        </label>

                        <input
                          type="text"
                          name="budget"
                          value={
                            challengeForm.budget
                          }
                          onChange={
                            handleFormChange
                          }
                          placeholder="Example: ₹10,00,000"
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Submission Deadline
                        </label>

                        <input
                          type="date"
                          name="deadline"
                          value={
                            challengeForm.deadline
                          }
                          onChange={
                            handleFormChange
                          }
                        />

                      </div>


                      <div className="form-group full">

                        <label>
                          Challenge Description
                        </label>

                        <textarea
                          name="description"
                          value={
                            challengeForm.description
                          }
                          onChange={
                            handleFormChange
                          }
                          placeholder="Describe the public problem, expected outcome and requirements..."
                          rows="5"
                        />

                      </div>

                    </div>


                    <div className="form-actions">

                      <button
                        type="button"
                        className="government-cancel-button"
                        onClick={() =>
                          setShowChallengeForm(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="government-primary-button"
                      >
                        Publish Challenge →
                      </button>

                    </div>

                  </form>

                </div>
              )}


              <div className="government-table-card">

                <div className="table-header">

                  <div>

                    <strong>
                      Active Public Challenges
                    </strong>

                    <span>
                      {challenges.length}{" "}
                      challenges
                    </span>

                  </div>

                </div>


                <div className="government-table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>
                          Challenge
                        </th>

                        <th>
                          Department
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Applications
                        </th>

                        <th>
                          Deadline
                        </th>

                        <th>
                          Status
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {challenges.length ===
                      0 ? (
                        <tr>
                          <td colSpan="6">
                            No challenges created yet.
                          </td>
                        </tr>
                      ) : (
                        backendChallenges.map(
                          (
                            challenge
                          ) => (
                            <tr
                              key={
                                challenge.id
                              }
                            >

                              <td>

                                <div className="table-challenge">

                                  <strong>
                                    {
                                      challenge.title
                                    }
                                  </strong>

                                  <span>
                                    {
                                      challenge.id
                                    }
                                  </span>

                                </div>

                              </td>

                              <td>
                                {
                                  challenge.department
                                }
                              </td>

                              <td>
                                {
                                  challenge.category
                                }
                              </td>

                              <td>
                                {
                                  challenge.applications ||
                                  0
                                }
                              </td>

                              <td>
                                {
                                  challenge.deadline
                                }
                              </td>

                              <td>

                                <span className="table-status">
                                  ●{" "}
                                  {
                                    challenge.status
                                  }
                                </span>

                              </td>

                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </section>
          )}


          {/* =================================================
              AI MATCHING
          ================================================= */}

          {activeSection ===
            "matching" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    AI-ASSISTED DISCOVERY
                  </span>

                  <h2>
                    AI Startup Matching
                  </h2>

                  <p>
                    Match government challenges
                    with startup capabilities,
                    technologies and solution areas.
                  </p>

                </div>

              </div>


              <div className="ai-matching-hero">

                <div className="ai-matching-hero-icon">
                  🤖
                </div>

                <div className="ai-matching-hero-content">

                  <span>
                    GOVCATALYST MATCHING ENGINE
                  </span>

                  <h3>
                    Find the right startup for every challenge
                  </h3>

                  <p>
                    The matching engine compares
                    challenge requirements with
                    startup sector, technology and
                    deployment capabilities.
                  </p>

                </div>

                <div className="ai-matching-hero-badge">

                  <strong>
                    AI
                  </strong>

                  <span>
                    Assisted
                  </span>

                </div>

              </div>


              <div className="matching-control-card">

                <div className="matching-control-header">

                  <div>

                    <span>
                      STEP 01
                    </span>

                    <h3>
                      Select Government Challenge
                    </h3>

                    <p>
                      Choose a challenge to generate
                      relevant startup matches.
                    </p>

                  </div>

                  <div className="matching-step-number">
                    01
                  </div>

                </div>


                {challenges.length ===
                0 ? (
                  <div className="government-empty-state">

                    <div className="matching-empty-icon">
                      📋
                    </div>

                    <strong>
                      No challenges available
                    </strong>

                    <p>
                      Create a government
                      challenge before running
                      AI matching.
                    </p>

                    <button
                      type="button"
                      className="government-primary-button"
                      onClick={
                        openCreateChallenge
                      }
                    >
                      + Create Challenge
                    </button>

                  </div>
                ) : (
                  <div className="matching-challenge-selector">

                    {challenges.map(
                      (challenge) => (
                        <button
                          type="button"
                          key={
                            challenge.id
                          }
                          className={`matching-challenge-option ${
                            selectedMatchingChallenge?.id ===
                            challenge.id
                              ? "selected"
                              : ""
                          }`}
                        onClick={() => selectMatchingChallenge(challenge.id)}
                        >

                          <div className="matching-option-icon">
                            {getCategoryIcon(
                              challenge.category
                            )}
                          </div>

                          <div className="matching-option-content">

                            <strong>
                              {
                                challenge.title
                              }
                            </strong>

                            <span>
                              {
                                challenge.department
                              }
                            </span>

                            <small>
                              {
                                challenge.category
                              }{" "}
                              •{" "}
                              {
                                challenge.id
                              }
                            </small>

                          </div>

                          <div className="matching-option-check">

                            {selectedMatchingChallenge?.id ===
                            challenge.id
                              ? "✓"
                              : "○"}

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}


                {selectedMatchingChallenge && (
                  <div className="selected-challenge-preview">

                    <div>

                      <span>
                        SELECTED CHALLENGE
                      </span>

                      <h4>
                        {
                          selectedMatchingChallenge.title
                        }
                      </h4>

                      <p>
                        {selectedMatchingChallenge.description ||
                          selectedMatchingChallenge.problem ||
                          "Government innovation challenge."}
                      </p>

                    </div>

                    <button
                      type="button"
                      className="government-primary-button"
                      onClick={
                        startMatching
                      }
                    >
                      🤖 Run AI Matching
                    </button>

                  </div>
                )}

              </div>


              {matchingStarted && (
                <div className="matching-engine-stats">

                  <div className="matching-engine-stat">

                    <div>
                      🔍
                    </div>

                    <span>
                      Startups Analyzed
                    </span>

                    <strong>
                      {
                        startupProfiles.length
                      }
                    </strong>

                  </div>


                  <div className="matching-engine-stat">

                    <div>
                      🎯
                    </div>

                    <span>
                      Matches Generated
                    </span>

                    <strong>
                      {
                        matchingResults.length
                      }
                    </strong>

                  </div>


                  <div className="matching-engine-stat">

                    <div>
                      📊
                    </div>

                    <span>
                      Top Match Score
                    </span>

                    <strong>
                      {
                        matchingResults[0]
                          ?.match
                          .total || 0
                      }%
                    </strong>

                  </div>


                  <div className="matching-engine-stat">

                    <div>
                      ⚡
                    </div>

                    <span>
                      Matching Status
                    </span>

                    <strong>
                      Complete
                    </strong>

                  </div>

                </div>
              )}


              {matchingStarted && (
                <div className="government-table-card matching-results-card">

                  <div className="table-header">

                    <div>

                      <strong>
                        Recommended Startup Matches
                      </strong>

                      <span>
                        Ranked by challenge compatibility
                      </span>

                    </div>

                    <div className="matching-result-label">
                      {
                        selectedMatchingChallenge?.title
                      }
                    </div>

                  </div>


                  <div className="matching-results-list">

                    {matchingResults.length ===
                    0 ? (
                      <div className="government-empty-state">

                        <div className="matching-empty-icon">
                          🔎
                        </div>

                        <strong>
                          No matching startups found
                        </strong>

                        <p>
                          Try creating a
                          challenge with more
                          detailed requirements.
                        </p>

                      </div>
                    ) : (
                      matchingResults.map(
                        (
                          startup,
                          index
                        ) => (
                          <div
                            className={`ai-startup-match-card ${
                              recommendedStartup?.id ===
                              startup.id
                                ? "recommended"
                                : ""
                            }`}
                            key={`${startup.id}-${index}`}
                          >

                            <div className="ai-match-rank">
                              #
                              {index + 1}
                            </div>

                            <div className="startup-match-avatar ai-match-avatar">
                              {
                                startup.initials
                              }
                            </div>

                            <div className="ai-match-main">

                              <div className="ai-match-title-row">

                                <div>

                                  <h3>
                                    {
                                      startup.name
                                    }
                                  </h3>

                                  <span>
                                    {startup.categories?.join(
                                      " • "
                                    )}
                                  </span>

                                </div>

                                <div className="ai-match-score">

                                  <strong>
                                   {Number(startup.matchScore || 0).toFixed(1)}%
                                  </strong>

                                  <span>
                                    Match
                                  </span>

                                </div>

                              </div>


                              <p className="ai-match-description">
                                {
                                  startup.description
                                }
                              </p>


                              <div className="ai-match-tags">

                                {startup.technologies
                                  ?.filter(
                                    (
                                      technology
                                    ) =>
                                      technology
                                  )
                                  .slice(
                                    0,
                                    5
                                  )
                                  .map(
                                    (
                                      technology
                                    ) => (
                                      <span
                                        key={
                                          technology
                                        }
                                      >
                                        {
                                          technology
                                        }
                                      </span>
                                    )
                                  )}

                              </div>


                              <div className="ai-match-score-grid">

                                <div>

                                  <span>
                                    Problem Fit
                                  </span>

                                  <div className="ai-score-bar">

                                    <div
                                      style={{
                                        width: `${startup.match.problemFit}%`,
                                      }}
                                    ></div>

                                  </div>

                                  <strong>
                                    {
                                      startup
                                        .match
                                        .problemFit
                                    }%
                                  </strong>

                                </div>


                                <div>

                                  <span>
                                    Technology Fit
                                  </span>

                                  <div className="ai-score-bar">

                                    <div
                                      style={{
                                        width: `${startup.match.technologyFit}%`,
                                      }}
                                    ></div>

                                  </div>

                                  <strong>
                                    {
                                      startup
                                        .match
                                        .technologyFit
                                    }%
                                  </strong>

                                </div>


                                <div>

                                  <span>
                                    Deployment Readiness
                                  </span>

                                  <div className="ai-score-bar">

                                    <div
                                      style={{
                                        width: `${startup.match.readiness}%`,
                                      }}
                                    ></div>

                                  </div>

                                  <strong>
                                    {
                                      startup
                                        .match
                                        .readiness
                                    }%
                                  </strong>

                                </div>

                              </div>


                              <div className="ai-match-reason">

                                <span>
                                  ✨
                                </span>

                                <p>

                                  <strong>
                                    Why this match:
                                  </strong>{" "}

                                  {
                                    startup
                                      .match
                                      .reason
                                  }

                                </p>

                              </div>


                              <div className="ai-match-actions">

                                <button
                                  type="button"
                                  className="government-secondary-button"
                                  onClick={() =>
                                    openStartupProposal(
                                      startup
                                    )
                                  }
                                >
                                  {startup.proposal
                                    ? "View Proposal"
                                    : "View Profile"}
                                </button>


                                <button
                                  type="button"
                                  className="government-primary-button"
                                  onClick={() =>
                                    recommendStartup(
                                      startup
                                    )
                                  }
                                >
                                  {recommendedStartup?.id ===
                                  startup.id
                                    ? "✓ Recommended"
                                    : "Recommend Startup"}
                                </button>

                              </div>

                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>

                </div>
              )}


              {recommendedStartup && (
                <div className="matching-recommendation-banner">

                  <div className="matching-recommendation-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      STARTUP RECOMMENDED
                    </span>

                    <h3>
                      {
                        recommendedStartup.name
                      }
                    </h3>

                    <p>
                      {
                        recommendedStartup
                          .match.total
                      }%
                      compatibility with{" "}
                      {
                        selectedMatchingChallenge?.title
                      }.
                      {
                        recommendedStartup.proposal
                          ? " The submitted proposal is now ready for government evaluation."
                          : " This startup profile can be considered when a proposal is submitted."
                      }
                    </p>

                  </div>


                  {recommendedStartup.proposal && (
                    <button
                      type="button"
                      className="government-primary-button"
                      onClick={() =>
                        setActiveSection(
                          "evaluation"
                        )
                      }
                    >
                      Go to Evaluation →
                    </button>
                  )}

                </div>
              )}


              <div className="matching-method-card">

                <div className="matching-method-header">

                  <span>
                    HOW MATCHING WORKS
                  </span>

                  <h3>
                    Multi-factor startup compatibility
                  </h3>

                </div>


                <div className="matching-method-grid">

                  <div>

                    <div>
                      🎯
                    </div>

                    <strong>
                      Problem Fit
                    </strong>

                    <p>
                      Compares the startup's
                      solution with the
                      public-sector problem.
                    </p>

                    <span>
                      35% weight
                    </span>

                  </div>


                  <div>

                    <div>
                      ⚙️
                    </div>

                    <strong>
                      Technology Fit
                    </strong>

                    <p>
                      Identifies overlap between
                      required and available
                      technologies.
                    </p>

                    <span>
                      35% weight
                    </span>

                  </div>


                  <div>

                    <div>
                      🚀
                    </div>

                    <strong>
                      Deployment Readiness
                    </strong>

                    <p>
                      Considers the startup's
                      readiness to move from
                      solution discovery toward
                      implementation.
                    </p>

                    <span>
                      30% weight
                    </span>

                  </div>

                </div>

              </div>

            </section>
          )}


          {/* =================================================
              EVALUATION
          ================================================= */}

          {activeSection ===
            "evaluation" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    PROPOSAL REVIEW
                  </span>

                  <h2>
                    Evaluate Startup Solutions
                  </h2>

                  <p>
                    Review startup submissions,
                    score their solutions and move
                    them through the evaluation
                    pipeline.
                  </p>

                </div>

              </div>


              {/* EVALUATION STATS */}

              <div className="government-stat-grid">

                <div className="government-stat-card">

                  <div className="government-stat-icon blue">
                    📥
                  </div>

                  <div>

                    <span>
                      Submitted
                    </span>

                    <strong>
                      {submittedCount}
                    </strong>

                    <small>
                      Total proposals
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon orange">
                    🔎
                  </div>

                  <div>

                    <span>
                      Under Review
                    </span>

                    <strong>
                      {reviewCount}
                    </strong>

                    <small>
                      Being evaluated
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon purple">
                    📊
                  </div>

                  <div>

                    <span>
                      Scored
                    </span>

                    <strong>
                      {evaluationCount}
                    </strong>

                    <small>
                      Evaluation completed
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon green">
                    ⭐
                  </div>

                  <div>

                    <span>
                      Shortlisted
                    </span>

                    <strong>
                      {shortlistedCount}
                    </strong>

                    <small>
                      Selected for next stage
                    </small>

                  </div>

                </div>

              </div>


              {/* PROPOSAL TABLE */}

              <div className="government-table-card">

                <div className="table-header">

                  <div>

                    <strong>
                      Startup Proposals
                    </strong>

                    <span>
                      {proposals.length}{" "}
                      submitted
                    </span>

                  </div>

                </div>


                {proposals.length ===
                0 ? (
                  <div className="government-empty-state">

                    <div
                      style={{
                        fontSize:
                          "42px",
                        marginBottom:
                          "12px",
                      }}
                    >
                      📭
                    </div>

                    <strong>
                      No startup proposals yet
                    </strong>

                    <p>
                      When startups apply
                      to your challenges,
                      their proposals will
                      appear here.
                    </p>

                  </div>
                ) : (
                  <div className="government-table-wrapper">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Startup
                          </th>

                          <th>
                            Challenge
                          </th>

                          <th>
                            Solution
                          </th>

                          <th>
                            Budget
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Score
                          </th>

                          <th>
                            Action
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {proposals.map(
                          (proposal) => {

                            const scores =
                              getProposalEvaluation(
                                proposal
                              );

                            const scoreComplete =
                              isEvaluationComplete(
                                scores
                              );

                            return (
                              <tr
                                key={
                                  proposal.id
                                }
                              >

                                <td>

                                  <div className="table-challenge">

                                    <strong>
                                      {
                                        proposal.startupName
                                      }
                                    </strong>

                                    <span>
                                      {
                                        proposal.email ||
                                        proposal.contactEmail ||
                                        "—"
                                      }
                                    </span>

                                  </div>

                                </td>


                                <td>
                                  {
                                    proposal.challengeTitle
                                  }
                                </td>


                                <td>
                                  {
                                    proposal.solutionTitle
                                  }
                                </td>


                                <td>
                                  {
                                    proposal.proposedBudget ||
                                    "—"
                                  }
                                </td>


                                <td>

                                  <span className="table-stage">
                                    {
                                      proposal.status
                                    }
                                  </span>

                                </td>


                                <td>

                                  {scoreComplete ? (
                                    <strong className="evaluation-table-score">
                                      {calculateOverallScore(
                                        scores
                                      )}
                                      /10
                                    </strong>
                                  ) : (
                                    <span>
                                      —
                                    </span>
                                  )}

                                </td>


                                <td>

                                  <button
                                    type="button"
                                    className="table-action"
                                    onClick={() =>
                                      setSelectedProposal(
                                        proposal
                                      )
                                    }
                                  >
                                    Review →
                                  </button>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </div>


              {/* SELECTED PROPOSAL */}

              {selectedProposal && (
                <div className="evaluation-card">

                  <div className="evaluation-top">

                    <div className="startup-match-avatar">

                      {selectedProposal.startupName
                        ?.substring(
                          0,
                          2
                        )
                        .toUpperCase()}

                    </div>


                    <div>

                      <span className="evaluation-status">
                        {
                          selectedProposal.status
                        }
                      </span>


                      {isEvaluationComplete(
                        getProposalEvaluation(
                          selectedProposal
                        )
                      ) && (
                        <span className="evaluation-complete-badge">
                          ✓ Evaluation Complete
                        </span>
                      )}

                    </div>

                  </div>


                  <h3>
                    {
                      selectedProposal.solutionTitle
                    }
                  </h3>


                  <p>
                    <strong>
                      Startup:
                    </strong>{" "}
                    {
                      selectedProposal.startupName
                    }
                  </p>


                  <p>
                    <strong>
                      Challenge:
                    </strong>{" "}
                    {
                      selectedProposal.challengeTitle
                    }
                  </p>


                  <p>
                    <strong>
                      Contact:
                    </strong>{" "}
                    {
                      selectedProposal.email ||
                      selectedProposal.contactEmail ||
                      "Not provided"
                    }
                  </p>


                  <p>
                    <strong>
                      Proposed Budget:
                    </strong>{" "}
                    {
                      selectedProposal.proposedBudget ||
                      "Not specified"
                    }
                  </p>


                  <p>
                    <strong>
                      Implementation Time:
                    </strong>{" "}
                    {
                      selectedProposal.implementationTime ||
                      "Not specified"
                    }
                  </p>


                  <div className="evaluation-description-box">

                    <strong>
                      Solution Description
                    </strong>

                    <p>
                      {
                        selectedProposal.solutionDescription ||
                        "No description provided."
                      }
                    </p>

                  </div>


                  {/* =========================================
                      SCORING
                  ========================================= */}

                  <div className="evaluation-scoring-card">

                    <div className="evaluation-scoring-header">

                      <div>

                        <span>
                          EVALUATION SCORE
                        </span>

                        <h3>
                          Government Evaluation Criteria
                        </h3>

                        <p>
                          Enter a score from
                          0 to 10 for every
                          criterion. The overall
                          score is calculated
                          automatically using
                          the assigned weights.
                        </p>

                      </div>


                      <div className="evaluation-overall-score">

                        <span>
                          OVERALL SCORE
                        </span>

                        <strong>

                          {calculateOverallScore(
                            getProposalEvaluation(
                              selectedProposal
                            )
                          )}

                          <small>
                            /10
                          </small>

                        </strong>

                        <em>
                          Weighted Score
                        </em>

                      </div>

                    </div>


                    <div className="evaluation-criteria-list">

                      {evaluationCriteria.map(
                        (criterion) => {

                          const scores =
                            getProposalEvaluation(
                              selectedProposal
                            );

                          const currentScore =
                            scores[
                              criterion.key
                            ];

                          const weightedScore =
                            currentScore !==
                              "" &&
                            currentScore !==
                              undefined
                              ? (
                                  Number(
                                    currentScore
                                  ) *
                                  (criterion.weight /
                                    100)
                                ).toFixed(
                                  2
                                )
                              : "—";

                          return (
                            <div
                              className="evaluation-criterion-row"
                              key={
                                criterion.key
                              }
                            >

                              <div className="evaluation-criterion-info">

                                <strong>
                                  {
                                    criterion.label
                                  }
                                </strong>

                                <span>
                                  Weight:{" "}
                                  {
                                    criterion.weight
                                  }
                                  %
                                </span>

                              </div>


                              <div className="evaluation-score-control">

                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={
                                    currentScore ??
                                    ""
                                  }
                                  placeholder="0–10"
                                  onChange={(
                                    event
                                  ) =>
                                    handleEvaluationScoreChange(
                                      selectedProposal.id,
                                      criterion.key,
                                      event.target.value
                                    )
                                  }
                                />

                                <span>
                                  /10
                                </span>

                              </div>


                              <div className="evaluation-weighted-score">

                                <span>
                                  Weighted
                                </span>

                                <strong>
                                  {
                                    weightedScore
                                  }
                                </strong>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>


                    {/* SCORE SUMMARY */}

                    <div className="evaluation-score-summary">

                      {evaluationCriteria.map(
                        (criterion) => {

                          const score =
                            getProposalEvaluation(
                              selectedProposal
                            )[
                              criterion.key
                            ];

                          return (
                            <div
                              key={
                                criterion.key
                              }
                            >

                              <span>
                                {
                                  criterion.label
                                }
                              </span>

                              <strong>
                                {score !==
                                  "" &&
                                score !==
                                  undefined
                                  ? score
                                  : "—"}
                                /10
                              </strong>

                            </div>
                          );
                        }
                      )}

                    </div>


                    {/* FINAL SCORE */}

                    <div className="evaluation-final-score">

                      <div>

                        <span>
                          FINAL EVALUATION SCORE
                        </span>

                        <strong>

                          {calculateOverallScore(
                            getProposalEvaluation(
                              selectedProposal
                            )
                          )}

                          <small>
                            /10
                          </small>

                        </strong>

                      </div>


                      <div className="evaluation-score-scale">

                        <span>
                          0
                        </span>

                        <div className="evaluation-score-track">

                          <div
                            className="evaluation-score-fill"
                            style={{
                              width: `${
                                calculateOverallScore(
                                  getProposalEvaluation(
                                    selectedProposal
                                  )
                                ) * 10
                              }%`,
                            }}
                          ></div>

                        </div>

                        <span>
                          10
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      WORKFLOW
                  ========================================= */}

                  <div className="evaluation-workflow">

                    <div className="evaluation-workflow-title">

                      <span>
                        PROPOSAL WORKFLOW
                      </span>

                      <h4>
                        Evaluation Progress
                      </h4>

                    </div>


                    <div className="evaluation-workflow-steps">

                      <div
                        className={`evaluation-workflow-step ${
                          [
                            "Submitted",
                            "Under Review",
                            "Evaluation Score",
                            "Shortlisted",
                            "Approved for Pilot",
                          ].includes(
                            selectedProposal.status
                          )
                            ? "active"
                            : ""
                        }`}
                      >

                        <span>
                          01
                        </span>

                        <strong>
                          Submitted
                        </strong>

                      </div>


                      <div
                        className={`evaluation-workflow-step ${
                          [
                            "Under Review",
                            "Evaluation Score",
                            "Shortlisted",
                            "Approved for Pilot",
                          ].includes(
                            selectedProposal.status
                          )
                            ? "active"
                            : ""
                        }`}
                      >

                        <span>
                          02
                        </span>

                        <strong>
                          Under Review
                        </strong>

                      </div>


                      <div
                        className={`evaluation-workflow-step ${
                          [
                            "Evaluation Score",
                            "Shortlisted",
                            "Approved for Pilot",
                          ].includes(
                            selectedProposal.status
                          )
                            ? "active"
                            : ""
                        }`}
                      >

                        <span>
                          03
                        </span>

                        <strong>
                          Evaluation Score
                        </strong>

                      </div>


                      <div
                        className={`evaluation-workflow-step ${
                          [
                            "Shortlisted",
                            "Approved for Pilot",
                          ].includes(
                            selectedProposal.status
                          )
                            ? "active"
                            : ""
                        }`}
                      >

                        <span>
                          04
                        </span>

                        <strong>
                          Shortlisted
                        </strong>

                      </div>


                      <div
                        className={`evaluation-workflow-step ${
                          selectedProposal.status ===
                          "Approved for Pilot"
                            ? "active"
                            : ""
                        }`}
                      >

                        <span>
                          05
                        </span>

                        <strong>
                          Approved for Pilot
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      ACTIONS
                  ========================================= */}

                  <div className="evaluation-actions">


                    <button
                      type="button"
                      className="government-secondary-button"
                      onClick={() =>
                        changeProposalStatus(
                          selectedProposal,
                          "Under Review"
                        )
                      }
                    >
                      🔎 Under Review
                    </button>


                    <button
                      type="button"
                      className="government-primary-button"
                      onClick={() =>
                        saveEvaluationScore(
                          selectedProposal
                        )
                      }
                    >
                      💾 Save Evaluation
                    </button>


                    <button
                      type="button"
                      className="government-secondary-button"
                      onClick={() =>
                        shortlistEvaluatedProposal(
                          selectedProposal
                        )
                      }
                    >
                      ⭐ Shortlist
                    </button>


                    <button
                      type="button"
                      className="government-primary-button"
                      onClick={() =>
                        approveEvaluatedProposal(
                          selectedProposal
                        )
                      }
                    >
                      🧪 Approve for Pilot
                    </button>


                    <button
                      type="button"
                      className="government-cancel-button"
                      onClick={() =>
                        changeProposalStatus(
                          selectedProposal,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>


                    <button
                      type="button"
                      className="government-secondary-button"
                      onClick={() =>
                        setSelectedProposal(
                          null
                        )
                      }
                    >
                      Close
                    </button>

                  </div>

                </div>
              )}

            </section>
          )}


          {/* =================================================
              PILOTS
          ================================================= */}

          {activeSection === "pilots" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    PILOT MANAGEMENT
                  </span>

                  <h2>
                    Pilot Programs
                  </h2>

                  <p>
                    Track solutions approved for
                    pilot implementation.
                  </p>

                </div>

              </div>


              <div className="government-stat-grid">

                <div className="government-stat-card">

                  <div className="government-stat-icon green">
                    🧪
                  </div>

                  <div>

                    <span>
                      Pilot Ready
                    </span>

                    <strong>
                      {pilotCount}
                    </strong>

                    <small>
                      Approved for pilot
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon orange">
                    🚀
                  </div>

                  <div>

                    <span>
                      Pilot In Progress
                    </span>

                    <strong>
                      {pilotStartedCount}
                    </strong>

                    <small>
                      Active pilots
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon blue">
                    ✓
                  </div>

                  <div>

                    <span>
                      Pilot Completed
                    </span>

                    <strong>
                      {pilotCompletedCount}
                    </strong>

                    <small>
                      Ready for procurement review
                    </small>

                  </div>

                </div>

              </div>


              {proposals.filter(
                (proposal) =>
                  proposal.status ===
                    "Approved for Pilot" ||
                  proposal.status ===
                    "Pilot Started" ||
                  proposal.status ===
                    "Pilot Completed"
              ).length === 0 ? (
                <div className="government-empty-state">

                  <div
                    style={{
                      fontSize: "44px",
                      marginBottom:
                        "12px",
                    }}
                  >
                    🧪
                  </div>

                  <strong>
                    No pilots started yet
                  </strong>

                  <p>
                    Approve a startup
                    proposal for pilot from
                    the Evaluation section.
                  </p>

                </div>
              ) : (
                <div className="pilot-grid">

                  {proposals
                    .filter(
                      (proposal) =>
                        proposal.status ===
                          "Approved for Pilot" ||
                        proposal.status ===
                          "Pilot Started" ||
                        proposal.status ===
                          "Pilot Completed"
                    )
                    .map((proposal) => {

                      const progress =
                        getPilotProgress(
                          proposal.status
                        );

                      return (
                        <div
                          className="pilot-card"
                          key={
                            proposal.id
                          }
                        >

                          <div className="pilot-card-header">

                            <span className="pilot-status active">
                              ●{" "}
                              {
                                getPilotLabel(
                                  proposal.status
                                )
                              }
                            </span>

                            <span>
                              {
                                proposal.id
                              }
                            </span>

                          </div>


                          <h3>
                            {
                              proposal.solutionTitle
                            }
                          </h3>

                          <p>
                            {
                              proposal.startupName
                            }
                          </p>

                          <p>
                            Challenge:{" "}
                            {
                              proposal.challengeTitle
                            }
                          </p>


                          <div className="pilot-progress">

                            <div className="pilot-progress-header">

                              <span>
                                Pilot Progress
                              </span>

                              <strong>
                                {progress}%
                              </strong>

                            </div>


                            <div className="pilot-progress-bar">

                              <div
                                style={{
                                  width: `${progress}%`,
                                }}
                              ></div>

                            </div>

                          </div>


                          {proposal.status ===
                            "Approved for Pilot" && (
                            <button
                              type="button"
                              className="government-primary-button full-width"
                              onClick={() =>
                                changeProposalStatus(
                                  proposal,
                                  "Pilot Started"
                                )
                              }
                            >
                              Start Pilot →
                            </button>
                          )}


                          {proposal.status ===
                            "Pilot Started" && (
                            <button
                              type="button"
                              className="government-primary-button full-width"
                              onClick={() =>
                                changeProposalStatus(
                                  proposal,
                                  "Pilot Completed"
                                )
                              }
                            >
                              Complete Pilot →
                            </button>
                          )}


                          {proposal.status ===
                            "Pilot Completed" && (
                            <button
                              type="button"
                              className="government-primary-button full-width"
                              onClick={() =>
                                changeProposalStatus(
                                  proposal,
                                  "Procurement Review"
                                )
                              }
                            >
                              Send to Procurement →
                            </button>
                          )}

                        </div>
                      );
                    })}

                </div>
              )}

            </section>
          )}


          {/* =================================================
              PROCUREMENT
          ================================================= */}

          {activeSection ===
            "procurement" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    PROCUREMENT PIPELINE
                  </span>

                  <h2>
                    Move Solutions Toward Procurement
                  </h2>

                  <p>
                    Track solutions through pilot
                    completion, procurement review,
                    contracting and deployment.
                  </p>

                </div>

              </div>


              <div className="government-stat-grid">

                <div className="government-stat-card">

                  <div className="government-stat-icon blue">
                    ✓
                  </div>

                  <div>

                    <span>
                      Pilot Completed
                    </span>

                    <strong>
                      {
                        pilotCompletedCount
                      }
                    </strong>

                    <small>
                      Ready for review
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon orange">
                    🔎
                  </div>

                  <div>

                    <span>
                      Procurement Review
                    </span>

                    <strong>
                      {
                        procurementReviewCount
                      }
                    </strong>

                    <small>
                      Under procurement review
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon purple">
                    ✓
                  </div>

                  <div>

                    <span>
                      Procurement Approved
                    </span>

                    <strong>
                      {
                        procurementApprovedCount
                      }
                    </strong>

                    <small>
                      Approved for contracting
                    </small>

                  </div>

                </div>


                <div className="government-stat-card">

                  <div className="government-stat-icon green">
                    🚀
                  </div>

                  <div>

                    <span>
                      Deployment Started
                    </span>

                    <strong>
                      {
                        deploymentStartedCount
                      }
                    </strong>

                    <small>
                      Solutions being deployed
                    </small>

                  </div>

                </div>

              </div>


              <div className="procurement-timeline">

                <div className="procurement-timeline-item completed">

                  <div className="procurement-timeline-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      STEP 01
                    </span>

                    <h3>
                      Challenge Published
                    </h3>

                    <p>
                      Government requirement defined.
                    </p>

                  </div>

                </div>


                <div className="procurement-timeline-item completed">

                  <div className="procurement-timeline-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      STEP 02
                    </span>

                    <h3>
                      Startup Matched
                    </h3>

                    <p>
                      Relevant startup solutions identified.
                    </p>

                  </div>

                </div>


                <div className="procurement-timeline-item completed">

                  <div className="procurement-timeline-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      STEP 03
                    </span>

                    <h3>
                      Evaluation & Pilot
                    </h3>

                    <p>
                      Government evaluates proposals and
                      pilot outcomes.
                    </p>

                  </div>

                </div>


                <div className="procurement-timeline-item current">

                  <div className="procurement-timeline-icon">
                    04
                  </div>

                  <div>

                    <span>
                      CURRENT STAGE
                    </span>

                    <h3>
                      Procurement Review
                    </h3>

                    <p>
                      Eligible pilot outcomes move through
                      procurement review.
                    </p>

                  </div>

                </div>


                <div className="procurement-timeline-item">

                  <div className="procurement-timeline-icon">
                    05
                  </div>

                  <div>

                    <span>
                      NEXT STAGE
                    </span>

                    <h3>
                      Contract Ready
                    </h3>

                    <p>
                      Procurement approval completed and
                      solution prepared for contracting.
                    </p>

                  </div>

                </div>


                <div className="procurement-timeline-item">

                  <div className="procurement-timeline-icon">
                    06
                  </div>

                  <div>

                    <span>
                      FUTURE
                    </span>

                    <h3>
                      Deployment
                    </h3>

                    <p>
                      Approved solutions move toward
                      wider deployment.
                    </p>

                  </div>

                </div>

              </div>


              {proposals.filter(
                (proposal) =>
                  proposal.status ===
                    "Pilot Completed" ||
                  proposal.status ===
                    "Procurement Review" ||
                  proposal.status ===
                    "Procurement Approved" ||
                  proposal.status ===
                    "Contract Ready" ||
                  proposal.status ===
                    "Deployment Started"
              ).length === 0 ? (
                <div className="government-empty-state">

                  <div
                    style={{
                      fontSize: "44px",
                      marginBottom:
                        "12px",
                    }}
                  >
                    📑
                  </div>

                  <strong>
                    No solutions in procurement
                  </strong>

                  <p>
                    Complete a pilot to move
                    a solution into procurement
                    review.
                  </p>

                </div>
              ) : (
                <div className="government-table-card">

                  <div className="table-header">

                    <div>

                      <strong>
                        Procurement Pipeline
                      </strong>

                      <span>
                        Solutions progressing toward deployment
                      </span>

                    </div>

                  </div>


                  <div className="government-table-wrapper">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Startup
                          </th>

                          <th>
                            Solution
                          </th>

                          <th>
                            Challenge
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Action
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {proposals
                          .filter(
                            (proposal) =>
                              proposal.status ===
                                "Pilot Completed" ||
                              proposal.status ===
                                "Procurement Review" ||
                              proposal.status ===
                                "Procurement Approved" ||
                              proposal.status ===
                                "Contract Ready" ||
                              proposal.status ===
                                "Deployment Started"
                          )
                          .map(
                            (
                              proposal
                            ) => (
                              <tr
                                key={
                                  proposal.id
                                }
                              >

                                <td>
                                  {
                                    proposal.startupName
                                  }
                                </td>

                                <td>
                                  {
                                    proposal.solutionTitle
                                  }
                                </td>

                                <td>
                                  {
                                    proposal.challengeTitle
                                  }
                                </td>

                                <td>

                                  <span className="table-stage">
                                    {
                                      getProcurementLabel(
                                        proposal.status
                                      )
                                    }
                                  </span>

                                </td>

                                <td>

                                  {proposal.status ===
                                    "Pilot Completed" && (
                                    <button
                                      type="button"
                                      className="table-action"
                                      onClick={() =>
                                        changeProposalStatus(
                                          proposal,
                                          "Procurement Review"
                                        )
                                      }
                                    >
                                      Start Review →
                                    </button>
                                  )}


                                  {proposal.status ===
                                    "Procurement Review" && (
                                    <button
                                      type="button"
                                      className="table-action"
                                      onClick={() =>
                                        changeProposalStatus(
                                          proposal,
                                          "Procurement Approved"
                                        )
                                      }
                                    >
                                      Approve Procurement →
                                    </button>
                                  )}


                                  {proposal.status ===
                                    "Procurement Approved" && (
                                    <button
                                      type="button"
                                      className="table-action"
                                      onClick={() =>
                                        changeProposalStatus(
                                          proposal,
                                          "Contract Ready"
                                        )
                                      }
                                    >
                                      Prepare Contract →
                                    </button>
                                  )}


                                  {proposal.status ===
                                    "Contract Ready" && (
                                    <button
                                      type="button"
                                      className="table-action"
                                      onClick={() =>
                                        changeProposalStatus(
                                          proposal,
                                          "Deployment Started"
                                        )
                                      }
                                    >
                                      Start Deployment →
                                    </button>
                                  )}


                                  {proposal.status ===
                                    "Deployment Started" && (
                                    <span className="table-status">
                                      ● Deployment Active
                                    </span>
                                  )}

                                </td>

                              </tr>
                            )
                          )}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

            </section>
          )}


          {/* =================================================
              ANALYTICS
          ================================================= */}

          {activeSection ===
            "analytics" && (
            <section className="government-page-section">

              <div className="government-page-title">

                <div>

                  <span>
                    IMPACT & INSIGHTS
                  </span>

                  <h2>
                    Innovation Analytics
                  </h2>

                  <p>
                    Monitor challenge activity,
                    proposals, pilots and
                    procurement progress.
                  </p>

                </div>

              </div>


              <div className="analytics-stat-grid">

                <div className="analytics-stat">

                  <span>
                    Total Challenges
                  </span>

                  <strong>
                    {challenges.length}
                  </strong>

                  <small>
                    Published challenges
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Startup Proposals
                  </span>

                  <strong>
                    {proposals.length}
                  </strong>

                  <small>
                    Submitted solutions
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Shortlisted
                  </span>

                  <strong>
                    {shortlistedCount}
                  </strong>

                  <small>
                    Moving forward
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Pilot Ready
                  </span>

                  <strong>
                    {pilotCount}
                  </strong>

                  <small>
                    Approved solutions
                  </small>

                </div>

              </div>


              <div className="analytics-stat-grid">

                <div className="analytics-stat">

                  <span>
                    Pilots In Progress
                  </span>

                  <strong>
                    {pilotStartedCount}
                  </strong>

                  <small>
                    Active pilots
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Pilots Completed
                  </span>

                  <strong>
                    {pilotCompletedCount}
                  </strong>

                  <small>
                    Completed pilots
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Procurement Approved
                  </span>

                  <strong>
                    {procurementApprovedCount}
                  </strong>

                  <small>
                    Approved solutions
                  </small>

                </div>


                <div className="analytics-stat">

                  <span>
                    Deployment Started
                  </span>

                  <strong>
                    {deploymentStartedCount}
                  </strong>

                  <small>
                    Active deployments
                  </small>

                </div>

              </div>


              <div className="analytics-grid">

                <div className="analytics-card">

                  <div className="analytics-card-header">

                    <div>

                      <span>
                        PIPELINE
                      </span>

                      <h3>
                        Proposal Status
                      </h3>

                    </div>

                  </div>


                  <div className="analytics-bars">

                    <div className="analytics-bar-row">

                      <span>
                        Submitted
                      </span>

                      <div className="analytics-bar">

                        <div
                          style={{
                            width:
                              proposals.length >
                              0
                                ? "100%"
                                : "0%",
                          }}
                        ></div>

                      </div>

                      <strong>
                        {
                          submittedCount
                        }
                      </strong>

                    </div>


                    <div className="analytics-bar-row">

                      <span>
                        Review
                      </span>

                      <div className="analytics-bar">

                        <div
                          style={{
                            width:
                              submittedCount >
                              0
                                ? `${
                                    (reviewCount /
                                      submittedCount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        ></div>

                      </div>

                      <strong>
                        {
                          reviewCount
                        }
                      </strong>

                    </div>


                    <div className="analytics-bar-row">

                      <span>
                        Evaluation
                      </span>

                      <div className="analytics-bar">

                        <div
                          style={{
                            width:
                              submittedCount >
                              0
                                ? `${
                                    (evaluationCount /
                                      submittedCount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        ></div>

                      </div>

                      <strong>
                        {
                          evaluationCount
                        }
                      </strong>

                    </div>


                    <div className="analytics-bar-row">

                      <span>
                        Shortlisted
                      </span>

                      <div className="analytics-bar">

                        <div
                          style={{
                            width:
                              submittedCount >
                              0
                                ? `${
                                    (shortlistedCount /
                                      submittedCount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        ></div>

                      </div>

                      <strong>
                        {
                          shortlistedCount
                        }
                      </strong>

                    </div>


                    <div className="analytics-bar-row">

                      <span>
                        Pilot
                      </span>

                      <div className="analytics-bar">

                        <div
                          style={{
                            width:
                              submittedCount >
                              0
                                ? `${
                                    (pilotCount /
                                      submittedCount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        ></div>

                      </div>

                      <strong>
                        {pilotCount}
                      </strong>

                    </div>

                  </div>

                </div>


                <div className="analytics-card">

                  <div className="analytics-card-header">

                    <div>

                      <span>
                        PLATFORM
                      </span>

                      <h3>
                        Workflow Summary
                      </h3>

                    </div>

                  </div>


                  <div
                    style={{
                      display:
                        "grid",
                      gap: "16px",
                    }}
                  >

                    <div>

                      <strong>
                        {
                          challenges.length
                        }
                      </strong>

                      <p>
                        Government challenges
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          proposals.length
                        }
                      </strong>

                      <p>
                        Startup proposals
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          reviewCount
                        }
                      </strong>

                      <p>
                        Proposals under review
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          evaluationCount
                        }
                      </strong>

                      <p>
                        Evaluations completed
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          shortlistedCount
                        }
                      </strong>

                      <p>
                        Shortlisted solutions
                      </p>

                    </div>


                    <div>

                      <strong>
                        {pilotCount}
                      </strong>

                      <p>
                        Pilot-ready solutions
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          pilotStartedCount
                        }
                      </strong>

                      <p>
                        Pilots in progress
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          pilotCompletedCount
                        }
                      </strong>

                      <p>
                        Pilots completed
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          procurementReviewCount
                        }
                      </strong>

                      <p>
                        Procurement reviews
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          procurementApprovedCount
                        }
                      </strong>

                      <p>
                        Procurement approved
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          contractReadyCount
                        }
                      </strong>

                      <p>
                        Contracts ready
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          deploymentStartedCount
                        }
                      </strong>

                      <p>
                        Deployments started
                      </p>

                    </div>


                    <div>

                      <strong>
                        {
                          rejectedCount
                        }
                      </strong>

                      <p>
                        Rejected proposals
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>
          )}

        </div>

      </main>

    </div>
  );
}
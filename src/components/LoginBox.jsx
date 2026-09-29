import { useState } from "react";

function LoginBox({ setPortal }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [captcha, setCaptcha] = useState("G7kP4");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const generateCaptcha = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    let newCaptcha = "";

    for (let i = 0; i < 5; i++) {
      newCaptcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setCaptcha(newCaptcha);
    setCaptchaInput("");
    setCaptchaError("");
  };

  
   const handleLogin = async () => {
  if (!username || !email || !password) {
    setCaptchaError("Please enter all required details.");
    return;
  }

  if (!captchaInput) {
    setCaptchaError("Please enter the CAPTCHA.");
    return;
  }

  if (captchaInput !== captcha) {
    setCaptchaError("Incorrect CAPTCHA. Please try again.");
    generateCaptcha();
    return;
  }

  setCaptchaError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setCaptchaError(data.message || "Login failed.");
      return;
    }

    localStorage.setItem("token", data.token);
    console.log("TOKEN SAVED:", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setPortal("portal-select");
  } catch (error) {
    console.error("Login failed:", error);
    setCaptchaError("Unable to connect to the server.");
  }
};
  return (
    <div className="login-box">

      {/* BRAND */}
      <div className="login-header">

        <div className="login-symbol">
          GC
        </div>

        <div>
          <h2>GovCatalyst</h2>

          <p>
            Public Innovation & Procurement Platform
          </p>
        </div>

      </div>


      {/* WELCOME */}
      <div className="login-title">

        <h1>Welcome</h1>

        <p>
          Sign in to continue to GovCatalyst
        </p>

      </div>


      {/* USERNAME */}
      <div className="form-group">

        <label>Username</label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

      </div>


      {/* EMAIL */}
      <div className="form-group">

        <label>Email ID</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email ID"
        />

      </div>


      {/* PASSWORD */}
      <div className="form-group">

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

      </div>


      {/* CAPTCHA */}
      <div className="captcha-section">

        <label>Security Verification</label>

        <div className="captcha-row">

          {/* CAPTCHA IMAGE-STYLE BOX */}
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


          {/* REFRESH */}
          <button
            type="button"
            className="captcha-refresh"
            onClick={generateCaptcha}
            title="Generate new CAPTCHA"
          >
            ↻
          </button>

        </div>


        {/* CAPTCHA INPUT */}
        <input
          type="text"
          value={captchaInput}
          onChange={(e) => {
            setCaptchaInput(e.target.value);
            setCaptchaError("");
          }}
          placeholder="Enter the characters shown above"
          className="captcha-input"
        />

      </div>


      {/* ERROR */}
      {captchaError && (
        <p className="captcha-error">
          {captchaError}
        </p>
      )}


      {/* OPTIONS */}
      <div className="login-options">

        <label>
          <input type="checkbox" />
          Remember me
        </label>

        <button
          type="button"
          className="forgot-btn"
        >
          Forgot Password?
        </button>

      </div>


      {/* SIGN IN */}
      <button
        type="button"
        className="login-btn"
        onClick={handleLogin}
      >
        Sign In
      </button>


      {/* FOOTER */}
      <p className="login-footer">
        Secure Government Innovation Platform
      </p>

    </div>
  );
}

export default LoginBox;
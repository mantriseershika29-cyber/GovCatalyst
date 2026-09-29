function Navbar({ setPortal }) {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <div
        className="logo"
        onClick={() => setPortal("home")}
      >
        GovNexus
      </div>

      {/* NAVIGATION */}
      <div className="nav-links">

        <button
          onClick={() => setPortal("home")}
        >
          Home
        </button>

        <button
          onClick={() => setPortal("startup")}
        >
          Startup
        </button>

        <button
          onClick={() => setPortal("government")}
        >
          Government
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
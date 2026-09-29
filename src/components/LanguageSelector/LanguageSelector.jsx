import { useState } from "react";
import "./LanguageSelector.css";

function LanguageSelector({ onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

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
    "অসমীয়া",
    "ଓଡ଼ିଆ",
    "اردو",
    "नेपाली",
    "संस्कृतम्",
    "कोंकणी",
    "मैथिली",
    "डोगरी",
    "মণিপুরী",
    "සිංහල",
    "日本語",
    "한국어",
    "简体中文",
    "繁體中文",
    "Español",
    "français",
    "português",
    "Deutsch",
    "Italiano",
    "русский",
    "العربية",
    "فارسی",
  ];

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    setOpen(false);

    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  return (
    <div className="language-selector">

      <button
        type="button"
        className="language-selector-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>🌐 {selectedLanguage}</span>
        <strong>{open ? "▴" : "▾"}</strong>
      </button>

      {open && (
        <div className="language-dropdown">

          <div className="language-dropdown-title">
            Select Language
          </div>

          <div className="language-grid">

            {languages.map((language) => (
              <button
                type="button"
                key={language}
                className={
                  language === selectedLanguage
                    ? "language-option selected"
                    : "language-option"
                }
                onClick={() => handleSelect(language)}
              >
                {language}
              </button>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default LanguageSelector;
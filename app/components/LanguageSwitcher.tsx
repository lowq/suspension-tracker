import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`px-3 py-1 rounded ${
          i18n.language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("en")}
      >
        {t("languageSwitcher.en")}
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded ${
          i18n.language === "de" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("de")}
      >
        {t("languageSwitcher.de")}
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded ${
          i18n.language === "sk" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => changeLanguage("sk")}
      >
        {t("languageSwitcher.sk")}
      </button>
    </div>
  );
}

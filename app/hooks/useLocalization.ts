import { useTranslation } from "react-i18next";

export function useLocalization() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // Store user's language preference
    localStorage.setItem("userLanguage", language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
  };
}

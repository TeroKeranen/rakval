// i18n.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../src/translations/en.json"
import fi from "../src/translations/fi.json"

export const languageResources = {
  en: {
    translation: en,
  },
  fi: {
    translation: fi,
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lang: "fi",
  fallbackLng: "en",
  resources: languageResources,
});

export default i18next;


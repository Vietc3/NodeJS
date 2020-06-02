import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import store from "store/Store";
import Constants from "variables/Constants/";
import ExtendFunction from "lib/ExtendFunction";
import moment from "moment";

const resources = ExtendFunction.importAll(require.context("../src/locales/", false, /\.(json)$/));
delete resources.kr;
i18n
  .use(LanguageDetector)// passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: Constants.DEFAULT_LANGUAGE,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ",",
      format: function(value, format, lng) {
        if (format === 'lowercase') return value.toLowerCase();
        if(value instanceof Date) return moment(value).format(format);
        return value;
      }
    },

    react: {
        wait: true
    }
});

export default i18n;
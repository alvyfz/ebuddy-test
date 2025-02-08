import id from "@/lang/id";
import en from "@/lang/en";

export type LangType = keyof typeof language;

const language = {
  id,
  en,
};

export const translate =  (lang: keyof typeof language) => {
  const objLanguage = language[lang || 'en'];

  const t = ( key: keyof typeof id | keyof typeof en) => {
    return objLanguage?.[key] || key;
  };

  return {
    t: (key: keyof typeof id | keyof typeof en) : string => t(key),
  };
};
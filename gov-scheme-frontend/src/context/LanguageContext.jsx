import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    detailsTitle: "Your Details",
    ageLabel: "Age",
    locationLabel: "Location (State/City)",
    continueBtn: "Continue to Chat",
    chatPlaceholder: "Ask about schemes...",
    sendBtn: "Send",
    assistantStatus: "AI Assistant Online",
    welcome: "Hello! I've analyzed your profile. Which scheme would you like to explore?"
  },
  hi: {
    detailsTitle: "आपका विवरण",
    ageLabel: "आयु",
    locationLabel: "स्थान (राज्य/शहर)",
    continueBtn: "चैट जारी रखें",
    chatPlaceholder: "योजनाओं के बारे में पूछें...",
    sendBtn: "भेजें",
    assistantStatus: "एआई सहायक ऑनलाइन",
    welcome: "नमस्ते! मैंने आपकी प्रोफाइल का विश्लेषण किया है। आप आज कौन सी योजना देखना चाहेंगे?"
  },
  ta: {
    detailsTitle: "உங்கள் விவரங்கள்",
    ageLabel: "வயது",
    locationLabel: "இடம் (மாநிலம்/நகரம்)",
    continueBtn: "அரட்டைக்குச் செல்லவும்",
    chatPlaceholder: "திட்டங்களைப் பற்றி கேளுங்கள்...",
    sendBtn: "அனுப்பு",
    assistantStatus: "AI உதவியாளர் ஆன்லைனில் உள்ளார்",
    welcome: "வணக்கம்! உங்கள் விவரங்களை நான் ஆய்வு செய்துள்ளேன். இன்று எந்தத் திட்டத்தைப் பற்றி அறிய விரும்புகிறீர்கள்?"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
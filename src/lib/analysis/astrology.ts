/**
 * Basic astrology utilities for sun sign and moon sign estimation
 * For a production app, integrate a proper ephemeris library
 */

export interface AstrologyProfile {
  sunSign: string;
  sunSignElement: string;
  sunSignQuality: string;
  approximateMoonSign: string;
  ascendantAvailable: boolean;
  currentTransits: string;
  weeklyFocus: string;
}

const ZODIAC_SIGNS = [
  { name: "Áries", nameEn: "Aries", element: "Fogo", quality: "Cardinal", startMonth: 3, startDay: 21 },
  { name: "Touro", nameEn: "Taurus", element: "Terra", quality: "Fixo", startMonth: 4, startDay: 20 },
  { name: "Gêmeos", nameEn: "Gemini", element: "Ar", quality: "Mutável", startMonth: 5, startDay: 21 },
  { name: "Câncer", nameEn: "Cancer", element: "Água", quality: "Cardinal", startMonth: 6, startDay: 21 },
  { name: "Leão", nameEn: "Leo", element: "Fogo", quality: "Fixo", startMonth: 7, startDay: 23 },
  { name: "Virgem", nameEn: "Virgo", element: "Terra", quality: "Mutável", startMonth: 8, startDay: 23 },
  { name: "Libra", nameEn: "Libra", element: "Ar", quality: "Cardinal", startMonth: 9, startDay: 23 },
  { name: "Escorpião", nameEn: "Scorpio", element: "Água", quality: "Fixo", startMonth: 10, startDay: 23 },
  { name: "Sagitário", nameEn: "Sagittarius", element: "Fogo", quality: "Mutável", startMonth: 11, startDay: 22 },
  { name: "Capricórnio", nameEn: "Capricorn", element: "Terra", quality: "Cardinal", startMonth: 12, startDay: 22 },
  { name: "Aquário", nameEn: "Aquarius", element: "Ar", quality: "Fixo", startMonth: 1, startDay: 20 },
  { name: "Peixes", nameEn: "Pisces", element: "Água", quality: "Mutável", startMonth: 2, startDay: 19 },
];

export function getSunSign(birthDate: Date, language = "pt"): { sign: string; element: string; quality: string } {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
    const current = ZODIAC_SIGNS[i];
    const next = ZODIAC_SIGNS[(i + 1) % 12];

    if (
      (month === current.startMonth && day >= current.startDay) ||
      (month === next.startMonth && day < next.startDay)
    ) {
      return {
        sign: language === "en" ? current.nameEn : current.name,
        element: current.element,
        quality: current.quality,
      };
    }
  }

  return { sign: language === "en" ? "Pisces" : "Peixes", element: "Água", quality: "Mutável" };
}

export function buildAstrologyProfile(
  birthDate: Date,
  birthTimeAccuracy: string,
  language = "pt"
): AstrologyProfile {
  const { sign, element, quality } = getSunSign(birthDate, language);
  const currentDate = new Date();
  const { sign: currentSign } = getSunSign(currentDate, language);

  const moonSigns = ZODIAC_SIGNS.map(s => (language === "en" ? s.nameEn : s.name));
  const moonIndex = Math.floor(
    (birthDate.getTime() / (1000 * 60 * 60 * 24 * 2.5)) % 12
  );
  const approximateMoonSign = moonSigns[Math.abs(moonIndex) % 12];

  return {
    sunSign: sign,
    sunSignElement: element,
    sunSignQuality: quality,
    approximateMoonSign,
    ascendantAvailable: birthTimeAccuracy === "EXACT",
    currentTransits: `Sol em ${currentSign} — período de revisão e consolidação`,
    weeklyFocus: "Energia de foco em comunicação e clareza de intenções",
  };
}

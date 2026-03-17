/**
 * Numerology calculation utilities
 */

function reduceToSingleDigit(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n; // Master numbers
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

export function calculateLifePath(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(
    String(year)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0)
  );

  return reduceToSingleDigit(dayReduced + monthReduced + yearReduced);
}

export function calculatePersonalYear(birthDate: Date, currentYear: number): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const yearDigits = String(currentYear)
    .split("")
    .reduce((sum, d) => sum + parseInt(d), 0);

  return reduceToSingleDigit(
    reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(yearDigits)
  );
}

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function calculateExpressionNumber(fullName: string): number {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = letters.split("").reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0);
  return reduceToSingleDigit(sum);
}

export function calculateSoulUrgeNumber(fullName: string): number {
  const vowels = fullName.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => VOWELS.has(l));
  const sum = vowels.reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0);
  return reduceToSingleDigit(sum);
}

export function calculatePersonalityNumber(fullName: string): number {
  const consonants = fullName.toUpperCase().replace(/[^A-Z]/g, "").split("").filter(l => !VOWELS.has(l));
  const sum = consonants.reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0);
  return reduceToSingleDigit(sum);
}

export function calculateBirthDayNumber(birthDate: Date): number {
  return reduceToSingleDigit(birthDate.getDate());
}

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthDay: number;
  personalYear: number;
  personalYearNext: number;
  personalYearAfterNext: number;
}

export function buildNumerologyProfile(
  birthDate: Date,
  fullNameBirth: string,
  currentYear: number
): NumerologyProfile {
  return {
    lifePath: calculateLifePath(birthDate),
    expression: calculateExpressionNumber(fullNameBirth),
    soulUrge: calculateSoulUrgeNumber(fullNameBirth),
    personality: calculatePersonalityNumber(fullNameBirth),
    birthDay: calculateBirthDayNumber(birthDate),
    personalYear: calculatePersonalYear(birthDate, currentYear),
    personalYearNext: calculatePersonalYear(birthDate, currentYear + 1),
    personalYearAfterNext: calculatePersonalYear(birthDate, currentYear + 2),
  };
}

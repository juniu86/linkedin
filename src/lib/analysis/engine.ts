import Anthropic from "@anthropic-ai/sdk";
import { buildNumerologyProfile } from "./numerology";
import { buildAstrologyProfile } from "./astrology";
import { getSystemPrompt } from "./prompts/system";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface UserAnalysisInput {
  fullNameBirth: string;
  currentName: string;
  birthDate: Date;
  birthTime?: string | null;
  birthTimeAccuracy: string;
  birthCity?: string | null;
  birthState?: string | null;
  birthCountry?: string | null;
  currentProfession?: string | null;
  currentCompany?: string | null;
  relationshipStatus?: string | null;
  financialStatus?: string | null;
  goals?: string | null;
  challenges?: string | null;
  language: string;
  tone: string;
  depth: string;
  includeWeekly: boolean;
  includeTimeline: boolean;
  includeRelational: boolean;
  lifeEvents: Array<{
    eventType: string;
    eventDate?: Date | null;
    title: string;
    description?: string | null;
    impactLevel: number;
  }>;
  relatedPeople: Array<{
    fullName: string;
    relationType: string;
    birthDate?: Date | null;
    notes?: string | null;
  }>;
}

export interface AnalysisResult {
  executiveSummary: string;
  essence: string;
  journeyReading: string;
  deepCharacteristics: string;
  talentsStrengths: string;
  weaknessesPatterns: string;
  professionalProfile: string;
  relationships: string;
  wealthPattern: string;
  lifeSoulPath: string;
  integratedAnalysis: string;
  whatGoesRight: string;
  whatGoesWrong: string;
  timeline3Years: {
    year1: string;
    year2: string;
    year3: string;
  };
  weeklyForecast: {
    weekClimate: string;
    mainFocus: string;
    opportunities: string;
    risks: string;
    workMoney: string;
    loveRelations: string;
    mentalEnergy: string;
    avoid: string;
    recommendedAttitude: string;
    weekGuidePhrase: string;
  };
  practicalAdvice: string;
  finalChecklist: string[];
  numerologyProfile: ReturnType<typeof buildNumerologyProfile>;
  astrologyProfile: ReturnType<typeof buildAstrologyProfile>;
}

function buildAnalysisPrompt(input: UserAnalysisInput, lang: string): string {
  const numerology = buildNumerologyProfile(
    input.birthDate,
    input.fullNameBirth,
    new Date().getFullYear()
  );
  const astrology = buildAstrologyProfile(
    input.birthDate,
    input.birthTimeAccuracy,
    lang
  );

  const today = new Date();
  const age = today.getFullYear() - input.birthDate.getFullYear();

  const eventsText = input.lifeEvents
    .map(
      e =>
        `- [${e.eventType}] ${e.eventDate ? new Date(e.eventDate).getFullYear() : "?"}: ${e.title} — impacto ${e.impactLevel}/10. ${e.description || ""}`
    )
    .join("\n");

  const peopleText = input.relatedPeople
    .map(p => `- ${p.fullName} (${p.relationType})${p.birthDate ? ` — nasc. ${new Date(p.birthDate).toLocaleDateString()}` : ""}${p.notes ? `. Notas: ${p.notes}` : ""}`)
    .join("\n");

  if (lang === "en") {
    return `Generate a complete premium life journey report for the following person.

## PERSONAL DATA
- Full birth name: ${input.fullNameBirth}
- Current name: ${input.currentName}
- Age: ${age} years
- Birth: ${input.birthDate.toLocaleDateString()} ${input.birthTime || "(time unknown)"}
- Birth accuracy: ${input.birthTimeAccuracy}
- Location: ${[input.birthCity, input.birthState, input.birthCountry].filter(Boolean).join(", ") || "Not provided"}

## CURRENT CONTEXT
- Profession: ${input.currentProfession || "Not provided"}
- Company: ${input.currentCompany || "Not provided"}
- Relationship status: ${input.relationshipStatus || "Not provided"}
- Financial situation: ${input.financialStatus || "Not provided"}
- Current goals: ${input.goals || "Not provided"}
- Current challenges: ${input.challenges || "Not provided"}

## NUMEROLOGY
- Life Path: ${numerology.lifePath}
- Expression number: ${numerology.expression}
- Soul Urge number: ${numerology.soulUrge}
- Personality number: ${numerology.personality}
- Birth day number: ${numerology.birthDay}
- Personal year ${new Date().getFullYear()}: ${numerology.personalYear}
- Personal year ${new Date().getFullYear() + 1}: ${numerology.personalYearNext}
- Personal year ${new Date().getFullYear() + 2}: ${numerology.personalYearAfterNext}

## ASTROLOGY
- Sun sign: ${astrology.sunSign} (${astrology.sunSignElement}, ${astrology.sunSignQuality})
- Approximate moon sign: ${astrology.approximateMoonSign}
- Ascendant: ${astrology.ascendantAvailable ? "Available based on birth time" : "Not available — unknown birth time"}
- Current transits: ${astrology.currentTransits}

## LIFE TIMELINE
${eventsText || "No events provided."}

## IMPORTANT PEOPLE
${peopleText || "No people provided."}

## PREFERENCES
- Tone: ${input.tone}
- Depth: ${input.depth}
- Include weekly forecast: ${input.includeWeekly}
- Include 3-year timeline: ${input.includeTimeline}
- Include relational analysis: ${input.includeRelational}

---
Return a JSON object with EXACTLY this structure (all fields required):
{
  "executiveSummary": "...",
  "essence": "...",
  "journeyReading": "...",
  "deepCharacteristics": "...",
  "talentsStrengths": "...",
  "weaknessesPatterns": "...",
  "professionalProfile": "...",
  "relationships": "...",
  "wealthPattern": "...",
  "lifeSoulPath": "...",
  "integratedAnalysis": "...",
  "whatGoesRight": "...",
  "whatGoesWrong": "...",
  "timeline3Years": {
    "year1": "...",
    "year2": "...",
    "year3": "..."
  },
  "weeklyForecast": {
    "weekClimate": "...",
    "mainFocus": "...",
    "opportunities": "...",
    "risks": "...",
    "workMoney": "...",
    "loveRelations": "...",
    "mentalEnergy": "...",
    "avoid": "...",
    "recommendedAttitude": "...",
    "weekGuidePhrase": "..."
  },
  "practicalAdvice": "...",
  "finalChecklist": ["...", "...", "..."]
}`;
  }

  return `Gere um relatório premium completo de jornada de vida para a seguinte pessoa.

## DADOS PESSOAIS
- Nome completo de nascimento: ${input.fullNameBirth}
- Nome atual: ${input.currentName}
- Idade: ${age} anos
- Nascimento: ${input.birthDate.toLocaleDateString("pt-BR")} ${input.birthTime || "(hora desconhecida)"}
- Precisão da hora: ${input.birthTimeAccuracy}
- Local: ${[input.birthCity, input.birthState, input.birthCountry].filter(Boolean).join(", ") || "Não informado"}

## CONTEXTO ATUAL
- Profissão: ${input.currentProfession || "Não informado"}
- Empresa: ${input.currentCompany || "Não informado"}
- Estado civil: ${input.relationshipStatus || "Não informado"}
- Situação financeira: ${input.financialStatus || "Não informado"}
- Objetivos atuais: ${input.goals || "Não informado"}
- Desafios atuais: ${input.challenges || "Não informado"}

## NUMEROLOGIA
- Caminho de vida: ${numerology.lifePath}
- Número de expressão: ${numerology.expression}
- Número da alma: ${numerology.soulUrge}
- Número de personalidade: ${numerology.personality}
- Número do dia de nascimento: ${numerology.birthDay}
- Ano pessoal ${new Date().getFullYear()}: ${numerology.personalYear}
- Ano pessoal ${new Date().getFullYear() + 1}: ${numerology.personalYearNext}
- Ano pessoal ${new Date().getFullYear() + 2}: ${numerology.personalYearAfterNext}

## ASTROLOGIA
- Signo solar: ${astrology.sunSign} (${astrology.sunSignElement}, ${astrology.sunSignQuality})
- Signo lunar aproximado: ${astrology.approximateMoonSign}
- Ascendente: ${astrology.ascendantAvailable ? "Disponível com base no horário de nascimento" : "Indisponível — horário desconhecido"}
- Trânsitos atuais: ${astrology.currentTransits}

## LINHA DO TEMPO DE VIDA
${eventsText || "Nenhum evento informado."}

## PESSOAS IMPORTANTES
${peopleText || "Nenhuma pessoa informada."}

## PREFERÊNCIAS
- Tom: ${input.tone}
- Profundidade: ${input.depth}
- Incluir previsão semanal: ${input.includeWeekly}
- Incluir linha do tempo 3 anos: ${input.includeTimeline}
- Incluir análise relacional: ${input.includeRelational}

---
Retorne um objeto JSON com EXATAMENTE esta estrutura (todos os campos obrigatórios):
{
  "executiveSummary": "...",
  "essence": "...",
  "journeyReading": "...",
  "deepCharacteristics": "...",
  "talentsStrengths": "...",
  "weaknessesPatterns": "...",
  "professionalProfile": "...",
  "relationships": "...",
  "wealthPattern": "...",
  "lifeSoulPath": "...",
  "integratedAnalysis": "...",
  "whatGoesRight": "...",
  "whatGoesWrong": "...",
  "timeline3Years": {
    "year1": "...",
    "year2": "...",
    "year3": "..."
  },
  "weeklyForecast": {
    "weekClimate": "...",
    "mainFocus": "...",
    "opportunities": "...",
    "risks": "...",
    "workMoney": "...",
    "loveRelations": "...",
    "mentalEnergy": "...",
    "avoid": "...",
    "recommendedAttitude": "...",
    "weekGuidePhrase": "..."
  },
  "practicalAdvice": "...",
  "finalChecklist": ["...", "...", "..."]
}`;
}

export async function generateAnalysis(input: UserAnalysisInput): Promise<AnalysisResult> {
  const lang = input.language || "pt";
  const systemPrompt = getSystemPrompt(lang);
  const userPrompt = buildAnalysisPrompt(input, lang);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  // Extract JSON from the response (handle markdown code blocks)
  const text = content.text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const jsonText = jsonMatch[1] || text;

  let parsed: Omit<AnalysisResult, "numerologyProfile" | "astrologyProfile">;
  try {
    parsed = JSON.parse(jsonText.trim());
  } catch {
    throw new Error("Failed to parse analysis JSON from Claude response");
  }

  const numerologyProfile = buildNumerologyProfile(
    input.birthDate,
    input.fullNameBirth,
    new Date().getFullYear()
  );
  const astrologyProfile = buildAstrologyProfile(
    input.birthDate,
    input.birthTimeAccuracy,
    lang
  );

  return {
    ...parsed,
    numerologyProfile,
    astrologyProfile,
  };
}

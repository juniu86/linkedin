"use client";

import { Separator } from "@/components/ui/separator";

interface AnalysisJson {
  executiveSummary?: string;
  essence?: string;
  journeyReading?: string;
  deepCharacteristics?: string;
  talentsStrengths?: string;
  weaknessesPatterns?: string;
  professionalProfile?: string;
  relationships?: string;
  wealthPattern?: string;
  lifeSoulPath?: string;
  integratedAnalysis?: string;
  whatGoesRight?: string;
  whatGoesWrong?: string;
  timeline3Years?: { year1?: string; year2?: string; year3?: string };
  weeklyForecast?: {
    weekClimate?: string;
    mainFocus?: string;
    opportunities?: string;
    risks?: string;
    workMoney?: string;
    loveRelations?: string;
    mentalEnergy?: string;
    avoid?: string;
    recommendedAttitude?: string;
    weekGuidePhrase?: string;
  };
  practicalAdvice?: string;
  finalChecklist?: string[];
  numerologyProfile?: {
    lifePath?: number;
    expression?: number;
    soulUrge?: number;
    personality?: number;
    birthDay?: number;
    personalYear?: number;
  };
  astrologyProfile?: {
    sunSign?: string;
    sunSignElement?: string;
    sunSignQuality?: string;
    approximateMoonSign?: string;
  };
}

interface Props {
  analysis: Record<string, unknown>;
}

function Section({ title, content, accent = false }: { title: string; content?: string; accent?: boolean }) {
  if (!content) return null;
  return (
    <div className="mb-10">
      <h2 className={`text-sm uppercase tracking-[2px] mb-4 ${accent ? "text-[#d4af37]" : "text-[#555]"}`}>
        {title}
      </h2>
      <div className="text-[#bbb] leading-relaxed text-[15px] space-y-3">
        {content.split("\n").filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export function ReportViewer({ analysis }: Props) {
  const a = analysis as AnalysisJson;

  return (
    <div className="space-y-2 font-light">
      {/* Report header */}
      <div className="text-center py-12 border-b border-[#1a1a1a] mb-12">
        <div className="w-16 h-px bg-[#d4af37] mx-auto mb-6" />
        <h1 className="text-3xl font-thin tracking-[4px] text-[#d4af37] mb-2 uppercase">
          Mapa da Jornada
        </h1>
        <p className="text-[#555] text-xs tracking-wider">Relatório de Leitura Profunda</p>
        <div className="w-16 h-px bg-[#d4af37] mx-auto mt-6" />
      </div>

      {/* Numerology + Astrology quick reference */}
      {(a.numerologyProfile || a.astrologyProfile) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg">
          {a.numerologyProfile && (
            <>
              <div className="text-center">
                <div className="text-2xl text-[#d4af37] font-thin">{a.numerologyProfile.lifePath}</div>
                <div className="text-xs text-[#555] mt-1">Caminho de Vida</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-[#d4af37] font-thin">{a.numerologyProfile.personalYear}</div>
                <div className="text-xs text-[#555] mt-1">Ano Pessoal</div>
              </div>
            </>
          )}
          {a.astrologyProfile && (
            <>
              <div className="text-center">
                <div className="text-lg text-[#d4af37] font-thin">{a.astrologyProfile.sunSign}</div>
                <div className="text-xs text-[#555] mt-1">Signo Solar</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-[#d4af37] font-thin">{a.astrologyProfile.approximateMoonSign}</div>
                <div className="text-xs text-[#555] mt-1">Signo Lunar</div>
              </div>
            </>
          )}
        </div>
      )}

      <Section title="Resumo Executivo" content={a.executiveSummary} accent />
      <Separator className="bg-[#1a1a1a] my-8" />

      <Section title="Quem Você É em Essência" content={a.essence} />
      <Section title="Jornada até Aqui" content={a.journeyReading} />
      <Section title="Características Pessoais Profundas" content={a.deepCharacteristics} />

      <Separator className="bg-[#1a1a1a] my-8" />

      <Section title="Talentos e Forças Ocultas" content={a.talentsStrengths} />
      <Section title="Padrões de Autossabotagem" content={a.weaknessesPatterns} />

      <Separator className="bg-[#1a1a1a] my-8" />

      <Section title="Perfil Profissional e Vocacional" content={a.professionalProfile} />
      <Section title="Relacionamentos" content={a.relationships} />
      <Section title="Riqueza e Abundância" content={a.wealthPattern} />
      <Section title="Caminho de Vida e da Alma" content={a.lifeSoulPath} />

      <Separator className="bg-[#1a1a1a] my-8" />

      <Section title="Análise Integrada — Convergência das Lentes" content={a.integratedAnalysis} accent />
      <Section title="O Que Tende a Dar Certo" content={a.whatGoesRight} />
      <Section title="O Que Tende a Dar Errado" content={a.whatGoesWrong} />

      <Separator className="bg-[#1a1a1a] my-8" />

      {/* 3-year timeline */}
      {a.timeline3Years && (
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-[2px] mb-6 text-[#d4af37]">Linha do Tempo — Próximos 3 Anos</h2>
          <div className="space-y-6">
            {[
              { key: "year1", label: "Ano 1 — " + new Date().getFullYear() },
              { key: "year2", label: "Ano 2 — " + (new Date().getFullYear() + 1) },
              { key: "year3", label: "Ano 3 — " + (new Date().getFullYear() + 2) },
            ].map(({ key, label }) => (
              a.timeline3Years?.[key as keyof typeof a.timeline3Years] && (
                <div key={key} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-6">
                  <h3 className="text-xs uppercase tracking-wider text-[#555] mb-3">{label}</h3>
                  <p className="text-[#bbb] leading-relaxed text-sm">
                    {a.timeline3Years[key as keyof typeof a.timeline3Years]}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-[#1a1a1a] my-8" />

      {/* Weekly forecast */}
      {a.weeklyForecast && (
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-[2px] mb-6 text-[#d4af37]">Previsão da Próxima Semana</h2>
          <div className="bg-[#0d0d0d] border border-[#d4af37]/20 rounded-lg p-6 space-y-4">
            {a.weeklyForecast.weekGuidePhrase && (
              <p className="text-[#d4af37] italic text-center text-base mb-6 pb-6 border-b border-[#1a1a1a]">
                &ldquo;{a.weeklyForecast.weekGuidePhrase}&rdquo;
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "weekClimate", label: "Clima da Semana" },
                { key: "mainFocus", label: "Foco Principal" },
                { key: "opportunities", label: "Oportunidades" },
                { key: "risks", label: "Pontos de Atenção" },
                { key: "workMoney", label: "Trabalho e Dinheiro" },
                { key: "loveRelations", label: "Amor e Relações" },
                { key: "mentalEnergy", label: "Energia Mental" },
                { key: "recommendedAttitude", label: "Atitude Recomendada" },
              ].map(({ key, label }) => (
                a.weeklyForecast?.[key as keyof typeof a.weeklyForecast] && (
                  <div key={key}>
                    <p className="text-xs uppercase tracking-wider text-[#555] mb-1">{label}</p>
                    <p className="text-[#aaa] text-sm leading-relaxed">
                      {a.weeklyForecast[key as keyof typeof a.weeklyForecast] as string}
                    </p>
                  </div>
                )
              ))}
            </div>
            {a.weeklyForecast.avoid && (
              <div className="border-t border-[#1a1a1a] pt-4">
                <p className="text-xs uppercase tracking-wider text-[#555] mb-1">Evitar</p>
                <p className="text-[#aaa] text-sm leading-relaxed">{a.weeklyForecast.avoid}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator className="bg-[#1a1a1a] my-8" />

      <Section title="Conselhos Práticos" content={a.practicalAdvice} />

      {/* Final checklist */}
      {a.finalChecklist && a.finalChecklist.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-[2px] mb-4 text-[#555]">Checklist de Direcionamento</h2>
          <div className="space-y-2">
            {a.finalChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#0d0d0d] rounded-lg">
                <div className="w-5 h-5 rounded border border-[#333] shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="text-[#d4af37] text-xs">{i + 1}</span>
                </div>
                <p className="text-[#aaa] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-12 border-t border-[#1a1a1a] mt-12">
        <div className="w-16 h-px bg-[#d4af37] mx-auto mb-6" />
        <p className="text-xs text-[#555] leading-relaxed max-w-lg mx-auto">
          Este relatório é uma leitura interpretativa que integra múltiplos sistemas simbólicos.
          As análises são lentes de reflexão e direcionamento, não previsões científicas ou determinísticas.
          Não substituem orientação médica, jurídica ou financeira profissional.
        </p>
        <p className="text-[#d4af37] text-xs tracking-[3px] uppercase mt-6">Mapa da Jornada</p>
      </div>
    </div>
  );
}

"use client";

import { FormData } from "../multi-step-form";
import { CheckCircle2 } from "lucide-react";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

const PLANS = [
  {
    type: "ESSENTIAL" as const,
    name: "Essencial",
    price: "R$ 97",
    features: [
      "Personalidade e essência",
      "Jornada até aqui",
      "Perfil profissional",
      "Relacionamentos",
      "Riqueza e abundância",
      "Caminho de vida e alma",
      "Resumo do próximo ano",
    ],
  },
  {
    type: "PREMIUM" as const,
    name: "Premium",
    price: "R$ 197",
    popular: true,
    features: [
      "Tudo do Essencial",
      "Análise integrada completa",
      "Linha do tempo 3 anos",
      "Previsão da próxima semana",
      "PDF premium + e-mail",
    ],
  },
  {
    type: "PREMIUM_RELATIONAL" as const,
    name: "Premium + Relacional",
    price: "R$ 297",
    features: [
      "Tudo do Premium",
      "Análise da pessoa mais importante",
      "Compatibilidade e dinâmica",
      "Pontos de convergência / atrito",
    ],
  },
];

const TONES = [
  { value: "SPIRITUAL" as const, label: "Mais espiritual", desc: "Linguagem simbólica e energética" },
  { value: "BALANCED" as const, label: "Equilibrado", desc: "Mistura de simbólico e prático" },
  { value: "RATIONAL" as const, label: "Mais racional", desc: "Foco prático e analítico" },
];

export function StepPreferences({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Plan selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#aaa] mb-1">Escolha seu plano</h3>
          <p className="text-[#555] text-xs">Você pode sempre fazer upgrade depois</p>
        </div>

        <div className="space-y-3">
          {PLANS.map(plan => (
            <button
              key={plan.type}
              type="button"
              onClick={() => {
                onChange({
                  reportType: plan.type,
                  includeTimeline: plan.type !== "ESSENTIAL",
                  includeWeekly: plan.type !== "ESSENTIAL",
                  includeRelational: plan.type === "PREMIUM_RELATIONAL",
                });
              }}
              className={`w-full p-5 rounded-lg border text-left transition-all ${
                data.reportType === plan.type
                  ? "border-[#d4af37] bg-[#d4af37]/5"
                  : "border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${data.reportType === plan.type ? "text-[#d4af37]" : "text-[#aaa]"}`}>
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="text-xs bg-[#d4af37] text-black px-2 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  <div className={`text-xl font-light mt-1 ${data.reportType === plan.type ? "text-[#d4af37]" : "text-white"}`}>
                    {plan.price}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                  data.reportType === plan.type ? "border-[#d4af37] bg-[#d4af37]" : "border-[#333]"
                }`}>
                  {data.reportType === plan.type && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#777]">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${data.reportType === plan.type ? "text-[#d4af37]" : "text-[#444]"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#aaa] mb-1">Tom da leitura</h3>
          <p className="text-[#555] text-xs">Como você prefere que a análise seja escrita?</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {TONES.map(tone => (
            <button
              key={tone.value}
              type="button"
              onClick={() => onChange({ tone: tone.value })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                data.tone === tone.value
                  ? "border-[#d4af37] bg-[#d4af37]/10"
                  : "border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333]"
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${data.tone === tone.value ? "text-[#d4af37]" : "text-[#aaa]"}`}>
                {tone.label}
              </div>
              <div className="text-xs text-[#555] leading-relaxed">{tone.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#111] border border-[#d4af37]/20 rounded-lg p-5">
        <h3 className="text-sm font-medium text-[#d4af37] mb-3">Resumo da sua escolha</h3>
        <div className="space-y-2 text-xs text-[#777]">
          <div className="flex justify-between">
            <span>Plano</span>
            <span className="text-[#aaa]">{PLANS.find(p => p.type === data.reportType)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Tom</span>
            <span className="text-[#aaa]">{TONES.find(t => t.value === data.tone)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span>Previsão semanal</span>
            <span className="text-[#aaa]">{data.includeWeekly ? "Incluída" : "Não incluída"}</span>
          </div>
          <div className="flex justify-between">
            <span>Linha do tempo 3 anos</span>
            <span className="text-[#aaa]">{data.includeTimeline ? "Incluída" : "Não incluída"}</span>
          </div>
          <div className="flex justify-between border-t border-[#1a1a1a] pt-2 mt-2">
            <span className="font-medium text-[#aaa]">Total</span>
            <span className="font-medium text-[#d4af37]">
              {PLANS.find(p => p.type === data.reportType)?.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

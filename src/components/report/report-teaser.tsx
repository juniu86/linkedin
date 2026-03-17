"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Star, Sparkles } from "lucide-react";

interface Props {
  reportId: string;
  report: {
    reportType: string;
    teaser?: {
      executiveSummary?: string;
      essence?: string;
      weeklyForecast?: { weekGuidePhrase?: string };
    } | null;
  };
}

const PLAN_TYPES: Record<string, string> = {
  ESSENTIAL: "ESSENTIAL",
  PREMIUM: "PREMIUM",
  PREMIUM_RELATIONAL: "PREMIUM_RELATIONAL",
};

export function ReportTeaser({ reportId, report }: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
        <h1 className="text-2xl font-light mb-2">Seu Mapa da Jornada</h1>
        <p className="text-[#666] text-sm">Prévia da sua análise — desbloqueie para ver o relatório completo</p>
      </div>

      {/* Teaser insights */}
      {report.teaser && (
        <div className="space-y-4">
          {report.teaser.executiveSummary && (
            <Card className="bg-[#111] border-[#1a1a1a]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs uppercase tracking-wider text-[#555]">Insight revelado</span>
                </div>
                <p className="text-sm text-[#aaa] leading-relaxed line-clamp-4">
                  {report.teaser.executiveSummary}
                </p>
              </CardContent>
            </Card>
          )}

          {report.teaser.weeklyForecast?.weekGuidePhrase && (
            <Card className="bg-[#111] border-[#d4af37]/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs uppercase tracking-wider text-[#555]">Frase-guia da semana</span>
                </div>
                <p className="text-[#d4af37] text-sm italic leading-relaxed">
                  &ldquo;{report.teaser.weeklyForecast.weekGuidePhrase}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Locked sections preview */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-[#555] mb-4">
          O que está bloqueado no seu relatório
        </p>
        {[
          "Quem você é em essência — traços, arquétipo e padrão de comportamento",
          "Jornada até aqui — leitura interpretativa da sua trajetória",
          "Talentos ocultos e forças que você ainda não usa",
          "Padrões de autossabotagem e pontos cegos",
          "Perfil profissional e vocacional completo",
          "Relacionamentos — padrões afetivos e compatibilidades",
          "Riqueza e abundância — sua relação com dinheiro",
          "Caminho de vida e alma",
          "Linha do tempo dos próximos 3 anos",
          "Previsão detalhada da próxima semana",
          "17 conselhos práticos e acionáveis",
        ].map((section) => (
          <div
            key={section}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]"
          >
            <Lock className="w-4 h-4 text-[#333] shrink-0" />
            <span className="text-[#444] text-sm">{section}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-[#111] border border-[#d4af37]/30 rounded-xl p-8 text-center">
        <h2 className="text-xl font-light mb-3">Desbloqueie seu relatório completo</h2>
        <p className="text-[#666] text-sm mb-6 leading-relaxed">
          Uma única vez. Sem assinaturas. Acesse para sempre.
        </p>
        <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c4a030] px-10">
          <Link href={`/checkout/${reportId}?type=${report.reportType}`}>
            Liberar relatório completo
          </Link>
        </Button>
        <p className="text-xs text-[#555] mt-4">PIX, cartão ou boleto via Mercado Pago</p>
      </div>
    </div>
  );
}

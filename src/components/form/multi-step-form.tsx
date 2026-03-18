"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepIdentity } from "./steps/step-identity";
import { StepBirth } from "./steps/step-birth";
import { StepContext } from "./steps/step-context";
import { StepTimeline } from "./steps/step-timeline";
import { StepPeople } from "./steps/step-people";
import { StepPreferences } from "./steps/step-preferences";

export interface FormData {
  // Identity
  fullNameBirth: string;
  currentName: string;
  phone: string;
  gender: string;
  language: string;
  // Birth
  birthDate: string;
  birthTime: string;
  birthTimeAccuracy: "EXACT" | "APPROXIMATE" | "UNKNOWN";
  birthCity: string;
  birthState: string;
  birthCountry: string;
  // Context
  relationshipStatus: string;
  currentProfession: string;
  currentCompany: string;
  financialStatus: string;
  goals: string;
  challenges: string;
  // Timeline
  lifeEvents: Array<{
    id?: string;
    eventType: string;
    eventDate: string;
    title: string;
    description: string;
    impactLevel: number;
  }>;
  // People
  relatedPeople: Array<{
    id?: string;
    fullName: string;
    relationType: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
    birthState: string;
    birthCountry: string;
    notes: string;
  }>;
  // Preferences
  tone: "SPIRITUAL" | "BALANCED" | "RATIONAL";
  depth: "SUMMARY" | "COMPLETE" | "PREMIUM_DEPTH";
  reportType: "ESSENTIAL" | "PREMIUM" | "PREMIUM_RELATIONAL";
  includeWeekly: boolean;
  includeTimeline: boolean;
  includeRelational: boolean;
}

const INITIAL_DATA: FormData = {
  fullNameBirth: "",
  currentName: "",
  phone: "",
  gender: "",
  language: "pt",
  birthDate: "",
  birthTime: "",
  birthTimeAccuracy: "UNKNOWN",
  birthCity: "",
  birthState: "",
  birthCountry: "Brasil",
  relationshipStatus: "",
  currentProfession: "",
  currentCompany: "",
  financialStatus: "",
  goals: "",
  challenges: "",
  lifeEvents: [],
  relatedPeople: [],
  tone: "BALANCED",
  depth: "COMPLETE",
  reportType: "PREMIUM",
  includeWeekly: true,
  includeTimeline: true,
  includeRelational: false,
};

const STEPS = [
  { id: 1, title: "Identidade", subtitle: "Quem é você" },
  { id: 2, title: "Nascimento", subtitle: "Dados de origem" },
  { id: 3, title: "Contexto", subtitle: "Momento atual" },
  { id: 4, title: "Trajetória", subtitle: "Eventos de vida" },
  { id: 5, title: "Pessoas", subtitle: "Relações importantes" },
  { id: 6, title: "Preferências", subtitle: "Tipo de análise" },
];

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);

  const updateData = useCallback((updates: Partial<FormData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const saveProgress = async (formData: FormData) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formDraftJson: formData,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  };

  const handleNext = () => {
    saveProgress(data); // fire-and-forget, não bloqueia navegação
    if (step < STEPS.length) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Save final profile
      const profileRes = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lifeEvents: data.lifeEvents,
          relatedPeople: data.relatedPeople,
        }),
      });

      if (!profileRes.ok) throw new Error("Failed to save profile");

      // Create report
      const reportRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: data.reportType,
          tone: data.tone,
          depth: data.depth,
          includeWeekly: data.includeWeekly,
          includeTimeline: data.includeTimeline,
          includeRelational: data.includeRelational,
        }),
      });

      if (!reportRes.ok) throw new Error("Failed to create report");
      const { reportId } = await reportRes.json();

      // Go to checkout
      router.push(`/checkout/${reportId}?type=${data.reportType}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar dados. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#d4af37] tracking-[3px] text-xs font-light uppercase">
              Mapa da Jornada
            </span>
            <span className="text-[#555] text-xs">
              Etapa {step} de {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-0.5 bg-[#1a1a1a] [&>div]:bg-[#d4af37]" />
        </div>
      </div>

      {/* Steps indicator */}
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-6 py-3 flex gap-4 overflow-x-auto">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 shrink-0 text-xs ${
                s.id === step ? "text-[#d4af37]" : s.id < step ? "text-[#555]" : "text-[#333]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  s.id < step
                    ? "bg-[#d4af37]/20 text-[#d4af37]"
                    : s.id === step
                    ? "bg-[#d4af37] text-black font-bold"
                    : "bg-[#1a1a1a] text-[#555]"
                }`}
              >
                {s.id < step ? "✓" : s.id}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-light mb-1">{STEPS[step - 1].title}</h1>
          <p className="text-[#555] text-sm">{STEPS[step - 1].subtitle}</p>
        </div>

        {step === 1 && <StepIdentity data={data} onChange={updateData} />}
        {step === 2 && <StepBirth data={data} onChange={updateData} />}
        {step === 3 && <StepContext data={data} onChange={updateData} />}
        {step === 4 && <StepTimeline data={data} onChange={updateData} />}
        {step === 5 && <StepPeople data={data} onChange={updateData} />}
        {step === 6 && <StepPreferences data={data} onChange={updateData} />}

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-[#1a1a1a]">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-[#333] text-[#888] hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="bg-[#d4af37] text-black hover:bg-[#c4a030]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-1 order-last" />
              )}
              {saving ? "Salvando..." : "Próximo"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#d4af37] text-black hover:bg-[#c4a030] px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Ir para o pagamento"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

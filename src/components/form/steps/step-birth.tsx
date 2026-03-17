"use client";

import { FormData } from "../multi-step-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export function StepBirth({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Data de nascimento *</Label>
          <Input
            type="date"
            value={data.birthDate}
            onChange={e => onChange({ birthDate: e.target.value })}
            className="bg-[#111] border-[#333] text-white focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Hora de nascimento</Label>
          <Input
            type="time"
            value={data.birthTime}
            onChange={e => onChange({ birthTime: e.target.value })}
            className="bg-[#111] border-[#333] text-white focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Precisão da hora</Label>
        <p className="text-[#555] text-xs">
          Quanto mais preciso o horário, mais específica a leitura do ascendente
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "EXACT", label: "Exata", desc: "Tenho certeza" },
            { value: "APPROXIMATE", label: "Aproximada", desc: "Sei mais ou menos" },
            { value: "UNKNOWN", label: "Desconhecida", desc: "Não sei" },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ birthTimeAccuracy: option.value as FormData["birthTimeAccuracy"] })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                data.birthTimeAccuracy === option.value
                  ? "border-[#d4af37] bg-[#d4af37]/10"
                  : "border-[#333] bg-[#111] hover:border-[#555]"
              }`}
            >
              <div className={`text-sm font-medium ${data.birthTimeAccuracy === option.value ? "text-[#d4af37]" : "text-[#aaa]"}`}>
                {option.label}
              </div>
              <div className="text-xs text-[#555] mt-0.5">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Cidade de nascimento</Label>
          <Input
            value={data.birthCity}
            onChange={e => onChange({ birthCity: e.target.value })}
            placeholder="Ex: São Paulo"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Estado / Província</Label>
          <Input
            value={data.birthState}
            onChange={e => onChange({ birthState: e.target.value })}
            placeholder="Ex: SP"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">País</Label>
          <Input
            value={data.birthCountry}
            onChange={e => onChange({ birthCountry: e.target.value })}
            placeholder="Ex: Brasil"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
        <p className="text-[#555] text-xs leading-relaxed">
          <span className="text-[#d4af37]">Por que precisamos do local de nascimento?</span>
          <br />
          O local define fuso horário e coordenadas para o cálculo do mapa natal astrológico.
          Sem o local, a análise será baseada apenas no signo solar e não incluirá ascendente ou casas astrológicas.
        </p>
      </div>
    </div>
  );
}

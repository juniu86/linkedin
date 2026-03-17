"use client";

import { FormData } from "../multi-step-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

const EVENT_TYPES = [
  { value: "RELATIONSHIP_START", label: "Início de relacionamento" },
  { value: "MARRIAGE", label: "Casamento" },
  { value: "SEPARATION", label: "Separação / Divórcio" },
  { value: "CHILD_BIRTH", label: "Nascimento de filho(a)" },
  { value: "CITY_CHANGE", label: "Mudança de cidade" },
  { value: "GRADUATION", label: "Formatura / Graduação" },
  { value: "JOB_START", label: "Início de trabalho / cargo" },
  { value: "JOB_END", label: "Saída de trabalho" },
  { value: "BUSINESS_OPEN", label: "Abertura de empresa" },
  { value: "FAMILY_LOSS", label: "Perda familiar" },
  { value: "HEALTH_CRISIS", label: "Doença / Crise de saúde" },
  { value: "WEALTH_GAIN", label: "Ganho patrimonial" },
  { value: "OTHER", label: "Outro evento marcante" },
];

export function StepTimeline({ data, onChange }: Props) {
  const addEvent = () => {
    onChange({
      lifeEvents: [
        ...data.lifeEvents,
        {
          id: crypto.randomUUID(),
          eventType: "OTHER",
          eventDate: "",
          title: "",
          description: "",
          impactLevel: 7,
        },
      ],
    });
  };

  const updateEvent = (index: number, updates: Partial<(typeof data.lifeEvents)[0]>) => {
    const updated = [...data.lifeEvents];
    updated[index] = { ...updated[index], ...updates };
    onChange({ lifeEvents: updated });
  };

  const removeEvent = (index: number) => {
    onChange({ lifeEvents: data.lifeEvents.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
        <p className="text-[#555] text-xs leading-relaxed">
          <span className="text-[#d4af37]">Por que os eventos de vida importam?</span>
          <br />
          Os marcos reais da sua trajetória são âncoras que tornam a análise precisa.
          Eles permitem identificar padrões de transição, ciclos repetidos e momentos pivô.
          Adicione os eventos que foram realmente significativos para você.
        </p>
      </div>

      {data.lifeEvents.length === 0 && (
        <div className="text-center py-8 text-[#555] text-sm">
          <p>Nenhum evento adicionado.</p>
          <p className="text-xs mt-1">Esta etapa é opcional, mas enriquece muito a análise.</p>
        </div>
      )}

      {data.lifeEvents.map((event, index) => (
        <div key={event.id || index} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#d4af37] text-xs uppercase tracking-wider">Evento {index + 1}</span>
            <button
              type="button"
              onClick={() => removeEvent(index)}
              className="text-[#555] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Tipo de evento</Label>
              <Select
                value={event.eventType}
                onValueChange={v => updateEvent(index, { eventType: v ?? "OTHER" })}
              >
                <SelectTrigger className="bg-[#111] border-[#333] text-white text-sm focus:border-[#d4af37]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333]">
                  {EVENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Data aproximada</Label>
              <Input
                type="date"
                value={event.eventDate}
                onChange={e => updateEvent(index, { eventDate: e.target.value })}
                className="bg-[#111] border-[#333] text-white text-sm focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#aaa] text-xs">Título breve</Label>
            <Input
              value={event.title}
              onChange={e => updateEvent(index, { title: e.target.value })}
              placeholder="Ex: Me separei após 8 anos de casamento"
              className="bg-[#111] border-[#333] text-white text-sm placeholder:text-[#444] focus:border-[#d4af37]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#aaa] text-xs">Descrição (opcional)</Label>
            <Textarea
              value={event.description}
              onChange={e => updateEvent(index, { description: e.target.value })}
              placeholder="Como foi, o que mudou, como você se sentiu..."
              rows={2}
              className="bg-[#111] border-[#333] text-white text-sm placeholder:text-[#444] focus:border-[#d4af37] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#aaa] text-xs">
              Impacto percebido: <span className="text-[#d4af37]">{event.impactLevel}/10</span>
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={event.impactLevel}
              onChange={e => updateEvent(index, { impactLevel: parseInt(e.target.value) })}
              className="w-full accent-[#d4af37]"
            />
            <div className="flex justify-between text-xs text-[#555]">
              <span>Pouco impacto</span>
              <span>Impacto enorme</span>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEvent}
        className="w-full border-dashed border-[#333] text-[#555] hover:text-white hover:border-[#d4af37]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar evento marcante
      </Button>
    </div>
  );
}

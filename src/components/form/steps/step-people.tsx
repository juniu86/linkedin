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

const RELATION_TYPES = [
  { value: "parceiro", label: "Parceiro(a) / Cônjuge" },
  { value: "ex-parceiro", label: "Ex-parceiro(a)" },
  { value: "filho", label: "Filho(a)" },
  { value: "mae", label: "Mãe" },
  { value: "pai", label: "Pai" },
  { value: "irmao", label: "Irmão / Irmã" },
  { value: "socio", label: "Sócio(a)" },
  { value: "chefe", label: "Chefe / Mentor" },
  { value: "amigo-proximo", label: "Amigo(a) próximo" },
  { value: "rival", label: "Rival / Adversário" },
  { value: "outro", label: "Outra relação" },
];

export function StepPeople({ data, onChange }: Props) {
  const addPerson = () => {
    onChange({
      relatedPeople: [
        ...data.relatedPeople,
        {
          id: crypto.randomUUID(),
          fullName: "",
          relationType: "parceiro",
          birthDate: "",
          birthTime: "",
          birthCity: "",
          birthState: "",
          birthCountry: "",
          notes: "",
        },
      ],
    });
  };

  const updatePerson = (index: number, updates: Partial<(typeof data.relatedPeople)[0]>) => {
    const updated = [...data.relatedPeople];
    updated[index] = { ...updated[index], ...updates };
    onChange({ relatedPeople: updated });
  };

  const removePerson = (index: number) => {
    onChange({ relatedPeople: data.relatedPeople.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
        <p className="text-[#555] text-xs leading-relaxed">
          <span className="text-[#d4af37]">Esta etapa é opcional.</span>
          <br />
          Adicionar pessoas importantes permite análises de compatibilidade, dinâmicas relacionais
          e influência dessas pessoas nos seus ciclos atuais. Útil especialmente para análise de parceiro(a)
          ou pessoas de impacto direto na sua vida agora.
        </p>
      </div>

      {data.relatedPeople.length === 0 && (
        <div className="text-center py-8 text-[#555] text-sm">
          <p>Nenhuma pessoa adicionada.</p>
          <p className="text-xs mt-1">Adicione se quiser análise relacional ou de compatibilidade.</p>
        </div>
      )}

      {data.relatedPeople.map((person, index) => (
        <div key={person.id || index} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#d4af37] text-xs uppercase tracking-wider">Pessoa {index + 1}</span>
            <button
              type="button"
              onClick={() => removePerson(index)}
              className="text-[#555] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Nome completo</Label>
              <Input
                value={person.fullName}
                onChange={e => updatePerson(index, { fullName: e.target.value })}
                placeholder="Nome da pessoa"
                className="bg-[#111] border-[#333] text-white text-sm placeholder:text-[#444] focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Relação com você</Label>
              <Select
                value={person.relationType}
                onValueChange={v => updatePerson(index, { relationType: v ?? "outro" })}
              >
                <SelectTrigger className="bg-[#111] border-[#333] text-white text-sm focus:border-[#d4af37]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333]">
                  {RELATION_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Data de nascimento</Label>
              <Input
                type="date"
                value={person.birthDate}
                onChange={e => updatePerson(index, { birthDate: e.target.value })}
                className="bg-[#111] border-[#333] text-white text-sm focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#aaa] text-xs">Cidade de nascimento (opcional)</Label>
              <Input
                value={person.birthCity}
                onChange={e => updatePerson(index, { birthCity: e.target.value })}
                placeholder="Ex: Rio de Janeiro"
                className="bg-[#111] border-[#333] text-white text-sm placeholder:text-[#444] focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#aaa] text-xs">Notas sobre esta pessoa (opcional)</Label>
            <Textarea
              value={person.notes}
              onChange={e => updatePerson(index, { notes: e.target.value })}
              placeholder="Como é a relação, o que você quer entender desta dinâmica..."
              rows={2}
              className="bg-[#111] border-[#333] text-white text-sm placeholder:text-[#444] focus:border-[#d4af37] resize-none"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addPerson}
        className="w-full border-dashed border-[#333] text-[#555] hover:text-white hover:border-[#d4af37]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar pessoa importante
      </Button>
    </div>
  );
}

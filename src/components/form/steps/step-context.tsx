"use client";

import { FormData } from "../multi-step-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const RELATIONSHIP_OPTIONS = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "namorando", label: "Namorando" },
  { value: "casado", label: "Casado(a)" },
  { value: "uniao-estavel", label: "União estável" },
  { value: "separado", label: "Separado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "complicado", label: "Relacionamento complicado" },
];

const FINANCIAL_OPTIONS = [
  { value: "dificuldade", label: "Passando por dificuldades" },
  { value: "estavel-limitado", label: "Estável, mas limitado" },
  { value: "confortavel", label: "Confortável" },
  { value: "crescendo", label: "Em crescimento acelerado" },
  { value: "abundante", label: "Abundante" },
  { value: "transicao", label: "Em transição / incerteza" },
];

export function StepContext({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Estado civil atual</Label>
        <Select value={data.relationshipStatus} onValueChange={v => onChange({ relationshipStatus: v ?? "" })}>
          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#d4af37]">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-[#333]">
            {RELATIONSHIP_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Profissão atual</Label>
          <Input
            value={data.currentProfession}
            onChange={e => onChange({ currentProfession: e.target.value })}
            placeholder="Ex: Designer, Empreendedor..."
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Empresa ou negócio atual</Label>
          <Input
            value={data.currentCompany}
            onChange={e => onChange({ currentCompany: e.target.value })}
            placeholder="Ex: Freelancer, Nome da empresa..."
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Situação financeira atual</Label>
        <Select value={data.financialStatus} onValueChange={v => onChange({ financialStatus: v ?? "" })}>
          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#d4af37]">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-[#333]">
            {FINANCIAL_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Principais objetivos atuais</Label>
        <p className="text-[#555] text-xs">
          O que você quer conquistar ou construir nos próximos 12 meses?
        </p>
        <Textarea
          value={data.goals}
          onChange={e => onChange({ goals: e.target.value })}
          placeholder="Ex: Mudar de carreira, construir um negócio, estabilizar financeiramente, melhorar relacionamentos..."
          rows={3}
          className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Principais desafios atuais</Label>
        <p className="text-[#555] text-xs">
          O que está pesando ou travando você agora?
        </p>
        <Textarea
          value={data.challenges}
          onChange={e => onChange({ challenges: e.target.value })}
          placeholder="Ex: Falta de clareza de propósito, dificuldades financeiras, conflitos relacionais, bloqueios de autoconfiança..."
          rows={3}
          className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37] resize-none"
        />
      </div>
    </div>
  );
}

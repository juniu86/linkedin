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

export function StepIdentity({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Nome completo de nascimento *</Label>
          <p className="text-[#555] text-xs">Exatamente como consta na certidão</p>
          <Input
            value={data.fullNameBirth}
            onChange={e => onChange({ fullNameBirth: e.target.value })}
            placeholder="Ex: Maria das Graças Silva"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Nome que você usa atualmente *</Label>
          <p className="text-[#555] text-xs">Como você é chamado hoje</p>
          <Input
            value={data.currentName}
            onChange={e => onChange({ currentName: e.target.value })}
            placeholder="Ex: Mari Silva"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Telefone (opcional)</Label>
          <Input
            value={data.phone}
            onChange={e => onChange({ phone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="bg-[#111] border-[#333] text-white placeholder:text-[#444] focus:border-[#d4af37]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#aaa] text-sm">Gênero (opcional)</Label>
          <Select value={data.gender} onValueChange={v => onChange({ gender: v ?? "" })}>
            <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#d4af37]">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-[#333]">
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="nao-binario">Não binário</SelectItem>
              <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[#aaa] text-sm">Idioma da análise</Label>
        <p className="text-[#555] text-xs">Idioma em que seu relatório será escrito</p>
        <Select value={data.language} onValueChange={v => onChange({ language: v ?? "pt" })}>
          <SelectTrigger className="bg-[#111] border-[#333] text-white focus:border-[#d4af37] max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-[#333]">
            <SelectItem value="pt">Português (PT-BR)</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 mt-4">
        <p className="text-[#555] text-xs leading-relaxed">
          <span className="text-[#d4af37]">Por que precisamos do seu nome de nascimento?</span>
          <br />
          A numerologia do nome usa as letras exatas do nome registrado no nascimento para calcular
          números de expressão, alma e personalidade — cada um revelando um aspecto diferente da sua essência.
        </p>
      </div>
    </div>
  );
}

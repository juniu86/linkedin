"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Report {
  id: string;
  reportType: string;
  status: string;
  createdAt: string;
  payments: Array<{ status: string }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Aguardando pagamento", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", icon: Clock },
  PROCESSING: { label: "Gerando análise", color: "bg-blue-500/10 text-blue-500 border-blue-500/30", icon: Clock },
  COMPLETED: { label: "Pronto", color: "bg-green-500/10 text-green-500 border-green-500/30", icon: CheckCircle2 },
  FAILED: { label: "Erro", color: "bg-red-500/10 text-red-500 border-red-500/30", icon: AlertCircle },
};

const TYPE_LABELS: Record<string, string> = {
  ESSENTIAL: "Essencial",
  PREMIUM: "Premium",
  PREMIUM_RELATIONAL: "Premium + Relacional",
};

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then(d => setReports(d.reports || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[#d4af37] tracking-[3px] text-xs font-light uppercase">
            Mapa da Jornada
          </span>
          <UserButton />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light">Meus relatórios</h1>
            <p className="text-[#555] text-sm mt-1">Histórico das suas análises</p>
          </div>
          <Button asChild className="bg-[#d4af37] text-black hover:bg-[#c4a030]">
            <Link href="/novo-relatorio">
              <Plus className="w-4 h-4 mr-2" />
              Nova análise
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-[#111] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#666] mb-6">Você ainda não tem análises.</p>
            <Button asChild className="bg-[#d4af37] text-black hover:bg-[#c4a030]">
              <Link href="/novo-relatorio">Criar primeira análise</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => {
              const statusInfo = STATUS_LABELS[report.status] || STATUS_LABELS.PENDING;
              const StatusIcon = statusInfo.icon;
              const isPaid = report.payments?.some(p => p.status === "APPROVED");

              return (
                <Link key={report.id} href={`/relatorio/${report.id}`}>
                  <Card className="bg-[#111] border-[#1a1a1a] hover:border-[#333] transition-colors cursor-pointer">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#d4af37]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{TYPE_LABELS[report.reportType] || report.reportType}</p>
                          <p className="text-xs text-[#555] mt-0.5">
                            {format(new Date(report.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!isPaid && (
                          <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
                            Pagamento pendente
                          </Badge>
                        )}
                        <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

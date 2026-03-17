"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Download, CheckCircle2, Star } from "lucide-react";
import { toast } from "sonner";
import { ReportTeaser } from "@/components/report/report-teaser";
import { ReportViewer } from "@/components/report/report-viewer";

interface Report {
  id: string;
  reportType: string;
  status: string;
  isPaid: boolean;
  analysisJson?: Record<string, unknown>;
  teaser?: {
    executiveSummary: string;
    essence: string;
    weeklyForecast?: { weekGuidePhrase: string };
  } | null;
  createdAt: string;
}

export default function RelatoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reportId = params.id as string;
  const paymentStatus = searchParams.get("payment");

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Pagamento confirmado! Gerando seu relatório...");
      triggerGeneration();
    }
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar relatório.");
    } finally {
      setLoading(false);
    }
  };

  const triggerGeneration = async () => {
    setGenerating(true);
    try {
      await fetch(`/api/reports/${reportId}/generate`, {
        method: "POST",
      });

      // Poll for completion
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const res = await fetch(`/api/reports/${reportId}`);
        const data = await res.json();
        setReport(data.report);

        if (data.report.status === "COMPLETED" || attempts > 30) {
          clearInterval(poll);
          setGenerating(false);
          if (data.report.status === "COMPLETED") {
            toast.success("Relatório gerado com sucesso!");
          }
        }
      }, 5000);
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666]">Relatório não encontrado.</p>
          <Button asChild className="mt-4 bg-[#d4af37] text-black">
            <Link href="/dashboard">Voltar ao dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-[#d4af37] tracking-[3px] text-xs font-light uppercase">
            Mapa da Jornada
          </Link>
          {report.isPaid && report.status === "COMPLETED" && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-[#333] text-[#888] hover:text-white"
            >
              <a href={`/api/reports/${reportId}/pdf`} target="_blank">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                PDF
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Processing state */}
      {(generating || report.status === "PROCESSING") && (
        <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin shrink-0" />
            <div>
              <p className="text-sm text-[#aaa]">Gerando seu relatório...</p>
              <p className="text-xs text-[#555]">Isso pode levar alguns minutos. A página atualiza automaticamente.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Not paid — show teaser */}
        {!report.isPaid ? (
          <ReportTeaser reportId={reportId} report={report} />
        ) : report.status === "COMPLETED" && report.analysisJson ? (
          <ReportViewer analysis={report.analysisJson as Record<string, unknown>} />
        ) : report.status === "FAILED" ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">Ocorreu um erro ao gerar seu relatório.</p>
            <Button
              onClick={triggerGeneration}
              className="bg-[#d4af37] text-black"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-4" />
            <p className="text-[#666]">Seu relatório está sendo preparado...</p>
          </div>
        )}
      </div>
    </div>
  );
}

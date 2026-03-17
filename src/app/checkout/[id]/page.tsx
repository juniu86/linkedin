"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const PLAN_PRICES: Record<string, { name: string; price: string }> = {
  ESSENTIAL: { name: "Análise Essencial", price: "R$ 97" },
  PREMIUM: { name: "Análise Premium", price: "R$ 197" },
  PREMIUM_RELATIONAL: { name: "Análise Premium + Relacional", price: "R$ 297" },
};

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reportId = params.id as string;
  const productType = searchParams.get("type") || "PREMIUM";
  const [loading, setLoading] = useState(false);

  const plan = PLAN_PRICES[productType] || PLAN_PRICES.PREMIUM;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, productType }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao criar pagamento");

      // Redirect to Mercado Pago
      const url = process.env.NODE_ENV === "production"
        ? data.initPoint
        : data.sandboxInitPoint || data.initPoint;

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de pagamento não disponível");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[#d4af37] tracking-[3px] text-xs font-light uppercase block mb-4">
            Mapa da Jornada
          </span>
          <h1 className="text-2xl font-light mb-2">Finalizar pagamento</h1>
          <p className="text-[#666] text-sm">Após a confirmação, seu relatório será gerado em minutos.</p>
        </div>

        <Card className="bg-[#111] border-[#1a1a1a]">
          <CardContent className="p-6 space-y-6">
            {/* Order summary */}
            <div>
              <h2 className="text-xs uppercase tracking-wider text-[#555] mb-3">Resumo do pedido</h2>
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]">
                <span className="text-sm text-[#aaa]">{plan.name}</span>
                <span className="text-[#d4af37] font-medium">{plan.price}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-medium">Total</span>
                <span className="text-[#d4af37] text-lg font-light">{plan.price}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div>
              <h2 className="text-xs uppercase tracking-wider text-[#555] mb-3">Formas de pagamento</h2>
              <div className="bg-[#0d0d0d] rounded-lg p-4 text-sm text-[#777] space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span>PIX — aprovação imediata</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span>Cartão de crédito — até 12x</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span>Boleto bancário</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#d4af37] text-black hover:bg-[#c4a030] h-12 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar agora
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#555]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pagamento seguro via Mercado Pago</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-[#555] text-center mt-6 leading-relaxed">
          Após confirmação do pagamento, você será redirecionado automaticamente.
          <br />
          Seu relatório será gerado e enviado por e-mail em até 5 minutos.
        </p>
      </div>
    </div>
  );
}

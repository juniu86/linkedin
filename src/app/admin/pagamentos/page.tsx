import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminPaymentsPage() {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_CLERK_ID) redirect("/dashboard");

  const payments = await prisma.payment.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, currentName: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[#d4af37] tracking-[3px] text-xs font-light uppercase">
            Admin — Mapa da Jornada
          </span>
          <div className="flex gap-4 text-xs text-[#555]">
            <Link href="/admin/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/admin/relatorios" className="hover:text-white">Relatórios</Link>
            <Link href="/admin/pagamentos" className="hover:text-white text-white">Pagamentos</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-light mb-8">Pagamentos</h1>

        <div className="space-y-3">
          {payments.map(payment => (
            <Card key={payment.id} className="bg-[#111] border-[#1a1a1a]">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{payment.user.currentName}</p>
                  <p className="text-xs text-[#555]">
                    {payment.user.email} ·{" "}
                    {format(new Date(payment.createdAt), "d MMM yyyy HH:mm", { locale: ptBR })}
                  </p>
                  {payment.providerPaymentId && (
                    <p className="text-xs text-[#444] mt-0.5">ID: {payment.providerPaymentId}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#d4af37] font-medium text-sm">
                    R$ {payment.amount.toFixed(0)}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      payment.status === "APPROVED"
                        ? "border-green-500/30 text-green-500"
                        : payment.status === "FAILED"
                        ? "border-red-500/30 text-red-500"
                        : "border-yellow-500/30 text-yellow-500"
                    }`}
                  >
                    {payment.status}
                  </Badge>
                  <span className="text-xs text-[#555]">{payment.provider}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

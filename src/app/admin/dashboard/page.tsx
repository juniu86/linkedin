import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check admin
  if (userId !== process.env.ADMIN_CLERK_ID) {
    redirect("/dashboard");
  }

  const [totalReports, completedReports, totalPayments, approvedPayments, recentReports] =
    await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: "COMPLETED" } }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "APPROVED" } }),
      prisma.report.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true, currentName: true } },
          payments: { where: { status: "APPROVED" } },
        },
      }),
    ]);

  const revenue = await prisma.payment.aggregate({
    where: { status: "APPROVED" },
    _sum: { amount: true },
  });

  const stats = [
    { label: "Total de relatórios", value: totalReports, icon: FileText },
    { label: "Relatórios concluídos", value: completedReports, icon: TrendingUp },
    { label: "Pagamentos aprovados", value: approvedPayments, icon: DollarSign },
    {
      label: "Receita total",
      value: `R$ ${(revenue._sum.amount || 0).toFixed(0)}`,
      icon: DollarSign,
    },
  ];

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
            <Link href="/admin/pagamentos" className="hover:text-white">Pagamentos</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-light mb-8">Dashboard Admin</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(stat => (
            <Card key={stat.label} className="bg-[#111] border-[#1a1a1a]">
              <CardContent className="p-5">
                <stat.icon className="w-5 h-5 text-[#d4af37] mb-2" />
                <div className="text-2xl font-light text-[#d4af37]">{stat.value}</div>
                <div className="text-xs text-[#555] mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent reports */}
        <h2 className="text-sm uppercase tracking-wider text-[#555] mb-4">Últimos relatórios</h2>
        <div className="space-y-3">
          {recentReports.map(report => (
            <Card key={report.id} className="bg-[#111] border-[#1a1a1a]">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{report.user.currentName}</p>
                  <p className="text-xs text-[#555]">
                    {report.user.email} ·{" "}
                    {format(new Date(report.createdAt), "d MMM yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      report.status === "COMPLETED"
                        ? "border-green-500/30 text-green-500"
                        : report.status === "PROCESSING"
                        ? "border-blue-500/30 text-blue-500"
                        : report.status === "FAILED"
                        ? "border-red-500/30 text-red-500"
                        : "border-yellow-500/30 text-yellow-500"
                    }`}
                  >
                    {report.status}
                  </Badge>
                  {report.payments.length > 0 && (
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-500">
                      PAGO
                    </Badge>
                  )}
                  <Link
                    href={`/relatorio/${report.id}`}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    Ver
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

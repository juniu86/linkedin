import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  TrendingUp,
  Heart,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Preencha o formulário",
    desc: "Dados de nascimento, contexto atual e eventos marcantes da sua trajetória.",
  },
  {
    step: "02",
    title: "Escolha sua análise",
    desc: "Selecione o nível de profundidade: Essencial, Premium ou Premium + Relacional.",
  },
  {
    step: "03",
    title: "Receba seu relatório",
    desc: "Nossa IA cruza numerologia, astrologia e trajetória para gerar sua leitura completa.",
  },
];

const REPORT_SECTIONS = [
  { icon: User, title: "Quem você é em essência", desc: "Traços centrais, arquétipo dominante e padrão de comportamento" },
  { icon: BookOpen, title: "Jornada até aqui", desc: "Leitura interpretativa dos seus eventos e transições de vida" },
  { icon: TrendingUp, title: "Perfil profissional e vocacional", desc: "Talentos, zona de genialidade e ambiente ideal de trabalho" },
  { icon: Heart, title: "Relacionamentos e amor", desc: "Padrões afetivos, compatibilidades e dinâmicas relacionais" },
  { icon: DollarSign, title: "Riqueza e abundância", desc: "Sua relação com dinheiro, bloqueios e potencial financeiro" },
  { icon: Calendar, title: "Próximos 3 anos", desc: "Linha do tempo com oportunidades, riscos e foco recomendado" },
];

const PLANS = [
  {
    name: "Essencial",
    price: "R$ 97",
    description: "Análise completa da sua personalidade, jornada e próximo ano.",
    features: [
      "Perfil de personalidade profundo",
      "Leitura da jornada até aqui",
      "Perfil profissional e vocacional",
      "Relacionamentos e compatibilidades",
      "Riqueza e padrão financeiro",
      "Caminho de vida e da alma",
      "Resumo do próximo ano",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "R$ 197",
    description: "Análise completa + linha do tempo de 3 anos + previsão semanal + PDF.",
    features: [
      "Tudo do Essencial",
      "Análise integrada multi-lentes",
      "Linha do tempo dos próximos 3 anos",
      "Previsão detalhada da próxima semana",
      "PDF premium para download",
      "Envio por e-mail",
    ],
    highlighted: true,
    badge: "Mais Popular",
  },
  {
    name: "Premium + Relacional",
    price: "R$ 297",
    description: "Tudo do Premium com análise do seu relacionamento principal.",
    features: [
      "Tudo do Premium",
      "Análise da pessoa mais importante",
      "Dinâmica relacional profunda",
      "Pontos de convergência e atrito",
      "Compatibilidade energética",
    ],
    highlighted: false,
  },
];

const FAQ = [
  {
    q: "A análise é baseada em ciência?",
    a: "A análise cruza numerologia, astrologia e dados biográficos como lentes interpretativas, não como prova científica. O objetivo é oferecer um espelho de reflexão e direcionamento prático.",
  },
  {
    q: "Quanto tempo leva para gerar o relatório?",
    a: "O relatório é gerado em poucos minutos após a confirmação do pagamento. Você recebe uma notificação por e-mail assim que estiver pronto.",
  },
  {
    q: "Preciso saber meu horário exato de nascimento?",
    a: "Não. O formulário aceita hora aproximada ou desconhecida. A análise ficará mais genérica em alguns pontos, mas o relatório continua completo e útil.",
  },
  {
    q: "Posso comprar a análise para outra pessoa?",
    a: "Sim. Você pode preencher os dados de outra pessoa e gerar a análise dela. Para análise relacional, inclua os dados de ambos.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#d4af37] tracking-[3px] text-sm font-light uppercase">
            Mapa da Jornada
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm text-[#888] hover:text-white transition-colors">
              Entrar
            </Link>
            <Button asChild size="sm" className="bg-[#d4af37] text-black hover:bg-[#c4a030]">
              <Link href="/novo-relatorio">Começar agora</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37]/10">
            <Sparkles className="w-3 h-3 mr-1" />
            Leitura interpretativa premium
          </Badge>
          <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 tracking-wide">
            Descubra a leitura mais profunda
            <br />
            <span className="text-[#d4af37]">da sua jornada de vida</span>
          </h1>
          <p className="text-lg text-[#888] leading-relaxed max-w-2xl mx-auto mb-10">
            Um relatório premium que cruza nascimento, nome, trajetória e ciclos para revelar
            padrões pessoais, profissionais, afetivos e financeiros com profundidade real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c4a030] text-base px-8">
              <Link href="/novo-relatorio">Quero minha análise</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#333] text-[#888] hover:text-white text-base px-8">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-4">Como funciona</h2>
            <Separator className="w-16 mx-auto bg-[#d4af37]" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-thin text-[#d4af37]/30 mb-4">{item.step}</div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-[#888] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you receive */}
      <section className="py-24 px-6 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-4">O que você recebe</h2>
            <Separator className="w-16 mx-auto bg-[#d4af37]" />
            <p className="text-[#888] mt-6 text-sm">
              Um relatório com até 17 seções de análise profunda
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {REPORT_SECTIONS.map((section) => (
              <Card key={section.title} className="bg-[#111] border-[#1a1a1a]">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-sm">{section.title}</h3>
                    <p className="text-[#666] text-xs leading-relaxed">{section.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-4">Escolha sua análise</h2>
            <Separator className="w-16 mx-auto bg-[#d4af37]" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? "bg-[#111] border-[#d4af37]/50"
                    : "bg-[#0d0d0d] border-[#1a1a1a]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#d4af37] text-black text-xs">{plan.badge}</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-lg font-medium mb-1">{plan.name}</h3>
                  <div className="text-3xl font-light text-[#d4af37] mb-3">{plan.price}</div>
                  <p className="text-[#666] text-sm mb-6 leading-relaxed">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="text-[#aaa]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-[#d4af37] text-black hover:bg-[#c4a030]"
                        : "bg-[#1a1a1a] text-white hover:bg-[#222]"
                    }`}
                  >
                    <Link href="/novo-relatorio">Começar agora</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-wide mb-4">Perguntas frequentes</h2>
            <Separator className="w-16 mx-auto bg-[#d4af37]" />
          </div>
          <div className="space-y-8">
            {FAQ.map((item) => (
              <div key={item.q} className="border-b border-[#1a1a1a] pb-8">
                <h3 className="font-medium mb-3 flex items-start gap-2">
                  <Star className="w-4 h-4 text-[#d4af37] shrink-0 mt-1" />
                  {item.q}
                </h3>
                <p className="text-[#777] text-sm leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <Lock className="w-8 h-8 text-[#d4af37] mx-auto mb-6" />
          <h2 className="text-3xl font-light tracking-wide mb-4">
            Sua análise espera por você
          </h2>
          <p className="text-[#777] mb-8 leading-relaxed">
            Preencha o formulário em menos de 10 minutos e receba a leitura mais profunda
            da sua trajetória, personalidade e próximos ciclos de vida.
          </p>
          <Button asChild size="lg" className="bg-[#d4af37] text-black hover:bg-[#c4a030] text-base px-10">
            <Link href="/novo-relatorio">Quero minha análise agora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#d4af37] tracking-[3px] text-sm font-light uppercase">
            Mapa da Jornada
          </span>
          <p className="text-[#555] text-xs text-center">
            As análises são leituras interpretativas, não previsões científicas.
            <br />
            Não substituem orientação médica, jurídica ou financeira.
          </p>
          <div className="flex gap-6 text-xs text-[#555]">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

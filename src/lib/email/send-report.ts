import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail({
  to,
  userName,
  reportId,
  pdfUrl,
  language = "pt",
}: {
  to: string;
  userName: string;
  reportId: string;
  pdfUrl?: string | null;
  language?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reportUrl = `${appUrl}/relatorio/${reportId}`;

  const subjectPt = "Seu Mapa da Jornada está pronto ✨";
  const subjectEn = "Your Journey Map is ready ✨";

  const bodyPt = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
      <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #d4af37; margin-bottom: 8px;">MAPA DA JORNADA</h1>
      <div style="width: 40px; height: 1px; background: #d4af37; margin-bottom: 32px;"></div>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">Olá, ${userName},</p>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
        Seu relatório de leitura profunda da jornada de vida está pronto.
        Preparamos uma análise completa cruzando múltiplas lentes interpretativas —
        numerologia, astrologia, trajetória biográfica e ciclos pessoais.
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${reportUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 16px 40px; text-decoration: none; font-size: 14px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase;">
          VER MEU RELATÓRIO
        </a>
      </div>

      ${pdfUrl ? `
      <p style="font-size: 14px; line-height: 1.7; color: #888; margin-bottom: 16px;">
        <a href="${pdfUrl}" style="color: #d4af37;">Clique aqui para baixar o PDF premium</a>
      </p>
      ` : ""}

      <hr style="border: none; border-top: 1px solid #333; margin: 40px 0;" />

      <p style="font-size: 12px; color: #555; line-height: 1.6;">
        Este relatório foi gerado com base nos dados fornecidos por você e representa uma leitura interpretativa,
        não uma previsão científica. As análises são lentes de reflexão, não verdades absolutas.
      </p>
    </div>
  `;

  const bodyEn = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #e5e5e5;">
      <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #d4af37; margin-bottom: 8px;">JOURNEY MAP</h1>
      <div style="width: 40px; height: 1px; background: #d4af37; margin-bottom: 32px;"></div>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">Hello, ${userName},</p>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
        Your deep life journey reading report is ready.
        We prepared a complete analysis crossing multiple interpretive lenses —
        numerology, astrology, biographical trajectory and personal cycles.
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${reportUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 16px 40px; text-decoration: none; font-size: 14px; letter-spacing: 2px; font-weight: 600; text-transform: uppercase;">
          VIEW MY REPORT
        </a>
      </div>

      ${pdfUrl ? `
      <p style="font-size: 14px; line-height: 1.7; color: #888; margin-bottom: 16px;">
        <a href="${pdfUrl}" style="color: #d4af37;">Click here to download the premium PDF</a>
      </p>
      ` : ""}
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "noreply@mapajornada.com",
    to,
    subject: language === "en" ? subjectEn : subjectPt,
    html: language === "en" ? bodyEn : bodyPt,
  });
}

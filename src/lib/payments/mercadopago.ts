import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const PRODUCT_PRICES: Record<string, { amount: number; label: string; labelEn: string }> = {
  ESSENTIAL: { amount: 97, label: "Análise Essencial", labelEn: "Essential Analysis" },
  PREMIUM: { amount: 197, label: "Análise Premium", labelEn: "Premium Analysis" },
  PREMIUM_RELATIONAL: { amount: 297, label: "Análise Premium + Relacional", labelEn: "Premium + Relational Analysis" },
};

export async function createPaymentPreference({
  reportId,
  userId,
  productType,
  userEmail,
  language = "pt",
}: {
  reportId: string;
  userId: string;
  productType: string;
  userEmail: string;
  language?: string;
}) {
  const product = PRODUCT_PRICES[productType];
  if (!product) throw new Error(`Invalid product type: ${productType}`);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: reportId,
          title: language === "en" ? product.labelEn : product.label,
          quantity: 1,
          unit_price: product.amount,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: userEmail,
      },
      external_reference: JSON.stringify({ reportId, userId, productType }),
      back_urls: {
        success: `${appUrl}/relatorio/${reportId}?payment=success`,
        failure: `${appUrl}/relatorio/${reportId}?payment=failed`,
        pending: `${appUrl}/relatorio/${reportId}?payment=pending`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
    },
  });

  return result;
}

export async function getPaymentDetails(paymentId: string) {
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

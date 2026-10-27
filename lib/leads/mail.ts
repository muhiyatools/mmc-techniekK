import "server-only";
import type { Lead } from "./schema";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

const FROM = process.env.MAIL_FROM ?? "MMC Techniek <info@mmctechniek.nl>";

/** Send one email through the provider in MAIL_PROVIDER (resend | smtp | log). Throws on failure. */
export async function sendMail(mail: Mail) {
  const provider = process.env.MAIL_PROVIDER ?? "log";

  if (provider === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [mail.to], subject: mail.subject, text: mail.text, reply_to: mail.replyTo }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return;
  }

  if (provider === "smtp") {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transport.sendMail({ from: FROM, to: mail.to, subject: mail.subject, text: mail.text, replyTo: mail.replyTo });
    return;
  }

  console.info(`[mail:log] to=${mail.to} subject="${mail.subject}"\n${mail.text}\n`);
}

const LABELS: Record<string, string> = {
  zonnepanelen: "Zonnepanelen",
  thuisbatterij: "Thuisbatterij",
  warmtepompen: "Warmtepomp",
  airconditioning: "Airconditioning",
  meterkast: "Meterkast & elektra",
  laadpaal: "Laadpaal",
  onderhoud: "Onderhoud & service",
  advies: "Advies / anders",
};

/** Plain-text notification to the company. */
export function companyMail(lead: Lead, ref: string, adminUrl: string): Mail {
  const lines =
    lead.kind === "offerte"
      ? [
          `Diensten: ${lead.services.map((s) => LABELS[s] ?? s).join(", ")}`,
          lead.product_slug && `Product: ${lead.product_slug}${lead.variant ? ` (${lead.variant})` : ""}`,
          lead.property_type && `Type pand: ${lead.property_type}`,
          lead.timing && `Start: ${lead.timing}`,
          (lead.postcode || lead.house_number) && `Adres: ${[lead.postcode, lead.house_number].filter(Boolean).join(" ")}`,
        ]
      : [];
  return {
    to: process.env.MAIL_TO ?? "info@mmctechniek.nl",
    replyTo: lead.email,
    subject: `${lead.kind === "offerte" ? "Nieuwe offerteaanvraag" : "Nieuw bericht"} ${ref}: ${lead.name}`,
    text: [
      `${lead.kind === "offerte" ? "Offerteaanvraag" : "Contactbericht"} ${ref}`,
      "",
      `Naam: ${lead.name}`,
      lead.phone && `Telefoon: ${lead.phone}`,
      `E-mail: ${lead.email}`,
      ...lines,
      lead.message && `\nToelichting:\n${lead.message}`,
      "",
      `Openen in beheer: ${adminUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

/** Plain-text confirmation to the customer. */
export function customerMail(lead: Lead, ref: string, phoneDisplay: string): Mail {
  const nl = lead.locale === "nl";
  return {
    to: lead.email,
    subject: nl ? `We hebben uw aanvraag ontvangen (${ref})` : `We've received your request (${ref})`,
    text: nl
      ? [`Beste ${lead.name},`, "", "Bedankt voor uw aanvraag. We nemen binnen één werkdag contact met u op.", `Uw referentie is ${ref}.`, "", `Liever direct contact? Bel ${phoneDisplay}.`, "", "Met vriendelijke groet,", "MMC Techniek"].join("\n")
      : [`Dear ${lead.name},`, "", "Thank you for your request. We'll get back to you within one working day.", `Your reference is ${ref}.`, "", `Rather talk now? Call ${phoneDisplay}.`, "", "Kind regards,", "MMC Techniek"].join("\n"),
  };
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  service: z.string().trim().min(1).max(120),
  details: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(), // honeypot — must stay empty
  elapsedMs: z.number().min(2500), // humans take a few seconds to fill the form
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Basic rate limit: max 3 inquiries per email per hour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return { ok: false as const, error: "Too many messages from this email. Please try again later or use WhatsApp." };
    }

    const { error } = await supabaseAdmin.from("inquiries").insert({
      name: data.name,
      email: data.email,
      service: data.service,
      details: data.details,
    });
    if (error) {
      console.error("inquiry insert failed", error);
      return { ok: false as const, error: "We couldn't save your message. Please try again or use WhatsApp / email." };
    }
    return { ok: true as const };
  });

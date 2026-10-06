import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  project: z.string().trim().min(1).max(120),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot
  elapsedMs: z.number().min(2500),
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 2) {
      return { ok: false as const, error: "You've already sent feedback recently. Please try again later." };
    }
    const { error } = await supabaseAdmin.from("feedback").insert({
      name: data.name,
      email: data.email,
      project: data.project,
      rating: data.rating,
      message: data.message,
      status: "pending",
    });
    if (error) {
      console.error("feedback insert failed", error);
      return { ok: false as const, error: "We couldn't save your feedback. Please try again in a moment." };
    }
    return { ok: true as const };
  });

export type PublicReview = { id: string; name: string; project: string; rating: number; message: string; created_at: string };

export const getApprovedReviews = createServerFn({ method: "GET" }).handler(async (): Promise<PublicReview[]> => {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env['SUPABASE_URL']!, process.env['SUPABASE_PUBLISHABLE_KEY']!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb
    .from("feedback")
    .select("id, name, project, rating, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    console.error("reviews fetch failed", error);
    return [];
  }
  return data as PublicReview[];
});

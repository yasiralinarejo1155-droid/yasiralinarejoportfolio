import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MessageCircle, Send, CheckCircle2, Phone, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { site, whatsapp, mailto, tel } from "@/data/site";
import { submitInquiry } from "@/lib/inquiries.functions";
import { Reveal } from "./ui";
import { LeaveFeedbackButton } from "./Feedback";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "service" | "details", string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ContactSection({ defaultService = "" }: { defaultService?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const openedAt = useRef(Date.now());
  const send = useServerFn(submitInquiry);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = Object.fromEntries(new FormData(form)) as { name?: string; email?: string; service?: string; details?: string; website?: string };
    const errs: Errors = {};
    if ((v.name?.trim().length ?? 0) < 2) errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email?.trim() ?? "")) errs.email = "Please enter a valid email address.";
    if (!v.service) errs.service = "Please choose a service.";
    if ((v.details?.trim().length ?? 0) < 10) errs.details = "Please describe your project (at least 10 characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus({ kind: "sending" });
    try {
      const res = await send({
        data: {
          name: v.name!.trim(),
          email: v.email!.trim(),
          service: v.service!,
          details: v.details!.trim(),
          website: v.website ?? "",
          elapsedMs: Date.now() - openedAt.current,
        },
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        form.reset();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    } catch {
      setStatus({ kind: "error", message: "Something went wrong while sending. Please try again, or contact me on WhatsApp or by email." });
    }
  };

  const field = "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-forest outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-3xl bg-panel p-6 text-forest-foreground md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bright/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <span className="inline-flex rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-forest">Open for projects</span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">Have an idea worth building?</h2>
              <p className="mt-4 max-w-md text-forest-foreground/80 md:text-lg">
                Let's discuss your website, AI solution, UI/UX design, or digital project.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#project-form" className="btn btn-light">Start a Project</a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light"><MessageCircle className="h-4 w-4" /> WhatsApp Me</a>
                <a href={mailto} className="btn btn-ghost-light"><Mail className="h-4 w-4" /> Email Me</a>
                <LeaveFeedbackButton className="btn-ghost-light" />
              </div>
              <ul className="mt-10 space-y-1 text-sm text-forest-foreground/85">
                <li><a className="inline-flex min-h-11 items-center gap-3 hover:text-forest-foreground" href={tel}><Phone className="h-4 w-4" />{site.phoneDisplay}</a></li>
                <li><a className="inline-flex min-h-11 items-center gap-3 break-all hover:text-forest-foreground" href={mailto}><Mail className="h-4 w-4 shrink-0" />{site.email}</a></li>
                <li className="inline-flex min-h-11 items-center gap-3"><MapPin className="h-4 w-4" />{site.location}</li>
              </ul>
            </div>

            <div id="project-form" className="rounded-2xl bg-background p-5 text-forest md:p-7">
              {status.kind === "sent" ? (
                <div role="status" aria-live="polite" className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="h-12 w-12 text-bright" />
                  <h3 className="mt-4 text-xl font-bold">Thank you — your message was received</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Your inquiry has been saved and Yasir will reply to your email soon. For anything urgent, message on WhatsApp.
                  </p>
                  <button type="button" onClick={() => { openedAt.current = Date.now(); setStatus({ kind: "idle" }); }} className="btn btn-outline mt-6 !min-h-11 text-sm">Send another message</button>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold">Tell me about your project</h3>
                  {/* Honeypot: hidden from people, bots tend to fill it */}
                  <div aria-hidden className="absolute -left-[9999px]" >
                    <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <input id="name" name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby="name-err" className={cn(field, errors.name && "border-destructive")} />
                      {errors.name && <p id="name-err" className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <input id="email" name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={!!errors.email} aria-describedby="email-err" className={cn(field, errors.email && "border-destructive")} />
                      {errors.email && <p id="email-err" className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="text-sm font-medium">Service Required</label>
                    <select id="service" name="service" key={defaultService} defaultValue={defaultService} aria-invalid={!!errors.service} aria-describedby="service-err" className={cn(field, errors.service && "border-destructive")}>
                      <option value="">Choose a service</option>
                      {site.services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="Custom project">Custom project</option>
                    </select>
                    {errors.service && <p id="service-err" className="mt-1 text-xs text-destructive">{errors.service}</p>}
                  </div>
                  <div>
                    <label htmlFor="details" className="text-sm font-medium">Project Details / Message</label>
                    <textarea id="details" name="details" rows={4} maxLength={4000} aria-invalid={!!errors.details} aria-describedby="details-err" className={cn(field, "resize-y", errors.details && "border-destructive")} />
                    {errors.details && <p id="details-err" className="mt-1 text-xs text-destructive">{errors.details}</p>}
                  </div>
                  {status.kind === "error" && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {status.message}
                    </p>
                  )}
                  <button type="submit" disabled={status.kind === "sending"} className="btn btn-primary w-full disabled:opacity-70">
                    {status.kind === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Send Message <Send className="h-4 w-4" /></>}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Prefer email? <a href={mailto} className="font-medium text-primary hover:underline">Write directly</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Star, X, Loader2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, MessageSquareHeart,
  BrainCircuit, MonitorSmartphone, GraduationCap, Presentation, SlidersHorizontal, Quote,
} from "lucide-react";
import { site } from "@/data/site";
import { submitFeedback, getApprovedReviews, type PublicReview } from "@/lib/feedback.functions";
import { SectionHeading } from "./ui";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "open-feedback";
export const openFeedback = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function LeaveFeedbackButton({ className, children = "Leave Feedback" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={openFeedback} className={cn("btn", className)}>
      <MessageSquareHeart className="h-4 w-4" /> {children}
    </button>
  );
}

/* ---------------- Modal ---------------- */
type Errors = Partial<Record<"name" | "email" | "project" | "rating" | "message", string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const openedAt = useRef(Date.now());
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const send = useServerFn(submitFeedback);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      openedAt.current = Date.now();
      setStatus({ kind: "idle" });
      setErrors({});
      setRating(0);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input,button")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, close]);

  if (!open) return null;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = Object.fromEntries(new FormData(form)) as { name: string; email: string; project: string; message: string; website?: string };
    const errs: Errors = {};
    if ((v.name?.trim().length ?? 0) < 2) errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email?.trim() ?? "")) errs.email = "Please enter a valid email address.";
    if (!v.project) errs.project = "Please choose a project or service.";
    if (rating < 1) errs.rating = "Please choose a rating.";
    if ((v.message?.trim().length ?? 0) < 10) errs.message = "Please write at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus({ kind: "sending" });
    try {
      const res = await send({
        data: {
          name: v.name.trim(), email: v.email.trim(), project: v.project, rating,
          message: v.message.trim(), website: v.website ?? "", elapsedMs: Date.now() - openedAt.current,
        },
      });
      if (res.ok) setStatus({ kind: "sent" });
      else setStatus({ kind: "error", message: res.error });
    } catch {
      setStatus({ kind: "error", message: "Something went wrong while sending. Please check your connection and try again." });
    }
  };

  const field = "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-forest outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
  const options = [...site.projects.map((p) => p.name), ...site.services.map((s) => s.name), "Other"];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-forest/60 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="fb-title" className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-6 shadow-lift animate-in slide-in-from-bottom-4 duration-300 sm:rounded-3xl md:p-8">
        <button type="button" onClick={close} aria-label="Close feedback form" className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-mint hover:text-forest">
          <X className="h-5 w-5" />
        </button>
        {status.kind === "sent" ? (
          <div role="status" aria-live="polite" className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-bright" />
            <h2 id="fb-title" className="mt-4 text-xl font-bold">Thank you for your feedback</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">It has been received and will be reviewed before it appears on the site.</p>
            <button type="button" onClick={close} className="btn btn-primary mt-6">Close</button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="space-y-4">
            <div>
              <h2 id="fb-title" className="text-xl font-bold">Leave feedback</h2>
              <p className="mt-1 text-sm text-muted-foreground">Worked with me? Share your honest experience.</p>
            </div>
            <div aria-hidden className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fb-name" className="text-sm font-medium">Full Name</label>
                <input id="fb-name" name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} className={cn(field, errors.name && "border-destructive")} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="fb-email" className="text-sm font-medium">Email Address</label>
                <input id="fb-email" name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={!!errors.email} className={cn(field, errors.email && "border-destructive")} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="fb-project" className="text-sm font-medium">Project / Service</label>
              <select id="fb-project" name="project" defaultValue="" aria-invalid={!!errors.project} className={cn(field, errors.project && "border-destructive")}>
                <option value="">Choose one</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {errors.project && <p className="mt-1 text-xs text-destructive">{errors.project}</p>}
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Rating</legend>
              <div className="mt-1.5 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={rating === n}
                    onClick={() => setRating(n)} onMouseEnter={() => setHover(n)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition hover:scale-110 active:scale-95"
                  >
                    <Star className={cn("h-7 w-7 transition-colors", (hover || rating) >= n ? "fill-highlight text-highlight" : "text-border")} />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}
            </fieldset>
            <div>
              <label htmlFor="fb-message" className="text-sm font-medium">Feedback / Review</label>
              <textarea id="fb-message" name="message" rows={4} maxLength={2000} aria-invalid={!!errors.message} className={cn(field, "resize-y", errors.message && "border-destructive")} />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
            {status.kind === "error" && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {status.message}
              </p>
            )}
            <button type="submit" disabled={status.kind === "sending"} className="btn btn-primary w-full disabled:opacity-70">
              {status.kind === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- Reviews section ---------------- */
const highlights = [
  { icon: BrainCircuit, title: "AI & Machine Learning Solutions", text: "Practical AI features shaped around a real use case." },
  { icon: MonitorSmartphone, title: "Full-Stack Web Applications", text: "Responsive interfaces connected to useful application workflows." },
  { icon: SlidersHorizontal, title: "UI/UX and Portfolio Design", text: "Clear, user-focused interfaces for professional digital experiences." },
  { icon: GraduationCap, title: "Academic Research Platforms", text: "Focused digital experiences for research and academic work." },
  { icon: Presentation, title: "Live Project Demonstrations", text: "Working projects shared through direct live links." },
  { icon: SlidersHorizontal, title: "Custom Client Requirements", text: "Project scope and features shaped around the requirements provided." },
];

type Slide =
  | { kind: "review"; r: PublicReview }
  | { kind: "highlight"; h: (typeof highlights)[number] };

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

function usePerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const f = () => setN(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return n;
}

export function ReviewsSection() {
  const fetchReviews = useServerFn(getApprovedReviews);
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Load reviews only when the section approaches the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        io.disconnect();
        fetchReviews().then(setReviews).catch(() => setReviews([]));
      }
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchReviews]);

  const hasReviews = !!reviews && reviews.length > 0;
  const slides: Slide[] = hasReviews ? reviews!.map((r) => ({ kind: "review", r })) : highlights.map((h) => ({ kind: "highlight", h }));

  return (
    <section ref={sectionRef} id="feedback" className="bg-mint py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={hasReviews ? "Approved reviews" : "Project highlights"}
            title="Client Feedback & Project Reviews"
            text={hasReviews ? "Your feedback helps me improve and deliver better digital solutions." : "Your feedback helps me improve and deliver better digital solutions. Approved reviews will appear here; these cards are project highlights, not testimonials."}
          />
          <LeaveFeedbackButton className="btn-primary self-start md:self-auto" />
        </div>
        <Carousel slides={slides} />
      </div>
    </section>
  );
}

function Carousel({ slides }: { slides: Slide[] }) {
  const perView = usePerView();
  const reduced = useReducedMotion();
  const pages = Math.max(1, slides.length - perView + 1);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => { if (i > pages - 1) setI(0); }, [pages, i]);
  useEffect(() => {
    if (reduced || paused || pages < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % pages), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, pages]);

  const go = (d: number) => setI((x) => (x + d + pages) % pages);

  return (
    <div
      className="mt-12"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div
        className="overflow-hidden"
        onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; setPaused(true); }}
        onTouchEnd={(e) => {
          const s = touchX.current; touchX.current = null; setPaused(false);
          const end = e.changedTouches[0]?.clientX;
          if (s == null || end == null) return;
          if (Math.abs(end - s) > 40) go(end < s ? 1 : -1);
        }}
      >
        <ul
          className={cn("flex", !reduced && "transition-transform duration-500 ease-out")}
          style={{ transform: `translateX(-${(i * 100) / perView}%)` }}
        >
          {slides.map((s, idx) => (
            <li key={s.kind === "review" ? s.r.id : s.h.title} className="shrink-0 px-2.5" style={{ width: `${100 / perView}%` }} aria-hidden={idx < i || idx >= i + perView}>
              {s.kind === "review" ? <ReviewCard r={s.r} /> : <HighlightCard h={s.h} />}
            </li>
          ))}
        </ul>
      </div>
      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary hover:text-primary active:scale-95"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex gap-1">
            {Array.from({ length: pages }).map((_, d) => (
              <button key={d} type="button" onClick={() => setI(d)} aria-label={`Go to slide ${d + 1}`} aria-current={d === i} className="inline-flex h-8 w-6 items-center justify-center">
                <span className={cn("h-2 rounded-full transition-all", d === i ? "w-6 bg-primary" : "w-2 bg-primary/25")} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary hover:text-primary active:scale-95"><ChevronRight className="h-5 w-5" /></button>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ r }: { r: PublicReview }) {
  const initials = r.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn("h-4 w-4", n <= r.rating ? "fill-highlight text-highlight" : "text-border")} />)}
      </div>
      <Quote className="mt-4 h-6 w-6 text-primary/30" />
      <p className="mt-2 flex-1 text-sm leading-relaxed text-forest">{r.message}</p>
      <div className="mt-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{initials}</span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.project} · {new Date(r.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
        </div>
      </div>
    </article>
  );
}

function HighlightCard({ h }: { h: (typeof highlights)[number] }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-primary"><h.icon className="h-6 w-6" /></span>
      <h3 className="mt-5 font-bold">{h.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
      <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wider text-primary">Project highlight</span>
    </article>
  );
}

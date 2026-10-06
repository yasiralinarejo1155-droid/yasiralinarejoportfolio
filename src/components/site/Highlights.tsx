import { BrainCircuit, AppWindow, Palette, ShoppingCart, GraduationCap, Globe } from "lucide-react";
import { SectionHeading } from "./ui";

const items = [
  { icon: BrainCircuit, title: "AI & Machine Learning Projects", text: "TruthTrail, SmartCV AI, LanguageBridge" },
  { icon: AppWindow, title: "Custom Web Applications", text: "Full-stack apps built around real needs" },
  { icon: Palette, title: "UI/UX and Portfolio Websites", text: "Clean, user-focused interfaces" },
  { icon: ShoppingCart, title: "E-Commerce Solutions", text: "Ordering flows like CraveBite" },
  { icon: GraduationCap, title: "Academic and FYP Systems", text: "Project development and guidance" },
  { icon: Globe, title: "Live Project Demos", text: "Every project shared as a live link" },
];

export function HighlightsMarquee() {
  const loop = [...items, ...items];
  return (
    <section aria-labelledby="hl-title" className="overflow-hidden py-20 md:py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Highlights" title={<span id="hl-title">Trusted Work, Real Solutions</span>} center />
      </div>
      <div className="marquee mt-12 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="marquee-track flex w-max gap-5 px-5">
          {loop.map((it, i) => (
            <li key={i} aria-hidden={i >= items.length} className="group w-[260px] shrink-0 rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_10px_30px_-10px_var(--color-bright)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><it.icon className="h-5 w-5" /></span>
              <p className="mt-4 font-display font-bold leading-snug">{it.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

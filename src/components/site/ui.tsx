import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, as: Tag = "div", delay = 0 }: { children: ReactNode; className?: string; as?: ElementType; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-visible={visible} style={{ transitionDelay: `${delay}ms` }} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-highlight" />
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, text, center, className }: { eyebrow: string; title: ReactNode; text?: ReactNode; center?: boolean; className?: string }) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{text}</p>}
    </Reveal>
  );
}

export function Chip({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "orange" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "mint" && "bg-mint text-primary",
        tone === "orange" && "bg-highlight-soft text-forest",
        tone === "outline" && "border border-border bg-background text-forest",
      )}
    >
      {children}
    </span>
  );
}

import { useEffect, useState, type MouseEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const els = navItems.map((n) => document.getElementById(n.hash)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (hash: string) => (e: MouseEvent) => {
    setOpen(false);
    if (!isHome) return; // let the router navigate to "/" + hash
    const el = document.getElementById(hash);
    if (!el) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      document.body.style.overflow = "";
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash === "top" ? "/" : `/#${hash}`);
      setActive(hash);
    });
  };

  const isActive = (hash: string) =>
    isHome ? active === hash : (hash === "about" && pathname === "/about") || (hash === "services" && pathname === "/services") || (hash === "work" && pathname.startsWith("/work"));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-border bg-background shadow-soft" : "bg-background/60 backdrop-blur-md",
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link to="/" hash="top" className="flex min-h-11 items-center font-display text-xl font-extrabold tracking-tight" onClick={go("top")}>
          Yasir Ali<span className="text-bright">.</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center">
            {navItems.map((n) => (
              <li key={n.hash}>
                <Link
                  to="/"
                  hash={n.hash}
                  onClick={go(n.hash)}
                  data-active={isActive(n.hash)}
                  className={cn(
                    "nav-link flex min-h-11 items-center px-3 text-sm font-medium transition-colors hover:text-primary",
                    isActive(n.hash) ? "text-primary" : "text-forest/80",
                  )}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/" hash="contact" onClick={go("contact")} className="btn btn-primary hidden !min-h-11 !px-5 text-sm sm:inline-flex">
            Let's Talk <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition active:scale-95 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-background lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="container-x flex flex-col gap-1 py-6">
            {navItems.map((n) => (
              <li key={n.hash}>
                <Link
                  to="/"
                  hash={n.hash}
                  onClick={go(n.hash)}
                  className={cn(
                    "flex min-h-14 items-center rounded-xl px-4 font-display text-xl font-bold transition active:bg-accent hover:bg-mint",
                    isActive(n.hash) && "bg-mint text-primary",
                  )}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <Link to="/" hash="contact" onClick={go("contact")} className="btn btn-primary w-full">
                Let's Talk <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Linkedin, Github, Youtube, Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { LeaveFeedbackButton } from "./Feedback";
import { site, mailto, tel, navItems, highlightServices } from "@/data/site";

const socials = [
  { label: "LinkedIn", href: site.socials.LinkedIn, icon: Linkedin },
  { label: "GitHub", href: site.socials.GitHub, icon: Github },
  { label: "Fiverr", href: site.socials.Fiverr, icon: Briefcase },
  { label: "YouTube", href: site.socials.YouTube, icon: Youtube },
];

export function SocialLinks({ light }: { light?: boolean }) {
  return (
    <ul className="flex gap-2">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={
              light
                ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest-foreground/25 text-forest-foreground transition hover:-translate-y-0.5 hover:bg-forest-foreground/10 active:scale-95"
                : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-forest transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-95"
            }
          >
            <s.icon className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div>
          <p className="font-display text-2xl font-extrabold">Yasir Ali<span className="text-bright">.</span></p>
          <p className="mt-1 text-sm font-medium text-forest-foreground/90">{site.identity}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-foreground/70">
            Building AI solutions, modern web applications and thoughtful digital experiences.
          </p>
          <div className="mt-6"><SocialLinks light /></div>
          <LeaveFeedbackButton className="btn-ghost-light mt-5 !min-h-11 text-sm" />
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-bright">Quick links</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {navItems.map((n) => (
              <li key={n.hash}>
                <Link to="/" hash={n.hash} className="inline-flex min-h-9 items-center text-forest-foreground/75 transition hover:translate-x-0.5 hover:text-forest-foreground">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-bright">Services</h2>
          <ul className="mt-4 space-y-1 text-sm">
            {highlightServices.slice(0, 6).map((s) => (
              <li key={s.title}>
                <Link to="/services" className="inline-flex min-h-9 items-center text-forest-foreground/75 transition hover:text-forest-foreground">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-bright">Contact</h2>
          <ul className="mt-4 space-y-1 text-sm text-forest-foreground/80">
            <li><a href={tel} className="inline-flex min-h-11 items-center gap-3 hover:text-forest-foreground"><Phone className="h-4 w-4" />{site.phoneDisplay}</a></li>
            <li><a href={mailto} className="inline-flex min-h-11 items-center gap-3 break-all hover:text-forest-foreground"><Mail className="h-4 w-4 shrink-0" />{site.email}</a></li>
            <li className="flex min-h-11 items-center gap-3"><MapPin className="h-4 w-4 shrink-0" />{site.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-foreground/10">
        <div className="container-x flex flex-col gap-1 py-5 text-xs text-forest-foreground/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Built with care in Khairpur Mirs.</p>
        </div>
      </div>
    </footer>
  );
}

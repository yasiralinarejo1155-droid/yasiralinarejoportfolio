import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { serviceIcons, type Service, type ProjectItem } from "@/data/site";
import { Chip } from "./ui";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, detailed }: { service: Service; detailed?: boolean }) {
  const Icon = serviceIcons[service.id] ?? ArrowRight;
  return (
    <article className="card-lift group flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-primary transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </span>
        <Link
          to="/"
          hash="contact"
          search={{ service: service.name }}
          aria-label={`Request ${service.name}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-forest transition group-hover:border-primary group-hover:text-primary active:scale-95"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
      <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.intro}</p>
      {detailed && (
        <>
          <ul className="mt-4 space-y-1.5 text-sm text-forest/85">
            {service.features.map((f) => (
              <li key={f} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bright" />{f}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground"><span className="font-semibold text-forest">For: </span>{service.audience}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {service.tools.map((t) => <Chip key={t} tone="outline">{t}</Chip>)}
          </div>
        </>
      )}
    </article>
  );
}

export function ProjectVisual({ project }: { project: ProjectItem }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-mint">
      <img
        src={project.image}
        alt={`Preview of ${project.name}`}
        width={1152}
        height={720}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest/70 via-forest/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest-foreground">Open live project <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article className="card-lift group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-3.5">
      <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} live (new tab)`} tabIndex={-1}>
        <ProjectVisual project={project} />
      </a>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5">
        <div><Chip tone="orange">{project.type}</Chip></div>
        <h3 className="mt-3 text-lg font-bold leading-snug">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.features.map((f) => <Chip key={f}>{f}</Chip>)}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 flex-1 text-sm">
            View Live Project <ArrowUpRight className="h-4 w-4" />
          </a>
          <Link to="/work/$id" params={{ id: project.id }} aria-label={`Details about ${project.name}`} className="btn btn-outline !min-h-11 !px-4 text-sm">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <div key={f.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-bold transition-colors hover:text-primary md:px-6"
              >
                {f.question}
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-primary transition-transform duration-300", isOpen && "rotate-45 bg-primary text-primary-foreground")}>
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div id={id} role="region" className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6 md:text-base">{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

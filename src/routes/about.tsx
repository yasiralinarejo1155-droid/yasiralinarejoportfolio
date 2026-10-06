import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PenTool, BrainCircuit, Code2 } from "lucide-react";
import { site, images, skillGroups } from "@/data/site";
import { Reveal, Eyebrow, SectionHeading, Chip } from "@/components/site/ui";
import { SocialLinks } from "@/components/site/Footer";

const TITLE = "About Yasir Ali Narejo — AI, Development & Design";
const DESC = "Meet Yasir Ali Narejo, an AI Specialist, Full-Stack Developer and UI/UX Designer who turns ideas into useful digital products.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const values = [
  { icon: PenTool, title: "Design + function", text: "I pay attention to how a product looks, how people move through it and how its features support their goals." },
  { icon: BrainCircuit, title: "Practical AI", text: "AI is most valuable when it is built around a real use case and a clear workflow." },
  { icon: Code2, title: "Complete builds", text: "From interface to backend, I connect clear design with the features your visitors need." },
];

function About() {
  return (
    <>
      <section className="bg-hero pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-[400px]">
            <figure className="overflow-hidden rounded-[2rem] border-4 border-background bg-mint shadow-lift">
              <img src={images.yasir} alt="Portrait of Yasir Ali Narejo" width={900} height={900} className="aspect-square w-full object-cover" />
            </figure>
          </Reveal>
          <Reveal delay={100}>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">Different disciplines.<br />One practical perspective.</h1>
            <p className="mt-6 leading-relaxed text-muted-foreground md:text-lg">
              I'm {site.name}, an AI Specialist, Full-Stack Developer and UI/UX Designer focused on creating modern, useful and engaging digital products.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              I design and develop websites, web applications, AI-powered solutions, chatbots and intelligent agents. My creative work includes Figma prototypes, Canva graphics, posters, thumbnails, presentations and digital content.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
              My goal is simple: understand your idea, turn it into a practical solution and make the final experience clean, functional and easy to use.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/" hash="contact" className="btn btn-primary">Let's discuss your idea <ArrowRight className="h-4 w-4" /></Link>
              <SocialLinks />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How I add value" title="The full picture matters." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="card-lift rounded-2xl border border-border bg-card p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-primary"><v.icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Toolkit" title="Skills I work with" />
          <div className="mt-10 space-y-6">
            {skillGroups.map((g) => (
              <Reveal key={g.title} className="flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-start md:gap-8">
                <h3 className="w-56 shrink-0 font-bold">{g.title}</h3>
                <div className="flex flex-wrap gap-2">{g.items.map((s) => <Chip key={s} tone="outline">{s}</Chip>)}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

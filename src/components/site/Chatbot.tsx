import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, ExternalLink, MessageCircle, Send, X } from "lucide-react";
import { highlightServices, projects, site } from "@/data/site";
import { cn } from "@/lib/utils";

type Message = { id: number; from: "assistant" | "user"; text: string; links?: { label: string; href: string }[] };

const welcome = "Hi! I'm Yasir AI Assistant. Ask me about services, projects, skills, or how to contact Yasir.";
const quickActions = ["View Services", "Recent Projects", "Contact Yasir", "Leave Feedback"] as const;

const serviceAnswer = `Yasir offers ${highlightServices.map((service) => service.title).join(", ")}. Tell me which area interests you, or use the Contact section to share your requirements.`;

function answerQuestion(input: string): Omit<Message, "id" | "from"> {
  const query = input.trim().toLowerCase();

  if (/service|build|website|web app|design|branding|e-commerce|ecommerce|fyp/.test(query)) {
    return { text: serviceAnswer };
  }
  if (/project|work|portfolio|kiu|research|truthtrail|smartcv|languagebridge/.test(query)) {
    const selected = projects.slice(0, 7);
    return {
      text: "Here are Yasir's featured and recent live projects:",
      links: selected.map((project) => ({ label: project.name, href: project.url })),
    };
  }
  if (/skill|technolog|tool|stack|python|react|django|figma/.test(query)) {
    return { text: `Yasir's portfolio lists these skills and tools: ${site.skills.join(", ")}.` };
  }
  if (/contact|email|phone|location|hire|request|talk|whatsapp/.test(query)) {
    return { text: `You can contact Yasir at ${site.email}, call or WhatsApp ${site.phoneDisplay}, or use the Contact section. He is based in ${site.location}.` };
  }
  if (/feedback|review|rating/.test(query)) {
    return { text: "Use the Feedback section to leave a review. New submissions stay pending until Yasir approves them." };
  }
  if (/who|about|yasir|profile/.test(query)) {
    return { text: `${site.name} is an ${site.identity.replaceAll("|", ",")} based in ${site.location}.` };
  }
  if (/price|cost|available|deadline|delivery|time/.test(query)) {
    return { text: "Pricing, availability, and delivery time depend on the project. Please share your requirements in the Contact section for a confirmed answer." };
  }
  return { text: "I can help with Yasir's services, skills, live projects, contact details, and feedback process. Try one of the options below or ask a more specific question." };
}

function scrollToSection(id: "services" | "contact" | "feedback") {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 1, from: "assistant", text: welcome }]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const addAssistant = (message: Omit<Message, "id" | "from">) => {
    setMessages((current) => [...current, { ...message, id: nextId.current++, from: "assistant" }]);
  };

  const handleQuickAction = (action: (typeof quickActions)[number]) => {
    setMessages((current) => [...current, { id: nextId.current++, from: "user", text: action }]);
    if (action === "View Services") {
      addAssistant({ text: serviceAnswer });
      scrollToSection("services");
    } else if (action === "Recent Projects") {
      addAssistant({ text: "Explore these recent live projects:", links: projects.slice(0, 7).map((project) => ({ label: project.name, href: project.url })) });
    } else if (action === "Contact Yasir") {
      addAssistant({ text: `Contact Yasir at ${site.email} or ${site.phoneDisplay}. I've also taken you to the Contact section.` });
      scrollToSection("contact");
      setOpen(false);
    } else {
      addAssistant({ text: "I've taken you to the feedback form. New reviews remain pending until approved." });
      scrollToSection("feedback");
      setOpen(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || value.length > 300) return;
    setMessages((current) => [...current, { id: nextId.current++, from: "user", text: value }]);
    setInput("");
    addAssistant(answerQuestion(value));
  };

  return (
    <>
      {open && (
        <section aria-label="Yasir AI Assistant" className="fixed inset-x-3 bottom-3 z-[70] flex max-h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lift sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px]">
          <header className="flex items-center gap-3 bg-forest px-4 py-3.5 text-forest-foreground">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bright/20"><Bot className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-sm font-bold">Yasir AI Assistant</h2>
              <p className="text-xs text-forest-foreground/70">Portfolio guide</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Yasir AI Assistant" className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-forest-foreground/10"><X className="h-5 w-5" /></button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-mint/50 p-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("max-w-[88%]", message.from === "user" ? "ml-auto" : "mr-auto")}>
                <div className={cn("rounded-2xl px-3.5 py-3 text-sm leading-relaxed", message.from === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border bg-background text-forest")}>
                  {message.text}
                </div>
                {message.links && (
                  <ul className="mt-2 space-y-1 rounded-xl border border-border bg-background p-2">
                    {message.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex min-h-9 items-center justify-between gap-2 rounded-lg px-2 text-xs font-semibold text-primary transition hover:bg-mint">
                          <span>{link.label}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-background p-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickActions.map((action) => (
                <button key={action} type="button" onClick={() => handleQuickAction(action)} className="min-h-9 shrink-0 rounded-full border border-border px-3 text-xs font-semibold text-forest transition hover:border-primary hover:text-primary">{action}</button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <label htmlFor="assistant-message" className="sr-only">Ask Yasir AI Assistant</label>
              <input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={300} placeholder="Ask about services or projects…" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30" />
              <button type="submit" aria-label="Send message" disabled={!input.trim()} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-50"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </section>
      )}

      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close Yasir AI Assistant" : "Open Yasir AI Assistant"} aria-expanded={open} className={cn("chat-launch fixed bottom-5 right-5 z-[69] inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition hover:-translate-y-1", open && "pointer-events-none opacity-0")}>
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
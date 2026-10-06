import profile from "./profile.json";
import {
  BrainCircuit, Bot, Sparkles, Code2, Monitor, Server, LayoutTemplate, PenTool, Figma,
  Palette, Image as ImageIcon, Youtube, Share2, Megaphone, FileText, GraduationCap,
  IdCard, Briefcase, UserRound, Layers, Smartphone, ShoppingCart, type LucideIcon,
} from "lucide-react";

export type Service = (typeof profile.services)[number];

export const site = profile;
export const images = { yasir: "/yasir.webp?v=2" };

export const whatsapp = "https://wa.me/923203798756";
export const mailto = `mailto:${profile.email}`;
export const tel = "tel:+923203798756";

export const serviceIcons: Record<string, LucideIcon | undefined> = {
  "ai-solutions": BrainCircuit,
  "ai-chatbots": Bot,
  "ai-ml": Sparkles,
  "web-development": Code2,
  frontend: Monitor,
  backend: Server,
  "web-design": LayoutTemplate,
  "ui-ux": PenTool,
  figma: Figma,
  "graphic-design": Palette,
  posters: ImageIcon,
  thumbnails: Youtube,
  "social-media": Share2,
  "digital-marketing": Megaphone,
  "content-writing": FileText,
  "fyp-projects": GraduationCap,
  "cv-resume": IdCard,
  fiverr: Briefcase,
  upwork: UserRound,
};

/** The eight services highlighted on the home page. `request` is the value pre-filled in the contact form. */
export const highlightServices: { title: string; text: string; icon: LucideIcon; request: string }[] = [
  { title: "AI & Machine Learning Solutions", text: "AI features, chatbots, agents and ML prototypes built around a real use case.", icon: BrainCircuit, request: "AI & Intelligent Solutions" },
  { title: "Full-Stack Web Development", text: "Complete web applications, from interface to backend and database.", icon: Code2, request: "Full-Stack Web Development" },
  { title: "Responsive Website Development", text: "Fast, accessible sites that work beautifully on every screen size.", icon: Smartphone, request: "Frontend Development" },
  { title: "UI/UX Design", text: "User flows, wireframes and Figma prototypes shaped around your users.", icon: PenTool, request: "UI/UX Design" },
  { title: "Portfolio and Business Websites", text: "Professional websites that present your work or business clearly.", icon: LayoutTemplate, request: "Web Design" },
  { title: "E-Commerce and Custom Web Applications", text: "Online stores, ordering flows and custom tools for your workflow.", icon: ShoppingCart, request: "Full-Stack Web Development" },
  { title: "Academic / FYP Project Development", text: "Guidance and working prototypes that help you build and understand your project.", icon: GraduationCap, request: "FYP & Academic Projects" },
  { title: "Digital Branding and Social Media Design", text: "Consistent graphics, posters and social content for your brand.", icon: Palette, request: "Social Media Graphics" },
];

export const serviceGroups = [
  { title: "AI & Development", ids: ["ai-solutions", "ai-chatbots", "ai-ml", "web-development", "frontend", "backend"] },
  { title: "Design & Content", ids: ["web-design", "ui-ux", "figma", "graphic-design", "posters", "thumbnails", "social-media", "digital-marketing", "content-writing"] },
  { title: "Freelance & Academic Support", ids: ["fyp-projects", "cv-resume", "fiverr", "upwork"] },
];

export const getService = (id: string) => profile.services.find((s) => s.id === id)!;

const projectImages: Record<string, string> = {
  truthtrail: "/truthtrail.webp",
  smartcv: "/smartcv.webp",
  languagebridge: "/languagebridge.webp",
  "kiu-research-hub": "/kiu-research-hub.webp",
  "kiu-research-lab": "/kiu-research-lab.webp",
  hci: "/hci.webp",
  hunargah: "/hunargah.webp",
  hunza: "/hunza.webp",
  cravebite: "/cravebite.webp",
  portfolio: "/perfumebrand.webp",
};

export type ProjectCategory = "ai" | "web" | "ux";
export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI Projects" },
  { id: "web", label: "Web Apps" },
  { id: "ux", label: "UI & UX" },
];

export type ProjectItem = {
  id: string; name: string; url: string; description: string; features: string[];
  type: string; category: ProjectCategory; featured: boolean; image: string;
};
export const projects: ProjectItem[] = profile.projects.map((p) => ({
  id: p.id,
  name: p.name,
  url: p.url,
  description: p.description,
  features: p.features,
  type: p.label,
  category: p.category as ProjectCategory,
  featured: Boolean((p as { featured?: boolean }).featured),
  image: projectImages[p.id] ?? "",
}));

const has = (s: string) => profile.skills.includes(s);
export const skillGroups = [
  { title: "AI & Machine Learning", icon: BrainCircuit, items: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "AI Chatbots", "AI Agents", "Prompt Engineering"].filter(has) },
  { title: "Development", icon: Code2, items: ["HTML", "CSS", "JavaScript", "React", "Python", "Django", "API Integration", "Database Fundamentals", "Frontend Development", "Backend Development", "Full-Stack Development", "Responsive Web Development"].filter(has) },
  { title: "UI/UX & Design", icon: PenTool, items: ["UI/UX Design", "Figma", "Wireframing", "Prototyping", "Canva", "Graphic Design", "Social Media Graphics", "YouTube Thumbnails"].filter(has) },
  { title: "Marketing & Tools", icon: Layers, items: ["SEO", "Digital Marketing", "Content Writing", "GitHub", "VS Code", "Jupyter Notebook", "Google Colab"].filter(has) },
];

export const navItems = [
  { label: "Home", hash: "top" },
  { label: "About", hash: "about" },
  { label: "Services", hash: "services" },
  { label: "Work", hash: "work" },
  { label: "Skills", hash: "skills" },
  { label: "Feedback", hash: "feedback" },
  { label: "FAQ", hash: "faq" },
  { label: "Contact", hash: "contact" },
];

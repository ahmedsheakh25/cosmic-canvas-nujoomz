
import { HomeIcon, MessageCircle, Smartphone, Cog, BookOpen, Rocket } from "lucide-react";

export const navItems = [
  {
    title: "Nujmooz",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Landing",
    to: "/landing",
    icon: <Rocket className="h-4 w-4" />,
  },
  {
    title: "Mobile Nujmooz",
    to: "/mobile-nujmooz",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    title: "📘 Knowledge Base",
    to: "/knowledge-base",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Admin",
    to: "/admin",
    icon: <Cog className="h-4 w-4" />,
  },
];

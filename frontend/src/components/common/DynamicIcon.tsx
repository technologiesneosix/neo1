import {
  BadgeCheck, BookOpen, Boxes, Brain, Building2, CalendarCheck, Circle, Cloud, Code2, Cog,
  ConciergeBell, Cpu, CreditCard, Factory, Globe, GraduationCap, HeartPulse, Home, Hotel,
  Landmark, Layers, LifeBuoy, PenTool, Plug, Rocket, Search, ShieldCheck, ShoppingBag,
  Smartphone, Truck, Users, Workflow, type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  BadgeCheck, BookOpen, Boxes, Brain, Building2, CalendarCheck, Cloud, Code2, Cog, ConciergeBell,
  Cpu, CreditCard, Factory, Globe, GraduationCap, HeartPulse, Home, Hotel, Landmark, Layers,
  LifeBuoy, PenTool, Plug, Rocket, Search, ShieldCheck, ShoppingBag, Smartphone, Truck, Users,
  Workflow,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

/** Resolves an admin-stored icon name to a Lucide icon component. */
export function DynamicIcon({ name, size = 28, className }: DynamicIconProps) {
  const Icon = registry[name] ?? Circle;
  return <Icon size={size} className={className} aria-hidden="true" />;
}

export const availableIconNames = Object.keys(registry);

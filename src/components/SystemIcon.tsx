import React from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  Headphones,
  FileCheck,
  Layers,
  Flame,
  Clock,
  CreditCard,
  Receipt,
  PieChart,
  LifeBuoy,
  Activity,
  FolderGit2,
  MessageCircle,
  Inbox,
  BookOpen,
  Code2,
  FileSignature,
  Server,
  AppWindow,
} from 'lucide-react';

interface SystemIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  Headphones,
  FileCheck,
  Layers,
  Flame,
  Clock,
  CreditCard,
  Receipt,
  PieChart,
  LifeBuoy,
  Activity,
  FolderGit2,
  MessageCircle,
  Inbox,
  BookOpen,
  Code2,
  FileSignature,
  Server,
};

export const SystemIcon: React.FC<SystemIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[name] || AppWindow;
  return <IconComponent className={className} />;
};

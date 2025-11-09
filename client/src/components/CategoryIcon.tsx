import { Droplet, Zap, Construction, Trash2, Shield, Heart, GraduationCap, FileQuestion } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export default function CategoryIcon({ category, className = "w-5 h-5" }: CategoryIconProps) {
  const icons = {
    Water: Droplet,
    Power: Zap,
    Roads: Construction,
    Sanitation: Trash2,
    "Public Safety": Shield,
    Healthcare: Heart,
    Education: GraduationCap,
    Other: FileQuestion,
  };

  const Icon = icons[category as keyof typeof icons] || FileQuestion;

  return <Icon className={className} />;
}

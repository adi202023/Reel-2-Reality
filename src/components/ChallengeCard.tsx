import React from "react";
import { LucideIcon } from "lucide-react";

interface ChallengeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  icon: Icon,
  title,
  description,
  className = "",
  gradient = "from-purple-500 to-pink-500"
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2 ${className}`}
    >
      <div className="relative z-10">
        <div className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ChallengeCard;

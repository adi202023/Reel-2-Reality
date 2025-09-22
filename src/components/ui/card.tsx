import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl';
      case 'elevated':
        return 'bg-slate-800 border border-slate-700 shadow-2xl';
      default:
        return 'bg-slate-800/80 border border-slate-700/50 shadow-lg';
    }
  };

  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer' : '';
  
  const baseClasses = 'rounded-xl p-6 transition-all duration-200';
  const combinedClasses = `${baseClasses} ${getVariantClasses()} ${hoverClasses} ${className}`;

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <h3 className={`text-xl font-semibold text-white mb-2 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <p className={`text-slate-400 text-sm ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`mt-4 pt-4 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
);

export default Card;

import React from 'react';
import { Film } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Film className={`${sizeClasses[size]} text-reel-gold animate-reel-spin`} />
        <div className="absolute inset-0 bg-gradient-challenge rounded-full opacity-20 animate-pulse" />
      </div>
      <p className={`${textSizeClasses[size]} text-muted-foreground animate-pulse`}>
        {message}
      </p>
    </div>
  );
};

export default Loading;

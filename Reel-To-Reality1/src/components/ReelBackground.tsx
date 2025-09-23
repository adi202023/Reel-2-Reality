import React from "react";
import { Play, Film, Video, Camera, Trophy, Users, Zap } from "lucide-react";

const ReelBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Film Strip Animation */}
      <div className="absolute top-0 w-full h-8 opacity-10">
        <div className="flex h-full items-center animate-float">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-6 h-4 bg-yellow-400/20 mx-1 rounded-sm"
            />
          ))}
        </div>
      </div>

      {/* Floating Reel Icons */}
      <div className="absolute top-20 left-12 animate-float opacity-5">
        <Film className="w-16 h-16 text-yellow-400 animate-spin" />
      </div>

      <div className="absolute top-32 right-16 animate-float opacity-5 delay-1000">
        <Video className="w-12 h-12 text-gray-400" />
      </div>

      <div className="absolute top-64 left-1/4 animate-float opacity-5 delay-2000">
        <Play className="w-10 h-10 text-yellow-400" />
      </div>

      <div className="absolute bottom-32 right-12 animate-float opacity-5 delay-500">
        <Camera className="w-14 h-14 text-gray-600 animate-spin reverse-animation" />
      </div>

      {/* Challenge Icons */}
      <div className="absolute top-48 right-1/4 animate-pulse opacity-80">
        <Trophy className="w-8 h-8 text-purple-400" />
      </div>

      <div className="absolute bottom-48 left-16 animate-pulse opacity-80 delay-1500">
        <Users className="w-6 h-6 text-cyan-400" />
      </div>

      <div className="absolute top-80 left-1/3 animate-pulse opacity-80 delay-3000">
        <Zap className="w-7 h-7 text-pink-400" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-pink-900/10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/20 to-transparent" />
    </div>
  );
};

export default ReelBackground;

'use client';

import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* ASCII Cityscape Background */}
      

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-white/10 text-white border-white/20">
          Cursor Kenya
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          Cursor KE
        </h1>
        <div className="absolute bottom-10 right-10 diamond-accent animate-pulse-slow"></div>
      

      </div>

      {/* Diamond accent */}
      <div className="absolute bottom-10 right-10 diamond-accent animate-pulse-slow"></div>
    </section>
  );
}

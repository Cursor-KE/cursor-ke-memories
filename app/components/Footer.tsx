'use client';

import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className="relative py-8 md:py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <img 
                src="/logo.png" 
                alt="Cursor AI Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-lg font-bold text-foreground">CURSGIR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              by cursor & tech @ nairobi
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
            <div className="text-center">
              <Icon icon="mdi:account-group" className="w-6 md:w-8 h-6 md:h-8 text-primary mx-auto mb-1 md:mb-2" />
              <p className="text-xl md:text-2xl font-bold text-foreground">100+</p>
              <p className="text-xs text-muted-foreground">Builders</p>
            </div>
            <Separator orientation="vertical" className="h-10 md:h-12" />
            <div className="text-center">
              <Icon icon="mdi:code-tags" className="w-6 md:w-8 h-6 md:h-8 text-primary mx-auto mb-1 md:mb-2" />
              <p className="text-xl md:text-2xl font-bold text-foreground">50+</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <Separator orientation="vertical" className="h-10 md:h-12" />
            <div className="text-center">
              <Icon icon="mdi:trophy" className="w-6 md:w-8 h-6 md:h-8 text-primary mx-auto mb-1 md:mb-2" />
              <p className="text-xl md:text-2xl font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted-foreground">
          <p>© 2025 Cursor KE. All rights reserved.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Diamond accent - hidden on mobile */}
      <div className="absolute top-8 right-8 diamond-accent animate-sparkle hidden md:block"></div>
      <div className="absolute bottom-8 left-8 diamond-accent animate-sparkle hidden md:block" style={{ animationDelay: '1s' }}></div>
    </footer>
  );
}

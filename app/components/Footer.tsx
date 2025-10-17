'use client';

import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              <span className="text-lg font-bold text-foreground">CURSGIR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              by cursor & tech @ nairobi
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <Icon icon="mdi:account-group" className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">100+</p>
              <p className="text-xs text-muted-foreground">Builders</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <Icon icon="mdi:code-tags" className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">50+</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <Icon icon="mdi:trophy" className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Cursor KE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Diamond accent */}
      <div className="absolute top-8 right-8 diamond-accent animate-sparkle"></div>
      <div className="absolute bottom-8 left-8 diamond-accent animate-sparkle" style={{ animationDelay: '1s' }}></div>
    </footer>
  );
}

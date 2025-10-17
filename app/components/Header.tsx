'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icon } from '@iconify/react';

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Cursor Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/logos/cursor-logo.svg" 
            alt="Cursor AI Logo" 
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-foreground">Cursor KE</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => {
              const gallerySection = document.getElementById('gallery-section');
              if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Memories
          </Button>
        </nav>

        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Icon icon="mdi:menu" className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem 
              className="text-foreground"
              onClick={() => {
                const gallerySection = document.getElementById('gallery-section');
                if (gallerySection) {
                  gallerySection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Memories
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

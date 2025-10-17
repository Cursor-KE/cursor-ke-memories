'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Section - Content */}
          <div className="space-y-8">
            {/* Cursor Kenya Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/5 text-white border-white/20">
                Cursor Kenya
              </Badge>
            </div>
            
            {/* Main Headline */}
            <div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Cursor Kenya{' '}
                <span className="relative">
                  Community
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full"></div>
                </span>
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
              Join Kenya's premier AI-powered development community. Connect with fellow developers, 
              share knowledge, and build the future together through meetups, hackathons, and collaborative projects.
            </p>
            
            
            {/* Community Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:account-group" className="w-4 h-4 text-primary" />
                <span>500+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar-multiple" className="w-4 h-4 text-primary" />
                <span>Monthly Meetups</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:code-braces" className="w-4 h-4 text-primary" />
                <span>AI-Powered Coding</span>
              </div>
            </div>
          </div>
          
          {/* Right Section - Visual */}
          <div className="relative">
            {/* Nairobi Cityscape Background */}
            <div className="relative bg-card rounded-2xl p-8 border border-border">
              
              {/* Community Features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <Icon icon="mdi:account-group" className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="text-foreground font-semibold">Community</h4>
                  <p className="text-muted-foreground text-sm">Connect & Collaborate</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <Icon icon="mdi:code-braces" className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="text-foreground font-semibold">AI Coding</h4>
                  <p className="text-muted-foreground text-sm">Master Cursor</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <Icon icon="mdi:calendar-multiple" className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="text-foreground font-semibold">Events</h4>
                  <p className="text-muted-foreground text-sm">Meetups & Hackathons</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <Icon icon="mdi:rocket-launch" className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="text-foreground font-semibold">Growth</h4>
                  <p className="text-muted-foreground text-sm">Career Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
}

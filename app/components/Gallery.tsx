'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import UploadMemory from './UploadMemory';
import { useState, useEffect } from 'react';
import { Memory } from '@/lib/supabase';

export default function Gallery() {
  const [showUpload, setShowUpload] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories');
      const data = await response.json();
      if (response.ok) {
        setMemories(data.memories);
      } else {
        console.error('Failed to fetch memories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleUploadSuccess = () => {
    fetchMemories(); // Refresh memories after upload
  };

  return (
    <section id="gallery-section" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community Memories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Celebrating our Cursor Kenya community journey, achievements, and shared moments
          </p>
          
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg font-semibold w-full md:w-auto"
          >
            <Icon icon="mdi:camera-plus" className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden sm:inline">Share your Cursor KE community memory</span>
            <span className="sm:hidden">Share Memory</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading community memories...</span>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20">
            <Icon icon="mdi:image-outline" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No community memories yet</p>
            <p className="text-muted-foreground text-sm">Be the first to share a Cursor KE memory!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {memories.map((memory) => (
              <Card key={memory.id} className="award-glow bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group overflow-hidden">
                {/* Event Photo */}
                <div 
                  className="relative h-48 md:h-64 lg:h-80 overflow-hidden cursor-pointer"
                  onClick={() => memory.images && memory.images.length > 0 && setSelectedImage({ url: memory.images[0], title: memory.title })}
                >
                  {memory.images && memory.images.length > 0 ? (
                    <img
                      src={memory.images[0]}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Icon icon="mdi:camera" className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Multiple images indicator */}
                  {memory.images && memory.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      +{memory.images.length - 1}
                    </div>
                  )}
                  
                  {/* Share button */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 text-white hover:bg-black/70 text-xs md:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share the image URL directly - X will display it as a preview
                        const imageUrl = memory.images?.[0] || '';
                        const shareText = encodeURIComponent(`Check out this moment from Cursor Kenya! 🇰🇪 @cursor_ai\n\n${imageUrl}`);
                        window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
                      }}
                    >
                      <Icon icon="mdi:share" className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden md:inline">Share</span>
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-secondary/50 flex items-center gap-1 text-xs">
                      <Icon icon="mdi:tag" className="w-3 h-3" />
                      {memory.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon icon="mdi:calendar" className="w-3 h-3" />
                      {new Date(memory.created_at).getFullYear()}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {memory.title}
                  </h3>
                  
                  {memory.is_black_white && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Icon icon="mdi:palette" className="w-3 h-3 mr-1" />
                        B&W
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Memory Modal */}
      {showUpload && (
        <UploadMemory onClose={() => setShowUpload(false)} onSuccess={handleUploadSuccess} />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-10 md:-top-12 right-0 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <Icon icon="mdi:close" className="w-5 md:w-6 h-5 md:h-6" />
            </Button>
            
            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Title - REMOVED */}
          </div>
        </div>
      )}
    </section>
  );
}

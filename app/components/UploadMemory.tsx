'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@iconify/react';

interface UploadMemoryProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export default function UploadMemory({ onClose, onSuccess }: UploadMemoryProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Memory' | 'Activity'>('Memory');
  const [isBlackWhite, setIsBlackWhite] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (selectedFiles: File[]) => {
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    // Check file sizes (max 10MB per file)
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large (max 10MB each). Please compress them first.`);
      return;
    }

    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    addFiles(droppedFiles);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0 || !title) {
      toast.error('Please select files and choose a title');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('isBlackWhite', isBlackWhite.toString());

      // Add files to form data
      files.forEach((uploadedFile, index) => {
        formData.append(`file_${index}`, uploadedFile.file);
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      // Upload to Supabase and Cloudinary with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch('/api/upload-memory', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setUploadProgress(100);

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const errorMessage = result?.error || result?.details || 'Upload failed';
        const details = Array.isArray(result?.details) 
          ? result.details.join(', ') 
          : result?.details;
        throw new Error(`${errorMessage}${details ? `: ${details}` : ''}`);
      }

      toast.success('Memory uploaded successfully!');
      
      // Reset form
      setFiles([]);
      setTitle('');
      setDescription('');
      setCategory('Memory');
      setIsBlackWhite(false);
      setUploadProgress(0);
      
      // Call success callback to refresh gallery
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Upload timed out. Please try with smaller images or fewer files.');
      } else {
        toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-xl md:text-2xl text-foreground">Add Your Cursor Memory</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon icon="mdi:close" className="w-4 md:w-5 h-4 md:h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <Label className="text-foreground text-sm md:text-base">Photos (up to 5)</Label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-4 md:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon icon="mdi:cloud-upload" className="w-8 md:w-12 h-8 md:h-12 text-muted-foreground mx-auto mb-2 md:mb-4" />
              <p className="text-xs md:text-base text-muted-foreground mb-2 md:mb-4">
                Drag and drop your photos here, or click to select
              </p>
            <Button
              variant="outline"
              size="sm"
              disabled={files.length >= 5}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs md:text-sm"
            >
              <Icon icon="mdi:folder-open" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Select Photos</span>
              <span className="md:hidden">Select</span>
            </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {files.length}/5 files selected (max 10MB each)
              </p>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((uploadedFile) => (
                  <div key={uploadedFile.id} className="relative group">
                    <img
                      src={uploadedFile.preview}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 md:h-8 md:w-8 p-0"
                      onClick={() => removeFile(uploadedFile.id)}
                    >
                      <Icon icon="mdi:close" className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Memory Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-3 block">Title *</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="title-1" 
                    checked={title === 'Cursor meetup #1'}
                    onCheckedChange={(checked) => checked && setTitle('Cursor meetup #1')}
                  />
                  <Label htmlFor="title-1" className="text-foreground cursor-pointer">
                    Cursor meetup #1
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="title-2" 
                    checked={title === 'cursor meetup Nakuru'}
                    onCheckedChange={(checked) => checked && setTitle('cursor meetup Nakuru')}
                  />
                  <Label htmlFor="title-2" className="text-foreground cursor-pointer">
                    cursor meetup Nakuru
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="title-3" 
                    checked={title === 'cursor hack X makewave'}
                    onCheckedChange={(checked) => checked && setTitle('cursor hack X makewave')}
                  />
                  <Label htmlFor="title-3" className="text-foreground cursor-pointer">
                    cursor hack X makewave
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="title-4" 
                    checked={title === 'cursor halloween hacks X payhero'}
                    onCheckedChange={(checked) => checked && setTitle('cursor halloween hacks X payhero')}
                  />
                  <Label htmlFor="title-4" className="text-foreground cursor-pointer">
                    cursor halloween hacks X payhero
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your memory..."
                className="bg-background border-border text-foreground"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-foreground">Category</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={category === 'Memory' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory('Memory')}
                >
                  Memory
                </Button>
                <Button
                  variant={category === 'Activity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory('Activity')}
                >
                  Activity
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="blackWhite"
                checked={isBlackWhite}
                onChange={(e) => setIsBlackWhite(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="blackWhite" className="text-foreground">
                Convert to black & white
              </Label>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-4 pt-4 flex-col md:flex-row">
            <Button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0 || !title}
              className="flex-1 text-xs md:text-base py-2 md:py-3"
            >
              {isUploading ? (
                <>
                  <Icon icon="mdi:loading" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
                  <span className="hidden md:inline">Uploading... ({uploadProgress}%)</span>
                  <span className="md:hidden">Uploading {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:upload" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden md:inline">Upload Memory</span>
                  <span className="md:hidden">Upload</span>
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isUploading} className="text-xs md:text-base py-2 md:py-3">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

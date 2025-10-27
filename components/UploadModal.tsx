import { useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../utils/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent } from "./ui/card";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TITLES = [
  "cursor kenya meet #1",
  "cursor Nakuru Meet",
  "cursor KE x makevewave Hack",
  "cursor KE x Payhero hack",
  "Cursor KE Kisumu Hack",
];

const EMOJIS = ["🇰🇪", "💻", "🎉", "🚀", "🔥", "✨", "💡", "🎯", "👥", "🤝", "🏆", "📸", "😊", "❤️", "💯"];

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    if (!title.trim()) {
      setError("Please select an event");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append("file", selectedFile);

      const cloudinaryResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(errorData.error || "Failed to upload to Cloudinary");
      }

      const cloudinaryData = await cloudinaryResponse.json();

      // Combine description with selected emojis
      const finalDescription = [
        description.trim(),
        selectedEmojis.join(" ")
      ].filter(Boolean).join(" ") || null;

      // Store metadata in Supabase
      const { error: supabaseError } = await supabase
        .from("memories")
        .insert({
          title: title.trim(),
          description: finalDescription,
          category: "Memory",
          images: [cloudinaryData.secure_url || cloudinaryData.url],
          is_black_white: false,
        });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error("Failed to save memory: " + supabaseError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        setSelectedEmojis([]);
        setPreview(null);
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      // Reset form after a short delay to allow animation
      setTimeout(() => {
        setSuccess(false);
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        setSelectedEmojis([]);
        setPreview(null);
        setError(null);
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:upload" className="h-6 w-6" />
            Upload Your Memory
          </DialogTitle>
          <DialogDescription>
            Share your amazing moments from Cursor Kenya events
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Icon icon="mdi:check-circle" className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Memory uploaded successfully!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your memory will appear in the gallery shortly
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Event Selection */}
            <div className="space-y-2">
              <Label htmlFor="event" className="flex items-center gap-2">
                <Icon icon="mdi:calendar-event" className="h-4 w-4" />
                Event <span className="text-red-500">*</span>
              </Label>
              <Select value={title} onValueChange={setTitle}>
                <SelectTrigger id="event">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TITLES.map((eventTitle) => (
                    <SelectItem key={eventTitle} value={eventTitle}>
                      {eventTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2">
                <Icon icon="mdi:image" className="h-4 w-4" />
                Select an image <span className="text-red-500">*</span>
              </Label>
              {preview ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-[300px] w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                      >
                        <Icon icon="mdi:close" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400">
                  <label htmlFor="image" className="cursor-pointer text-center">
                    <Icon icon="mdi:cloud-upload" className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <Icon icon="mdi:text" className="h-4 w-4" />
                Description (optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Share your memory..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Emojis */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Icon icon="mdi:emoticon-happy" className="h-4 w-4" />
                Add Emojis (optional)
              </Label>
              <div className="flex flex-wrap gap-2 rounded-lg border p-3">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => toggleEmoji(emoji)}
                    className={`rounded-lg px-3 py-2 text-xl transition-all ${
                      selectedEmojis.includes(emoji)
                        ? "bg-primary text-primary-foreground ring-2 ring-primary"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {selectedEmojis.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedEmojis.join(" ")}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <Icon icon="mdi:alert-circle" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={uploading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !title.trim()}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:upload" className="mr-2 h-4 w-4" />
                    Upload Memory
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

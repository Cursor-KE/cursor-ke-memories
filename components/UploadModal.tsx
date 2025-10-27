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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'uploading' | 'saving' | 'complete'>('uploading');
  const [isBlackWhite, setIsBlackWhite] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

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

    if (selectedEvents.length === 0) {
      setError("Please select at least one event");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadStep('uploading');

    try {
      // Step 1: request a short-lived signature
      const sign = await fetch("/api/sign-cloudinary", { method: "POST" }).then((r) => r.json());

      // Step 2: direct upload to Cloudinary with progress
      let cloudinaryData: any = null;
      setUploadPercent(0);

      await new Promise<void>((resolve, reject) => {
        const form = new FormData();
        form.append("file", selectedFile);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);
        form.append("folder", sign.folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadPercent(pct);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            cloudinaryData = JSON.parse(xhr.responseText);
            resolve();
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(form);
      });
      
      // Update step to saving
      setUploadStep('saving');

      // Combine description with selected emojis
      const finalDescription = [
        description.trim(),
        selectedEmojis.join(" ")
      ].filter(Boolean).join(" ") || null;

      // Store metadata in Supabase
      const { error: supabaseError } = await supabase
        .from("memories")
        .insert({
          title: selectedEvents.join(", "), // Use selected events as title
          description: finalDescription,
          category: "Memory",
          images: [cloudinaryData.secure_url || cloudinaryData.url],
          is_black_white: isBlackWhite,
        });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error("Failed to save memory: " + supabaseError.message);
      }

      // Update step to complete
      setUploadStep('complete');
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedFile(null);
        setSelectedEvents([]);
        setDescription("");
        setSelectedEmojis([]);
        setPreview(null);
        setUploadStep('uploading');
        setIsBlackWhite(false);
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploading(false);
      setUploadStep('uploading');
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      // Reset form after a short delay to allow animation
      setTimeout(() => {
        setSuccess(false);
        setSelectedFile(null);
        setSelectedEvents([]);
        setDescription("");
        setSelectedEmojis([]);
        setPreview(null);
        setError(null);
        setIsBlackWhite(false);
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon icon="mdi:upload" className="h-6 w-6" />
            Upload Your Memory
          </DialogTitle>
          <DialogDescription>
            Share your amazing moments from Cursor Kenya events
          </DialogDescription>
        </DialogHeader>

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-16">
            {/* Animated Icon Container */}
            <div className="relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Icon 
                  icon="mdi:cloud-upload" 
                  className="h-12 w-12 text-primary animate-bounce" 
                />
              </div>
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            </div>

            {/* Step Indicator */}
            <div className="mb-6 w-full max-w-sm">
              {/* Step 1: Uploading */}
              <div className={`flex items-start gap-3 transition-colors ${uploadStep === 'uploading' ? 'text-primary' : uploadStep === 'saving' || uploadStep === 'complete' ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  {uploadStep === 'uploading' ? (
                    <Icon icon="mdi:loading" className="h-6 w-6 animate-spin" />
                  ) : uploadStep === 'saving' || uploadStep === 'complete' ? (
                    <Icon icon="mdi:check-circle" className="h-6 w-6" />
                  ) : (
                    <Icon icon="mdi:checkbox-blank-circle-outline" className="h-6 w-6" />
                  )}
                  {/* Connector Line */}
                  <div className={`h-12 w-0.5 mt-2 mb-2 ${uploadStep === 'saving' || uploadStep === 'complete' ? 'bg-green-600' : 'bg-gray-300'}`} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">Uploading Image</div>
                  <div className="text-xs text-muted-foreground">Sending to cloud storage</div>
                </div>
              </div>

              {/* Step 2: Saving */}
              <div className={`flex items-start gap-3 transition-colors ${uploadStep === 'saving' ? 'text-primary' : uploadStep === 'complete' ? 'text-green-600' : 'text-muted-foreground'}`}>
                <div className="flex-shrink-0">
                  {uploadStep === 'saving' ? (
                    <Icon icon="mdi:loading" className="h-6 w-6 animate-spin" />
                  ) : uploadStep === 'complete' ? (
                    <Icon icon="mdi:check-circle" className="h-6 w-6" />
                  ) : (
                    <Icon icon="mdi:checkbox-blank-circle-outline" className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">Saving to Database</div>
                  <div className="text-xs text-muted-foreground">Storing metadata</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadStep === 'uploading' ? uploadPercent : uploadStep === 'saving' ? 90 : 100}%` }}
                />
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {uploadStep === 'uploading' && 'Uploading your memory to the cloud...'}
                {uploadStep === 'saving' && 'Saving your memory...'}
                {uploadStep === 'complete' && 'Almost done!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {uploadStep === 'uploading' && 'Please wait while we upload your image'}
                {uploadStep === 'saving' && 'Storing your memory in our database'}
                {uploadStep === 'complete' && 'Redirecting to gallery...'}
              </p>
            </div>
          </div>
        ) : success ? (
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
              <Label className="flex items-center gap-2">
                <Icon icon="mdi:calendar-event" className="h-4 w-4" />
                Event <span className="text-red-500">*</span>
              </Label>
              <Card className="p-4">
                <div className="space-y-3">
                  {EVENT_TITLES.map((eventTitle) => (
                    <label
                      key={eventTitle}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                    >
                      <input
                        type="radio"
                        name="event"
                        checked={selectedEvents[0] === eventTitle}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([eventTitle]);
                          }
                        }}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{eventTitle}</span>
                    </label>
                  ))}
                </div>
              </Card>
              {selectedEvents.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedEvents[0]}
                </p>
              )}
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
                        className={`h-[300px] w-full object-cover transition-all duration-300 ${
                          isBlackWhite ? 'grayscale' : ''
                        }`}
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
                      {isBlackWhite && (
                        <div className="absolute left-2 top-2">
                          <div className="rounded-full bg-primary/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                            <Icon icon="mdi:palette" className="mr-1 inline h-3 w-3" />
                            B&W
                          </div>
                        </div>
                      )}
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

            {/* Black & White Option */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:palette" className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="blackWhite" className="font-medium cursor-pointer">
                      Convert to Black & White
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Transform your memory into a classic monochrome look
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlackWhite(!isBlackWhite)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isBlackWhite ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isBlackWhite ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

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
                disabled={uploading || !selectedFile || selectedEvents.length === 0}
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

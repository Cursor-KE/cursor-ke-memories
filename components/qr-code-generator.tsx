'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, QrCode, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { Event } from '@/lib/types';
import { format } from 'date-fns';

interface QRCodeGeneratorProps {
  event?: Event;
  onClose?: () => void;
}

export function QRCodeGenerator({ event, onClose }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrType, setQrType] = useState<'event' | 'custom'>('event');
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code data based on type
  useEffect(() => {
    if (qrType === 'event' && event) {
      const eventData = {
        title: event.title,
        date: format(event.date, 'yyyy-MM-dd'),
        time: `${event.startTime} - ${event.endTime}`,
        location: event.isOnline ? event.onlineLink : `${event.venue}, ${event.city}`,
        description: event.description,
        type: event.eventType,
        capacity: event.capacity,
        price: event.price,
        currency: event.currency,
        isOnline: event.isOnline
      };
      setQrData(JSON.stringify(eventData, null, 2));
    } else if (qrType === 'custom') {
      setQrData(customText);
    }
  }, [qrType, event, customText]);

  // Generate QR code image
  useEffect(() => {
    if (qrData) {
      setIsGenerating(true);
      QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => {
        setQrCodeUrl(url);
        setIsGenerating(false);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
        setIsGenerating(false);
      });
    }
  }, [qrData]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `event-qr-${event?.title?.replace(/\s+/g, '-').toLowerCase() || 'code'}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData);
  };

  const shareEvent = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">QR Code Generator</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Generate QR codes for easy event sharing
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Settings</CardTitle>
            <CardDescription>Configure your QR code content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-type">QR Code Type</Label>
              <Select value={qrType} onValueChange={(value: 'event' | 'custom') => setQrType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Information</SelectItem>
                  <SelectItem value="custom">Custom Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {qrType === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-text">Custom Text</Label>
                <Input
                  id="custom-text"
                  placeholder="Enter text to encode..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
              </div>
            )}

            {qrType === 'event' && event && (
              <div className="space-y-2">
                <Label>Event Preview</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(event.date, 'MMM dd, yyyy')} • {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.isOnline ? 'Online Event' : `${event.venue}, ${event.city}`}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {event.eventType}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={downloadQRCode} disabled={!qrCodeUrl || isGenerating}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={copyQRData} disabled={!qrData}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
              {event && (
                <Button variant="outline" onClick={shareEvent}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>Generated QR Code</CardTitle>
            <CardDescription>Scan with any QR code reader</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {isGenerating ? (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <QrCode className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-gray-600">Generating QR Code...</p>
                </div>
              </div>
            ) : qrCodeUrl ? (
              <div className="text-center">
                <img 
                  src={qrCodeUrl} 
                  alt="Generated QR Code" 
                  className="w-64 h-64 mx-auto border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Scan to view event details
                </p>
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <QrCode className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">No QR code generated</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* QR Code Data Preview */}
      {qrData && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code Data</CardTitle>
            <CardDescription>Raw data that will be encoded in the QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-auto max-h-40">
              {qrData}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

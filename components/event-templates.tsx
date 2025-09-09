'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign,
  Sparkles,
  Copy,
  Plus
} from 'lucide-react';
import { Event } from '@/lib/types';

interface EventTemplatesProps {
  onUseTemplate: (template: Event) => void;
}

const eventTemplates: Event[] = [
  {
    id: 'template-1',
    title: 'Tech Meetup',
    description: 'Monthly tech meetup for developers and tech enthusiasts. Join us for networking, talks, and discussions about the latest in technology.',
    date: new Date(),
    startTime: '18:00',
    endTime: '21:00',
    location: 'Tech Hub, Nairobi',
    venue: 'Tech Hub',
    address: '123 Tech Street',
    city: 'Nairobi',
    country: 'Kenya',
    eventType: 'meetup',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 50,
    price: 0,
    currency: 'KES',
    isOnline: false,
    tags: ['networking', 'technology', 'community'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'template-2',
    title: 'React Workshop',
    description: 'Hands-on workshop covering React fundamentals, hooks, and best practices. Perfect for developers looking to level up their React skills.',
    date: new Date(),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Online',
    venue: 'Online',
    address: '',
    city: 'Online',
    country: 'Global',
    eventType: 'workshop',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 30,
    price: 5000,
    currency: 'KES',
    isOnline: true,
    onlineLink: 'https://meet.google.com/workshop-link',
    tags: ['react', 'javascript', 'frontend', 'workshop'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'template-3',
    title: 'AI Conference 2024',
    description: 'Annual AI conference featuring industry leaders, cutting-edge research presentations, and networking opportunities in artificial intelligence.',
    date: new Date(),
    startTime: '08:00',
    endTime: '18:00',
    location: 'Convention Center, Nairobi',
    venue: 'Nairobi Convention Center',
    address: '456 Convention Avenue',
    city: 'Nairobi',
    country: 'Kenya',
    eventType: 'conference',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 200,
    price: 15000,
    currency: 'KES',
    isOnline: false,
    tags: ['ai', 'machine-learning', 'conference', 'research'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'template-4',
    title: '24-Hour Hackathon',
    description: 'Intensive coding competition where teams build innovative solutions in 24 hours. Prizes, mentorship, and networking included.',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:00',
    location: 'Innovation Hub, Nairobi',
    venue: 'Nairobi Innovation Hub',
    address: '789 Innovation Drive',
    city: 'Nairobi',
    country: 'Kenya',
    eventType: 'hackathon',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 100,
    price: 2000,
    currency: 'KES',
    isOnline: false,
    tags: ['hackathon', 'coding', 'competition', 'innovation'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'template-5',
    title: 'Webinar: Digital Marketing Trends',
    description: 'Online webinar covering the latest trends in digital marketing, social media strategies, and growth hacking techniques.',
    date: new Date(),
    startTime: '14:00',
    endTime: '15:30',
    location: 'Online',
    venue: 'Online',
    address: '',
    city: 'Online',
    country: 'Global',
    eventType: 'webinar',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 500,
    price: 0,
    currency: 'KES',
    isOnline: true,
    onlineLink: 'https://zoom.us/webinar-link',
    tags: ['marketing', 'digital', 'webinar', 'trends'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'template-6',
    title: 'Networking Mixer',
    description: 'Casual networking event for professionals to connect, share ideas, and build meaningful relationships in a relaxed atmosphere.',
    date: new Date(),
    startTime: '17:30',
    endTime: '20:00',
    location: 'Rooftop Bar, Nairobi',
    venue: 'Sky Lounge',
    address: '321 Sky Avenue',
    city: 'Nairobi',
    country: 'Kenya',
    eventType: 'networking',
    status: 'draft',
    kanbanStage: 'planning',
    capacity: 75,
    price: 3000,
    currency: 'KES',
    isOnline: false,
    tags: ['networking', 'professional', 'social', 'mixer'],
    speakers: [],
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export function EventTemplates({ onUseTemplate }: EventTemplatesProps) {
  const handleUseTemplate = (template: Event) => {
    // Create a new event based on template with a new ID
    const newEvent: Event = {
      ...template,
      id: Date.now().toString(),
      title: template.title + ' (Copy)',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onUseTemplate(newEvent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Templates</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick-start your event planning with pre-built templates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {template.eventType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{template.startTime} - {template.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{template.isOnline ? 'Online' : template.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{template.capacity} capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {template.price === 0 ? 'Free' : `${template.currency} ${template.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <Button 
                onClick={() => handleUseTemplate(template)}
                className="w-full"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create Custom Template</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Don&apos;t see what you&apos;re looking for? Create your own custom event template.
          </p>
          <Button variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Custom Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

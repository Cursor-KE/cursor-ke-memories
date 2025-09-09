'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Event, Speaker } from '@/lib/types';
import { eventTypes, eventStatuses, kanbanStages } from '@/lib/data';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  eventType: z.enum(['conference', 'meetup', 'workshop', 'hackathon', 'webinar', 'networking']),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']),
  kanbanStage: z.enum(['planning', 'preparation', 'promotion', 'execution', 'completion']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().min(1, 'Currency is required'),
  isOnline: z.boolean(),
  onlineLink: z.string().optional(),
  venue: z.string().min(1, 'Venue is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  speakers: z.array(z.object({
    name: z.string().min(1, 'Speaker name is required'),
    title: z.string().min(1, 'Speaker title is required'),
    company: z.string().min(1, 'Speaker company is required'),
    bio: z.string().min(1, 'Speaker bio is required'),
    socialLinks: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  })),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [newSpeaker, setNewSpeaker] = useState<Partial<Speaker>>({
    name: '',
    title: '',
    company: '',
    bio: '',
    socialLinks: {}
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? event.date.toISOString().split('T')[0] : '',
      startTime: event?.startTime || '',
      endTime: event?.endTime || '',
      eventType: event?.eventType || 'meetup',
      status: event?.status || 'draft',
      kanbanStage: event?.kanbanStage || 'planning',
      capacity: event?.capacity || 50,
      price: event?.price || 0,
      currency: event?.currency || 'KES',
      isOnline: event?.isOnline || false,
      onlineLink: event?.onlineLink || '',
      venue: event?.venue || '',
      address: event?.address || '',
      city: event?.city || '',
      country: event?.country || 'Kenya',
      tags: event?.tags || [],
      speakers: event?.speakers || [],
    },
  });

  const { watch, setValue, getValues } = form;
  const isOnline = watch('isOnline');
  const tags = watch('tags');
  const speakers = watch('speakers');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const addSpeaker = () => {
    if (newSpeaker.name && newSpeaker.title && newSpeaker.company && newSpeaker.bio) {
      setValue('speakers', [...speakers, newSpeaker as Speaker]);
      setNewSpeaker({
        name: '',
        title: '',
        company: '',
        bio: '',
        socialLinks: {}
      });
    }
  };

  const removeSpeaker = (index: number) => {
    setValue('speakers', speakers.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EventFormData) => {
    const eventData: Event = {
      id: event?.id || Date.now().toString(),
      ...data,
      date: new Date(data.date),
      imageUrl: event?.imageUrl,
      attendees: event?.attendees || [],
      createdAt: event?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    onSave(eventData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{event ? 'Edit Event' : 'Create New Event'}</CardTitle>
          <CardDescription>
            Fill in the details to {event ? 'update' : 'create'} your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="speakers">Speakers</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      {...form.register('title')}
                      placeholder="Enter event title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select onValueChange={(value) => form.setValue('eventType', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Describe your event..."
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...form.register('date')}
                    />
                    {form.formState.errors.date && (
                      <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      {...form.register('startTime')}
                    />
                    {form.formState.errors.startTime && (
                      <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      {...form.register('endTime')}
                    />
                    {form.formState.errors.endTime && (
                      <p className="text-sm text-red-500">{form.formState.errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOnline"
                    checked={isOnline}
                    onCheckedChange={(checked) => form.setValue('isOnline', checked)}
                  />
                  <Label htmlFor="isOnline">Online Event</Label>
                </div>

                {isOnline ? (
                  <div className="space-y-2">
                    <Label htmlFor="onlineLink">Online Link</Label>
                    <Input
                      id="onlineLink"
                      {...form.register('onlineLink')}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        {...form.register('venue')}
                        placeholder="Enter venue name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        {...form.register('address')}
                        placeholder="Enter venue address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...form.register('city')}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...form.register('country')}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...form.register('capacity', { valueAsNumber: true })}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      {...form.register('price', { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select onValueChange={(value) => form.setValue('currency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="speakers" className="space-y-4">
                <div className="space-y-4">
                  {speakers.map((speaker, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Speaker {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpeaker(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={speaker.name} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={speaker.title} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={speaker.company} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea value={speaker.bio} disabled rows={2} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">Add New Speaker</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={newSpeaker.name || ''}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                            placeholder="Speaker name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={newSpeaker.title || ''}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
                            placeholder="Job title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={newSpeaker.company || ''}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, company: e.target.value })}
                            placeholder="Company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea
                            value={newSpeaker.bio || ''}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, bio: e.target.value })}
                            placeholder="Speaker bio"
                            rows={2}
                          />
                        </div>
                      </div>
                      <Button type="button" onClick={addSpeaker} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Speaker
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => form.setValue('status', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kanbanStage">Workflow Stage</Label>
                    <Select onValueChange={(value) => form.setValue('kanbanStage', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {kanbanStages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                              {stage.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Event } from '@/lib/types';
import { eventTypes } from '@/lib/data';

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventTypeColor = (eventType: Event['eventType']) => {
    const colors = {
      conference: 'bg-blue-500',
      meetup: 'bg-green-500',
      workshop: 'bg-purple-500',
      hackathon: 'bg-orange-500',
      webinar: 'bg-pink-500',
      networking: 'bg-indigo-500',
    };
    return colors[eventType] || 'bg-gray-500';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
            <CardDescription>
              Click on a date to view events for that day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {format(selectedDate, 'MMMM dd, yyyy')}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {events.length === 0 
                    ? 'No events created yet' 
                    : 'No events scheduled for this date'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{event.title}</h4>
                      <Badge
                        className={`text-white text-xs ${getEventTypeColor(event.eventType)}`}
                      >
                        {eventTypes.find(t => t.value === event.eventType)?.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.isOnline ? 'Online' : event.venue}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees.filter(a => a.rsvpStatus === 'confirmed').length} / {event.capacity} attendees
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .filter(event => event.status === 'published' && event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.eventType)}`} />
                    <span className="truncate">{event.title}</span>
                    <span className="text-gray-500 text-xs">
                      {format(event.date, 'MMM dd')}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Eye,
  QrCode
} from 'lucide-react';
import { Event } from '@/lib/types';
import { sampleEvents, getEventStats, eventTypes, eventStatuses } from '@/lib/data';
import { format } from 'date-fns';
import { EventForm } from './event-form';
import { CalendarView } from './calendar-view';
import { KanbanBoard } from './kanban-board';
import { AnalyticsDashboard } from './analytics-dashboard';
import { EventTemplates } from './event-templates';
import { QRCodeGenerator } from './qr-code-generator';

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [qrEvent, setQrEvent] = useState<Event | undefined>();

  const stats = getEventStats(events);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.eventType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingEvents = filteredEvents
    .filter(event => event.status === 'published' && event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      setEvents([...events, event]);
    }
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(undefined);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleEventUpdate = (eventId: string, updates: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const handleUseTemplate = (template: Event) => {
    setEvents([...events, template]);
    setEditingEvent(template);
    setShowEventForm(true);
  };

  const handleGenerateQR = (event: Event) => {
    setQrEvent(event);
    setShowQRGenerator(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Event Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your tech community events effectively
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateEvent}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendees}</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageAttendance} avg per event
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speakers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSpeakers}</div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Ready to go
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="kanban">Workflow</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Manage all your events in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {events.length === 0 ? 'No events yet' : 'No events match your filters'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {events.length === 0 
                        ? 'Get started by creating your first event' 
                        : 'Try adjusting your search or filter criteria'
                      }
                    </p>
                    {events.length === 0 && (
                      <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Event
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attendees</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {event.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(event.date, 'MMM dd, yyyy')}</div>
                              <div className="text-gray-500">
                                {event.startTime} - {event.endTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {event.isOnline ? 'Online' : event.city}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {eventTypes.find(t => t.value === event.eventType)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                event.status === 'published' ? 'default' :
                                event.status === 'draft' ? 'secondary' :
                                event.status === 'cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {eventStatuses.find(s => s.value === event.status)?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {event.attendees.filter(a => a.rsvpStatus === 'confirmed').length} / {event.capacity}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {events.length === 0 
                      ? 'Create your first event to get started' 
                      : 'All your events are in the past or not yet published'
                    }
                  </p>
                  {events.length === 0 && (
                    <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <Badge variant="outline">
                              {eventTypes.find(t => t.value === event.eventType)?.label}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(event.date, 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.isOnline ? 'Online' : event.venue}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees.filter(a => a.rsvpStatus === 'confirmed').length} attendees
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEventClick(event)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <KanbanBoard
              events={events}
              onEventUpdate={handleEventUpdate}
              onEventClick={handleEventClick}
              onEventEdit={handleEditEvent}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <EventTemplates onUseTemplate={handleUseTemplate} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard events={events} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView 
              events={events} 
              onEventClick={handleEventClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={handleCancelEventForm}
          />
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(undefined)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <CardDescription>
              {selectedEvent?.description}
            </CardDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Date & Time</h4>
                  <p className="text-sm">
                    {format(selectedEvent.date, 'MMMM dd, yyyy')} at {selectedEvent.startTime} - {selectedEvent.endTime}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Location</h4>
                  <p className="text-sm">
                    {selectedEvent.isOnline ? 'Online' : `${selectedEvent.venue}, ${selectedEvent.city}`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Type</h4>
                  <Badge variant="secondary">
                    {eventTypes.find(t => t.value === selectedEvent.eventType)?.label}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Attendees</h4>
                  <p className="text-sm">
                    {selectedEvent.attendees.filter(a => a.rsvpStatus === 'confirmed').length} / {selectedEvent.capacity}
                  </p>
                </div>
              </div>
              
              {selectedEvent.speakers.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Speakers</h4>
                  <div className="space-y-2">
                    {selectedEvent.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{speaker.name}</p>
                          <p className="text-xs text-gray-500">{speaker.title} at {speaker.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedEvent(undefined)}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => handleGenerateQR(selectedEvent)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button onClick={() => handleEditEvent(selectedEvent)}>
                  Edit Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Generator Dialog */}
      {showQRGenerator && (
        <Dialog open={showQRGenerator} onOpenChange={setShowQRGenerator}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <QRCodeGenerator 
              event={qrEvent} 
              onClose={() => setShowQRGenerator(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

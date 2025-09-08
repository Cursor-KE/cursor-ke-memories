import { Event, EventStats } from './types';

export const sampleEvents: Event[] = [];

export const getEventStats = (events: Event[]): EventStats => {
  const now = new Date();
  const upcomingEvents = events.filter(event => 
    event.status === 'published' && event.date >= now
  ).length;
  
  const totalAttendees = events.reduce((sum, event) => 
    sum + event.attendees.filter(attendee => attendee.rsvpStatus === 'confirmed').length, 0
  );
  
  const totalSpeakers = events.reduce((sum, event) => sum + event.speakers.length, 0);
  
  const averageAttendance = events.length > 0 
    ? totalAttendees / events.length 
    : 0;

  return {
    totalEvents: events.length,
    upcomingEvents,
    totalAttendees,
    totalSpeakers,
    averageAttendance: Math.round(averageAttendance)
  };
};

export const eventTypes = [
  { value: 'conference', label: 'Conference' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'networking', label: 'Networking' }
] as const;

export const eventStatuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
] as const;

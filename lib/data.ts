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

export const kanbanStages = [
  { 
    value: 'planning', 
    label: 'Planning', 
    description: 'Initial planning and setup',
    color: 'bg-gray-500',
    textColor: 'text-gray-700'
  },
  { 
    value: 'preparation', 
    label: 'Preparation', 
    description: 'Getting ready for the event',
    color: 'bg-blue-500',
    textColor: 'text-blue-700'
  },
  { 
    value: 'promotion', 
    label: 'Promotion', 
    description: 'Marketing and promotion phase',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700'
  },
  { 
    value: 'execution', 
    label: 'Execution', 
    description: 'Event is happening now',
    color: 'bg-green-500',
    textColor: 'text-green-700'
  },
  { 
    value: 'completion', 
    label: 'Completion', 
    description: 'Event completed successfully',
    color: 'bg-purple-500',
    textColor: 'text-purple-700'
  }
] as const;

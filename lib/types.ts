export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  eventType: 'conference' | 'meetup' | 'workshop' | 'hackathon' | 'webinar' | 'networking';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity: number;
  price: number;
  currency: string;
  isOnline: boolean;
  onlineLink?: string;
  imageUrl?: string;
  tags: string[];
  speakers: Speaker[];
  attendees: Attendee[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: Date;
  checkedIn: boolean;
  checkedInAt?: Date;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  totalSpeakers: number;
  averageAttendance: number;
}

export interface EventFilters {
  status?: Event['status'];
  eventType?: Event['eventType'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

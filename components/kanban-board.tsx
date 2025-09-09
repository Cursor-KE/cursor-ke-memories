'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MoreHorizontal,
  GripVertical
} from 'lucide-react';
import { Event } from '@/lib/types';
import { kanbanStages, eventTypes } from '@/lib/data';
import { format } from 'date-fns';

interface KanbanBoardProps {
  events: Event[];
  onEventUpdate: (eventId: string, updates: Partial<Event>) => void;
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
}

interface KanbanColumnProps {
  stage: typeof kanbanStages[0];
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
}

interface EventCardProps {
  event: Event;
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
}

function EventCard({ event, onEventClick, onEventEdit }: EventCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const eventType = eventTypes.find(t => t.value === event.eventType);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onEventClick(event)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-2 mb-1">{event.title}</h4>
            <Badge variant="secondary" className="text-xs">
              {eventType?.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEventEdit(event);
              }}
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
            <div
              {...attributes}
              {...listeners}
              className="h-6 w-6 flex items-center justify-center cursor-grab hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(event.date, 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {event.startTime} - {event.endTime}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.isOnline ? 'Online' : event.city}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {event.attendees.filter(a => a.rsvpStatus === 'confirmed').length} / {event.capacity}
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{event.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KanbanColumn({ stage, events, onEventClick, onEventEdit }: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-0">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
            <CardTitle className="text-sm font-medium">{stage.label}</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {events.length}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {stage.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SortableContext items={events.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 min-h-[200px]">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={onEventClick}
                  onEventEdit={onEventEdit}
                />
              ))}
              {events.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-xs">No events in this stage</div>
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard({ events, onEventUpdate, onEventClick, onEventEdit }: KanbanBoardProps) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group events by kanban stage
  const eventsByStage = kanbanStages.reduce((acc, stage) => {
    acc[stage.value] = events.filter(event => event.kanbanStage === stage.value);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleDragStart = (dragEvent: DragStartEvent) => {
    const eventId = dragEvent.active.id as string;
    const event = events.find(e => e.id === eventId);
    setActiveEvent(event || null);
  };

  const handleDragEnd = (dragEvent: DragEndEvent) => {
    const { active, over } = dragEvent;
    setActiveEvent(null);

    if (!over) return;

    const eventId = active.id as string;
    const newStage = over.id as string;

    // Check if the drop target is a valid stage
    if (kanbanStages.some(stage => stage.value === newStage)) {
      onEventUpdate(eventId, { kanbanStage: newStage as Event['kanbanStage'] });
    }
  };

  const handleDragOver = (dragEvent: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Workflow</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop events through different stages of planning and execution
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanStages.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              events={eventsByStage[stage.value] || []}
              onEventClick={onEventClick}
              onEventEdit={onEventEdit}
            />
          ))}
        </div>

        <DragOverlay>
          {activeEvent ? (
            <div className="rotate-3 opacity-90">
              <EventCard
                event={activeEvent}
                onEventClick={() => {}}
                onEventEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

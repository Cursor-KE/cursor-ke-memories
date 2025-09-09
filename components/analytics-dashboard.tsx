'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Target,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import { Event } from '@/lib/types';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsDashboardProps {
  events: Event[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function AnalyticsDashboard({ events }: AnalyticsDashboardProps) {
  // Calculate analytics data
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => event.date >= new Date()).length;
  const completedEvents = events.filter(event => event.date < new Date()).length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const totalRevenue = events.reduce((sum, event) => sum + event.price, 0);
  const averageCapacity = totalEvents > 0 ? Math.round(totalCapacity / totalEvents) : 0;

  // Event type distribution
  const eventTypeData = events.reduce((acc, event) => {
    const existing = acc.find(item => item.name === event.eventType);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: event.eventType, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly event trends (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(new Date(), i * 30);
    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth(date) && eventDate <= endOfMonth(date);
    });
    return {
      month: format(date, 'MMM'),
      events: monthEvents.length,
      capacity: monthEvents.reduce((sum, event) => sum + event.capacity, 0),
      revenue: monthEvents.reduce((sum, event) => sum + event.price, 0)
    };
  }).reverse();

  // Event status distribution
  const statusData = events.reduce((acc, event) => {
    const existing = acc.find(item => item.name === event.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: event.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Top events by capacity
  const topEvents = events
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 5);

  // Recent activity (last 7 days)
  const recentActivity = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const sevenDaysAgo = subDays(new Date(), 7);
      return eventDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Insights and metrics for your events
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents} upcoming, {completedEvents} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {averageCapacity} avg per event
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total planned revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Events completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Events and attendance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="events" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="capacity" 
                  stackId="2" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Distribution by event type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events by Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Largest Events</CardTitle>
            <CardDescription>Events with highest capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {format(event.date, 'MMM dd, yyyy')} • {event.eventType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{event.capacity}</p>
                    <p className="text-xs text-gray-500">capacity</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((event) => (
                <div key={event.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{format(event.date, 'MMM dd, yyyy')}</span>
                      <MapPin className="h-3 w-3" />
                      <span>{event.isOnline ? 'Online' : event.city}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

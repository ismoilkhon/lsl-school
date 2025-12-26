'use client';

import React, { useState } from 'react';
import { Typography, Card, CardBody, Button, Chip } from '@material-tailwind/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EventModal from './EventModal';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';
import { useEvents } from '@/lib/hooks/useQueries';
import { getAppwriteFilePreviewUrl } from '@/lib/utils';
import Image from 'next/image';

export default function EventsSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real events from database
  const { data: dbEvents = [], isLoading, error } = useEvents();
  
  // Parse events and transform them for display
  const events = dbEvents.map(event => {
    try {
      const enhancedDesc = JSON.parse(event.description || '{}');
      return {
        id: event.$id,
        title: event.title,
        description: enhancedDesc.main || event.description,
        date: new Date(event.startTime).toLocaleDateString(),
        time: `${new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(event.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
        location: event.location,
        category: enhancedDesc.category || 'Academic',
        attendees: enhancedDesc.attendees || 100,
        organizer: enhancedDesc.organizer || 'School Administration',
        requirements: enhancedDesc.requirements || [],
        image: event.img ? getAppwriteFilePreviewUrl(event.img, 400, 300) : '/0WJDnS1sZOiv.png',
        details: enhancedDesc.main || event.description
      };
    } catch {
      // Fallback for events with simple description
      return {
        id: event.$id,
        title: event.title,
        description: event.description,
        date: new Date(event.startTime).toLocaleDateString(),
        time: `${new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(event.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
        location: event.location,
        category: 'Academic',
        attendees: 100,
        organizer: 'School Administration',
        requirements: [],
        image: event.img ? getAppwriteFilePreviewUrl(event.img, 400, 300) : '/0WJDnS1sZOiv.png',
        details: event.description
      };
    }
  });

  // Fallback to static events if no database events
  const displayEvents = events.length > 0 ? events : t('events.items');

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'blue';
      case 'Sports': return 'green';
      case 'Meeting': return 'orange';
      case 'Arts': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <section id="events" className="py-20 bg-blue-50 dark:bg-blue-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Typography
            variant="h2"
            className="mb-4 text-4xl md:text-5xl font-bold text-blue-900"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            {t('events.title')}
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            {t('events.description')}
          </Typography>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <div className="col-span-2 text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-red-500">Failed to load events. Showing sample events.</p>
            </div>
          ) : null}
          {displayEvents.map((event: any, index: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="overflow-hidden flex flex-row hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                placeholder=""
                onResize={() => {}}
                onResizeCapture={() => {}}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                <div className="relative w-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-4 left-4">
                    <Chip
                      value={event.category}
                      color={getCategoryColor(event.category) as any}
                      className="text-white"
                    />
                  </div>
                </div>
                
                <CardBody 
                  className="p-6"
                  placeholder=""
                  onResize={() => {}}
                  onResizeCapture={() => {}}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <Typography
                    variant="h4"
                    className="mb-3 font-bold text-blue-900"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                  >
                    {event.title}
                  </Typography>
                  
                  <Typography
                    className="text-blue-700 dark:text-blue-200 mb-4 line-clamp-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                  >
                    {event.description}
                  </Typography>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-blue-700 dark:text-blue-200">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-blue-700 dark:text-blue-200">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-blue-700 dark:text-blue-200">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-blue-700 dark:text-blue-200">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.attendees} expected attendees</span>
                    </div>
                  </div>

                  <Button
                    variant="gradient"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800"
                    onClick={() => handleEventClick(event)}
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                  >
                    Learn More
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outlined"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            View All Events
          </Button>
        </motion.div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}


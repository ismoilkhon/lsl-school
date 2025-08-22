'use client';

import React, { useState } from 'react';
import { Typography, Card, CardBody, Button, Chip } from '@material-tailwind/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EventModal from './EventModal';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';

export default function EventsSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = t('events.items');

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
          >
            {t('events.title')}
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('events.description')}
          </Typography>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Chip
                      value={event.category}
                      color={getCategoryColor(event.category) as any}
                      className="text-white"
                    />
                  </div>
                </div>
                
                <CardBody className="p-6">
                  <Typography
                    variant="h4"
                    className="mb-3 font-bold text-blue-900"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {event.title}
                  </Typography>
                  
                  <Typography
                    className="text-blue-700 dark:text-blue-200 mb-4 line-clamp-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
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


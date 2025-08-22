'use client';

import React, { useState } from 'react';
import { Typography, Card, CardBody, Button, Chip } from '@material-tailwind/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EventModal from './EventModal';

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = [
    {
      id: 1,
      title: "Annual Science Fair",
      date: "March 15, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Main Auditorium",
      category: "Academic",
      description: "Students showcase their innovative science projects and experiments.",
      attendees: 500,
      image: "/0WJDnS1sZOiv.png",
      details: "Join us for our most anticipated academic event of the year! Students from all grade levels will present their innovative science projects, ranging from environmental studies to robotics. This event showcases the creativity and scientific thinking of our students while providing an opportunity for peer learning and community engagement.",
      organizer: "Science Department",
      requirements: ["Open to all students", "Projects must be submitted by March 10", "Parents and community members welcome"]
    },
    {
      id: 2,
      title: "Spring Sports Day",
      date: "March 22, 2025",
      time: "8:00 AM - 5:00 PM",
      location: "Athletic Field",
      category: "Sports",
      description: "Annual inter-house sports competition featuring track and field events.",
      attendees: 800,
      image: "/Su8rdyb70UGm.jpg",
      details: "Our annual Spring Sports Day brings together students from all houses in friendly competition. Events include track and field, team sports, and fun activities for all age groups. This day promotes physical fitness, teamwork, and school spirit while celebrating athletic achievement.",
      organizer: "Physical Education Department",
      requirements: ["All students encouraged to participate", "Medical clearance required for competitive events", "Spectators welcome"]
    },
    {
      id: 3,
      title: "Parent-Teacher Conference",
      date: "March 28, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Classrooms",
      category: "Meeting",
      description: "Individual meetings to discuss student progress and development.",
      attendees: 300,
      image: "/yFx8haCPmgHC.jpg",
      details: "These important one-on-one meetings provide an opportunity for parents and teachers to discuss student progress, address any concerns, and collaborate on strategies to support each child's academic and personal development. Appointments can be scheduled online.",
      organizer: "Academic Affairs Office",
      requirements: ["Appointments must be scheduled in advance", "15-minute time slots available", "Both parents encouraged to attend"]
    },
    {
      id: 4,
      title: "Art Exhibition Opening",
      date: "April 5, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Art Gallery",
      category: "Arts",
      description: "Showcasing student artwork from various grades and art programs.",
      attendees: 200,
      image: "/0WJDnS1sZOiv.png",
      details: "Celebrate the artistic talents of our students at this special exhibition featuring paintings, sculptures, digital art, and mixed media pieces. The evening will include light refreshments and an opportunity to meet the young artists and learn about their creative process.",
      organizer: "Arts Department",
      requirements: ["Open to all community members", "Light refreshments provided", "Artwork available for purchase"]
    }
  ];

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
            Upcoming Events
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Stay connected with our vibrant school community through exciting events, 
            competitions, and educational activities throughout the year.
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


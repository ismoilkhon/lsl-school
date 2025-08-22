'use client';

import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Button, Card, CardBody } from '@material-tailwind/react';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
  details: string;
  organizer: string;
  requirements?: string[];
}

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'bg-blue-500';
      case 'sports': return 'bg-green-500';
      case 'arts': return 'bg-purple-500';
      case 'meeting': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          handler={onClose}
          size="lg"
          className="bg-transparent shadow-none"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mx-auto w-full max-w-4xl">
              <CardBody className="p-0">
                {/* Header Image */}
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="text"
                      className="p-2 text-white hover:bg-white/20 rounded-full"
                      onClick={onClose}
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <DialogHeader className="p-0 mb-4">
                    <Typography
                      variant="h3"
                      className="text-blue-900 font-bold"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {event.title}
                    </Typography>
                  </DialogHeader>

                  <DialogBody className="p-0">
                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-orange-500" />
                          <div>
                            <Typography
                              variant="small"
                              className="text-gray-600 font-medium"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              Date
                            </Typography>
                            <Typography
                              className="text-blue-900 font-semibold"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              {event.date}
                            </Typography>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <div>
                            <Typography
                              variant="small"
                              className="text-gray-600 font-medium"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              Time
                            </Typography>
                            <Typography
                              className="text-blue-900 font-semibold"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              {event.time}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-orange-500" />
                          <div>
                            <Typography
                              variant="small"
                              className="text-gray-600 font-medium"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              Location
                            </Typography>
                            <Typography
                              className="text-blue-900 font-semibold"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              {event.location}
                            </Typography>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-orange-500" />
                          <div>
                            <Typography
                              variant="small"
                              className="text-gray-600 font-medium"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              Expected Attendees
                            </Typography>
                            <Typography
                              className="text-blue-900 font-semibold"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              {event.attendees}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <Typography
                        variant="h5"
                        className="mb-3 text-blue-900 font-semibold"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        About This Event
                      </Typography>
                      <Typography
                        className="text-gray-600 leading-relaxed"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        {event.details}
                      </Typography>
                    </div>

                    {/* Organizer */}
                    <div className="mb-6">
                      <Typography
                        variant="h6"
                        className="mb-2 text-blue-900 font-semibold"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Organized by: {event.organizer}
                      </Typography>
                    </div>

                    {/* Requirements */}
                    {event.requirements && event.requirements.length > 0 && (
                      <div className="mb-6">
                        <Typography
                          variant="h6"
                          className="mb-3 text-blue-900 font-semibold"
                          placeholder=""
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          Requirements
                        </Typography>
                        <ul className="space-y-2">
                          {event.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </DialogBody>

                  <DialogFooter className="p-0 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <Button
                        variant="outlined"
                        onClick={onClose}
                        className="flex-1 border-gray-300 text-gray-700"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Close
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Register for Event
                      </Button>
                    </div>
                  </DialogFooter>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}


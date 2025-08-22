'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, CardBody, Avatar, IconButton } from '@material-tailwind/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Parent of Emma (Grade 8)",
    content: "Bright Valley Academy has exceeded our expectations. The teachers are incredibly dedicated, and the personalized attention Emma receives has helped her flourish both academically and socially. The school's emphasis on character development is truly remarkable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Alumni, Class of 2020",
    content: "The education I received at Bright Valley Academy prepared me exceptionally well for university. The critical thinking skills, leadership opportunities, and supportive environment gave me the confidence to pursue my dreams. I'm now studying engineering at MIT.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    role: "Parent of twins Alex & Maya (Grade 6)",
    content: "Having twins with different learning styles, I was concerned about finding the right school. Bright Valley Academy's individualized approach has been perfect. Both children are thriving, and the teachers truly understand each child's unique needs.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Parent of Jake (Grade 10)",
    content: "The STEM program at Bright Valley Academy is outstanding. Jake has developed a passion for robotics and programming that I never expected. The school's modern facilities and innovative teaching methods make learning exciting and relevant.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Amanda Foster",
    role: "Current Student (Grade 11)",
    content: "I love being part of the Bright Valley community! The teachers push us to think critically and creatively. The variety of clubs and activities means there's something for everyone. I feel prepared and excited about my future.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Parent of Sophie (Grade 4)",
    content: "The transition to Bright Valley Academy was seamless for Sophie. The warm, welcoming environment and the school's focus on building confidence has helped her become more outgoing and eager to learn. We couldn't be happier with our choice.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
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
            className="mb-4 text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-100"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            What Our Community Says
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-600 dark:text-blue-300 max-w-3xl mx-auto"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Hear from our students, parents, and alumni about their experiences 
            at Bright Valley Academy and how we've made a difference in their lives.
          </Typography>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
            <IconButton
              variant="filled"
              className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 shadow-lg hover:bg-blue-200 dark:hover:bg-blue-700"
              onClick={goToPrevious}
              placeholder=""
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <ChevronLeft className="h-6 w-6" />
            </IconButton>
          </div>
          
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10">
            <IconButton
              variant="filled"
              className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 shadow-lg hover:bg-blue-200 dark:hover:bg-blue-700"
              onClick={goToNext}
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <ChevronRight className="h-6 w-6" />
            </IconButton>
          </div>

          {/* Testimonial Cards */}
          <div className="overflow-hidden h-[400px] flex items-center">
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full absolute inset-0"
              >
                <Card className="hover:shadow-xl transition-all duration-300 bg-blue-50 dark:bg-blue-800 backdrop-blur-sm">
                  <CardBody className="p-8 text-center">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <Quote className="h-12 w-12 text-orange-500" />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-6">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>

                    {/* Content */}
                    <Typography
                      className="text-gray-700 mb-8 text-lg leading-relaxed italic max-w-3xl mx-auto"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      "{testimonials[currentIndex].content}"
                    </Typography>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <Avatar
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        size="lg"
                        className="border-2 border-orange-500"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      />
                      <div className="text-left">
                        <Typography
                          variant="h5"
                          className="font-semibold text-blue-900"
                          placeholder=""
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          {testimonials[currentIndex].name}
                        </Typography>
                        <Typography
                          className="text-gray-600"
                          placeholder=""
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          {testimonials[currentIndex].role}
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                isAutoPlaying 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


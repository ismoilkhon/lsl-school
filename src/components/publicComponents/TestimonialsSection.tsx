'use client';

import React from 'react';
import { Typography, Card, CardBody, Avatar } from '@material-tailwind/react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
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
            className="mb-4 text-4xl md:text-5xl font-bold text-blue-900"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            What Our Community Says
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Hear from our students, parents, and alumni about their experiences 
            at Bright Valley Academy and how we've made a difference in their lives.
          </Typography>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardBody className="p-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <Quote className="h-8 w-8 text-orange-500" />
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Content */}
                  <Typography
                    className="text-gray-700 mb-6 flex-grow text-center italic leading-relaxed"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    "{testimonial.content}"
                  </Typography>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-3 mt-auto">
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      size="sm"
                      className="border-2 border-orange-500"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    />
                    <div className="text-center">
                      <Typography
                        variant="h6"
                        className="font-semibold text-blue-900"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-gray-600"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        {testimonial.role}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Typography
            variant="h4"
            className="mb-4 font-bold text-blue-900"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Ready to Join Our Community?
          </Typography>
          <Typography
            className="text-gray-600 mb-6 max-w-2xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Experience the Bright Valley Academy difference for yourself. 
            Schedule a campus tour and see why families choose us for their children's education.
          </Typography>
        </motion.div>
      </div>
    </section>
  );
}


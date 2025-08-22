'use client';

import React from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';
import { Target, Eye, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for academic excellence and personal growth in every student."
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Innovation",
      description: "Embracing modern teaching methods and technology for effective learning."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Compassion",
      description: "Creating a caring environment where every student feels valued and supported."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Integrity",
      description: "Building character and ethical values that last a lifetime."
    }
  ];

  return (
    <section id="about" className="py-20 bg-blue-50 dark:bg-blue-900">
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
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            About Bright Valley Academy
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            For over 25 years, we have been dedicated to providing exceptional education 
            that prepares students for success in an ever-changing world.
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div
                className="w-full h-96 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl flex items-center justify-center"
              >
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <div className="text-xl font-semibold">Students in Classroom</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Typography
              variant="h3"
              className="text-3xl font-bold text-blue-800 dark:text-blue-100 mb-4"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Our Mission
            </Typography>
            <Typography
              className="text-blue-700 dark:text-blue-200 text-lg leading-relaxed"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              To provide a nurturing and challenging educational environment that empowers 
              students to reach their full potential academically, socially, and emotionally. 
              We believe in fostering critical thinking, creativity, and character development 
              while preparing students for lifelong learning and responsible citizenship.
            </Typography>
            
            <Typography
              variant="h3"
              className="text-3xl font-bold text-blue-800 dark:text-blue-100 mb-4 mt-8"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Our Vision
            </Typography>
            <Typography
              className="text-blue-700 dark:text-blue-200 text-lg leading-relaxed"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              To be recognized as a leading educational institution that inspires students 
              to become confident, compassionate, and capable leaders who make positive 
              contributions to their communities and the world.
            </Typography>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-12"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Our Core Values
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 bg-blue-100 dark:bg-blue-800">
                  <CardBody className="text-center p-6">
                    <div className="flex justify-center mb-4 text-blue-700 dark:text-blue-200">
                      {value.icon}
                    </div>
                    <Typography
                      variant="h5"
                      className="mb-3 font-bold text-blue-800 dark:text-blue-100"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      className="text-blue-700 dark:text-blue-200"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {value.description}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


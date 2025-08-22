'use client';

import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { ArrowRight, Users, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Shaping Tomorrow's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Leaders Today
            </span>
          </Typography>

          <Typography
            variant="lead"
            className="mb-8 text-xl md:text-2xl max-w-4xl mx-auto text-blue-100"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            At Bright Valley Academy, we nurture young minds through innovative education, 
            fostering creativity, critical thinking, and character development in a supportive environment.
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outlined"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-300"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Schedule a Tour
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-orange-400" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <AnimatedCounter end={1200} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Happy Students
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-8 w-8 text-orange-400" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <AnimatedCounter end={25} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Years of Excellence
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-8 w-8 text-orange-400" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <AnimatedCounter end={50} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Programs Offered
            </Typography>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}


'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';
import { Typography, Button } from '@material-tailwind/react';
import { ArrowRight, Users, Award, BookOpen, ArrowDown } from 'lucide-react';
import { useStudents, useTeachers } from '@/lib/hooks/useQueries';

export default function HeroSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  
  // Fetch real data for statistics
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  
  // Calculate real statistics
  const studentCount = 350 // students.length;
  const teacherCount = 40 // teachers.length;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('/LSL-SCHOOL.jpg')]  bg-center bg-no-repeat"
        style={{ backgroundSize: '100% 100%' }}
      >
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-blue-200/20"></div> */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            className="mb-6  text-4xl text-cyan-950 md:text-6xl lg:text-7xl font-bold leading-tight"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('hero.title')}
            <span className="block  bg-clip-text text-cyan-950">
              {t('hero.subtitle')}
            </span>
          </Typography>

          <Typography
            variant="lead"
            className="mb-8 text-xl md:text-2xl max-w-4xl mx-auto text-cyan-950"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('hero.description')}
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r flex p-3 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('hero.explorePrograms')}
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            {/* <Button
              variant="outlined"
              size="lg"
              className="border-blue-200 text-blue-200 hover:bg-blue-200 hover:text-blue-800 transition-all duration-300"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('hero.scheduleTour')}
            </Button> */}
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
              <Users className="h-8 w-8 text-cyan-950" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              <AnimatedCounter end={studentCount} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('hero.stats.students')}
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award className="h-8 w-8 text-cyan-950" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              <AnimatedCounter end={2} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('hero.stats.years')}
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-8 w-8 text-cyan-950" />
            </div>
            <Typography
              variant="h3"
              className="text-3xl font-bold mb-1"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              <AnimatedCounter end={teacherCount} suffix="+" />
            </Typography>
            <Typography
              className="text-blue-200"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              Teachers
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


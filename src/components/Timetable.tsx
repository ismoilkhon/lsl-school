'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Typography, Chip, Button } from '@material-tailwind/react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';

interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'lecture' | 'lab' | 'seminar' | 'exam';
  color?: string;
}

interface TimetableProps {
  lessons: Lesson[];
  userType: 'student' | 'teacher';
  className?: string;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const timeSlots = [
  '08:00', '08:45', '09:30', '10:15', '11:00', '11:45',
  '12:30', '13:15', '14:00', '14:45', '15:30', '16:15'
];

const subjectColors = {
  mathematics: 'bg-blue-500',
  physics: 'bg-green-500',
  chemistry: 'bg-yellow-500',
  biology: 'bg-purple-500',
  history: 'bg-red-500',
  geography: 'bg-indigo-500',
  literature: 'bg-pink-500',
  english: 'bg-orange-500',
  computer_science: 'bg-teal-500',
  art: 'bg-rose-500',
  music: 'bg-violet-500',
  physical_education: 'bg-emerald-500',
};

const Timetable = React.memo(function Timetable({ lessons, userType, className = '' }: TimetableProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Get current date and calculate week start
  const weekStart = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
    return weekStart;
  }, [currentWeek]);

  const getDayName = (day: string) => {
    return t(`timetable.days.${day}`);
  };

  const getSubjectColor = (subject: string) => {
    const subjectKey = subject.toLowerCase().replace(/\s+/g, '_');
    return subjectColors[subjectKey as keyof typeof subjectColors] || 'bg-gray-500';
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'seminar': return 'bg-yellow-100 text-yellow-800';
      case 'exam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeText = (type: string) => {
    return t(`timetable.lessonTypes.${type}`);
  };

  const getLessonsForDay = useMemo(() => {
    return (day: string) => {
      return lessons.filter(lesson => lesson.day.toLowerCase() === day);
    };
  }, [lessons]);

  const getLessonsForTimeSlot = useMemo(() => {
    return (day: string, time: string) => {
      return lessons.filter(lesson => 
        lesson.day.toLowerCase() === day && 
        lesson.startTime === time
      );
    };
  }, [lessons]);

  const formatTime = (time: string) => {
    return time;
  };

  const WeekView = useMemo(() => {
    return () => (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
              {t('timetable.time')}
            </Typography>
          </div>
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                {getDayName(day)}
              </Typography>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map(time => (
          <div key={time} className="grid grid-cols-7 gap-2 mb-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                {formatTime(time)}
              </Typography>
            </div>
            {daysOfWeek.map(day => {
              const dayLessons = getLessonsForTimeSlot(day, time);
              return (
                <div key={`${day}-${time}`} className="min-h-[60px] p-2">
                  {dayLessons.map(lesson => (
                    <Card key={lesson.id} className="mb-1 shadow-sm">
                      <CardBody className="p-2">
                        <Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-200">
                          {lesson.subject}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {lesson.teacher}
                        </Typography>
                                                 <div className="flex items-center gap-1 mt-1">
                           <MapPin className="w-3 h-3 text-gray-500" />
                           <Typography variant="small" className="text-gray-500">
                             {lesson.room}
                           </Typography>
                         </div>
                        <Chip
                          value={getLessonTypeText(lesson.type)}
                          size="sm"
                          className={`mt-1 ${getLessonTypeColor(lesson.type)}`}
                        />
                      </CardBody>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
  }, [getLessonsForTimeSlot, getDayName, t, getSubjectColor, getLessonTypeText, getLessonTypeColor]);

  const DayView = useMemo(() => {
    return () => {
      const dayLessons = getLessonsForDay(selectedDay);
    
    return (
      <div className="space-y-4">
        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daysOfWeek.map(day => (
            <Button
              key={day}
              variant={selectedDay === day ? "filled" : "outlined"}
              size="sm"
              onClick={() => setSelectedDay(day)}
              className="whitespace-nowrap"
            >
              {getDayName(day)}
            </Button>
          ))}
        </div>

        {/* Lessons for selected day */}
        <div className="space-y-3">
          {dayLessons.length === 0 ? (
            <Card className="p-6 text-center">
              <CardBody>
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <Typography variant="h6" className="text-gray-600 dark:text-gray-400">
                  {t('timetable.noLessons')}
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  {t('timetable.noLessonsDescription')}
                </Typography>
              </CardBody>
            </Card>
          ) : (
            dayLessons
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(lesson => (
                <Card key={lesson.id} className="shadow-sm">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getSubjectColor(lesson.subject)}`} />
                          <Typography variant="h6" className="text-gray-800 dark:text-gray-200">
                            {lesson.subject}
                          </Typography>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                     <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-gray-500" />
                             <span className="text-gray-600 dark:text-gray-400">
                               {lesson.startTime} - {lesson.endTime}
                             </span>
                           </div>
                          
                                                     <div className="flex items-center gap-2">
                             <User className="w-4 h-4 text-gray-500" />
                             <span className="text-gray-600 dark:text-gray-400">
                               {lesson.teacher}
                             </span>
                           </div>
                          
                                                     <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-gray-500" />
                             <span className="text-gray-600 dark:text-gray-400">
                               {lesson.room}
                             </span>
                           </div>
                        </div>
                      </div>
                      
                      <Chip
                        value={getLessonTypeText(lesson.type)}
                        className={getLessonTypeColor(lesson.type)}
                      />
                    </div>
                  </CardBody>
                </Card>
              ))
          )}
        </div>
      </div>
    );
    };
  }, [getLessonsForDay, selectedDay, getDayName, t, getSubjectColor, getLessonTypeText, getLessonTypeColor]);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h5" className="text-gray-800 dark:text-gray-200">
              {t(`timetable.${userType}Title`)}
            </Typography>
            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
              {t('timetable.weekOf')} {weekStart.toLocaleDateString(locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentWeek(0)}
              className="px-4"
            >
              {t('timetable.today')}
            </Button>
            
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentWeek(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'week' ? "filled" : "outlined"}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            {t('timetable.weekView')}
          </Button>
          <Button
            variant={viewMode === 'day' ? "filled" : "outlined"}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            {t('timetable.dayView')}
          </Button>
        </div>

        {/* Timetable content */}
        {viewMode === 'week' ? <WeekView /> : <DayView />}
      </div>
    </div>
  );
});

export default Timetable;

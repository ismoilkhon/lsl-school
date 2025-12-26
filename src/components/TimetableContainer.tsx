'use client';

import React from 'react';
import { Card, CardBody, Typography, Spinner } from '@material-tailwind/react';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';
import Timetable from './Timetable';
import { useLessonsByClass, useLessonsByTeacher } from "@/lib/hooks/useQueries";
import type { Lesson as ApiLesson } from '@/lib/client-api';

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

interface TimetableContainerProps {
  userType: 'student' | 'teacher';
  userId?: string;
  classId?: string;
  className?: string;
}

// Transform API lesson data to match local interface
const transformApiLesson = (apiLesson: ApiLesson): Lesson => {
  return {
    id: apiLesson.$id,
    subject: apiLesson.name, // Using name as subject for now
    teacher: '', // Will need to fetch teacher name separately
    room: apiLesson.room,
    startTime: apiLesson.startTime,
    endTime: apiLesson.endTime,
    day: apiLesson.day,
    type: 'lecture' as const, // Default type
    color: undefined
  };
};

const TimetableContainer = React.memo(function TimetableContainer({ 
  userType, 
  userId, 
  classId, 
  className = '' 
}: TimetableContainerProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  
  // Use TanStack Query hooks based on user type
  const { data: classLessons = [], isLoading: classLoading, error: classError } = useLessonsByClass(classId || '');
  const { data: teacherLessons = [], isLoading: teacherLoading, error: teacherError } = useLessonsByTeacher(userId || '');
  
  // Determine which data to use based on user type and transform it
  const apiLessons = userType === 'student' && classId ? classLessons : 
                     userType === 'teacher' && userId ? teacherLessons : 
                     [];
  
  const lessons = apiLessons.map(transformApiLesson);
  
  const isLoading = userType === 'student' && classId ? classLoading : 
                    userType === 'teacher' && userId ? teacherLoading : 
                    false;
  
  const error = userType === 'student' && classId ? classError : 
                userType === 'teacher' && userId ? teacherError : 
                null;

  if (isLoading) {
    return (
      <Card 
        className={className}
        placeholder=""
        onResize={() => {}}
        onResizeCapture={() => {}}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <CardBody 
          className="p-6"
          placeholder=""
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner 
                className="h-8 w-8 mx-auto mb-4"
                onResize={() => {}}
                onResizeCapture={() => {}}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              />
              <Typography 
                variant="small" 
                className="text-gray-600 dark:text-gray-400"
                placeholder=""
                onResize={() => {}}
                onResizeCapture={() => {}}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {t('timetable.loading')}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        className={className}
        placeholder=""
        onResize={() => {}}
        onResizeCapture={() => {}}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <CardBody 
          className="p-6"
          placeholder=""
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <div className="text-center py-8">
            <Typography 
              variant="h6" 
              className="text-red-600 mb-2"
              placeholder=""
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {t('timetable.error')}
            </Typography>
            <Typography 
              variant="small" 
              className="text-gray-600 dark:text-gray-400"
              placeholder=""
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {error.message || t('timetable.errorLoading')}
            </Typography>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Timetable
      lessons={lessons}
      userType={userType}
      className={className}
    />
  );
});

export default TimetableContainer;

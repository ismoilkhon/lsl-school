'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Typography, Spinner } from '@material-tailwind/react';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';
import Timetable from './Timetable';

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

// Mock data for demonstration - in real app, this would come from API
const mockLessons: Lesson[] = [
  {
    id: '1',
    subject: 'Mathematics',
    teacher: 'Dr. Sarah Johnson',
    room: 'Room 101',
    startTime: '08:00',
    endTime: '08:45',
    day: 'monday',
    type: 'lecture'
  },
  {
    id: '2',
    subject: 'Physics',
    teacher: 'Prof. Michael Chen',
    room: 'Lab 205',
    startTime: '08:45',
    endTime: '09:30',
    day: 'monday',
    type: 'lab'
  },
  {
    id: '3',
    subject: 'English Literature',
    teacher: 'Ms. Emily Davis',
    room: 'Room 103',
    startTime: '09:30',
    endTime: '10:15',
    day: 'monday',
    type: 'seminar'
  },
  {
    id: '4',
    subject: 'Chemistry',
    teacher: 'Dr. Robert Wilson',
    room: 'Lab 201',
    startTime: '10:15',
    endTime: '11:00',
    day: 'monday',
    type: 'lab'
  },
  {
    id: '5',
    subject: 'History',
    teacher: 'Prof. Lisa Anderson',
    room: 'Room 105',
    startTime: '11:00',
    endTime: '11:45',
    day: 'monday',
    type: 'lecture'
  },
  {
    id: '6',
    subject: 'Computer Science',
    teacher: 'Mr. David Kim',
    room: 'Computer Lab',
    startTime: '12:30',
    endTime: '13:15',
    day: 'monday',
    type: 'lab'
  },
  {
    id: '7',
    subject: 'Physical Education',
    teacher: 'Coach James Smith',
    room: 'Gymnasium',
    startTime: '13:15',
    endTime: '14:00',
    day: 'monday',
    type: 'lab'
  },
  // Tuesday lessons
  {
    id: '8',
    subject: 'Biology',
    teacher: 'Dr. Maria Garcia',
    room: 'Lab 203',
    startTime: '08:00',
    endTime: '08:45',
    day: 'tuesday',
    type: 'lab'
  },
  {
    id: '9',
    subject: 'Geography',
    teacher: 'Ms. Jennifer Lee',
    room: 'Room 107',
    startTime: '08:45',
    endTime: '09:30',
    day: 'tuesday',
    type: 'lecture'
  },
  {
    id: '10',
    subject: 'Mathematics',
    teacher: 'Dr. Sarah Johnson',
    room: 'Room 101',
    startTime: '09:30',
    endTime: '10:15',
    day: 'tuesday',
    type: 'lecture'
  },
  {
    id: '11',
    subject: 'Art',
    teacher: 'Ms. Rachel Green',
    room: 'Art Studio',
    startTime: '10:15',
    endTime: '11:00',
    day: 'tuesday',
    type: 'lab'
  },
  {
    id: '12',
    subject: 'Music',
    teacher: 'Mr. Thomas Brown',
    room: 'Music Room',
    startTime: '11:00',
    endTime: '11:45',
    day: 'tuesday',
    type: 'lab'
  },
  // Wednesday lessons
  {
    id: '13',
    subject: 'Physics',
    teacher: 'Prof. Michael Chen',
    room: 'Lab 205',
    startTime: '08:00',
    endTime: '08:45',
    day: 'wednesday',
    type: 'lecture'
  },
  {
    id: '14',
    subject: 'English Literature',
    teacher: 'Ms. Emily Davis',
    room: 'Room 103',
    startTime: '08:45',
    endTime: '09:30',
    day: 'wednesday',
    type: 'seminar'
  },
  {
    id: '15',
    subject: 'Chemistry',
    teacher: 'Dr. Robert Wilson',
    room: 'Lab 201',
    startTime: '09:30',
    endTime: '10:15',
    day: 'wednesday',
    type: 'lecture'
  },
  // Thursday lessons
  {
    id: '16',
    subject: 'Mathematics',
    teacher: 'Dr. Sarah Johnson',
    room: 'Room 101',
    startTime: '08:00',
    endTime: '08:45',
    day: 'thursday',
    type: 'lecture'
  },
  {
    id: '17',
    subject: 'Biology',
    teacher: 'Dr. Maria Garcia',
    room: 'Lab 203',
    startTime: '08:45',
    endTime: '09:30',
    day: 'thursday',
    type: 'lab'
  },
  {
    id: '18',
    subject: 'History',
    teacher: 'Prof. Lisa Anderson',
    room: 'Room 105',
    startTime: '09:30',
    endTime: '10:15',
    day: 'thursday',
    type: 'seminar'
  },
  // Friday lessons
  {
    id: '19',
    subject: 'Computer Science',
    teacher: 'Mr. David Kim',
    room: 'Computer Lab',
    startTime: '08:00',
    endTime: '08:45',
    day: 'friday',
    type: 'lab'
  },
  {
    id: '20',
    subject: 'Geography',
    teacher: 'Ms. Jennifer Lee',
    room: 'Room 107',
    startTime: '08:45',
    endTime: '09:30',
    day: 'friday',
    type: 'lecture'
  },
  {
    id: '21',
    subject: 'Physical Education',
    teacher: 'Coach James Smith',
    room: 'Gymnasium',
    startTime: '09:30',
    endTime: '10:15',
    day: 'friday',
    type: 'lab'
  },
  // Saturday lessons (fewer)
  {
    id: '22',
    subject: 'Art',
    teacher: 'Ms. Rachel Green',
    room: 'Art Studio',
    startTime: '08:00',
    endTime: '08:45',
    day: 'saturday',
    type: 'lab'
  },
  {
    id: '23',
    subject: 'Music',
    teacher: 'Mr. Thomas Brown',
    room: 'Music Room',
    startTime: '08:45',
    endTime: '09:30',
    day: 'saturday',
    type: 'lab'
  }
];

const TimetableContainer = React.memo(function TimetableContainer({ 
  userType, 
  userId, 
  classId, 
  className = '' 
}: TimetableContainerProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real application, you would fetch data from your API
        // const response = await fetch(`/api/timetable?userType=${userType}&userId=${userId}&classId=${classId}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter lessons based on user type and class
        let filteredLessons = mockLessons;
        
        if (userType === 'student' && classId) {
          // For students, show lessons for their class
          // In real app, you'd filter by classId
          filteredLessons = mockLessons;
        } else if (userType === 'teacher' && userId) {
          // For teachers, show only their lessons
          // In real app, you'd filter by teacherId
          filteredLessons = mockLessons.filter(lesson => 
            lesson.teacher.includes('Dr.') || lesson.teacher.includes('Prof.') || lesson.teacher.includes('Mr.') || lesson.teacher.includes('Ms.')
          );
        }

        setLessons(filteredLessons);
      } catch (err) {
        setError(t('timetable.errorLoading'));
        console.error('Error fetching timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [userType, userId, classId, locale]);

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <Typography variant="small" className="text-gray-600 dark:text-gray-400">
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
      <Card className={`${className}`}>
        <CardBody className="p-6">
          <div className="text-center py-8">
            <Typography variant="h6" className="text-red-600 mb-2">
              {t('timetable.error')}
            </Typography>
            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
              {error}
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

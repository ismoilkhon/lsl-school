'use client';

import React from 'react';
import { Typography, Card, CardBody, Button } from '@material-tailwind/react';
import { Users, Trophy, Building, Heart, Users2, Award, BookOpen, Music, Palette, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';

export default function StudentLifeSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const activityIcons = {
    clubs: <Users className="h-6 w-6" />,
    leadership: <Trophy className="h-6 w-6" />,
    facilities: <Building className="h-6 w-6" />,
  };

  const facilityIcons = [
    <BookOpen key="library" className="h-5 w-5" />,
    <Microscope key="labs" className="h-5 w-5" />,
    <Trophy key="sports" className="h-5 w-5" />,
    <Palette key="art" className="h-5 w-5" />,
    <Music key="music" className="h-5 w-5" />,
    <Building key="computer" className="h-5 w-5" />,
  ];

  const communityIcons = [
    <Heart key="cultural" className="h-5 w-5" />,
    <Users2 key="international" className="h-5 w-5" />,
    <Award key="diversity" className="h-5 w-5" />,
    <Heart key="service" className="h-5 w-5" />,
  ];

  return (
    <section id="student-life" className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
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
            {t('studentLife.title')}
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('studentLife.description')}
          </Typography>
        </motion.div>

        {/* Extracurricular Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Typography
            variant="h3"
            className="mb-8 text-3xl font-bold text-center text-blue-800 dark:text-blue-100"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('studentLife.activities.title')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Clubs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4 text-blue-600">
                    {activityIcons.clubs}
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-3 font-bold text-center text-blue-800 dark:text-blue-100"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.clubs.title')}
                  </Typography>
                  <Typography
                    className="text-blue-700 dark:text-blue-200 mb-4 text-center"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.clubs.description')}
                  </Typography>
                  <div className="space-y-2">
                    {t('studentLife.activities.clubs.items').map((item: string, index: number) => (
                      <div key={index} className="flex items-center text-blue-700 dark:text-blue-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Leadership Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4 text-blue-600">
                    {activityIcons.leadership}
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-3 font-bold text-center text-blue-800 dark:text-blue-100"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.leadership.title')}
                  </Typography>
                  <Typography
                    className="text-blue-700 dark:text-blue-200 mb-4 text-center"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.leadership.description')}
                  </Typography>
                  <div className="space-y-2">
                    {t('studentLife.activities.leadership.items').map((item: string, index: number) => (
                      <div key={index} className="flex items-center text-blue-700 dark:text-blue-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Campus Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4 text-blue-600">
                    {activityIcons.facilities}
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-3 font-bold text-center text-blue-800 dark:text-blue-100"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.facilities.title')}
                  </Typography>
                  <Typography
                    className="text-blue-700 dark:text-blue-200 mb-4 text-center"
                    placeholder=""
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {t('studentLife.activities.facilities.description')}
                  </Typography>
                  <div className="space-y-2">
                    {t('studentLife.activities.facilities.items').map((item: string, index: number) => (
                      <div key={index} className="flex items-center text-blue-700 dark:text-blue-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Community & Culture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            className="mb-8 text-3xl font-bold text-center text-blue-800 dark:text-blue-100"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('studentLife.community.title')}
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 mb-8 text-center max-w-3xl mx-auto"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('studentLife.community.description')}
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t('studentLife.community.features').map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="p-4">
                    <div className="flex justify-center mb-3 text-blue-600">
                      {communityIcons[index]}
                    </div>
                    <Typography
                      className="text-blue-700 dark:text-blue-200 font-medium"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {feature}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
            className="mb-4 font-bold text-blue-800 dark:text-blue-100"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Ready to Experience Student Life?
          </Typography>
          <Typography
            className="text-blue-700 dark:text-blue-200 mb-6 max-w-2xl mx-auto"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Join our vibrant community and discover all the opportunities waiting for you at Bright Valley Academy.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              placeholder=""
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              placeholder=""
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Schedule a Tour
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

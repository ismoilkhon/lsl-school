'use client';

import React from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';
import { Target, Eye, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';
import studentsImage from '@/../public/yFx8haCPmgHC.jpg';

export default function AboutSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: t('about.values.compassion.title'),
      description: t('about.values.compassion.description')
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description')
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
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            {t('about.title')}
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            {t('about.description')}
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
                style={{
                  backgroundImage: `url(${studentsImage.src})`
                }}
                className="w-full h-96 bg-cover bg-center rounded-2xl shadow-2xl flex items-center justify-center"
              >
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
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('about.mission.title')}
            </Typography>
            <Typography
              className="text-blue-700 dark:text-blue-200 text-lg leading-relaxed"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('about.mission.content')}
            </Typography>
            
            <Typography
              variant="h3"
              className="text-3xl font-bold text-blue-800 dark:text-blue-100 mb-4 mt-8"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('about.vision.title')}
            </Typography>
            <Typography
              className="text-blue-700 dark:text-blue-200 text-lg leading-relaxed"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              {t('about.vision.content')}
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
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            {t('about.values.title')}
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
                <Card 
                  className="h-full hover:shadow-xl transition-shadow duration-300 bg-blue-100 dark:bg-blue-800"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  onResize={() => {}}
                  onResizeCapture={() => {}}
                >
                  <CardBody 
                    className="text-center p-6"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    onResize={() => {}}
                    onResizeCapture={() => {}}
                  >
                    <div className="flex justify-center mb-4 text-blue-700 dark:text-blue-200">
                      {value.icon}
                    </div>
                    <Typography
                      variant="h5"
                      className="mb-3 font-bold text-blue-800 dark:text-blue-100"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      className="text-blue-700 dark:text-blue-200"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                      onResize={() => {}}
                      onResizeCapture={() => {}}
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


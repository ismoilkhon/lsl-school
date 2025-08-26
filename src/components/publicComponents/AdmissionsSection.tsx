'use client';

import React from 'react';
import { Typography, Card, CardBody, Button, Chip } from '@material-tailwind/react';
import { FileText, CheckCircle, DollarSign, Download, Calendar, Users, Award, BookOpen, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';

export default function AdmissionsSection() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const stepIcons = [
    <FileText key="application" className="h-6 w-6" />,
    <CheckCircle key="assessment" className="h-6 w-6" />,
    <Users key="review" className="h-6 w-6" />,
    <Award key="decision" className="h-6 w-6" />,
  ];

  const requirementIcons = [
    <BookOpen key="documents" className="h-5 w-5" />,
    <Shield key="criteria" className="h-5 w-5" />,
  ];

  const feeIcons = [
    <DollarSign key="tuition" className="h-5 w-5" />,
    <FileText key="registration" className="h-5 w-5" />,
    <Award key="technology" className="h-5 w-5" />,
    <Calendar key="activity" className="h-5 w-5" />,
    <Clock key="transportation" className="h-5 w-5" />,
  ];

  return (
    <section id="admissions" className="py-20 bg-white dark:bg-blue-900">
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
            {t('admissions.title')}
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
            {t('admissions.description')}
          </Typography>
        </motion.div>

        {/* Admission Process */}
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
            {t('admissions.process.title')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t('admissions.process.steps').map((step: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardBody className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300">
                        {stepIcons[index]}
                      </div>
                    </div>
                    <Chip
                      value={`Step ${index + 1}`}
                      className="mb-3 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                    />
                    <Typography
                      variant="h5"
                      className="mb-3 font-bold text-blue-800 dark:text-blue-100"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      className="text-blue-700 dark:text-blue-200"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {step.description}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
            {t('admissions.requirements.title')}
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Required Documents */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-6">
                  <div className="flex items-center mb-4 text-blue-600">
                    {requirementIcons[0]}
                    <Typography
                      variant="h5"
                      className="ml-3 font-bold text-blue-800 dark:text-blue-100"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {t('admissions.requirements.documents.title')}
                    </Typography>
                  </div>
                  <div className="space-y-3">
                    {t('admissions.requirements.documents.items').map((item: string, index: number) => (
                      <div key={index} className="flex items-center text-blue-700 dark:text-blue-200">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Admission Criteria */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardBody className="p-6">
                  <div className="flex items-center mb-4 text-blue-600">
                    {requirementIcons[1]}
                    <Typography
                      variant="h5"
                      className="ml-3 font-bold text-blue-800 dark:text-blue-100"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {t('admissions.requirements.criteria.title')}
                    </Typography>
                  </div>
                  <div className="space-y-3">
                    {t('admissions.requirements.criteria.items').map((item: string, index: number) => (
                      <div key={index} className="flex items-center text-blue-700 dark:text-blue-200">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Tuition & Fees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Typography
            variant="h3"
            className="mb-4 text-3xl font-bold text-center text-blue-800 dark:text-blue-100"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {t('admissions.fees.title')}
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
            {t('admissions.fees.description')}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {t('admissions.fees.items').map((item: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardBody className="p-4 text-center">
                    <div className="flex justify-center mb-3 text-blue-600">
                      {feeIcons[index]}
                    </div>
                    <Typography
                      className="text-blue-700 dark:text-blue-200 font-medium text-sm"
                      placeholder=""
                      onResize={() => {}}
                      onResizeCapture={() => {}}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {item}
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
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
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
            Ready to Join LSL School?
          </Typography>
          <Typography
            className="text-blue-700 dark:text-blue-200 mb-8 max-w-2xl mx-auto"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Start your child's journey to academic excellence and personal growth today.
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
              {t('admissions.applyNow')}
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
              {t('admissions.scheduleTour')}
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
              <Download className="h-4 w-4 mr-2" />
              {t('admissions.downloadBrochure')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

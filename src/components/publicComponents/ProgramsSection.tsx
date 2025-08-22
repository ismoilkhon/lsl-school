'use client';

import React from 'react';
import { Typography, Card, CardBody, Button } from '@material-tailwind/react';
import { BookOpen, Users, Award, Microscope, Palette, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgramsSection() {
  const programs = [
    {
      id: 1,
      title: "Elementary Program",
      subtitle: "Grades K-5",
      description: "Building strong foundations in literacy, numeracy, and social skills through play-based and experiential learning.",
      icon: <BookOpen className="h-8 w-8" />,
      features: ["Small class sizes", "Individualized attention", "Creative learning", "Character development"],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Middle School Program",
      subtitle: "Grades 6-8",
      description: "Preparing students for high school with rigorous academics, leadership opportunities, and personal growth.",
      icon: <Users className="h-8 w-8" />,
      features: ["Advanced curriculum", "Leadership training", "Peer mentoring", "College preparation"],
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "High School Program",
      subtitle: "Grades 9-12",
      description: "Comprehensive college preparatory program with AP courses, internships, and university partnerships.",
      icon: <Award className="h-8 w-8" />,
      features: ["AP courses", "University partnerships", "Career counseling", "Scholarship support"],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "STEM Excellence",
      subtitle: "All Grades",
      description: "Cutting-edge science, technology, engineering, and mathematics programs with state-of-the-art facilities.",
      icon: <Microscope className="h-8 w-8" />,
      features: ["Modern labs", "Robotics club", "Coding bootcamps", "Science fairs"],
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 5,
      title: "Arts & Creativity",
      subtitle: "All Grades",
      description: "Comprehensive arts program including visual arts, music, theater, and digital media production.",
      icon: <Palette className="h-8 w-8" />,
      features: ["Art studios", "Music ensembles", "Theater productions", "Digital media"],
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 6,
      title: "Athletics & Sports",
      subtitle: "All Grades",
      description: "Competitive sports programs promoting teamwork, discipline, and physical fitness across multiple sports.",
      icon: <Trophy className="h-8 w-8" />,
      features: ["Team sports", "Individual training", "Fitness programs", "Championships"],
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
            Our Academic Programs
          </Typography>
          <Typography
            variant="lead"
            className="text-gray-600 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Discover our comprehensive range of programs designed to nurture every aspect 
            of your child's development from kindergarten through high school graduation.
          </Typography>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                  <div className="flex items-center justify-center mb-4">
                    {program.icon}
                  </div>
                  <Typography
                    variant="h4"
                    className="text-center font-bold mb-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {program.title}
                  </Typography>
                  <Typography
                    className="text-center text-white/90"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {program.subtitle}
                  </Typography>
                </div>

                <CardBody className="p-6">
                  <Typography
                    className="text-gray-600 mb-6 leading-relaxed"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {program.description}
                  </Typography>

                  {/* Features */}
                  <div className="mb-6">
                    <Typography
                      variant="h6"
                      className="mb-3 font-semibold text-blue-900"
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Key Features:
                    </Typography>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outlined"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    Learn More
                  </Button>
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
            Ready to Explore Our Programs?
          </Typography>
          <Typography
            className="text-gray-600 mb-6 max-w-2xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Schedule a personalized tour to see our facilities, meet our teachers, 
            and discover which program is the perfect fit for your child.
          </Typography>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Schedule a Tour
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


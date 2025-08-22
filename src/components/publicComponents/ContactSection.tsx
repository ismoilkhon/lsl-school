'use client';

import React from 'react';
import { Typography, Card, CardBody, Input, Textarea, Button } from '@material-tailwind/react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"]
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@brightvalley.edu", "admissions@brightvalley.edu"]
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: ["123 Education Lane", "Bright Valley, CA 90210"]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Office Hours",
      details: ["Mon-Fri: 7:30 AM - 4:30 PM", "Sat: 9:00 AM - 2:00 PM"]
    }
  ];

  return (
    <section id="contact" className="py-20 bg-blue-50 dark:bg-blue-900">
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
            Get In Touch
          </Typography>
          <Typography
            variant="lead"
            className="text-blue-700 dark:text-blue-200 max-w-3xl mx-auto"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Have questions about our programs or admissions process? We'd love to hear from you. 
            Reach out to us and discover how Bright Valley Academy can be the perfect fit for your child.
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              className="mb-8 text-3xl font-bold text-blue-900"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Contact Information
            </Typography>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardBody className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg text-orange-600">
                          {info.icon}
                        </div>
                        <div>
                          <Typography
                            variant="h5"
                            className="mb-2 font-semibold text-blue-900"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          >
                            {info.title}
                          </Typography>
                          {info.details.map((detail, idx) => (
                            <Typography
                              key={idx}
                              className="text-blue-700 dark:text-blue-200 mb-1"
                              placeholder=""
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              {detail}
                            </Typography>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card>
                <CardBody className="p-0">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <Typography
                        variant="h6"
                        className="text-blue-900 font-semibold"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Interactive Map
                      </Typography>
                      <Typography
                        className="text-blue-700 dark:text-blue-200"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Click to view directions
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              className="mb-8 text-3xl font-bold text-blue-900"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Send us a Message
            </Typography>

            <Card>
              <CardBody className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      size="lg"
                      crossOrigin=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    />
                    <Input
                      label="Last Name"
                      size="lg"
                      crossOrigin=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    />
                  </div>
                  
                  <Input
                    label="Email Address"
                    size="lg"
                    type="email"
                    crossOrigin=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  
                  <Input
                    label="Phone Number"
                    size="lg"
                    type="tel"
                    crossOrigin=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  
                  <Input
                    label="Subject"
                    size="lg"
                    crossOrigin=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  
                  <Textarea
                    label="Message"
                    rows={6}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center gap-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


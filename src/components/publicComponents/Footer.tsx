'use client';

import React from 'react';
import { Typography } from '@material-tailwind/react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Academic Programs', href: '#programs' },
    { name: 'Admissions', href: '#admissions' },
    { name: 'Student Life', href: '#student-life' },
    { name: 'Events', href: '#events' },
    { name: 'Contact', href: '#contact' }
  ];

  const programs = [
    { name: 'Elementary (K-5)', href: '#' },
    { name: 'Middle School (6-8)', href: '#' },
    { name: 'High School (9-12)', href: '#' },
    { name: 'STEM Programs', href: '#' },
    { name: 'Arts & Music', href: '#' },
    { name: 'Sports Programs', href: '#' }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', name: 'Twitter' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', name: 'Instagram' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', name: 'LinkedIn' },
    { icon: <Youtube className="h-5 w-5" />, href: '#', name: 'YouTube' }
  ];

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-orange-400" />
              <Typography
                variant="h5"
                className="font-bold text-white"
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                LSL School
              </Typography>
            </div>
            <Typography
              className="text-blue-100 mb-6 leading-relaxed"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Nurturing young minds through innovative education, fostering creativity, 
              critical thinking, and character development for over 25 years.
            </Typography>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-blue-800 rounded-lg hover:bg-orange-500 transition-colors duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-white"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Quick Links
            </Typography>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-blue-100 hover:text-orange-300 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-white"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Our Programs
            </Typography>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program.name}>
                  <a
                    href={program.href}
                    className="text-blue-100 hover:text-orange-300 transition-colors duration-200"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-white"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Contact Info
            </Typography>
            <div className="space-y-3 text-blue-100">
              <div>
                <Typography
                  className="font-medium text-white mb-1"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  Address
                </Typography>
                <Typography
                  variant="small"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  123 Education Lane<br />
                  LSL School, CA 90210
                </Typography>
              </div>
              
              <div>
                <Typography
                  className="font-medium text-white mb-1"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  Phone
                </Typography>
                <Typography
                  variant="small"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  +1 (555) 123-4567
                </Typography>
              </div>
              
              <div>
                <Typography
                  className="font-medium text-white mb-1"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  Email
                </Typography>
                <Typography
                  variant="small"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  info@LSL School.edu
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-8 border-blue-800" />
        <div className="flex flex-col md:flex-row justify-between items-center">
                      <Typography
              variant="small"
              className="text-blue-100 mb-4 md:mb-0"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              © 2025 LSL School. All rights reserved.
            </Typography>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-100 hover:text-orange-300 transition-colors duration-200 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-orange-300 transition-colors duration-200 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-orange-300 transition-colors duration-200 text-sm">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


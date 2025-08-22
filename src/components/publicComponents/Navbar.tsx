'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from '@material-tailwind/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Programs', href: '#programs' },
  { name: 'Events', href: '#events' },
  { name: 'Student Life', href: '#student-life' },
  { name: 'Admissions', href: '#admissions' },
  { name: 'Contact', href: '#contact' },
];

export default function NavigationBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {navItems.map((item) => (
        <Typography
          key={item.name}
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
          placeholder=""
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <a 
            href={item.href} 
            className="flex items-center hover:text-blue-500 transition-colors duration-200"
          >
            {item.name}
          </a>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar 
      className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-blue-800 dark:bg-blue-900 backdrop-blur-sm border-0 shadow-md"
      placeholder=""
      onResize={() => {}}
      onResizeCapture={() => {}}
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <div className="flex items-center justify-between text-blue-100 dark:text-blue-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-semibold text-xl text-blue-200 dark:text-blue-100 font-sans"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            LSL School
          </Typography>
        </div>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <ThemeToggle size="sm" />
          <Button
            variant="gradient"
            size="sm"
            className="hidden text-blue-100 lg:inline-block bg-gradient-to-r from-blue-600 to-blue-700"
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => router.push('/sign-in')}
          >
            Log in
          </Button>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder=""
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {openNav ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
                        <Button
                  variant="gradient"
                  size="sm"
                  fullWidth
                  className="mb-2 bg-gradient-to-r from-blue-600 to-blue-700"
                  placeholder=""
                  onResize={() => {}}
                  onResizeCapture={() => {}}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                  onClick={() => router.push('/sign-up')}
                >
                  Apply Now
                </Button>
      </Collapse>
    </Navbar>
  );
}


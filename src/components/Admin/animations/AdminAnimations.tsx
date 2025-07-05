
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for consistent motion across the admin dashboard
export const adminAnimations = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Sidebar animations
  sidebarSlide: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  // Card animations
  cardHover: {
    whileHover: { 
      scale: 1.02, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
    },
    transition: { duration: 0.2 }
  },

  // Stats card animations
  statsCard: {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  // Stagger container for multiple items
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },

  // Tab transitions
  tabContent: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },

  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 }
  },

  // Button press animation
  buttonPress: {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
    transition: { duration: 0.1 }
  },

  // Floating action button
  fab: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// Reusable animated components
export const AnimatedCard = motion.div;
export const AnimatedContainer = motion.div;
export const AnimatedButton = motion.button;

// Page wrapper with consistent animations
interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

// Stagger animation wrapper
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={adminAnimations.staggerContainer}
    initial="initial"
    animate="animate"
  >
    {children}
  </motion.div>
);

// Individual stagger item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = "" }) => (
  <motion.div
    className={className}
    variants={adminAnimations.staggerItem}
  >
    {children}
  </motion.div>
);

// Animated presence wrapper for tab content
interface AnimatedTabContentProps {
  children: React.ReactNode;
  key: string;
}

export const AnimatedTabContent: React.FC<AnimatedTabContentProps> = ({ children, key }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={key}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

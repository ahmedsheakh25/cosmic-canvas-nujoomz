
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Play, X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface InteractiveGuidedTourProps {
  user: User;
}

const tourSteps: TourStep[] = [
  {
    id: 'overview',
    title: 'Welcome to Enhanced Admin Dashboard',
    description: 'This dashboard provides comprehensive tools for managing your OfSpace Studio operations.',
    target: '[data-tour="overview"]',
    position: 'bottom'
  },
  {
    id: 'project-briefs',
    title: 'Project Briefs Management',
    description: 'View, manage, and track all client project briefs in one place.',
    target: '[data-tour="briefs"]',
    position: 'bottom'
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    description: 'Monitor feature usage and user interactions in real-time.',
    target: '[data-tour="analytics"]',
    position: 'left'
  },
  {
    id: 'team',
    title: 'Team Management',
    description: 'Manage team members and assign tasks efficiently.',
    target: '[data-tour="team"]',
    position: 'bottom'
  },
  {
    id: 'settings',
    title: 'Feature Management',
    description: 'Toggle features, manage personas, and customize the experience.',
    target: '[data-tour="settings"]',
    position: 'top'
  }
];

const InteractiveGuidedTour: React.FC<InteractiveGuidedTourProps> = ({ user }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [tourPosition, setTourPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    checkTourCompletion();
  }, [user.id]);

  useEffect(() => {
    if (isActive) {
      updateTourPosition();
      window.addEventListener('resize', updateTourPosition);
      return () => window.removeEventListener('resize', updateTourPosition);
    }
  }, [isActive, currentStep]);

  const checkTourCompletion = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_tour_completion')
        .select('*')
        .eq('user_id', user.id)
        .eq('tour_type', 'admin_onboarding')
        .single();

      if (!error && data) {
        setHasCompletedTour(true);
      }
    } catch (error) {
      // User hasn't completed the tour yet
      setHasCompletedTour(false);
    }
  };

  const updateTourPosition = () => {
    const currentTourStep = tourSteps[currentStep];
    const targetElement = document.querySelector(currentTourStep.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let x = rect.left + scrollLeft;
      let y = rect.top + scrollTop;

      // Adjust position based on the desired position
      switch (currentTourStep.position) {
        case 'top':
          x += rect.width / 2;
          y -= 10;
          break;
        case 'bottom':
          x += rect.width / 2;
          y += rect.height + 10;
          break;
        case 'left':
          x -= 10;
          y += rect.height / 2;
          break;
        case 'right':
          x += rect.width + 10;
          y += rect.height / 2;
          break;
      }

      setTourPosition({ x, y });
    }
  };

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    updateTourPosition();
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = async () => {
    try {
      const { error } = await supabase
        .from('admin_tour_completion')
        .insert({
          user_id: user.id,
          tour_type: 'admin_onboarding'
        });

      if (error) throw error;

      setHasCompletedTour(true);
      setIsActive(false);
      toast.success('Tour completed! Welcome to the admin dashboard.');
    } catch (error) {
      console.error('Error completing tour:', error);
      toast.error('Failed to save tour completion');
    }
  };

  const skipTour = () => {
    setIsActive(false);
    completeTour();
  };

  if (!isActive) {
    return (
      <div className="flex items-center gap-2">
        {!hasCompletedTour && (
          <Badge variant="secondary" className="animate-pulse">
            New
          </Badge>
        )}
        <Button
          onClick={startTour}
          variant={hasCompletedTour ? "outline" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {hasCompletedTour ? 'Replay Tour' : 'Start Tour'}
        </Button>
      </div>
    );
  }

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Tour Card */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-50 w-80"
          style={{
            left: `${tourPosition.x}px`,
            top: `${tourPosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Card className="shadow-lg border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">
                  Step {currentStep + 1} of {tourSteps.length}
                </Badge>
                <Button
                  onClick={skipTour}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">
                {currentTourStep.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {currentTourStep.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                
                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  onClick={nextStep}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default InteractiveGuidedTour;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  confidence: number;
  estimatedTime: string;
  tags: string[];
}

interface EnhancedServiceSuggestionsProps {
  suggestions: ServiceSuggestion[];
  currentLanguage: 'en' | 'ar';
  onAcceptSuggestion: (suggestionId: string) => void;
  onRejectSuggestion: (suggestionId: string) => void;
  onViewDetails: (suggestionId: string) => void;
  isVisible?: boolean;
}

const EnhancedServiceSuggestions: React.FC<EnhancedServiceSuggestionsProps> = ({
  suggestions,
  currentLanguage,
  onAcceptSuggestion,
  onRejectSuggestion,
  onViewDetails,
  isVisible = true
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardExpand = (suggestionId: string) => {
    setExpandedCard(expandedCard === suggestionId ? null : suggestionId);
  };

  if (!suggestions.length || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 space-y-4"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold text-lg">
          {currentLanguage === 'ar' ? 'اقتراحات الخدمات' : 'Service Suggestions'}
        </h3>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: currentLanguage === 'ar' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentLanguage === 'ar' ? -20 : 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCard === suggestion.id 
                    ? 'shadow-lg border-green-200 dark:border-green-800' 
                    : 'shadow-sm hover:shadow-md'
                }`}
              >
                {/* Card Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleCardExpand(suggestion.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Service Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-2xl flex-shrink-0">
                      {suggestion.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-base truncate">
                          {suggestion.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Sparkles className="w-3 h-3" />
                          <span>{Math.round(suggestion.confidence * 100)}%</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {suggestion.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {suggestion.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {suggestion.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{suggestion.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Estimated Time */}
                      <div className="text-xs text-gray-500">
                        {currentLanguage === 'ar' ? 'المدة المقدرة:' : 'Est. time:'} {suggestion.estimatedTime}
                      </div>
                    </div>

                    {/* Expand Arrow */}
                    <motion.div
                      animate={{ rotate: expandedCard === suggestion.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedCard === suggestion.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="p-4 space-y-4">
                        {/* All Tags */}
                        <div>
                          <h5 className="text-sm font-medium mb-2">
                            {currentLanguage === 'ar' ? 'المميزات:' : 'Features:'}
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => onAcceptSuggestion(suggestion.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {currentLanguage === 'ar' ? 'اختيار' : 'Accept'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewDetails(suggestion.id)}
                          >
                            {currentLanguage === 'ar' ? 'التفاصيل' : 'Details'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRejectSuggestion(suggestion.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedServiceSuggestions;

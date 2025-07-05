
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Lightbulb, 
  Mic, 
  Volume2, 
  FileText, 
  Sparkles,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { useTaskDistribution } from '@/hooks/useTaskDistribution';
import { useServiceSuggestions } from '@/hooks/useServiceSuggestions';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface AdvancedFeaturesPanelProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
  projectBriefId?: string;
  conversationHistory: any[];
}

const AdvancedFeaturesPanel: React.FC<AdvancedFeaturesPanelProps> = ({
  sessionId,
  currentLanguage,
  projectBriefId,
  conversationHistory
}) => {
  const [activeTab, setActiveTab] = useState<'sentiment' | 'tasks' | 'suggestions' | 'voice'>('sentiment');
  
  const { currentSentiment, getSentimentColor } = useSentimentAnalysis(sessionId);
  const { tasks, isDistributing, distributeTasksAutomatically } = useTaskDistribution();
  const { suggestions, isGenerating, generateServiceSuggestions } = useServiceSuggestions(sessionId);
  const { isListening, lastCommand, startVoiceCommandListening } = useVoiceCommands(sessionId, currentLanguage);

  const isRTL = currentLanguage === 'ar';

  const tabs = [
    { 
      id: 'sentiment', 
      label: currentLanguage === 'ar' ? 'تحليل المشاعر' : 'Sentiment Analysis',
      icon: Brain,
      color: 'text-blue-600'
    },
    { 
      id: 'tasks', 
      label: currentLanguage === 'ar' ? 'توزيع المهام' : 'Task Distribution',
      icon: Users,
      color: 'text-green-600'
    },
    { 
      id: 'suggestions', 
      label: currentLanguage === 'ar' ? 'اقتراح الخدمات' : 'Service Suggestions',
      icon: Lightbulb,
      color: 'text-yellow-600'
    },
    { 
      id: 'voice', 
      label: currentLanguage === 'ar' ? 'الأوامر الصوتية' : 'Voice Commands',
      icon: Mic,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 ${isRTL ? 'arabic-text' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-nujmooz-primary/10 to-nujmooz-primary/5 rounded-lg">
          <Sparkles className="w-5 h-5 text-nujmooz-primary" />
        </div>
        <h3 className="font-semibold text-gray-800 mixed-text">
          {currentLanguage === 'ar' ? 'الميزات المتقدمة' : 'Advanced Features'}
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${activeTab === tab.id ? 'bg-nujmooz-primary text-white' : 'hover:bg-gray-50'} transition-colors`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="mixed-text">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'sentiment' && (
          <motion.div
            key="sentiment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'حالة المشاعر الحالية' : 'Current Sentiment State'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className={getSentimentColor(currentSentiment.sentiment)}>
                      {currentLanguage === 'ar' 
                        ? (currentSentiment.sentiment === 'positive' ? 'إيجابي' : 
                           currentSentiment.sentiment === 'negative' ? 'سلبي' : 'محايد')
                        : currentSentiment.sentiment
                      }
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1 mixed-text">
                      {currentLanguage === 'ar' ? 'النقاط:' : 'Score:'} {(currentSentiment.score * 100).toFixed(0)}%
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${getSentimentColor(currentSentiment.sentiment)}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'توزيع المهام التلقائي' : 'Automatic Task Distribution'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectBriefId && (
                    <Button
                      onClick={() => distributeTasksAutomatically(projectBriefId)}
                      disabled={isDistributing}
                      className="w-full"
                    >
                      {isDistributing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="mixed-text">
                            {currentLanguage === 'ar' ? 'توزيع المهام...' : 'Distributing tasks...'}
                          </span>
                        </div>
                      ) : (
                        <span className="mixed-text">
                          {currentLanguage === 'ar' ? 'توزيع المهام تلقائياً' : 'Distribute Tasks Automatically'}
                        </span>
                      )}
                    </Button>
                  )}
                  
                  {tasks.length > 0 && (
                    <div className="text-sm text-gray-600 mixed-text">
                      {currentLanguage === 'ar' ? 'المهام المتاحة:' : 'Available Tasks:'} {tasks.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'suggestions' && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'اقتراحات الخدمات الذكية' : 'Smart Service Suggestions'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => generateServiceSuggestions(conversationHistory)}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="mixed-text">
                          {currentLanguage === 'ar' ? 'تحليل وإنشاء اقتراحات...' : 'Analyzing & generating suggestions...'}
                        </span>
                      </div>
                    ) : (
                      <span className="mixed-text">
                        {currentLanguage === 'ar' ? 'إنشاء اقتراحات ذكية' : 'Generate Smart Suggestions'}
                      </span>
                    )}
                  </Button>
                  
                  {suggestions.length > 0 && (
                    <div className="text-sm text-gray-600 mixed-text">
                      {currentLanguage === 'ar' ? 'الاقتراحات المتاحة:' : 'Available Suggestions:'} {suggestions.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'voice' && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'التحكم الصوتي المتقدم' : 'Advanced Voice Control'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={startVoiceCommandListening}
                    disabled={isListening}
                    variant={isListening ? "destructive" : "outline"}
                    className="w-full"
                  >
                    {isListening ? (
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 animate-pulse" />
                        <span className="mixed-text">
                          {currentLanguage === 'ar' ? 'أستمع للأوامر...' : 'Listening for commands...'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        <span className="mixed-text">
                          {currentLanguage === 'ar' ? 'ابدأ التحكم الصوتي' : 'Start Voice Control'}
                        </span>
                      </div>
                    )}
                  </Button>
                  
                  {lastCommand && (
                    <div className="text-sm text-gray-600 mixed-text">
                      {currentLanguage === 'ar' ? 'آخر أمر:' : 'Last command:'} "{lastCommand.command}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFeaturesPanel;

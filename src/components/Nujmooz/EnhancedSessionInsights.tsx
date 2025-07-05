
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Clock, MessageCircle, Target, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SessionInsightsProps {
  insights: {
    conversationLength: number;
    averageMessageLength: number;
    languageConsistency: number;
    topicProgression: Array<{ topic: string; mentions: number }>;
    engagementLevel: number;
    userPersonality: {
      communicationStyle: string;
      preferredTopics: string[];
      responsePattern: {
        quickResponder: boolean;
        detailOriented: boolean;
        questionAsker: boolean;
      };
    };
    projectReadiness: number;
    nextBestActions: string[];
  };
  currentLanguage: 'en' | 'ar';
}

const EnhancedSessionInsights: React.FC<SessionInsightsProps> = ({ insights, currentLanguage }) => {
  const isArabic = currentLanguage === 'ar';

  const getEngagementColor = (level: number) => {
    if (level > 0.7) return 'text-green-500';
    if (level > 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness > 0.8) return 'from-green-500 to-green-600';
    if (readiness > 0.5) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Conversation Overview */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <MessageCircle className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'نظرة عامة على المحادثة' : 'Conversation Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                {isArabic ? 'الرسائل:' : 'Messages:'}
              </span>
              <span className="text-[#7EF5A5] font-bold">{insights.conversationLength}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                {isArabic ? 'متوسط الطول:' : 'Avg Length:'}
              </span>
              <span className="text-white">{Math.round(insights.averageMessageLength)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">
                {isArabic ? 'اتساق اللغة:' : 'Language Consistency:'}
              </span>
              <span className="text-[#4AE374]">{insights.languageConsistency}%</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Engagement Level */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <TrendingUp className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'مستوى التفاعل' : 'Engagement Level'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold ${getEngagementColor(insights.engagementLevel)}`}>
                {Math.round(insights.engagementLevel * 100)}%
              </div>
              <Progress 
                value={insights.engagementLevel * 100} 
                className="mt-2 h-2"
              />
            </div>
            <div className="text-center text-white/60 text-xs">
              {insights.engagementLevel > 0.7 
                ? (isArabic ? 'تفاعل عالي!' : 'High Engagement!')
                : insights.engagementLevel > 0.4 
                ? (isArabic ? 'تفاعل متوسط' : 'Moderate Engagement')
                : (isArabic ? 'يحتاج تحسين' : 'Needs Improvement')
              }
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* User Personality */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Brain className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'شخصية المستخدم' : 'User Personality'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4AE374] rounded-full"></div>
              <span className="text-white/70 text-xs">
                {isArabic ? 'الأسلوب:' : 'Style:'} {insights.userPersonality.communicationStyle}
              </span>
            </div>
            {insights.userPersonality.responsePattern.quickResponder && (
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-[#7EF5A5]" />
                <span className="text-white/70 text-xs">
                  {isArabic ? 'مجيب سريع' : 'Quick Responder'}
                </span>
              </div>
            )}
            {insights.userPersonality.responsePattern.detailOriented && (
              <div className="flex items-center space-x-2">
                <Target className="h-3 w-3 text-[#7EF5A5]" />
                <span className="text-white/70 text-xs">
                  {isArabic ? 'يحب التفاصيل' : 'Detail Oriented'}
                </span>
              </div>
            )}
            {insights.userPersonality.responsePattern.questionAsker && (
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-3 w-3 text-[#7EF5A5]" />
                <span className="text-white/70 text-xs">
                  {isArabic ? 'كثير الأسئلة' : 'Question Asker'}
                </span>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Project Readiness */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10 md:col-span-2">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Target className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'جاهزية المشروع' : 'Project Readiness'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`text-2xl font-bold bg-gradient-to-r ${getReadinessColor(insights.projectReadiness)} bg-clip-text text-transparent`}>
                {Math.round(insights.projectReadiness * 100)}%
              </div>
              <Progress 
                value={insights.projectReadiness * 100} 
                className="flex-1 h-3"
              />
            </div>
            <div className="text-white/60 text-xs text-center">
              {insights.projectReadiness > 0.8 
                ? (isArabic ? 'جاهز للتنفيذ!' : 'Ready for execution!')
                : insights.projectReadiness > 0.5 
                ? (isArabic ? 'يحتاج المزيد من التفاصيل' : 'Needs more details')
                : (isArabic ? 'في مرحلة الاستكشاف' : 'In exploration phase')
              }
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Next Best Actions */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Lightbulb className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'الخطوات المقترحة' : 'Next Best Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {insights.nextBestActions.length > 0 ? (
              insights.nextBestActions.map((action, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-1.5 h-1.5 bg-[#7EF5A5] rounded-full"></div>
                  <span className="text-white text-xs">{action}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-white/60 text-xs text-center py-4">
                {isArabic ? 'لا توجد إجراءات مقترحة حالياً' : 'No suggested actions currently'}
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Topic Progression */}
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-white/10 md:col-span-3">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <TrendingUp className="h-5 w-5 text-[#7EF5A5] mr-2" />
          <CardTitle className="text-white text-sm">
            {isArabic ? 'تطور المواضيع' : 'Topic Progression'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            {insights.topicProgression.map((topic, index) => (
              <motion.div
                key={topic.topic}
                className="text-center p-3 bg-white/5 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="text-[#7EF5A5] text-lg font-bold">{topic.mentions}</div>
                <div className="text-white/60 text-xs capitalize">
                  {topic.topic.replace('_', ' ')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedSessionInsights;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FormattedSection {
  type: 'heading' | 'subheading' | 'list' | 'text' | 'table' | 'badge' | 'separator';
  content: string | string[] | TableData;
  level?: number;
  style?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface EnhancedResponseFormatterProps {
  content: string;
  language: 'en' | 'ar';
  responseType?: 'professional' | 'creative' | 'technical' | 'casual';
}

const EnhancedResponseFormatter: React.FC<EnhancedResponseFormatterProps> = ({
  content,
  language,
  responseType = 'professional'
}) => {
  const isRTL = language === 'ar';

  const parseContent = (text: string): FormattedSection[] => {
    const lines = text.split('\n');
    const sections: FormattedSection[] = [];
    let currentList: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (currentList.length > 0) {
          sections.push({ type: 'list', content: currentList });
          currentList = [];
        }
        continue;
      }
      
      // Main headings (##)
      if (line.startsWith('## ')) {
        if (currentList.length > 0) {
          sections.push({ type: 'list', content: currentList });
          currentList = [];
        }
        sections.push({
          type: 'heading',
          content: line.replace('## ', ''),
          level: 2
        });
      }
      // Sub headings (###)
      else if (line.startsWith('### ')) {
        if (currentList.length > 0) {
          sections.push({ type: 'list', content: currentList });
          currentList = [];
        }
        sections.push({
          type: 'subheading',
          content: line.replace('### ', ''),
          level: 3
        });
      }
      // Bold headings (**text**)
      else if (line.match(/^\*\*.*\*\*:?$/)) {
        if (currentList.length > 0) {
          sections.push({ type: 'list', content: currentList });
          currentList = [];
        }
        sections.push({
          type: 'subheading',
          content: line.replace(/\*\*/g, '').replace(':', ''),
          level: 4
        });
      }
      // List items (• or -)
      else if (line.startsWith('• ') || line.startsWith('- ')) {
        currentList.push(line.replace(/^[•-] /, ''));
      }
      // Numbered lists
      else if (line.match(/^\d+\. /)) {
        currentList.push(line);
      }
      // Regular text
      else {
        if (currentList.length > 0) {
          sections.push({ type: 'list', content: currentList });
          currentList = [];
        }
        sections.push({ type: 'text', content: line });
      }
    }
    
    // Add remaining list items
    if (currentList.length > 0) {
      sections.push({ type: 'list', content: currentList });
    }
    
    return sections;
  };

  const renderSection = (section: FormattedSection, index: number) => {
    const textAlign = isRTL ? 'text-right' : 'text-left';
    const direction = isRTL ? 'rtl' : 'ltr';

    switch (section.type) {
      case 'heading':
        return (
          <div key={index} className={`mb-4 ${textAlign}`} dir={direction}>
            <h2 className="text-xl font-bold text-nujmooz-text-primary mb-2 mixed-text">
              {section.content as string}
            </h2>
            <Separator className="bg-nujmooz-border" />
          </div>
        );
      
      case 'subheading':
        const headingSize = section.level === 3 ? 'text-lg' : 'text-base';
        return (
          <h3 key={index} className={`${headingSize} font-semibold text-nujmooz-text-secondary mb-3 mt-4 ${textAlign} mixed-text`} dir={direction}>
            {section.content as string}
          </h3>
        );
      
      case 'list':
        return (
          <ul key={index} className={`space-y-2 mb-4 ${isRTL ? 'pr-4' : 'pl-4'}`} dir={direction}>
            {(section.content as string[]).map((item, itemIndex) => (
              <li key={itemIndex} className={`flex items-start gap-2 ${textAlign}`}>
                <span className="text-nujmooz-primary mt-1 text-sm">
                  {item.match(/^\d+\./) ? '' : '•'}
                </span>
                <span className="text-nujmooz-text-primary leading-relaxed mixed-text flex-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        );
      
      case 'text':
        return (
          <p key={index} className={`text-nujmooz-text-primary leading-relaxed mb-3 ${textAlign} mixed-text`} dir={direction}>
            {section.content as string}
          </p>
        );
      
      case 'separator':
        return <Separator key={index} className="my-4 bg-nujmooz-border" />;
      
      default:
        return null;
    }
  };

  const sections = parseContent(content);
  
  const getCardStyle = () => {
    switch (responseType) {
      case 'professional':
        return 'border-l-4 border-l-blue-500';
      case 'creative':
        return 'border-l-4 border-l-purple-500';
      case 'technical':
        return 'border-l-4 border-l-green-500';
      case 'casual':
        return 'border-l-4 border-l-orange-500';
      default:
        return 'border-l-4 border-l-nujmooz-primary';
    }
  };

  return (
    <Card className={`p-6 bg-nujmooz-surface border border-nujmooz-border backdrop-blur-xl ${getCardStyle()}`}>
      <div className="space-y-2">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
      
      {/* Response Type Badge */}
      <div className={`mt-4 pt-4 border-t border-nujmooz-border ${isRTL ? 'text-left' : 'text-right'}`}>
        <Badge variant="secondary" className="text-xs">
          {responseType === 'professional' && (language === 'ar' ? 'مهني' : 'Professional')}
          {responseType === 'creative' && (language === 'ar' ? 'إبداعي' : 'Creative')}
          {responseType === 'technical' && (language === 'ar' ? 'تقني' : 'Technical')}
          {responseType === 'casual' && (language === 'ar' ? 'ودود' : 'Casual')}
        </Badge>
      </div>
    </Card>
  );
};

export default EnhancedResponseFormatter;

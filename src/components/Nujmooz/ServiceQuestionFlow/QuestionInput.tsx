import React from 'react';
import { QuestionInputProps } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function QuestionInput({
  question,
  value,
  onChange,
  language,
  disabled
}: QuestionInputProps) {
  switch (question.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label>{question.text[language]}</Label>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={language === 'ar' ? 'اكتب إجابتك هنا' : 'Type your answer here'}
            className={language === 'ar' ? 'text-right' : 'text-left'}
          />
        </div>
      );

    case 'choice':
      return (
        <div className="space-y-2">
          <Label>{question.text[language]}</Label>
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                language === 'ar' ? 'اختر إجابة' : 'Select an answer'
              } />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'multiChoice':
      return (
        <div className="space-y-4">
          <Label>{question.text[language]}</Label>
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = new Set(value || []);
                    if (checked) {
                      newValue.add(option.value);
                    } else {
                      newValue.delete(option.value);
                    }
                    onChange(Array.from(newValue));
                  }}
                  disabled={disabled}
                />
                <Label htmlFor={option.value}>
                  {option.label[language]}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'scale':
      return (
        <div className="space-y-4">
          <Label>{question.text[language]}</Label>
          <Slider
            value={[value || 0]}
            onValueChange={([newValue]) => onChange(newValue)}
            min={question.validation?.min || 0}
            max={question.validation?.max || 10}
            step={1}
            disabled={disabled}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{question.validation?.min || 0}</span>
            <span>{question.validation?.max || 10}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
} 
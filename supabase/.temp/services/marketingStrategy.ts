import { Service } from './types';

export const marketingStrategy: Service = {
  label: {
    en: "Marketing Strategy",
    ar: "استراتيجية التسويق"
  },
  description: {
    en: "Strategic planning including audience analysis, campaign goals, and budget allocation.",
    ar: "تخطيط استراتيجي يشمل تحليل الجمهور، أهداف الحملة، وتوزيع الميزانية."
  },
  tags: ["marketing-strategy", "business", "corporate", "global-market", "niche-community"],
  tone: "professional",
  subServices: {
    campaign_planning: {
      label: { en: "Campaign Planning", ar: "تخطيط الحملة" },
      questions: [
        {
          key: "campaign_goal",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Brand Awareness", ar: "رفع الوعي" },
            { en: "Lead Generation", ar: "جذب عملاء محتملين" },
            { en: "Sales Increase", ar: "زيادة مبيعات" },
            { en: "Product Launch", ar: "إطلاق منتج" },
            { en: "Event Promotion", ar: "ترويج فعالية" }
          ],
          label: {
            en: "What's the main goal of your campaign?",
            ar: "وش الهدف الرئيسي من حملتك؟"
          }
        },
        {
          key: "target_market",
          type: "text" as const,
          required: true,
          label: {
            en: "Describe your ideal target market",
            ar: "اوصف السوق المستهدف حقك"
          }
        },
        {
          key: "budget_range",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Less than 10,000 SAR", ar: "أقل من ١٠,٠٠٠ ريال" },
            { en: "10,000 – 50,000 SAR", ar: "١٠ - ٥٠ ألف" },
            { en: "50,000 – 100,000 SAR", ar: "٥٠ - ١٠٠ ألف" },
            { en: "Above 100,000 SAR", ar: "أكثر من ١٠٠ ألف" },
            { en: "Not Sure", ar: "مو متأكد" }
          ],
          label: {
            en: "What's your estimated campaign budget?",
            ar: "وش الميزانية اللي حاطها للحملة؟"
          }
        },
        {
          key: "campaign_duration",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "1 Month", ar: "شهر" },
            { en: "3 Months", ar: "٣ شهور" },
            { en: "6 Months", ar: "٦ شهور" },
            { en: "1 Year", ar: "سنة" },
            { en: "Ongoing", ar: "مستمرة" }
          ],
          label: {
            en: "For how long will the campaign run?",
            ar: "مدة الحملة تقريبيًا؟"
          }
        }
      ]
    },
    audience_analysis: {
      label: { en: "Audience Analysis", ar: "تحليل الجمهور" },
      questions: [
        {
          key: "current_customers",
          type: "text" as const,
          required: false,
          label: {
            en: "Describe your current customer base",
            ar: "عملاءك الحاليين كيف توصفهم؟"
          }
        },
        {
          key: "demographics",
          type: "text" as const,
          required: true,
          label: {
            en: "Who are your target audience? (age, gender, location)",
            ar: "الفئة المستهدفة: العمر، الجنس، المنطقة؟"
          }
        },
        {
          key: "customer_pain_points",
          type: "text" as const,
          required: true,
          label: {
            en: "What are the problems your audience faces that you solve?",
            ar: "وش المشاكل أو الاحتياجات اللي تحلّها؟"
          }
        },
        {
          key: "buying_behavior",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Impulse Shoppers", ar: "يشترون بعفوية" },
            { en: "Research Before Buying", ar: "يبحث قبل الشراء" },
            { en: "Price Sensitive", ar: "يهتم بالسعر" },
            { en: "Brand Loyal", ar: "يحب علامة معيّنة" },
            { en: "Quality First", ar: "يركز على الجودة" }
          ],
          label: {
            en: "What describes their buying style best?",
            ar: "كيف غالبًا يتخذون قرار الشراء؟"
          }
        }
      ]
    },
    budget_allocation: {
      label: { en: "Budget Allocation", ar: "توزيع الميزانية" },
      questions: [
        {
          key: "channels_interest",
          type: "multi-choice" as const,
          multiple: true,
          required: true,
          options: [
            { en: "Instagram / Facebook Ads", ar: "إعلانات إنستقرام / فيسبوك" },
            { en: "Google Ads", ar: "إعلانات جوجل" },
            { en: "Snapchat / TikTok", ar: "سناب أو تيك توك" },
            { en: "Email Campaigns", ar: "حملات إيميل" },
            { en: "Influencer Marketing", ar: "تسويق مع مؤثرين" },
            { en: "Traditional Media", ar: "قنوات تقليدية (راديو/مطبوعات)" }
          ],
          label: {
            en: "Which marketing channels interest you most?",
            ar: "وش القنوات التسويقية اللي تشوفها مناسبة؟"
          }
        },
        {
          key: "priority_channels",
          type: "text" as const,
          required: false,
          label: {
            en: "Any channel you want to prioritize?",
            ar: "في قناة معينة تبي تركز عليها أكثر؟"
          }
        }
      ]
    }
  }
}; 
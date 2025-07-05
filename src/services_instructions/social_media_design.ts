import type { ServiceData } from './types';

export const socialMediaDesignService: ServiceData = {
  label: {
    en: "Social Media Design",
    ar: "تصميم محتوى السوشيال ميديا"
  },
  description: {
    en: "Custom content and templates tailored for various platforms.",
    ar: "تصميم قوالب ومحتوى خاص بمنصات التواصل."
  },
  tags: ["social-media", "marketing-strategy", "copywriting", "modern", "playful", "gen-z", "millennials", "youth"],
  suggestMoodboard: true,
  tone: "friendly",
  subServices: {
    post_templates: {
      label: { en: "Post Templates", ar: "قوالب المنشورات" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      relatedTo: ["brand_adaptation"],
      questions: [
        {
          key: "platforms",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Instagram", ar: "إنستقرام" },
            { en: "X / Twitter", ar: "تويتر / X" },
            { en: "TikTok", ar: "تيك توك" },
            { en: "LinkedIn", ar: "لينكدإن" },
            { en: "Snapchat", ar: "سناب شات" },
            { en: "YouTube", ar: "يوتيوب" },
            { en: "Facebook", ar: "فيسبوك" }
          ],
          label: {
            en: "Which platforms are you active on?",
            ar: "وين تنشر غالبًا؟"
          }
        },
        {
          key: "content_types",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Product Highlights", ar: "عرض منتجات" },
            { en: "Tips / Advice", ar: "نصائح ومحتوى تعليمي" },
            { en: "Quotes", ar: "اقتباسات" },
            { en: "Announcements", ar: "إعلانات أو فعاليات" },
            { en: "Behind The Scenes", ar: "كواليس العمل" }
          ],
          label: {
            en: "What types of content will you post?",
            ar: "وش نوع المحتوى اللي تحب تنزله؟"
          }
        },
        {
          key: "posting_frequency",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Daily", ar: "يوميًا" },
            { en: "2–3 times per week", ar: "مرتين إلى ثلاث أسبوعيًا" },
            { en: "Weekly", ar: "أسبوعيًا" },
            { en: "Occasionally", ar: "بشكل متفرق" }
          ],
          label: {
            en: "How often do you plan to post?",
            ar: "كم مره تنشر في العادة؟"
          }
        }
      ]
    },
    brand_adaptation: {
      label: { en: "Brand Adaptation", ar: "تكييف الهوية" },
      questions: [
        {
          key: "current_brand_assets",
          type: "file",
          fileTypes: ["jpg", "jpeg", "png", "pdf", "ai", "svg"],
          required: false,
          label: {
            en: "Upload your current brand elements (logo/colors/fonts)",
            ar: "حمّل شعارك أو ألوانك المعتمدة (إن وجدت)"
          }
        },
        {
          key: "social_personality",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Fun & Playful", ar: "مرح وعفوي" },
            { en: "Minimal & Clean", ar: "بسيط وواضح" },
            { en: "Trendy & Modern", ar: "ترندي وعصري" },
            { en: "Professional & Sleek", ar: "احترافي وأنيق" }
          ],
          label: {
            en: "How should your brand look on social?",
            ar: "كيف تحب تظهر علامتك على السوشيال؟"
          }
        }
      ]
    },
    social_strategy: {
      label: { en: "Social Media Strategy", ar: "استراتيجية السوشيال" },
      tone: "professional",
      questions: [
        {
          key: "target_audience",
          type: "text",
          required: true,
          label: {
            en: "Who are you trying to reach on social?",
            ar: "مين جمهورك المستهدف؟"
          }
        },
        {
          key: "competitors",
          type: "text",
          required: false,
          label: {
            en: "Any competitors or pages you like?",
            ar: "في حسابات منافسة تحب طريقتها؟"
          }
        },
        {
          key: "social_goals",
          type: "multi-choice",
          required: true,
          multiple: true,
          options: [
            { en: "Brand Awareness", ar: "رفع الوعي بالعلامة" },
            { en: "Engagement", ar: "تفاعل ومتابعة" },
            { en: "Sales / Conversions", ar: "مبيعات أو طلبات" },
            { en: "Community Building", ar: "بناء مجتمع" }
          ],
          label: {
            en: "What are your goals with social media?",
            ar: "وش تبغى تحقق من وجودك الرقمي؟"
          }
        }
      ]
    }
  }
};
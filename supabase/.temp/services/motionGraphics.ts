import { Service } from './types';

export const motionGraphics: Service = {
  label: {
    en: "Motion Graphics",
    ar: "الموشن جرافيك"
  },
  description: {
    en: "Animated video services including intros, logo animation, and social media clips.",
    ar: "خدمات فيديو متحرك تشمل تعريفي، شعارات متحركة، ومقاطع سوشيال."
  },
  tags: ["motion-graphics", "social-media", "modern", "futuristic", "playful", "creative"],
  tone: "creative",
  subServices: {
    intro_video: {
      label: { en: "Intro Video", ar: "فيديو تعريفي" },
      questions: [
        {
          key: "video_duration",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "30 seconds", ar: "٣٠ ثانية" },
            { en: "1 minute", ar: "دقيقة واحدة" },
            { en: "2 minutes", ar: "دقيقتين" },
            { en: "3+ minutes", ar: "٣ دقائق أو أكثر" }
          ],
          label: {
            en: "Roughly, how long should the video be?",
            ar: "كم المدة التقريبية للفيديو؟"
          }
        },
        {
          key: "video_style",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "2D Animation", ar: "رسوم 2D" },
            { en: "3D Animation", ar: "رسوم 3D" },
            { en: "Typography Animation", ar: "تحريك نصوص" },
            { en: "Mixed Media", ar: "وسائط مختلطة" }
          ],
          label: {
            en: "Preferred animation style?",
            ar: "وش نوع التحريك اللي تحبه؟"
          }
        },
        {
          key: "key_messages",
          type: "text" as const,
          required: true,
          label: {
            en: "What main message(s) should the video deliver?",
            ar: "إيش الرسائل الأساسية اللي تبغى الفيديو يوصلها؟"
          }
        },
        {
          key: "voiceover_needed",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Yes – Arabic", ar: "نعم - عربي" },
            { en: "Yes – English", ar: "نعم - إنجليزي" },
            { en: "Yes – Both", ar: "نعم - الإثنين" },
            { en: "No Voiceover", ar: "بدون تعليق صوتي" }
          ],
          label: {
            en: "Do you need voiceover narration?",
            ar: "تحتاج تعليق صوتي داخل الفيديو؟"
          }
        }
      ]
    },
    social_video: {
      label: { en: "Social Media Videos", ar: "فيديوهات للسوشيال ميديا" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      questions: [
        {
          key: "video_format",
          type: "multi-choice" as const,
          multiple: true,
          required: true,
          options: [
            { en: "Square (1:1)", ar: "مربع (١:١)" },
            { en: "Vertical (9:16)", ar: "عمودي (٩:١٦)" },
            { en: "Horizontal (16:9)", ar: "أفقي (١٦:٩)" }
          ],
          label: {
            en: "What formats do you need?",
            ar: "وش صيغة العرض اللي تناسب منصاتك؟"
          }
        },
        {
          key: "video_purpose",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Product Promotion", ar: "ترويج منتج" },
            { en: "Brand Awareness", ar: "رفع الوعي" },
            { en: "Educational Content", ar: "توعية وتعليم" },
            { en: "Event Highlight", ar: "ترويج لفعالية" },
            { en: "Behind The Scenes", ar: "مشاهد من الكواليس" }
          ],
          label: {
            en: "What's the goal of these videos?",
            ar: "وش هدفك من الفيديوهات؟"
          }
        }
      ]
    },
    logo_animation: {
      label: { en: "Logo Animation", ar: "تحريك الشعار" },
      questions: [
        {
          key: "logo_file",
          type: "file" as const,
          required: true,
          fileTypes: ["ai", "svg", "pdf", "png", "eps"],
          label: {
            en: "Upload your logo (preferably vector)",
            ar: "حمّل الشعار (يفضل بصيغة فيكتور)"
          }
        },
        {
          key: "animation_style",
          type: "multi-choice" as const,
          required: true,
          options: [
            { en: "Simple Reveal", ar: "ظهور بسيط" },
            { en: "Dynamic Entrance", ar: "دخول ديناميكي" },
            { en: "Particle Effects", ar: "تأثيرات جزئية" },
            { en: "3D Transformation", ar: "تحويل ثلاثي الأبعاد" }
          ],
          label: {
            en: "What animation style do you like?",
            ar: "تحب نحرّك الشعار بأي طريقة؟"
          }
        },
        {
          key: "usage_purpose",
          type: "multi-choice" as const,
          multiple: true,
          required: true,
          options: [
            { en: "Intro/Outro for videos", ar: "بداية أو نهاية فيديوهات" },
            { en: "Social Media Clips", ar: "محتوى سوشيال ميديا" },
            { en: "Website or App", ar: "الموقع أو التطبيق" },
            { en: "Presentations", ar: "عروض تقديمية" }
          ],
          label: {
            en: "Where will you use the animated logo?",
            ar: "وين ناوي تستخدم الشعار المتحرك؟"
          }
        }
      ]
    }
  }
}; 
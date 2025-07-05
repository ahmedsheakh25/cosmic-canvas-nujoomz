import type { ServiceData } from './types';

export const brandingIdentityService: ServiceData = {
  label: {
    en: "Branding / Visual Identity",
    ar: "تصميم الهوية البصرية"
  },
  description: {
    en: "Complete identity design including logo, guidelines, business profile, and visual concept.",
    ar: "تصميم شامل يشمل الشعار، دليل الهوية، البروفايل، والمود البصري"
  },
  tags: ["branding", "illustration", "marketing-strategy", "minimal", "modern", "classic", "bold", "luxury", "organic"],
  suggestMoodboard: true,
  suggestPalettes: "huemint",
  tone: "friendly",
  subServices: {
    logo_design: {
      label: { en: "Logo Design", ar: "تصميم الشعار" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      relatedTo: ["brand_guideline", "moodboard_palette"],
      questions: [
        {
          key: "company_name",
          type: "text",
          required: true,
          label: {
            en: "What's your company or brand name?",
            ar: "وش اسم مشروعك أو شركتك؟"
          }
        },
        {
          key: "business_type",
          type: "text",
          required: true,
          label: {
            en: "What's your business about?",
            ar: "وش نوع شغلك أو مجالك؟"
          }
        },
        {
          key: "old_logo",
          type: "file",
          required: false,
          fileTypes: ["jpg", "jpeg", "png", "pdf", "svg"],
          label: {
            en: "Upload your current logo (if any)",
            ar: "إذا عندك شعار حالي، حمله هنا"
          }
        },
        {
          key: "style_reference",
          type: "file",
          required: false,
          fileTypes: ["jpg", "jpeg", "png", "pdf"],
          label: {
            en: "Upload logo styles or examples you like",
            ar: "ارفع أمثلة لشعارات أو ستايلات تعجبك"
          }
        },
        {
          key: "logo_style",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Modern & Minimalist", ar: "مودرن ومبسّط" },
            { en: "Classic & Traditional", ar: "كلاسيكي وتقليدي" },
            { en: "Bold & Creative", ar: "جريء ومميز" },
            { en: "Elegant & Luxury", ar: "راقي وفاخر" },
            { en: "Fun & Playful", ar: "مرح وحيوي" }
          ],
          label: {
            en: "What logo style do you prefer?",
            ar: "تحب الشعار يكون بأي ستايل؟"
          }
        },
        {
          key: "logo_concept",
          type: "text",
          required: false,
          label: {
            en: "Do you have a logo idea or concept in mind?",
            ar: "في فكرة أو مفهوم تبغى تعكسه في الشعار؟"
          }
        },
        {
          key: "color_preference",
          type: "text",
          required: false,
          label: {
            en: "Any color preferences or palettes?",
            ar: "تحب ألوان معيّنة؟ أو نبغى نقترح عليك؟"
          }
        }
      ]
    },
    business_profile: {
      label: { en: "Business Profile", ar: "بروفايل الشركة" },
      questions: [
        {
          key: "current_profile",
          type: "file",
          required: false,
          fileTypes: ["pdf", "doc", "docx", "txt"],
          label: {
            en: "Upload your current company profile (if available)",
            ar: "إذا عندك بروفايل قديم، حمّله هنا"
          }
        },
        {
          key: "profile_purpose",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Investor Presentation", ar: "عرض للمستثمرين" },
            { en: "Client Portfolio", ar: "تعريفي للعملاء" },
            { en: "Partnership Proposals", ar: "مقترحات شراكة" },
            { en: "Marketing Material", ar: "استخدام تسويقي" },
            { en: "General Overview", ar: "نظرة عامة على الشركة" }
          ],
          label: {
            en: "What's the main purpose of your company profile?",
            ar: "وش هدفك الرئيسي من البروفايل؟"
          }
        },
        {
          key: "key_achievements",
          type: "text",
          required: false,
          label: {
            en: "What are your most important achievements?",
            ar: "وش أهم إنجازاتك أو محطاتك اللي تفخر فيها؟"
          }
        },
        {
          key: "target_audience",
          type: "text",
          required: true,
          label: {
            en: "Who's the audience reading this profile?",
            ar: "مين راح يطّلع على البروفايل؟"
          }
        }
      ]
    },
    brand_guideline: {
      label: { en: "Brand Guideline", ar: "دليل الهوية البصرية" },
      questions: [
        {
          key: "guideline_scope",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Basic Guidelines", ar: "نُسخة أساسية" },
            { en: "Comprehensive Manual", ar: "دليل شامل" },
            { en: "Digital Only", ar: "نسخة رقمية فقط" },
            { en: "Print & Digital", ar: "للطباعة والديجيتال" }
          ],
          label: {
            en: "What kind of guideline do you need?",
            ar: "وش نوع دليل الهوية اللي تحتاجه؟"
          }
        },
        {
          key: "brand_elements",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Logo Usage", ar: "طريقة استخدام الشعار" },
            { en: "Color Palette", ar: "لوحة الألوان" },
            { en: "Typography", ar: "الخطوط" },
            { en: "Photography Style", ar: "نمط الصور" },
            { en: "Tone of Voice", ar: "نبرة الصوت" },
            { en: "Social Templates", ar: "قوالب سوشيال" }
          ],
          label: {
            en: "What elements should we include?",
            ar: "وش تبغى نغطي في الدليل؟"
          }
        },
        {
          key: "team_size",
          type: "text",
          required: false,
          label: {
            en: "How many people will use this guideline?",
            ar: "كم شخص تتوقع يستخدم الدليل؟"
          }
        }
      ]
    },
    moodboard_palette: {
      label: { en: "Moodboard & Colors", ar: "المودبورد والألوان" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      questions: [
        {
          key: "brand_personality",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Professional", ar: "مهني" },
            { en: "Creative", ar: "إبداعي" },
            { en: "Friendly", ar: "ودود" },
            { en: "Luxurious", ar: "فاخر" },
            { en: "Energetic", ar: "مليان حركة" },
            { en: "Trustworthy", ar: "موثوق" },
            { en: "Innovative", ar: "مبتكر" }
          ],
          label: {
            en: "How would you describe your brand personality?",
            ar: "علامتك تميل لأي طابع؟"
          }
        },
        {
          key: "inspiration_images",
          type: "file",
          multiple: true,
          required: false,
          fileTypes: ["jpg", "jpeg", "png"],
          label: {
            en: "Upload any moodboard or visual references",
            ar: "ارفع صور أو مراجع تلهمك"
          }
        },
        {
          key: "color_mood",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Warm & Energetic", ar: "دافي ومتحرك" },
            { en: "Cool & Calm", ar: "هادي وأنيق" },
            { en: "Bold & Vibrant", ar: "قوي وزاهي" },
            { en: "Neutral & Elegant", ar: "محايد وراقي" },
            { en: "Dark & Mysterious", ar: "غامق ومثير" }
          ],
          label: {
            en: "What color mood fits your brand?",
            ar: "وش مزاج الألوان اللي تحس يناسب البراند؟"
          }
        }
      ]
    }
  }
};
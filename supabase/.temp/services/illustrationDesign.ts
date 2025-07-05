import { Service } from './types';

export const illustrationDesign: Service = {
  label: {
    en: "Illustration & Character Design",
    ar: "تصميم التوضيحات والشخصيات"
  },
  description: {
    en: "Custom illustrations, infographics, mascots, and character styles.",
    ar: "رسوم توضيحية، إنفوجرافيكس، شخصيات كرتونية أو واقعية."
  },
  tags: ["illustration", "custom-project", "playful", "organic", "cultural"],
  tone: "creative",
  subServices: {
    infographic_design: {
      label: { en: "Infographic Design", ar: "تصميم إنفوجرافيك" },
      questions: [
        {
          key: "infographic_type",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Statistics & Numbers", ar: "إحصائيات وأرقام" },
            { en: "Explainer / Process", ar: "شرح خطوات أو فكرة" },
            { en: "Comparison / Timeline", ar: "مقارنة أو تسلسل زمني" },
            { en: "Mixed Format", ar: "تنسيق مختلط" }
          ],
          label: {
            en: "What type of infographic are you aiming for?",
            ar: "أي نوع من الإنفوجرافيك تبغى نسوي؟"
          }
        },
        {
          key: "content_provided",
          type: "file",
          required: false,
          fileTypes: ["pdf", "doc", "ppt", "txt"],
          label: {
            en: "Upload content or outline (if you have it)",
            ar: "إذا عندك المحتوى جاهز، حمله هنا"
          }
        },
        {
          key: "brand_alignment",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Follow my branding style", ar: "يتبع هوية البراند" },
            { en: "Creative & Open", ar: "حر وابداعي" }
          ],
          label: {
            en: "Should it follow your brand identity?",
            ar: "تبغى يكون بنفس هوية البراند؟"
          }
        }
      ]
    },
    mascot_character: {
      label: { en: "Mascot / Character Design", ar: "تصميم شخصية أو تميمة" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      questions: [
        {
          key: "character_usage",
          type: "multi-choice",
          required: true,
          multiple: true,
          options: [
            { en: "Website", ar: "الموقع" },
            { en: "Packaging / Products", ar: "المنتجات أو التغليف" },
            { en: "Social Media", ar: "السوشيال ميديا" },
            { en: "Mascot for Branding", ar: "شخصية تمثل البراند" },
            { en: "Kids / Educational Content", ar: "للمحتوى التعليمي للأطفال" }
          ],
          label: {
            en: "Where will this character be used?",
            ar: "وين ناوي تستخدم الشخصية؟"
          }
        },
        {
          key: "character_type",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Friendly Human", ar: "شخصية إنسان ودودة" },
            { en: "Cute Animal", ar: "حيوان لطيف" },
            { en: "Abstract/Symbolic", ar: "رمزية أو تجريدية" },
            { en: "Robot / Futuristic", ar: "روبوت / مستقبلي" },
            { en: "Cultural / Local", ar: "يعكس الطابع المحلي" }
          ],
          label: {
            en: "What kind of character do you want?",
            ar: "تبغى الشخصية تكون من أي نوع؟"
          }
        },
        {
          key: "personality_traits",
          type: "multi-choice",
          multiple: true,
          required: false,
          options: [
            { en: "Playful", ar: "مرح" },
            { en: "Helpful", ar: "يساعد" },
            { en: "Wise", ar: "حكيم" },
            { en: "Cool", ar: "كول وعصري" },
            { en: "Adventurous", ar: "مغامِر" }
          ],
          label: {
            en: "What traits should the character have?",
            ar: "تبغى الشخصية تعكس أي صفات؟"
          }
        }
      ]
    }
  }
}; 
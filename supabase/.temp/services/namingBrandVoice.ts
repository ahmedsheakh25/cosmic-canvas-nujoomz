import { Service } from './types';

export const namingBrandVoice: Service = {
  label: {
    en: "Naming & Brand Voice",
    ar: "اختيار الاسم ونبرة الصوت"
  },
  description: {
    en: "Crafting a memorable name and defining your brand's communication tone.",
    ar: "ابتكار اسم مميز وتحديد طريقة تواصلك مع جمهورك."
  },
  tags: ["naming", "branding", "copywriting", "arabic-speaking", "global-market"],
  tone: "creative",
  subServices: {
    business_naming: {
      label: { en: "Business Naming", ar: "اختيار اسم تجاري" },
      suggestMoodboard: true,
      questions: [
        {
          key: "business_description",
          type: "text",
          required: true,
          label: {
            en: "Briefly describe your business idea",
            ar: "عطني لمحة بسيطة عن مشروعك"
          }
        },
        {
          key: "name_style",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Modern & Techy", ar: "عصري وتقني" },
            { en: "Traditional & Arabic", ar: "تقليدي وله طابع عربي" },
            { en: "Creative & Unique", ar: "مميز ومختلف" },
            { en: "Professional & Corporate", ar: "احترافي ورسمي" },
            { en: "Fun & Catchy", ar: "مرح وسهل الحفظ" }
          ],
          label: {
            en: "What kind of name style do you prefer?",
            ar: "وش نوع الاسم اللي يعجبك؟"
          }
        },
        {
          key: "name_preferences",
          type: "text",
          required: false,
          label: {
            en: "Words or themes you'd like to include?",
            ar: "في كلمات أو معاني ودك تكون ضمن الاسم؟"
          }
        },
        {
          key: "avoid_words",
          type: "text",
          required: false,
          label: {
            en: "Words you want to avoid in the name?",
            ar: "في كلمات أو دلالات تبي تبعد عنها؟"
          }
        },
        {
          key: "language_preference",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Arabic", ar: "عربي" },
            { en: "English", ar: "إنجليزي" },
            { en: "Bilingual", ar: "ثنائي (عربي + إنجليزي)" },
            { en: "Global / Easy to pronounce", ar: "عالمي وسهل النطق" }
          ],
          label: {
            en: "Language style for the name?",
            ar: "تحب الاسم يكون بأي لغة أو طابع؟"
          }
        }
      ]
    },
    brand_voice: {
      label: { en: "Brand Voice", ar: "نبرة الصوت" },
      suggestPalettes: "huemint",
      tone: "creative",
      questions: [
        {
          key: "brand_personality",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Professional", ar: "مهني" },
            { en: "Friendly", ar: "ودود" },
            { en: "Authoritative", ar: "خبير وواثق" },
            { en: "Playful", ar: "مرح" },
            { en: "Inspiring", ar: "ملهم" },
            { en: "Caring", ar: "مهتم ومتفهّم" }
          ],
          label: {
            en: "How should your brand 'sound'?",
            ar: "كيف تحب أسلوب كلام البراند؟"
          }
        },
        {
          key: "communication_style",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Like a trusted advisor", ar: "زي المستشار الموثوق" },
            { en: "Like a close friend", ar: "زي الصديق القريب" },
            { en: "Like an expert voice", ar: "زي خبير المجال" },
            { en: "Like a fun companion", ar: "زي الرفيق المرح" }
          ],
          label: {
            en: "How do you want people to feel when they hear your brand?",
            ar: "وش الشعور أو العلاقة اللي تبغا جمهورك يحسها؟"
          }
        },
        {
          key: "avoid_tone",
          type: "multi-choice",
          required: true,
          multiple: true,
          options: [
            { en: "Too formal", ar: "رسمي زيادة" },
            { en: "Too casual", ar: "مرخي جدًا" },
            { en: "Boring", ar: "ممل" },
            { en: "Confusing", ar: "مربك" },
            { en: "Pushy / aggressive", ar: "هجومي أو مزعج" }
          ],
          label: {
            en: "Are there any tones you want to avoid?",
            ar: "في نبرات تبغا نتجنبها؟"
          }
        }
      ]
    }
  }
}; 